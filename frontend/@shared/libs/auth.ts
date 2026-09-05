const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export interface IAuthUser {
  id: number;
  name: string;
  email: string;
}

export const auth = {
  getToken() {
    if (typeof window === 'undefined') {
      return null;
    }

    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getUser(): IAuthUser | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const user = localStorage.getItem(USER_KEY);

    return user ? JSON.parse(user) : null;
  },

  setUser(user: IAuthUser) {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(user),
    );
  },

  removeAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};