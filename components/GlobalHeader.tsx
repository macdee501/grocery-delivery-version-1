import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePathname } from "expo-router";
import CartButton from "@/components/CartButton";

export default function GlobalHeader() {
  const pathname = usePathname();

  // 🔕 Hide header on profile
  if (pathname.includes("/profile")) {
    return null;
  }

  const renderContent = () => {
    // 🏠 HOME
    if (pathname === "/") {
      return (
        <>
          <View>
            <Text className="text-xs font-bold text-lime-500 uppercase">
              Deliver to
            </Text>
            <Text className="text-base font-semibold text-gray-900 mt-1">
              This address?
            </Text>
          </View>
          <CartButton />
        </>
      );
    }

    // 🛒 SHOP
    if (pathname.includes("/search")) {
      return (
        <>
          <View>
            <Text className="text-xs font-bold text-lime-500 uppercase">
              Search
            </Text>
            <Text className="text-base font-semibold text-gray-900 mt-1">
              Find your groceries
            </Text>
          </View>
          <CartButton />
        </>
      );
    }

    // 🧺 CART
    if (pathname.includes("/cart")) {
      return (
        <View className='flex-1 items-end'>

            <CartButton />
        </View>
    );
    }

    return null;
  };

  return (
    <SafeAreaView edges={["top"]} className="bg-white">
      <View className="px-4 py-3 flex-row justify-between items-center border-b border-gray-100">
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}
