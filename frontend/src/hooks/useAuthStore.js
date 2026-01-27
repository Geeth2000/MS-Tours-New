import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: ({ token, user }) => set({ token, user }),
      updateUser: (user) => set((state) => ({ ...state, user: { ...state.user, ...user } })),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "ms-tours-auth",
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);

export const getAuthToken = () => useAuthStore.getState().token;
