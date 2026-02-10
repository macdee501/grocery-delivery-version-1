import { Stack } from 'expo-router';
import ProtectedLayout from '@/components/ProtectedLayout';

export default function ProtectedStackLayout() {
  return (
    <ProtectedLayout>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ProtectedLayout>
  );
}
