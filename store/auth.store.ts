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

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  // Fetch user session on app start (optional)
  fetchAuthenticatedUser: async () => {
    set({ isLoading: true });
    try {
      const user = await getCurrentUser();
      if (user) {
        set({ isAuthenticated: true, user: user as User, isLoading: false });
      } else {
        set({ isAuthenticated: false, user: null, isLoading: false });
      }
    } catch (error) {
      console.error("❌ Auth restore failed:", error);
      set({ isAuthenticated: false, user: null, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      await appwriteSignIn({ email, password });
      const user = await getCurrentUser();
      if (!user) throw new Error("Failed to fetch user after login");
      set({ isAuthenticated: true, user: user as User, isLoading: false });
    } catch (error: any) {
      console.error("❌ Login failed:", error);
      set({ isAuthenticated: false, user: null, isLoading: false });
      throw error;
    }
  },

  signOutUser: async () => {
    set({ isLoading: true });
    try {
      await signOut();
      set({ isAuthenticated: false, user: null, isLoading: false });
    } catch (error) {
      console.error("❌ Sign out failed:", error);
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
