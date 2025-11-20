import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "@/lib/axios";
import { API_ROUTES } from "@/const/api";

interface User {
  id: number;
  email: string;
  phoneNumber: string;
  name: string;
  profileImageUrl: string;
  provider: string;
  bio: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  refreshToken: string | null;
  setUser: (user: User) => void;
  setTokens: (refreshToken: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user: User) => {
        if(!user){
          return set({
            user: null,
            isAuthenticated: false,
          })
        }
        return set({
          user,
          isAuthenticated: !!user,
        })
      },
      fetchUser: async () => {
        try {
          const response = await apiClient.get(API_ROUTES.USERS.ME.url);
          if (response.data.success && response.data.payload) {
            set({ user: response.data.payload, isAuthenticated: true });
          }
        } catch (error) {
          set({ user: null, isAuthenticated: false });
        }
      },
      setTokens: (refreshToken: string) => set({ refreshToken }),
      logout: async() => {
        await apiClient.post(API_ROUTES.AUTH.LOGOUT.url);
        set({
          user: null,
          isAuthenticated: false,
          refreshToken: null,
        })
        window.location.href = "/signin";
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;