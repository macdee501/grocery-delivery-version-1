import { Tabs, Redirect } from "expo-router";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useAuthStore from "@/store/auth.store";
import GlobalHeader from "@/components/GlobalHeader";

export default function TabsLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();

  // ⛔ wait until auth is resolved
  if (isLoading) {
    return null;
  }

  // 🔐 protect tabs
  if (!isAuthenticated) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <View className="flex-1 bg-white">
      {/* 🔝 Persistent header (visible on all tabs) */}
      <GlobalHeader/>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#84cc16",
          tabBarInactiveTintColor: "#9ca3af",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size} />
            ),
          }}
        />

        <Tabs.Screen
          name="search"
          options={{
            title: "Shop",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="storefront-outline"
                color={color}
                size={size}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="cart"
          options={{
            title: "Cart",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart-outline" color={color} size={size} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
