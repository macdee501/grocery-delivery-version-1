import { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import CustomInputField from "@/components/CustomInputField";
import CustomButton from "@/components/CustomButton";
import AuthHeader from "@/components/AuthHeader";
import useAuthStore from "@/store/auth.store";
import { createUser } from "@/lib/appwrite";

export default function SignUpScreen() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoading, isAuthenticated } = useAuthStore();

  const submitForm = async () => {
    const { name, email, password } = form;
    if (!name || !email || !password) return alert("All fields are required.");

    setIsSubmitting(true);
    try {
      await createUser({ name, email, password });
      alert("Account created! You can now log in.");
      router.replace("/sign-in");
    } catch (err: any) {
      alert(err.message || "Failed to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isAuthenticated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
        <Text style={{ color: "#6b7280" }}>Checking authentication...</Text>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      extraScrollHeight={Platform.OS === "android" ? 120 : 20}
      keyboardShouldPersistTaps="handled"
    >
      <AuthHeader />

      <View style={{ padding: 20, flex: 1, gap: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Sign Up</Text>

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

        <CustomButton title="Sign Up" isLoading={isSubmitting} onPress={submitForm} />

        <View style={{ marginTop: 24, alignItems: "center" }}>
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/sign-in")}>
            <Text style={{ color: "#84cc16", fontWeight: "bold" }}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
