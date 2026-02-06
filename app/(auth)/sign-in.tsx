import { Alert, Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import CustomInputField from '@/components/CustomInputField';
import CustomButton from '@/components/CustomButton';
import useAuthStore from '@/store/auth.store';

export default function SignInScreen() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    const { email, password } = form;
    if (!email || !password) {
      return Alert.alert('Error', 'All fields are required.');
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      router.replace('/(tabs)'); // Navigate to main app
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 gap-6 bg-white p-5 pt-12">
      <Text className="text-2xl font-bold text-gray-900 mb-4">Sign In</Text>

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
        onPress={handleLogin}
      />

      <View className="flex-row justify-center mt-6">
        <Text className="text-gray-600">Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/sign-up')}>
          <Text className="text-lime-500 font-bold">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
