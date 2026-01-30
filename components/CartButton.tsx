import { Image, TouchableOpacity, View, Text } from 'react-native';
import { images } from '@/constants';
import { router } from 'expo-router';
import { useCartStore } from '@/store/cart.store';

export default function CartButton() {
  const { getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <TouchableOpacity
      className="bg-lime-500 w-10 h-10 rounded-full flex items-center justify-center relative"
      onPress={() => router.push('/cart')}
    >
      <Image
        source={images.bag}
        className="w-5 h-5"
        resizeMode="contain"
      />

      {totalItems > 0 && (
        <View className="absolute -top-1 -right-1 bg-red-600 w-5 h-5 rounded-full flex items-center justify-center">
          <Text className="text-xs font-bold text-white">{totalItems}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
