const AUTH_TOKEN_KEY = 'auth_token';
const IS_USER_LOGGED_IN = 'is_user_logged_in';
const SESSION_EXPIRY_KEY = 'session_expiry';

const auth = {
  // Login function
  login(data) {
    localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
    this.setCookie('token', data.refrsh_token, 15); // Set cookie for 7 days
  },

  // Logout function
  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(IS_USER_LOGGED_IN);
    window.location.href = '/login';
  },
  // set cokkie function
  setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  },
  // Get cookie function
  getCookie(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  // Get token
  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  // Get user data
  getUser() {
    const userData = localStorage.getItem(USER_DATA_KEY) || sessionStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);
    if (expiry && Date.now() > parseInt(expiry)) {
      this.logout();
      return false;
    }

    return true;
  },

  // Update user data
  updateUser(userData) {
    const storage = localStorage.getItem(AUTH_TOKEN_KEY) ? localStorage : sessionStorage;
    storage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  }
};

export default auth;
