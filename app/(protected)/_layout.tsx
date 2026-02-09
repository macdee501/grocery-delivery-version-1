import { useEffect } from "react";
import { router } from "expo-router";
import useAuthStore from "@/store/auth.store";
import { ActivityIndicator, View } from "react-native";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("🚫 Not authenticated, redirecting to sign-in...");
      router.replace("/(auth)/sign-in");
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return null; // redirect is happening
  }

  // ✅ Render protected screens (Stack is handled automatically by Expo Router)
  return <>{children}</>;
}
