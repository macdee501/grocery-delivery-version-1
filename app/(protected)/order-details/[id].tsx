import { View, Text, ScrollView, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import { getOrderById } from '@/lib/appwrite'
import { Order } from '@/type'

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await getOrderById(id as string);
      setOrder(response as Order);
    } catch (error) {
      console.error('Error fetching order details:', error);
      Alert.alert('Error', 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 border-green-200';
      case 'shipped':
        return 'bg-blue-100 border-blue-200';
      case 'processing':
        return 'bg-yellow-100 border-yellow-200';
      case 'paid':
        return 'bg-purple-100 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 border-red-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  const getStatusTextColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'text-green-700';
      case 'shipped':
        return 'text-blue-700';
      case 'processing':
        return 'text-yellow-700';
      case 'paid':
        return 'text-purple-700';
      case 'cancelled':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  const getStatusText = (status: Order['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-white h-full items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
        <Text className="paragraph-regular text-gray-400 mt-4">
          Loading order details...
        </Text>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView className="bg-white h-full items-center justify-center px-8">
        <Text className="h2-bold text-dark-100 mb-4">Order Not Found</Text>
        <TouchableOpacity
          className="bg-primary px-8 py-4 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="paragraph-bold text-white">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }


 const parseOrderItems = (itemString:string)=>{
  try{
    if(typeof itemString === 'string')
    {
      return JSON.parse(itemString);
    }
    return [];

  }
  catch(error)
  {
    console.error('Error parsing order items:', error);
    return [];
  }
 }
  
  const items = parseOrderItems(order.items);
  console.log('📦 Final items:', items);
  console.log('📦 Items length:', items.length);
  
  // Also log the entire order object
  console.log('📋 Full order object:', JSON.stringify(order, null, 2));
  const subtotal = order.totalAmount - order.deliveryFee + order.discount;

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View className="px-5 pt-10 pb-4">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1">
              <Text className="h2-bold text-dark-100 mb-1">
                Order #{order.$id.slice(-8).toUpperCase()}
              </Text>
              <Text className="paragraph-regular text-gray-400">
                {formatDate(order.$createdAt)}
              </Text>
            </View>
            
            <View className={`px-3 py-1.5 rounded-full border ${getStatusColor(order.status)}`}>
              <Text className={`body-bold ${getStatusTextColor(order.status)}`}>
                {getStatusText(order.status)}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Info */}
        <View className="mx-5 mb-4 bg-purple-50 border border-purple-200 rounded-2xl p-4">
          <Text className="small-bold text-gray-400 mb-1">PAYMENT ID</Text>
          <Text className="base-bold text-dark-100">{order.stripePaymentId}</Text>
        </View>

        {/* Order Items */}
        <View className="px-5 mb-4">
          <Text className="h3-bold text-dark-100 mb-3">Order Items</Text>
          {items.map((item, index) => (
            <View key={index} className="bg-gray-50 rounded-2xl p-4 mb-3 flex-row">
              {item.image_url && (
                <Image
                  source={{ uri: item.image_url }}
                  className="size-20 rounded-xl bg-gray-200 mr-4"
                  resizeMode="cover"
                />
              )}
              <View className="flex-1 justify-center">
                <Text className="base-bold text-dark-100 mb-1">
                  {item.name}
                </Text>
                <Text className="body-regular text-gray-400 mb-1">
                  Quantity: {item.quantity}
                </Text>
                <Text className="small-regular text-gray-400">
                  R{item.price.toFixed(2)} each
                </Text>
              </View>
              <View className="justify-center">
                <Text className="h3-bold text-dark-100">
                  R{(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View className="px-5 mb-4">
          <Text className="h3-bold text-dark-100 mb-3">Order Summary</Text>
          <View className="bg-gray-50 rounded-2xl p-4">
            <View className="flex-row justify-between mb-2">
              <Text className="body-regular text-gray-400">Subtotal</Text>
              <Text className="body-semibold text-dark-100">R{subtotal.toFixed(2)}</Text>
            </View>
            
            <View className="flex-row justify-between mb-2">
              <Text className="body-regular text-gray-400">Delivery Fee</Text>
              <Text className="body-semibold text-dark-100">R{order.deliveryFee.toFixed(2)}</Text>
            </View>
            
            {order.discount > 0 && (
              <View className="flex-row justify-between mb-2">
                <Text className="body-regular text-gray-400">Discount</Text>
                <Text className="body-semibold text-green-600">-R{order.discount.toFixed(2)}</Text>
              </View>
            )}
            
            <View className="border-t border-gray-200 my-3" />
            
            <View className="flex-row justify-between">
              <Text className="h3-bold text-dark-100">Total</Text>
              <Text className="h2-bold text-dark-100">R{order.totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="px-5 pb-8 gap-3">
          <TouchableOpacity 
            className="bg-gray-50 border border-gray-200 py-4 rounded-xl items-center"
            onPress={() => Alert.alert('Support', 'Contact support feature coming soon!')}
          >
            <Text className="paragraph-bold text-dark-100">Contact Support</Text>
          </TouchableOpacity>
          
          {order.status === 'delivered' && (
            <TouchableOpacity className="bg-primary py-4 rounded-xl items-center">
              <Text className="paragraph-bold text-white">Reorder Items</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}