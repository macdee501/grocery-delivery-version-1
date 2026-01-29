import { create } from 'zustand';
import { User } from "@/type";
import { getCurrentUser, signOut } from "@/lib/appwrite";

type AuthState = {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;

    setIsAuthenticated: (value: boolean) => void;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;

    fetchAuthenticatedUser: () => Promise<void>;
    signOutUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    isLoading: true,

    setIsAuthenticated: (value) => set({ isAuthenticated: value }),
    setUser: (user) => set({ user }),
    setLoading: (value) => set({ isLoading: value }),

    fetchAuthenticatedUser: async () => {
        console.log('🔄 fetchAuthenticatedUser started');
        set({ isLoading: true });

        try {
            const user = await getCurrentUser();
            console.log('👤 getCurrentUser result:', user ? `User ID: ${user.$id}` : 'No user');

            if (user) {
                console.log('✅ Setting authenticated state with user:', user.email);
                set({ 
                    isAuthenticated: true, 
                    user: user as User,
                    isLoading: false  // ✅ Set loading false here too
                });
            } else {
                console.log('❌ No user found, setting unauthenticated');
                set({ 
                    isAuthenticated: false, 
                    user: null,
                    isLoading: false  // ✅ Set loading false here too
                });
            }
        } catch (e) {
            console.log('❌ fetchAuthenticatedUser error:', e);
            set({ 
                isAuthenticated: false, 
                user: null,
                isLoading: false  // ✅ Set loading false here too
            });
        }
        
        // Log final state
        console.log('📊 Final auth state after fetch');
    },

    signOutUser: async () => {
        set({ isLoading: true });
        
        try {
            await signOut();
            set({ 
                isAuthenticated: false, 
                user: null,
                isLoading: false
            });
            console.log('✅ Signed out and cleared state');
        } catch (error) {
            console.error('❌ Sign out error:', error);
            set({ isLoading: false });
        }
    }
}))

export default useAuthStore;
