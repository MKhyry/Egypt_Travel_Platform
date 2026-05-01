import { create } from 'zustand';
import { authAPI } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialzing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitialzing: true,

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
    set({ isInitialzing: true });
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isInitialzing: false });
      return;
    }
    try {
      const res = await authAPI.getMe();
      set({ user: res.data.data, token, isInitialzing: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ isInitialzing: false });
    }
  },
}));
