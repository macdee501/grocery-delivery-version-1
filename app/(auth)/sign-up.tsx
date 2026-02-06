import { Alert, Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import CustomInputField from '@/components/CustomInputField';
import CustomButton from '@/components/CustomButton';
import useAuthStore from '@/store/auth.store';
import { createUser } from '@/lib/appwrite';

export default function SignUpScreen() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoading, isAuthenticated } = useAuthStore();

  const submitForm = async () => {
    const { name, email, password } = form;
    if (!name || !email || !password) {
      return Alert.alert('Error', 'All fields are required.');
    }

    setIsSubmitting(true);
    try {
      await createUser({ name, email, password });
      Alert.alert(
        'Account Created!',
        'Your account was created successfully. You can now log in.',
        [{ text: 'Go to Login', onPress: () => router.replace('/sign-in') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isAuthenticated) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600">Checking authentication...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 gap-6 bg-white p-5 pt-12">
      <Text className="text-2xl font-bold text-gray-900 mb-4">Sign Up</Text>

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

      <View className="flex-row justify-center mt-6">
        <Text className="text-gray-600">Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/sign-in')}>
          <Text className="text-lime-500 font-bold">Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
