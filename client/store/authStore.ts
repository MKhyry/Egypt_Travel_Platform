import { create } from 'zustand';
import { authAPI } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitializing: true,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await authAPI.login({ email, password });
      const { token, data } = res.data;
      localStorage.setItem('token', token);
      set({ user: data, token, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const res = await authAPI.register({ name, email, password });
      const { token, data } = res.data;
      localStorage.setItem('token', token);
      set({ user: data, token, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  loadUser: async () => {
    set({ isInitializing: true });
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isInitializing: false });
      return;
    }
    try {
      const res = await authAPI.getMe();
      set({ user: res.data.data, token, isInitializing: false });
    } catch (error: any) {
      const status = error?.response?.status;
      // Only remove token if it's actually invalid (401) or expired (403)
      if (status === 401 || status === 403) {
        localStorage.removeItem('token');
        set({ user: null, token: null, isInitializing: false });
      } else {
        // Temporary error (network, server down) — keep token, just finish loading
        set({ isInitializing: false });
      }
    }
  },
}));
