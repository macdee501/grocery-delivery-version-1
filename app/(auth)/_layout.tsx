import { Dimensions, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import React from 'react';
import { Slot, Redirect } from 'expo-router';
import { images } from '@/constants';
import useAuthStore from '@/store/auth.store';

export default function AuthLayout() {
  const { isAuthenticated } = useAuthStore();

  // Redirect logged-in users away from auth pages
  if (isAuthenticated) return <Redirect href="/(tabs)" />;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <ScrollView
        className="h-full"
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Header Graphic */}
        <View
          className="w-full relative"
          style={{ height: Dimensions.get('screen').height / 2.5 }}
        >
          <ImageBackground
            source={images.siteHeader} // <-- replace with your site header graphic
            className="size-full rounded-b-3xl"
            resizeMode="cover"
          />

          {/* Avocado Logo */}
          <Image
            source={images.avocado} // <-- your avocado logo
            className="self-center size-48 absolute -bottom-16 z-10"
          />
        </View>

        {/* Slot for Sign In / Sign Up forms */}
        <View className="px-5 -mt-12">
          <Slot />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
