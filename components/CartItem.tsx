import { View, Text, Image, TouchableOpacity } from 'react-native'
import { CartItem as CartItemType } from '@/store/cart.store';
import { useCartStore } from '@/store/cart.store';

interface CartItemProps {
    item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
    const { increaseQty, decreaseQty, removeItem } = useCartStore();
    
    return (
        <View className="flex-row bg-gray-50 p-4 rounded-xl mb-3">
            <Image 
                source={{ uri: item.image_url }} 
                className="size-20 rounded-lg"
                resizeMode="cover"
            />
            
            <View className="flex-1 ml-4">
                <Text className="base-bold text-dark-100 mb-1">{item.name}</Text>
                <Text className="paragraph-medium text-gray-200 mb-2">
                    R{item.price.toFixed(2)}
                </Text>
                
                <View className="flex-row items-center gap-3">
                    <TouchableOpacity 
                        onPress={() => decreaseQty(item.id)}
                        className="bg-white w-8 h-8 rounded-full items-center justify-center border border-gray-200"
                    >
                        <Text className="text-lg text-dark-100">−</Text>
                    </TouchableOpacity>
                    
                    <Text className="paragraph-bold text-dark-100 min-w-[30px] text-center">
                        {item.quantity}
                    </Text>
                    
                    <TouchableOpacity 
                        onPress={() => increaseQty(item.id)}
                        className="bg-primary w-8 h-8 rounded-full items-center justify-center"
                    >
                        <Text className="text-lg text-white">+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            <View className="items-end justify-between">
                <TouchableOpacity 
                    onPress={() => removeItem(item.id)}
                    className="p-2"
                >
                    <Text className="text-red-500 text-lg">✕</Text>
                </TouchableOpacity>
                
                <Text className="base-bold text-primary">
                    R{(item.price * item.quantity).toFixed(2)}
                </Text>
            </View>
        </View>
    )
}

export default CartItem;