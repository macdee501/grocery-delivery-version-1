import { Dimensions, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect, Slot } from 'expo-router';
import { images } from '@/constants';
import useAuthStore from '@/store/auth.store';

export default function AuthLayout() {

    const { isAuthenticated } = useAuthStore();

    if(isAuthenticated) return <Redirect href="/" />
    
  return (
    <KeyboardAvoidingView
    behavior={Platform.OS == "ios" ? "padding": "height"}>
        <ScrollView 
        className='bg-white h-full'
        keyboardShouldPersistTaps="handled"
        >
            <View className='w-full relative'
            style={{height:Dimensions.get('screen').height/2.25}}>
                <ImageBackground
                source={images.loginGraphic}
                className='size-full rounded-b-lg'
                resizeMode='stretch'
                />

                {/* Company Logo */}
                <Image
                source={images.logo}
                className='self-center sie-48 absolute -bottom-16 z-10'
                />
            </View>
            <Slot/>
        </ScrollView>
    </KeyboardAvoidingView>
  )
}

