import { Tabs, Redirect } from "expo-router";
import useAuthStore from "@/store/auth.store";

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
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="search" options={{ title: "Shop" }} />
      <Tabs.Screen name="cart" options={{ title: "Cart" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
