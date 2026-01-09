import { create } from 'zustand'
import * as authService from '../services/authService'
import api from '../lib/apiClient'

export const useAuthStore = create((set) => ({
  user: null,
  userType: null, // 'student' or 'institution'
  isAuthenticated: false,
  email: null,
  emailVerified: false,
  profileSelected: false,
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.login(credentials);
      const data = res && res.data ? res.data : res;
      // try to extract user
      const user = data.user || data;
      set({ user, isAuthenticated: true, loading: false, emailVerified: user?.is_verified ?? true });
      return res;
    } catch (err) {
      set({ error: err, loading: false });
      throw err;
    }
  },

  signup: async (userCreateModel) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.register(userCreateModel);
      set({ loading: false });
      return res;
    } catch (err) {
      set({ error: err, loading: false });
      throw err;
    }
  },

  fetchCurrentUser: async () => {
    set({ loading: true, error: null });
    try {
      const res = await authService.getCurrentUser();
      const user = res && res.data ? res.data : res;
      set({ user, isAuthenticated: !!user, loading: false, emailVerified: user?.is_verified ?? false });
      return user;
    } catch (err) {
      set({ error: err, loading: false });
      // If 401/403, clear token
      if (err && err.status && (err.status === 401 || err.status === 403)) {
        api.clearAccessToken();
        set({ isAuthenticated: false, user: null });
      }
      throw err;
    }
  },

  verifyEmail: async (token) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.verifyEmail(token);
      // server may set cookie or return token; attempt to refresh user
      try { await authService.getCurrentUser(); } catch (e) {}
      set({ loading: false, emailVerified: true });
      return res;
    } catch (err) {
      set({ error: err, loading: false });
      throw err;
    }
  },

  resendVerification: async (email) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.resendVerification(email);
      set({ loading: false });
      return res;
    } catch (err) {
      set({ error: err, loading: false });
      throw err;
    }
  },

  selectProfile: (userType) => set({ userType, profileSelected: true }),

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await authService.logout();
    } catch (e) {
      // ignore errors during logout
    }
    api.clearAccessToken();
    set({ user: null, userType: null, isAuthenticated: false, email: null, emailVerified: false, profileSelected: false, loading: false });
  },
}))

