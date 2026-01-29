import { Alert, ActivityIndicator, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { useState, useEffect } from 'react';
import CustomInputField from '@/components/CustomInputField';
import CustomButton from '@/components/CustomButton';
import { signIn } from '@/lib/appwrite';
import useAuthStore from '@/store/auth.store';

export default function SignInScreen() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchAuthenticatedUser, isAuthenticated, user, isLoading } = useAuthStore();

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, user, isLoading]);

  const submitForm = async () => {
    const { email, password } = form;
    if (!email || !password) return Alert.alert('Error', 'Please enter valid email & password.');

    setIsSubmitting(true);
    try {
      await signIn({ email, password });
      await fetchAuthenticatedUser();
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || (isAuthenticated && user)) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#A3E635" />
        <Text className="mt-4 text-gray-600">Checking authentication...</Text>
      </View>
    );
  }

  return (
    <View className="gap-8 bg-white rounded-lg p-5 mt-5">
      <Text className="h2-bold text-dark-100">Login</Text>

      <CustomInputField
        label="Email"
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
        keyboardType="email-address"
      />

      <CustomInputField
        label="Password"
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
        secureTextEntry
      />

      <CustomButton
        title="Sign In"
        isLoading={isSubmitting}
        onPress={submitForm}
      />

      <View className="flex-row justify-center gap-2 mt-5">
        <Text className="base-regular text-gray-600">Don't have an account?</Text>
        <Link href="/sign-up" className="base-bold text-lime-500">
          Sign Up
        </Link>
      </View>
    </View>
  );
}
