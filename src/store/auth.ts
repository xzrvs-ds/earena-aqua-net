import { create } from 'zustand';
import { storage } from '@/lib/storage';

export type User = {
  id: string;
  username: string;
  role: 'ADMIN' | 'USER';
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  loadAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  setAuth: async (user, token) => {
    await storage.setToken(token);
    await storage.setUser(user);
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  clearAuth: async () => {
    await storage.clearAuth();
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  loadAuth: async () => {
    try {
      const token = await storage.getToken();
      const user = await storage.getUser();
      
      if (token && user) {
        set({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load auth:', error);
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
