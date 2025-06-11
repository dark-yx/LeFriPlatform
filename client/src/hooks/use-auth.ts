import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@shared/schema';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      
      login: (user, token) => {
        set({ user, token, isLoading: false });
      },
      
      logout: () => {
        set({ user: null, token: null, isLoading: false });
      },
      
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
      
      updateUser: (updates) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      }
    }),
    {
      name: 'lefri-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
