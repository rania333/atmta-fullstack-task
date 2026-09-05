const TOKEN_KEY = 'token';

export const auth = {
  getToken() { 
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    window.dispatchEvent(new Event('auth-change'));
  },

  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event('auth-change'));
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
