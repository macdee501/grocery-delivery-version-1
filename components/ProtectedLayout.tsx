import { useEffect } from 'react';
import { router, Slot } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import useAuthStore from '@/store/auth.store';

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/(auth)/sign-in');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // ✅ THIS is the missing piece
  return <Slot />;
}
