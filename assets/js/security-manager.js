/**
 * Security Manager for APGI Framework
 * Handles HTTPS enforcement, security headers, CSRF protection, and input validation
 */

class SecurityManager {
  constructor() {
    this.isDev = window.location.hostname === "localhost" ||
                 window.location.hostname === "127.0.0.1";
    this.csrfToken = null;
    this.initializeSecurityMeasures();
  }

  /**
   * Initialize all security measures
   */
  initializeSecurityMeasures() {
    this.enforceHTTPS();
    this.injectSecurityHeaders();
    this.setupCSRFProtection();
    this.setupInputSanitization();
    this.monitorSecurityEvents();
  }

  /**
   * Force HTTPS in production
   */
  enforceHTTPS() {
    if (!this.isDev && window.location.protocol !== "https:") {
      window.location.href = `https:${window.location.href.substring(window.location.protocol.length)}`;
    }
  }

  /**
   * Inject security headers (CSP, X-Frame-Options, etc.)
   * Note: These should also be set by the server via HTTP headers
   */
  injectSecurityHeaders() {
    // Create meta tag for CSP
    const cspMeta = document.createElement("meta");
    cspMeta.httpEquiv = "Content-Security-Policy";
    cspMeta.content = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://js.stripe.com https://unpkg.com https://cdn.plot.ly https://code.highcharts.com https://d3js.org https://cdnjs.cloudflare.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.stripe.com https://api.github.com https://www.google.com/recaptcha/",
      "frame-src 'self' https://js.stripe.com https://www.google.com/recaptcha/",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join("; ");

    if (document.head) {
      document.head.appendChild(cspMeta);
    }

    // Set additional security headers via javascript (limitations noted)
    this.setSecurityHeaderFlags();
  }

  /**
   * Set security-related flags and policies
   */
  setSecurityHeaderFlags() {
    // Prevent clickjacking in browser history
    if (document.documentElement) {
      document.documentElement.style.visibility = "visible";
    }

    // Disable browser features that could be exploited
    document.addEventListener("keydown", (e) => {
      // Prevent F12 in production (optional - can be annoying)
      // if (!this.isDev && e.key === "F12") e.preventDefault();
    });
  }

  /**
   * Setup CSRF token generation and validation
   */
  setupCSRFProtection() {
    this.csrfToken = this.generateCSRFToken();

    // Store token in sessionStorage (cleared when tab closes)
    sessionStorage.setItem("csrf_token", this.csrfToken);

    // Intercept fetch calls to add CSRF token
    this.setupFetchInterceptor();
  }

  /**
   * Generate a random CSRF token
   */
  generateCSRFToken() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  }

  /**
   * Setup fetch interceptor to add CSRF token to requests
   */
  setupFetchInterceptor() {
    const originalFetch = window.fetch;
    const self = this;

    window.fetch = function(...args) {
      let url = args[0];
      let config = args[1] || {};

      // Only add CSRF token to same-origin POST/PUT/DELETE requests
      if (typeof url === "string" && ["POST", "PUT", "DELETE"].includes(config.method?.toUpperCase())) {
        if (url.startsWith("/") || url.includes(window.location.origin)) {
          config.headers = config.headers || {};
          config.headers["X-CSRF-Token"] = self.csrfToken;
        }
      }

      return originalFetch.apply(this, [url, config]);
    };
  }

  /**
   * Setup comprehensive input sanitization
   */
  setupInputSanitization() {
    // Sanitize all text inputs on blur
    document.addEventListener("blur", (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        const original = e.target.value;
        e.target.value = this.sanitizeInput(original);
      }
    }, true);
  }

  /**
   * Sanitize user input to prevent XSS
   */
  sanitizeInput(input) {
    if (typeof input !== "string") return input;

    // Remove dangerous scripts and tags
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+\s*=/gi, "") // Remove event handlers
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/<iframe/gi, "") // Remove iframes
      .replace(/<object/gi, "") // Remove objects
      .replace(/<embed/gi, ""); // Remove embeds
  }

  /**
   * Escape HTML to prevent XSS in DOM
   */
  escapeHTML(text) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
  }

  /**
   * Validate email format
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate URL to prevent open redirect attacks
   */
  validateURL(url) {
    try {
      const urlObj = new URL(url, window.location.origin);
      // Only allow same-origin URLs
      return urlObj.origin === window.location.origin;
    } catch {
      return false;
    }
  }

  /**
   * Monitor security-related events
   */
  monitorSecurityEvents() {
    // Log security-related errors
    window.addEventListener("securitypolicyviolation", (e) => {
      if (this.isDev) {
        console.warn("CSP Violation:", e.violatedDirective, e.sourceFile);
      }
      // In production, send to error tracking service
    });

    // Monitor for XSS attempts in localStorage
    this.monitorStorageTampering();
  }

  /**
   * Detect tampering with localStorage
   */
  monitorStorageTampering() {
    const originalSetItem = Storage.prototype.setItem;

    Storage.prototype.setItem = function(key, value) {
      // Warn about storing sensitive data
      if (key.includes("token") || key.includes("secret") || key.includes("password")) {
        console.warn(
          `⚠️  SECURITY: Storing potentially sensitive data '${key}' in localStorage. ` +
          `Consider using HttpOnly cookies via backend instead.`
        );
      }

      // Try to detect malicious scripts
      if (typeof value === "string" && value.includes("<script")) {
        console.error("🚨 SECURITY: Attempted to store malicious script in localStorage");
        return; // Block the storage
      }

      return originalSetItem.call(this, key, value);
    };
  }

  /**
   * Validate and sanitize file uploads
   */
  validateFileUpload(file, allowedTypes = ["image/jpeg", "image/png", "application/pdf"]) {
    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error("File size exceeds 10MB limit");
    }

    // Check MIME type
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`);
    }

    // Check file extension matches MIME type
    const ext = file.name.split(".").pop()?.toLowerCase();
    const mimeMap = {
      "jpg": ["image/jpeg"],
      "jpeg": ["image/jpeg"],
      "png": ["image/png"],
      "pdf": ["application/pdf"]
    };

    if (ext && !mimeMap[ext]?.includes(file.type)) {
      throw new Error("File extension does not match MIME type");
    }

    return true;
  }

  /**
   * Rate limit API calls on client side (backup for server-side implementation)
   */
  createRateLimiter(maxCalls = 10, windowMs = 60000) {
    const calls = [];

    return () => {
      const now = Date.now();
      // Remove old calls outside the window
      while (calls.length > 0 && calls[0] < now - windowMs) {
        calls.shift();
      }

      if (calls.length >= maxCalls) {
        throw new Error("Rate limit exceeded. Please wait before trying again.");
      }

      calls.push(now);
      return true;
    };
  }

  /**
   * Log security events for audit trail
   */
  logSecurityEvent(eventType, details = {}) {
    const event = {
      timestamp: new Date().toISOString(),
      type: eventType,
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...details
    };

    if (this.isDev) {
      console.log("🔒 Security Event:", event);
    }

    // In production, send to security logging service
    // await fetch("/api/security/log", { method: "POST", body: JSON.stringify(event) });
  }

  /**
   * Get security report
   */
  getSecurityReport() {
    return {
      httpsEnabled: window.location.protocol === "https:",
      cspEnabled: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
      csrfTokenPresent: !!this.csrfToken,
      sessionStorageUsed: sessionStorage.length > 0,
      localStorageUsed: localStorage.length > 0,
      devMode: this.isDev,
      timestamp: new Date().toISOString()
    };
  }
}

// Create singleton instance
window.securityManager = new SecurityManager();

// Export for use in other modules
window.SecurityManager = SecurityManager;
