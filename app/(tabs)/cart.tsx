import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useCartStore } from "@/store/cart.store";
import useAuthStore from '@/store/auth.store';
import CartItem from "@/components/CartItem";
import { createPaymentIntent, createOrder } from '@/lib/payment';
import { useStripe } from '@stripe/stripe-react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import cn from 'clsx';

const PaymentInfo = ({ label, value, labelStyle, valueStyle }: { label: string; value: string; labelStyle?: string; valueStyle?: string }) => (
  <View className="flex-row justify-between my-1">
    <Text className={cn("text-sm font-medium text-gray-500", labelStyle)}>{label}</Text>
    <Text className={cn("text-base font-bold text-gray-900", valueStyle)}>{value}</Text>
  </View>
);

export default function Cart() {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const deliveryFee = 5.00;
  const discount = 0.50;
  const finalTotal = totalPrice + deliveryFee - discount;

  const handleCheckout = async () => {
    if (!user) {
      Alert.alert('Error', 'Please sign in to checkout');
      router.push('/sign-in');
      return;
    }
  
    if (!items?.length) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }
  
    setIsProcessing(true);
  
    try {
      // 1️⃣ Calculate totals
      const totalPrice = getTotalPrice();
      const totalItems = getTotalItems();
      const deliveryFee = 5.0;
      const discount = 0.5;
      const finalTotal = totalPrice + deliveryFee - discount;
  
      // 2️⃣ Create payment intent
      const paymentIntent = await createPaymentIntent(
        finalTotal,
        `Grocery order - ${totalItems} items`
      );
  
      if (!paymentIntent?.paymentIntentId)
        throw new Error('Payment ID is missing from payment intent');
  
      // 3️⃣ Initialize Stripe Payment Sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'Your Grocery Store',
        paymentIntentClientSecret: paymentIntent.clientSecret,
        defaultBillingDetails: { name: user.name, email: user.email },
        appearance: { colors: { primary: '#84CC16' } },
      });
  
      if (initError) throw new Error(initError.message);
  
      // 4️⃣ Present Stripe Payment Sheet
      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        if (presentError.code === 'Canceled') {
          Alert.alert('Payment Cancelled', 'You can complete your order anytime.');
          return;
        }
        throw new Error(presentError.message);
      }
  
      // 5️⃣ Create order in Appwrite
      const orderResult = await createOrder(
        paymentIntent.paymentIntentId, // ✅ Correct property
        items,
        user.$id,                      // ✅ Correct user ID
        finalTotal,
        deliveryFee,
        discount
      );
  
      if (!orderResult?.success)
        throw new Error(orderResult?.message || 'Order creation failed');
  
      // 6️⃣ Clear cart and show success
      clearCart();
      Alert.alert(
        'Payment Successful! 🎉',
        `Your order has been placed and paid!\n\nOrder ID: ${orderResult.orderId?.slice(
          0,
          8
        )}...\nTotal Paid: R${finalTotal.toFixed(2)}`,
        [{ text: 'Continue Shopping', onPress: () => router.push('/search') }]
      );
    } catch (error: any) {
      console.error('Checkout error:', error);
      Alert.alert('Payment Failed', error.message || 'Something went wrong.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  

  return (
    <SafeAreaView className="bg-white flex-1">
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CartItem item={item} />}
        contentContainerClassName="pb-28 px-5 pt-5"
        ListHeaderComponent={() => (
          <Text className="text-2xl font-bold text-gray-900 mb-5">Your Cart</Text>
        )}
        ListEmptyComponent={() => (
          <View className="items-center justify-center py-20">
            <Text className="text-xl font-bold text-gray-400 mb-2">Cart is Empty</Text>
            <Text className="text-sm text-gray-500 mb-6">Add some groceries to get started!</Text>
            <TouchableOpacity
              className="bg-lime-500 px-6 py-3 rounded-xl"
              onPress={() => router.push('/search')}
            >
              <Text className="text-white font-bold text-center">Start Shopping</Text>
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={() => totalItems > 0 && (
          <View className="gap-5 mt-5">
            <View className="border border-gray-200 p-5 rounded-2xl">
              <Text className="text-xl font-bold text-gray-900 mb-5">Payment Summary</Text>
              <PaymentInfo label={`Subtotal (${totalItems} items)`} value={`R${totalPrice.toFixed(2)}`} />
              <PaymentInfo label="Delivery Fee" value={`R${deliveryFee.toFixed(2)}`} />
              <PaymentInfo label="Discount" value={`- R${discount.toFixed(2)}`} valueStyle="text-green-600" />
              <View className="border-t border-gray-300 my-2" />
              <PaymentInfo label="Total" value={`R${finalTotal.toFixed(2)}`} labelStyle="font-bold text-gray-900" valueStyle="font-bold text-lime-500" />
            </View>

            <TouchableOpacity
              className={cn("p-4 rounded-xl items-center", isProcessing ? "bg-gray-300" : "bg-lime-500")}
              onPress={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator color="#fff" />
                  <Text className="text-white font-bold text-sm">Processing Payment...</Text>
                </View>
              ) : (
                <Text className="text-white font-bold text-sm">Proceed to Payment - R{finalTotal.toFixed(2)}</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
