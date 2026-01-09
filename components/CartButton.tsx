import { Image, TouchableOpacity, View, Text } from 'react-native'
import { images } from '@/constants'
import { router } from 'expo-router';
import { useCartStore } from '@/store/cart.store'; // ✅ Add this

export default function CartButton() {
    const { getTotalItems } = useCartStore(); // ✅ Add this
    const totalItems = getTotalItems(); // ✅ Use dynamic count
    
    return (
        <TouchableOpacity
            className='cart-btn'
            onPress={() => router.push('/cart')}
        >
            <Image
                source={images.bag} 
                className='size-5'
                resizeMode='contain'
            />

            {totalItems > 0 && (
                <View className='cart-badge'>
                    <Text className='small-bold text-white'>{totalItems}</Text>
                </View>
            )}
        </TouchableOpacity>
    )
}