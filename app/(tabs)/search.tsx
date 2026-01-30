import { Text, FlatList, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import useAppwrite from "@/lib/useAppwrite";
import { getCategories, getProducts } from "@/lib/appwrite";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import ProductCard from '@/components/ProductCard';
import CartButton from "@/components/CartButton";
import cn from 'clsx';
import { Product } from "@/type";

const Search = () => {
  const { category, query } = useLocalSearchParams<{query: string; category: string}>();
  
  const { data, refetch, loading } = useAppwrite({ 
    fn: getProducts, 
    params: { category, query, limit: 6 } 
  });
  
  const { data: categories } = useAppwrite({ fn: getCategories });
  
  useEffect(() => {
    refetch({ category, query, limit: 6 });
  }, [category, query]);
  
  return (
    <SafeAreaView className="bg-white flex-1">
      <FlatList
        data={data || []}
        numColumns={2}
        columnWrapperClassName="gap-4 px-4"
        contentContainerClassName="pb-28 pt-5"
        keyExtractor={(item) => item.$id}
        renderItem={({ item, index }) => (
          <View className={cn("flex-1", index % 2 === 0 ? "mt-0" : "mt-4")}>
            <ProductCard item={item as Product} />
          </View>
        )}
        ListHeaderComponent={() => (
          <View className="mb-5 px-4 flex-row justify-between items-center">
            <View>
              <Text className="text-xs font-bold text-lime-500 uppercase">Search</Text>
              <Text className="text-base font-semibold text-gray-900 mt-1">Find your groceries</Text>
            </View>
            <CartButton />
          </View>
        )}
        ListEmptyComponent={() => (
          !loading && (
            <Text className="text-center text-gray-500 mt-5">No products found</Text>
          )
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
