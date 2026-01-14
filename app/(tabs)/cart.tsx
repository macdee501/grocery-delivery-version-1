import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import { useCartStore } from "@/store/cart.store";
import useAuthStore from '@/store/auth.store';
import cn from "clsx";
import CustomButton from "@/components/CustomButton";
import CartItem from "@/components/CartItem";
import { processPayment, createOrder } from '@/lib/payment';
import { useState } from 'react';
import { router } from 'expo-router';

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

export default function Cart() {
    const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const [isProcessing, setIsProcessing] = useState(false);
    
    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();
    
    const deliveryFee = 5.00;
    const discount = 0.50;
    const finalTotal = totalPrice + deliveryFee - discount;
    
    const handleCheckout = async () => {
        // Check if user is logged in
        if (!user) {
            Alert.alert('Error', 'Please sign in to checkout');
            router.push('/sign-in');
            return;
        }
        
        // Check if cart has items
        if (items.length === 0) {
            Alert.alert('Error', 'Your cart is empty');
            return;
        }
        
        try {
            setIsProcessing(true);
            console.log('🛒 Starting checkout process...');
            
            // Step 1: Process Payment
            console.log('💳 Step 1: Processing payment...');
            const paymentResult = await processPayment(
                finalTotal,
                `Grocery order - ${totalItems} items`
            );
            
            if (!paymentResult.success) {
                throw new Error(paymentResult.message || 'Payment failed');
            }
            
            console.log('✅ Payment successful:', paymentResult.paymentIntentId);
            
            // Step 2: Create Order
            console.log('📦 Step 2: Creating order...');
            const orderResult = await createOrder(
                paymentResult.paymentIntentId,
                items,
                user.accountId,
                finalTotal,
                deliveryFee,
                discount
            );
            
            if (!orderResult.success) {
                throw new Error(orderResult.message || 'Order creation failed');
            }
            
            console.log('✅ Order created:', orderResult.orderId);
            
            // Step 3: Clear cart
            clearCart();
            
            // Step 4: Show success
            Alert.alert(
                'Order Placed! 🎉',
                `Your order has been placed successfully!\n\nOrder ID: ${orderResult.orderId.slice(0, 8)}...\nTotal: R${finalTotal.toFixed(2)}`,
                [
                    {
                        text: 'Continue Shopping',
                        onPress: () => router.push('/search')
                    }
                ]
            );
            
        } catch (error: any) {
            console.error('❌ Checkout error:', error);
            Alert.alert(
                'Checkout Failed',
                error.message || 'Something went wrong. Please try again.'
            );
        } finally {
            setIsProcessing(false);
        }
    };
    
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
                        <Text className="paragraph-regular text-gray-200 mb-6">
                            Add some groceries to get started!
                        </Text>
                        <TouchableOpacity 
                            className="bg-primary px-6 py-3 rounded-xl"
                            onPress={() => router.push('/search')}
                        >
                            <Text className="paragraph-bold text-white">
                                Start Shopping
                            </Text>
                        </TouchableOpacity>
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
                        
                        {/* Checkout Button with Processing State */}
                        <TouchableOpacity
                            className={cn(
                                "p-4 rounded-xl items-center",
                                isProcessing ? "bg-gray-300" : "bg-primary"
                            )}
                            onPress={handleCheckout}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <View className="flex-row items-center gap-2">
                                    <ActivityIndicator color="#fff" />
                                    <Text className="paragraph-bold text-white">
                                        Processing Order...
                                    </Text>
                                </View>
                            ) : (
                                <Text className="paragraph-bold text-white">
                                    Proceed to Checkout - R{finalTotal.toFixed(2)}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            />
        </SafeAreaView>
    )
}