import { create } from "zustand";
import { User } from "@/type";
import { getCurrentUser, signOut, signIn as appwriteSignIn } from "@/lib/appwrite";

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  fetchAuthenticatedUser: () => Promise<void>;
};

const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  fetchAuthenticatedUser: async () => {
    // 🛑 prevent double execution
    if (!get().isLoading) return;

    try {
      const user = await getCurrentUser();

      set({
        isAuthenticated: !!user,
        user: (user as User) ?? null,
        isLoading: false,
      });
    } catch {
      // 👤 guest user is NORMAL
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });

    try {
      await appwriteSignIn({ email, password });
      const user = await getCurrentUser();

      set({
        isAuthenticated: true,
        user: user as User,
        isLoading: false,
      });
    } catch (error) {
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
      throw error;
    }
  },

  signOutUser: async () => {
    set({ isLoading: true });

    try {
      await signOut();
    } finally {
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  },
}));

export default useAuthStore;
