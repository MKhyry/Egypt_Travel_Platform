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
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,

login: async (email, password) => {
  set({ isLoading: true });
  try {
    const res = await authAPI.login({ email, password });
    const { token, data } = res.data;
    localStorage.setItem('token', token);
    set({ user: data, token, isLoading: false });
  } catch (error) {
    set({ isLoading: false }); // 👈 always reset
    throw error;               // 👈 re-throw so the page can catch it
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
    set({ isLoading: false }); // 👈 always reset
    throw error;               // 👈 re-throw so the page can catch it
  }
},

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await authAPI.getMe();
      set({ user: res.data.data, token });
    } catch {
      localStorage.removeItem('token');
    }
  },
}));