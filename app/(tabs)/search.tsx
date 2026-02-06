import { Text, FlatList, View, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import useAppwrite from "@/lib/useAppwrite";
import { getCategories, getProducts } from "@/lib/appwrite";
import ProductCard from "@/components/ProductCard";
import cn from "clsx";
import { Product } from "@/type";

const Search = () => {
  const router = useRouter();
  const { category, query } = useLocalSearchParams<{ query: string; category: string }>();

  const [refreshing, setRefreshing] = useState(false);

  const { data: categories, loading: loadingCategories } = useAppwrite({ fn: getCategories });
  const { data: products, refetch, loading: loadingProducts } = useAppwrite({
    fn: getProducts,
    params: { category, query, limit: 6 },
  });

  useEffect(() => {
    refetch({ category, query, limit: 6 });
  }, [category, query]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch({ category, query, limit: 6 });
    setRefreshing(false);
  }, [category, query]);

  return (
    <SafeAreaView className="bg-white flex-1">
      {/* Categories */}
<View className="pt-3">
  {loadingCategories ? (
    <ActivityIndicator size="small" color="#000" />
  ) : (
    <FlatList
      data={[{ $id: "all", name: "All" }, ...(categories || [])]} // Add "All" first
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.$id}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      renderItem={({ item }) => {
        const isActive = category === item.$id || (!category && item.$id === "all");

        return (
          <TouchableOpacity
            onPress={() =>
              router.setParams({
                category: item.$id === "all" ? undefined : item.$id, // Clear category if "All"
                query,
              })
            }
            className={cn(
              "px-4 py-2 rounded-full border",
              isActive ? "bg-black border-black" : "bg-white border-gray-300"
            )}
          >
            <Text
              className={cn(
                "text-sm",
                isActive ? "text-white" : "text-gray-700"
              )}
            >
              {item.name || "Unnamed"}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  )}
</View>


      {/* Products */}
      {loadingProducts && !refreshing ? (
        <View className="flex-1 justify-center items-center mt-10">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          data={products || []}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, gap: 12 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <View className="items-center mt-10">
              <Text className="text-gray-400">No products found</Text>
            </View>
          )}
          renderItem={({ item }: { item: Product }) => <ProductCard item={item} />}
        />
      )}
    </SafeAreaView>
  );
};

export default Search;
