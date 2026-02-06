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
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // tweak if keyboard still covers
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Graphic */}
        <View
          style={{ height: Dimensions.get('screen').height / 2.5 }}
          className="w-full relative"
        >
          <ImageBackground
            source={images.siteHeader}
            className="size-full rounded-b-3xl"
            resizeMode="cover"
          />

          {/* Avocado Logo */}
          <Image
            source={images.avocado}
            className="self-center size-48 absolute -bottom-16 z-10"
          />
        </View>

        {/* Slot for Sign In / Sign Up forms */}
        <View className="px-5 -mt-12 flex-1 justify-center">
          <Slot />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
