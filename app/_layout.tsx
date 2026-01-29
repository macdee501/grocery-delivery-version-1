import { SplashScreen, Stack } from "expo-router";
import "./globals.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import useAuthStore from "@/store/auth.store";
import { StripeProvider } from "@stripe/stripe-react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { fetchAuthenticatedUser, isLoading } = useAuthStore();

  const [fontsLoaded, error] = useFonts({
    "QuickSand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "QuickSand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "QuickSand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "QuickSand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "QuickSand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
  });

  // Restore auth session ONCE
  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);

  // Hide splash only when everything is ready
  useEffect(() => {
    if (fontsLoaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoading]);

  if (!fontsLoaded || isLoading) {
    return null;
  }

  return (
    <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}>
      <Stack screenOptions={{ headerShown: false }} />
    </StripeProvider>
  );
}
