/**
 * reCAPTCHA v3 Helper for APGI Framework
 * Provides bot protection for login, registration, and form submissions
 *
 * Setup:
 * 1. Get reCAPTCHA keys at https://www.google.com/recaptcha/admin
 * 2. Add to environment-config.js: recaptcha.siteKey = "YOUR_SITE_KEY"
 * 3. Backend should verify tokens at https://www.google.com/recaptcha/api/siteverify
 */

class RecaptchaHelper {
  constructor() {
    this.siteKey = window.envConfig?.get("recaptcha.siteKey");
    this.isInitialized = false;
    this.isDev = window.location.hostname === "localhost" ||
                 window.location.hostname === "127.0.0.1";

    if (this.siteKey) {
      this.initialize();
    }
  }

  /**
   * Initialize reCAPTCHA
   */
  async initialize() {
    try {
      // Load reCAPTCHA script
      if (!window.grecaptcha) {
        await this.loadRecaptchaScript();
      }

      this.isInitialized = true;
      if (this.isDev) {
        console.log("reCAPTCHA initialized successfully");
      }
    } catch (error) {
      console.error("Failed to initialize reCAPTCHA:", error);
    }
  }

  /**
   * Load reCAPTCHA script
   */
  loadRecaptchaScript() {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="recaptcha"]')) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${this.siteKey}`;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * Execute reCAPTCHA v3 for a specific action
   * Returns token to be sent to backend for verification
   */
  async executeRecaptcha(action = "submit") {
    if (!this.isInitialized) {
      if (this.isDev) console.warn("reCAPTCHA not initialized");
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(this.siteKey, { action });
      return token;
    } catch (error) {
      console.error("reCAPTCHA execution error:", error);
      return null;
    }
  }

  /**
   * Get reCAPTCHA token for login action
   */
  async getLoginToken() {
    return this.executeRecaptcha("login");
  }

  /**
   * Get reCAPTCHA token for signup action
   */
  async getSignupToken() {
    return this.executeRecaptcha("signup");
  }

  /**
   * Get reCAPTCHA token for form submission
   */
  async getFormToken() {
    return this.executeRecaptcha("submit");
  }

  /**
   * Check if reCAPTCHA is available
   */
  isAvailable() {
    return this.isInitialized && !!this.siteKey;
  }

  /**
   * Render reCAPTCHA checkbox (v2) - alternative to v3
   */
  renderCheckbox(containerId = "recaptcha-container") {
    if (!this.isInitialized) {
      console.error("reCAPTCHA not initialized");
      return false;
    }

    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container #${containerId} not found`);
      return false;
    }

    try {
      window.grecaptcha.render(containerId, {
        sitekey: this.siteKey,
        theme: "dark",
        size: "normal"
      });
      return true;
    } catch (error) {
      console.error("Failed to render reCAPTCHA checkbox:", error);
      return false;
    }
  }

  /**
   * Get response from reCAPTCHA checkbox
   */
  getCheckboxResponse() {
    if (!this.isInitialized) return null;
    return window.grecaptcha.getResponse();
  }

  /**
   * Reset reCAPTCHA checkbox
   */
  resetCheckbox() {
    if (!this.isInitialized) return;
    window.grecaptcha.reset();
  }
}

// Create singleton instance
window.recaptchaHelper = new RecaptchaHelper();

// Export for use in other modules
window.RecaptchaHelper = RecaptchaHelper;
