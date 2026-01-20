import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { router } from 'expo-router';
import useAuthStore from '@/store/auth.store';
import { ActivityIndicator, View } from 'react-native';

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      console.log('🚫 Not authenticated, redirecting to sign-in...');
      router.replace('/(auth)/sign-in');
    }
  }, [isAuthenticated, isLoading]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // If not authenticated, show nothing (redirect happens above)
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated, show protected screens
  return (
    <Stack>
      <Stack.Screen 
        name="order-history" 
        options={{ 
          title: 'Order History',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="order-details/[id]" 
        options={{ 
          title: 'Order Details',
          headerShown: true,
        }} 
      />
    </Stack>
  );
}