import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "@/lib/axios";
import { API_ROUTES } from "@/const/api";
import { ROUTES } from "@/const/routes";

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
  isLoading: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
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
          set({ isLoading: true });
          const response = await apiClient.get(API_ROUTES.USERS.ME.url);
          if (response.data.success && response.data.payload) {
            set({ user: response.data.payload, isAuthenticated: true });
          }
        } catch (error) {
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },
      logout: async() => {
        await apiClient.post(API_ROUTES.AUTH.LOGOUT.url);
        // set({ isLoading: false });
        set({ user: null, isAuthenticated: false });
        window.location.href = ROUTES.SIGNIN.path;
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