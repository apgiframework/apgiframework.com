/**
 * Authentication Service for APGI Framework
 * Handles user registration, login, session management, and JWT tokens
 *
 * ⚠️  SECURITY RECOMMENDATIONS:
 * 1. CRITICAL: Backend should set auth tokens as HttpOnly, Secure, SameSite cookies
 * 2. Tokens should NOT be stored in localStorage (currently vulnerable to XSS)
 * 3. Implement rate limiting on /api/auth/login endpoint (5-10 attempts per minute)
 * 4. Add reCAPTCHA to login and registration forms
 * 5. Implement token refresh with rotating refresh tokens
 * 6. Log failed login attempts for security monitoring
 */

// Development mode check
const isDev =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname.includes("dev") ||
  window.envConfig?.isDevelopment();

class AuthService {
  constructor() {
    this.baseURL = window.envConfig?.getApiUrl();
    this.tokenKey = "apgi_auth_token";
    this.userKey = "apgi_user_data";
    this.currentUser = null;
    this.token = null;
    this.useHttpOnlyCookies = window.envConfig?.get("auth.useHttpOnlyCookies") ?? true;

    this.init();
  }

  /**
   * Initialize authentication service
   */
  init() {
    // First, try to load from HttpOnly cookies (if enabled)
    if (this.useHttpOnlyCookies) {
      // The token will be automatically sent with requests via HttpOnly cookie
      // Retrieve user data from sessionStorage (backed by server)
      const storedUser = sessionStorage.getItem(this.userKey);
      if (storedUser) {
        try {
          this.currentUser = JSON.parse(storedUser);
          this.setupTokenRefresh();
        } catch (error) {
          this.clearSession();
        }
      }
    } else {
      // Fallback: Load from localStorage (LESS SECURE - only for testing)
      if (!this.isDev) {
        console.warn(
          "⚠️  SECURITY: Using localStorage for tokens. " +
          "Enable HttpOnly cookies in production via backend configuration."
        );
      }

      const storedToken = localStorage.getItem(this.tokenKey);
      const storedUser = localStorage.getItem(this.userKey);

      if (storedToken && storedUser) {
        try {
          this.token = storedToken;
          this.currentUser = JSON.parse(storedUser);
          this.setupTokenRefresh();
        } catch (error) {
          this.clearSession();
        }
      }
    }
  }

