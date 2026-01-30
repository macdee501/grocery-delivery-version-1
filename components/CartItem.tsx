import { View, Text, Image, TouchableOpacity } from 'react-native';
import { CartItem as CartItemType } from '@/store/cart.store';
import { useCartStore } from '@/store/cart.store';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { increaseQty, decreaseQty, removeItem } = useCartStore();

  return (
    <View className="flex-row bg-gray-50 p-4 rounded-xl mb-3">
      {/* Product Image */}
      <Image 
        source={{ uri: item.image_url }}
        className="w-20 h-20 rounded-lg"
        resizeMode="cover"
      />

      {/* Product Details */}
      <View className="flex-1 ml-4">
        <Text className="text-lg font-bold text-gray-900 mb-1">{item.name}</Text>
        <Text className="text-sm text-gray-500 mb-2">R{item.price.toFixed(2)}</Text>

        {/* Quantity Controls */}
        <View className="flex-row items-center gap-3">
          <TouchableOpacity 
            onPress={() => decreaseQty(item.id)}
            className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center"
          >
            <Text className="text-lg text-gray-900">−</Text>
          </TouchableOpacity>

          <Text className="text-base font-bold text-gray-900 text-center min-w-[30px]">{item.quantity}</Text>

          <TouchableOpacity 
            onPress={() => increaseQty(item.id)}
            className="w-8 h-8 rounded-full bg-lime-500 flex items-center justify-center"
          >
            <Text className="text-lg text-white">+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Item Total & Remove */}
      <View className="items-end justify-between">
        <TouchableOpacity 
          onPress={() => removeItem(item.id)}
          className="p-2"
        >
          <Text className="text-red-600 text-lg">✕</Text>
        </TouchableOpacity>

        <Text className="text-lg font-bold text-lime-500">
          R{(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

export default CartItem;
