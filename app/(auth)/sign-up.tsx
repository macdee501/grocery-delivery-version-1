import { Alert, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { useState, useEffect } from 'react';
import CustomInputField from '@/components/CustomInputField';
import CustomButton from '@/components/CustomButton';
import { createUser } from '@/lib/appwrite';
import useAuthStore from '@/store/auth.store';

export default function SignUpScreen() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchAuthenticatedUser, isAuthenticated, user, isLoading } = useAuthStore();

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, user, isLoading]);

  const submitForm = async () => {
    const { name, email, password } = form;
    if (!name || !email || !password) return Alert.alert('Error', 'All fields are required.');

    setIsSubmitting(true);
    try {
      await createUser({ name, email, password });
      await fetchAuthenticatedUser();
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || (isAuthenticated && user)) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600 mt-4">Checking authentication...</Text>
      </View>
    );
  }

  return (
    <View className="gap-8 bg-white rounded-lg p-5 mt-5">
      <CustomInputField
        label="Full Name"
        placeholder="Enter your full name"
        value={form.name}
        onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
      />

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
        title="Sign Up"
        isLoading={isSubmitting}
        onPress={submitForm}
      />

      <View className="flex-row justify-center gap-2 mt-5">
        <Text className="base-regular text-gray-600">Already have an account?</Text>
        <Link href="/sign-in" className="base-bold text-lime-500">
          Sign In
        </Link>
      </View>
    </View>
  );
}
