import { create } from "zustand";
import { User } from "@/type";
import { getCurrentUser, signOut } from "@/lib/appwrite";

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;

  fetchAuthenticatedUser: () => Promise<void>;
  signOutUser: () => Promise<void>;
};

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  fetchAuthenticatedUser: async () => {
    console.log("🔄 fetchAuthenticatedUser started");

    set({ isLoading: true });

    try {
      const user = await getCurrentUser();

      if (user) {
        console.log("✅ Authenticated user restored");

        set({
          isAuthenticated: true,
          user: user as User,
          isLoading: false,
        });
      } else {
        console.log("🚫 No session found");

        set({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    } catch (error) {
      console.log("❌ Auth restore failed:", error);

      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  },

  signOutUser: async () => {
    set({ isLoading: true });

    try {
      await signOut();

      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });

      console.log("✅ Signed out successfully");
    } catch (error) {
      console.error("❌ Sign out error:", error);
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