  /**
   * Register a new user
   */
  async register(userData) {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: userData.password,
          role: "user",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Auto-login after successful registration
      return await this.login({
        email: userData.email,
        password: userData.password,
      });
    } catch (error) {
      if (isDev) console.error("Registration error:", error);
      throw error;
    }
  }

  /**
   * Login user with optional reCAPTCHA verification
   */
  async login(credentials, recaptchaToken = null) {
    try {
      // Validate email format
      if (!this.validateEmail(credentials.email)) {
        throw new Error("Invalid email format");
      }

      // Validate password is not empty
      if (!credentials.password || credentials.password.length === 0) {
        throw new Error("Password is required");
      }

      const loginPayload = {
        ...credentials,
        ...(recaptchaToken && { recaptchaToken }) // Include reCAPTCHA token if available
      };

      const response = await fetch(`${this.baseURL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // CSRF token added by security-manager.js
        },
        credentials: "include", // Include cookies in request
        body: JSON.stringify(loginPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Log failed attempt for security monitoring
        window.securityManager?.logSecurityEvent("login_failed", {
          email: credentials.email,
          reason: data.error
        });
        throw new Error(data.error || "Login failed");
      }

      // Store token and user data based on configuration
      if (this.useHttpOnlyCookies) {
        // Token is automatically managed by HttpOnly cookie
        this.currentUser = data.user;
        sessionStorage.setItem(this.userKey, JSON.stringify(this.currentUser));
      } else {
        // Fallback for non-HttpOnly scenario (less secure)
        this.token = data.token;
        this.currentUser = data.user;
        localStorage.setItem(this.tokenKey, this.token);
        localStorage.setItem(this.userKey, JSON.stringify(this.currentUser));
      }

      // Setup token refresh
      this.setupTokenRefresh();

      // Log successful login
      window.securityManager?.logSecurityEvent("login_success", {
        email: credentials.email
      });

      return {
        success: true,
        user: this.currentUser,
        token: this.useHttpOnlyCookies ? undefined : this.token, // Don't expose token if using HttpOnly
      };
    } catch (error) {
      if (isDev) console.error("Login error:", error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      // Call logout endpoint to invalidate token on server
      if (this.token) {
        await fetch(`${this.baseURL}/api/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      if (isDev) console.error("Logout error:", error);
    } finally {
      // Always clear local session
      this.clearSession();
    }
  }

  /**
   * Clear session data securely
   */
  clearSession() {
    this.token = null;
    this.currentUser = null;

    // Clear localStorage items
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);

    // Clear sessionStorage items
    sessionStorage.removeItem(this.userKey);

    // Clear CSRF token if present
    sessionStorage.removeItem("csrf_token");

    // Clear browser cache for sensitive data
    if (window.securityManager) {
      window.securityManager.logSecurityEvent("session_cleared");
    }

    // Redirect to login page
    if (window.location.pathname !== "/Auth.html") {
      window.location.href = "/Auth.html";
    }
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!(this.token && this.currentUser);
  }

  /**
   * Check if user has specific role
   */
  hasRole(role) {
    return this.currentUser && this.currentUser.role === role;
  }

  /**
   * Check if user is admin
   */
  isAdmin() {
    return this.hasRole("admin");
  }

  /**
   * Get authorization header
   */
  getAuthHeader() {
    return this.token ? `Bearer ${this.token}` : null;
  }

  /**
   * Make authenticated API request
   */
  async authenticatedFetch(url, options = {}) {
    const headers = {
      ...options.headers,
    };

    if (this.token) {
      headers["Authorization"] = this.getAuthHeader();
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle token expiration
      if (response.status === 401) {
        this.clearSession();
        throw new Error("Session expired. Please login again.");
      }

      return response;
    } catch (error) {
      if (error.message.includes("Session expired")) {
        throw error;
      }
      if (isDev) console.error("Authenticated fetch error:", error);
      throw error;
    }
  }

  /**
   * Setup token refresh
   */
  setupTokenRefresh() {
    // Check token expiration every 5 minutes
    setInterval(
      () => {
        if (this.token && this.isTokenExpired()) {
          this.refreshToken();
        }
      },
      5 * 60 * 1000,
    );
  }

  /**
   * Check if token is expired
   */
  isTokenExpired() {
    if (!this.token) return true;

    try {
      const payload = JSON.parse(atob(this.token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Refresh token
   */
  async refreshToken() {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          Authorization: this.getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.token;
        // Store refreshed token in localStorage
        localStorage.setItem(this.tokenKey, this.token);
      } else {
        this.clearSession();
      }
    } catch (error) {
      if (isDev) console.error("Token refresh error:", error);
      this.clearSession();
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData) {
    try {
      const response = await this.authenticatedFetch(
        `${this.baseURL}/api/auth/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Profile update failed");
      }

      // Update local user data
      this.currentUser = { ...this.currentUser, ...data.user };
      // Store updated user data in localStorage
      localStorage.setItem(this.userKey, JSON.stringify(this.currentUser));

      return data;
    } catch (error) {
      if (isDev) console.error("Profile update error:", error);
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(passwordData) {
    try {
      const response = await this.authenticatedFetch(
        `${this.baseURL}/api/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(passwordData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Password change failed");
      }

      return data;
    } catch (error) {
      if (isDev) console.error("Password change error:", error);
      throw error;
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email) {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/request-reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Password reset request failed");
      }

      return data;
    } catch (error) {
      if (isDev) console.error("Password reset request error:", error);
      throw error;
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(resetData) {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resetData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Password reset failed");
      }

      return data;
    } catch (error) {
      if (isDev) console.error("Password reset error:", error);
      throw error;
    }
  }

  /**
   * Validate email format
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid:
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers,
      errors: [
        password.length < minLength
          ? "Password must be at least 8 characters long"
          : null,
        !hasUpperCase
          ? "Password must contain at least one uppercase letter"
          : null,
        !hasLowerCase
          ? "Password must contain at least one lowercase letter"
          : null,
        !hasNumbers ? "Password must contain at least one number" : null,
        !hasSpecialChar
          ? "Password must contain at least one special character"
          : null,
      ].filter(Boolean),
    };
  }
}

// Create singleton instance
window.authService = new AuthService();

// Export for use in other modules
window.AuthService = AuthService;
