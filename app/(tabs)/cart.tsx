import { View, Text, FlatList } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import { useCartStore } from "@/store/cart.store";
import cn from "clsx";
import CustomButton from "@/components/CustomButton";
import CartItem from "@/components/CartItem";

interface PaymentInfoProps {
    label: string;
    value: string;
    labelStyle?: string;
    valueStyle?: string;
}

const PaymentInfo = ({ label, value, labelStyle, valueStyle }: PaymentInfoProps) => (
    <View className="flex-between flex-row my-1">
        <Text className={cn("paragraph-medium text-gray-200", labelStyle)}>
            {label}
        </Text>
        <Text className={cn("paragraph-bold text-dark-100", valueStyle)}>
            {value}
        </Text>
    </View>
);

const Cart = () => {
    const { items, getTotalItems, getTotalPrice } = useCartStore();
    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();
    
    const deliveryFee = 5.00;
    const discount = 0.50;
    const finalTotal = totalPrice + deliveryFee - discount;
    
    return (
        <SafeAreaView className="bg-white h-full">
            <FlatList
                data={items}
                renderItem={({ item }) => <CartItem item={item} />}
                keyExtractor={(item) => item.id}
                contentContainerClassName="pb-28 px-5 pt-5"
                ListHeaderComponent={() => (
                    <View className="mb-5">
                        <Text className="h2-bold text-dark-100">Your Cart</Text>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <View className="items-center justify-center py-20">
                        <Text className="h3-bold text-gray-300 mb-2">Cart is Empty</Text>
                        <Text className="paragraph-regular text-gray-200">
                            Add some groceries to get started!
                        </Text>
                    </View>
                )}
                ListFooterComponent={() => totalItems > 0 && (
                    <View className="gap-5 mt-5">
                        <View className="border border-gray-200 p-5 rounded-2xl">
                            <Text className="h3-bold text-dark-100 mb-5">
                                Payment Summary
                            </Text>
                            <PaymentInfo
                                label={`Subtotal (${totalItems} items)`}
                                value={`R${totalPrice.toFixed(2)}`}
                            />
                            <PaymentInfo
                                label="Delivery Fee"
                                value={`R${deliveryFee.toFixed(2)}`}
                            />
                            <PaymentInfo
                                label="Discount"
                                value={`- R${discount.toFixed(2)}`}
                                valueStyle="!text-green-600"
                            />
                            <View className="border-t border-gray-300 my-2" />
                            <PaymentInfo
                                label="Total"
                                value={`R${finalTotal.toFixed(2)}`}
                                labelStyle="base-bold !text-dark-100"
                                valueStyle="base-bold !text-primary"
                            />
                        </View>
                        <CustomButton 
                            title="Proceed to Checkout" 
                            onPress={() => console.log('💳 Checkout:', finalTotal)}
                        />
                    </View>
                )}
            />
        </SafeAreaView>
    )
}

export default Cart;