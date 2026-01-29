import { Alert, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Link, router } from 'expo-router';
import CustomInputField from '@/components/CustomInputField';
import CustomButton from '@/components/CustomButton';
import { signIn } from '@/lib/appwrite';
import useAuthStore from '@/store/auth.store';

export default function SignInScreen() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({email: "", password: ""});
    const { fetchAuthenticatedUser, user, isAuthenticated, isLoading } = useAuthStore(); 

    // Redirect if already logged in
    useEffect(() => {
        console.log('🔐 Sign-in page - Auth state:', { isAuthenticated, hasUser: !!user, isLoading });
        
        if (!isLoading && isAuthenticated && user) {
            console.log('✅ Already logged in, redirecting to home...');
            router.replace('/(tabs)');
        }
    }, [isAuthenticated, user, isLoading]);

    async function submitForm() {
        const {email, password} = form;
        
        if (!email || !password) {
            return Alert.alert("Error", "Please enter valid email address & password");
        }

        setIsSubmitting(true);

        try {
            console.log('📧 Attempting sign in with:', email);
            await signIn({email, password});
            console.log('✅ Sign in successful, fetching user...');
            await fetchAuthenticatedUser();
            console.log('✅ User fetched, redirecting...');
            router.replace('/(tabs)');
        } catch (error: any) {
            console.error('❌ Sign in error:', error);
            Alert.alert('Error', error.message || 'Could not sign in. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    // Show loading while checking auth
    if (isLoading) {
        return (
            <View className='flex-1 justify-center items-center bg-white'>
                <ActivityIndicator size="large" color="#FF6B2C" />
                <Text className='mt-4 text-gray-600'>Checking login status...</Text>
            </View>
        );
    }

    // Don't render form if already authenticated (prevents flash)
    if (isAuthenticated && user) {
        return (
            <View className='flex-1 justify-center items-center bg-white'>
                <ActivityIndicator size="large" color="#FF6B2C" />
                <Text className='mt-4 text-gray-600'>Redirecting...</Text>
            </View>
        );
    }

    return (
        <View className='gap-10 bg-white rounded-lg p-5 mt-5'>
            <View>
                <Text className='h2-bold text-dark-100'>Login</Text>
            </View>
            <CustomInputField
                placeholder='Enter Email'
                value={form.email}
                onChangeText={(text) => setForm((prev) => ({...prev, email: text}))}
                label='Email'
                keyboardType='email-address'
            />
            <CustomInputField
                placeholder='Enter Password'
                value={form.password}
                onChangeText={(text) => setForm((prev) => ({...prev, password: text}))}
                label='Password'
                secureTextEntry={true}
            />
            <CustomButton
                title="Sign In"
                isLoading={isSubmitting}
                onPress={submitForm}
            />
            <View className='flex justify-center mt-5 flex-row gap-2'>
                <Text className='base-regular text-gray-100'>Don't have an Account?</Text>
                <Link href='/sign-up' className='base-bold text-primary'>
                    Sign Up
                </Link>    
            </View>      
        </View>
    )
}