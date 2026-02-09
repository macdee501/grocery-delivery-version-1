import React from "react";
import { View, ScrollView, Platform } from "react-native";
import { Slot, Redirect } from "expo-router";
import useAuthStore from "@/store/auth.store";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AuthLayout() {
  const { isAuthenticated } = useAuthStore();
  const insets = useSafeAreaInsets();

  if (isAuthenticated) return <Redirect href="/(tabs)" />;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "white" }}
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: insets.bottom + (Platform.OS === "android" ? 120 : 20),
      }}
      keyboardShouldPersistTaps="handled"
    >
      <Slot />
    </ScrollView>
  );
}
