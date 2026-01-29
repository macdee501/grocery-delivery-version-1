import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import "./globals.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import useAuthStore from "@/store/auth.store";
import { StripeProvider } from '@stripe/stripe-react-native'

export default function RootLayout() {
  console.log('🌍 ROOT LAYOUT RENDER:', Math.random());
  
  const router = useRouter();
  const segments = useSegments();
  const { isLoading, isAuthenticated, fetchAuthenticatedUser } = useAuthStore();
  
  console.log('📊 Auth state:', { isLoading, isAuthenticated, segments });

  const [fontsLoaded, error] = useFonts({
    "QuickSand-Bold": require('../assets/fonts/Quicksand-Bold.ttf'),
    "QuickSand-Medium": require('../assets/fonts/Quicksand-Medium.ttf'),
    "QuickSand-Regular": require('../assets/fonts/Quicksand-Regular.ttf'),
    "QuickSand-SemiBold": require('../assets/fonts/Quicksand-SemiBold.ttf'),
    "QuickSand-Light": require('../assets/fonts/Quicksand-Light.ttf'),
  });

  useEffect(() => {
    console.log('🎨 Font useEffect triggered');
    if (error) throw error;
    if (fontsLoaded) {
      console.log('✅ Hiding splash screen');
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // Fetch auth on mount
  useEffect(() => {
    console.log('🔐 Fetching authenticated user...');
    fetchAuthenticatedUser();
  }, []);

  // Handle navigation after auth check completes
  useEffect(() => {
    if (isLoading || !fontsLoaded) return;

    const inAuthGroup = segments[0] === '(auth)' || segments[0] === 'sign-in' || segments[0] === 'sign-up';
    const inTabsGroup = segments[0] === '(tabs)';

    console.log('🧭 Navigation check:', { 
      isAuthenticated, 
      inAuthGroup, 
      inTabsGroup, 
      segments 
    });

    if (isAuthenticated && inAuthGroup) {
      // Logged in but on auth screen - redirect to home
      console.log('✅ Authenticated on auth screen, redirecting to home');
      router.replace('/(tabs)');
    } else if (!isAuthenticated && inTabsGroup) {
      // Not logged in but on protected screen - redirect to sign in
      console.log('🚫 Not authenticated on protected screen, redirecting to sign-in');
      router.replace('/sign-in');
    }
  }, [isAuthenticated, isLoading, segments, fontsLoaded]);

  if (!fontsLoaded || isLoading) { 
    console.log('⏳ Waiting for fonts or auth...');
    return null;
  }

  console.log('🚀 Rendering Stack');
  return (
    <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}>
      <Stack screenOptions={{headerShown: false}} />
    </StripeProvider>
  );
}