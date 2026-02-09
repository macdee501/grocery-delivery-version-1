import { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import CustomInputField from "@/components/CustomInputField";
import CustomButton from "@/components/CustomButton";
import AuthHeader from "@/components/AuthHeader";
import useAuthStore from "@/store/auth.store";

export default function SignInScreen() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    if (!form.email || !form.password) return alert("All fields are required.");

    setIsSubmitting(true);
    try {
      await login(form.email, form.password);
      router.replace("/(tabs)");
    } catch (err: any) {
      alert(err.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      extraScrollHeight={Platform.OS === "android" ? 120 : 20}
      keyboardShouldPersistTaps="handled"
    >
      <AuthHeader />

      <View style={{ padding: 20, flex: 1, gap: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Sign In</Text>

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

        <CustomButton title="Sign In" isLoading={isSubmitting} onPress={handleLogin} />

        <View style={{ marginTop: 24, alignItems: "center" }}>
          <Text>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/sign-up")}>
            <Text style={{ color: "#84cc16", fontWeight: "bold" }}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
