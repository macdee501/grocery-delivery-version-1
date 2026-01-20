import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getUserOrders } from '@/lib/appwrite'
import { router } from 'expo-router'
import useAuthStore from '@/store/auth.store'
import { Order, OrderItem } from '@/type'

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user,isAuthenticated } = useAuthStore();

  useEffect(() => {

    console.log('=== USER DEBUG ===')
    console.log('User Object',user)
    console.log('User.$id',user?.$id)
    console.log('====')


    if(!isAuthenticated)
    {
      router.replace('/(auth)/sign-in');
      return;
    }
    
    if (user) {
      fetchOrders();
    }
  }, [user,isAuthenticated]);

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      console.log('👤 Fetching orders for user ID:', user.accountId);


      const response = await getUserOrders(user.accountId);

      console.log('📦 Orders returned:', response.length);
    console.log('📋 Orders data:', JSON.stringify(response, null, 2));

      setOrders(response as Order[]);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  const renderOrderItem = ({ item }: { item: Order }) => {
    const parseItems = (itemsString:string)=>{
      try{
        return JSON.parse(itemsString);
      }
      catch
      {
        return [];
      }

    }
    
    const items = parseItems(item.items)
    const itemsToShow = items.slice(0, 2);

    return (
      <TouchableOpacity
        className="bg-gray-50 rounded-2xl p-4 mb-3"
        onPress={() => router.push(`/(protected)/order-details/${item.$id}`)}
        activeOpacity={0.7}
      >
        {/* Header */}
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="base-bold text-dark-100 mb-1">
              Order #{item.$id.slice(-8).toUpperCase()}
            </Text>
            <Text className="small-regular text-gray-400">
              {formatDate(item.$createdAt)}
            </Text>
          </View>
          
          <View className={`px-3 py-1 rounded-full border ${getStatusColor(item.status)}`}>
            <Text className={`small-bold ${getStatusTextColor(item.status)}`}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>

        {/* Items Preview */}
        <View className="mb-3">
          {itemsToShow.map((orderItem, index) => (
            <View key={index} className="flex-row items-center mb-2">
              {orderItem.image_url && (
                <Image
                  source={{ uri: orderItem.productImage }}
                  className="size-12 rounded-lg bg-gray-200 mr-3"
                  resizeMode="cover"
                />
              )}
              <View className="flex-1">
                <Text className="body-semibold text-dark-100" numberOfLines={1}>
                  {orderItem.name}
                </Text>
                <Text className="small-regular text-gray-400">
                  Qty: {orderItem.quantity}
                </Text>
              </View>
              <Text className="body-bold text-dark-100">
                R{orderItem.price.toFixed(2)}
              </Text>
            </View>
          ))}
          {items.length > 2 && (
            <Text className="small-regular text-gray-400 italic">
              +{items.length - 2} more item{items.length - 2 > 1 ? 's' : ''}
            </Text>
          )}
        </View>

        {/* Footer */}
        <View className="flex-row justify-between items-center pt-3 border-t border-gray-200">
          <Text className="body-regular text-gray-400">Total Amount</Text>
          <Text className="h3-bold text-dark-100">
            R{item.totalAmount.toFixed(2)}
          </Text>
        </View>

        {/* Payment ID */}
        <View className="mt-2 pt-2 border-t border-gray-200">
          <Text className="small-regular text-gray-400">
            Payment ID: <Text className="small-bold text-dark-100">{item.stripePaymentId.slice(-12)}</Text>
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-8" style={{ minHeight: 400 }}>
      <Text className="text-6xl mb-4">📦</Text>
      <Text className="h2-bold text-dark-100 mb-2 text-center">
        No Orders Yet
      </Text>
      <Text className="paragraph-regular text-gray-400 text-center mb-6">
        Your order history will appear here once you make your first purchase.
      </Text>
      <TouchableOpacity
        className="bg-primary px-8 py-4 rounded-xl"
        onPress={() => router.push('/(tabs)/search')}
      >
        <Text className="paragraph-bold text-white">Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className="bg-white h-full items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
        <Text className="paragraph-regular text-gray-400 mt-4">
          Loading your orders...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.$id}
        contentContainerClassName="px-5 pb-8"
        ListHeaderComponent={() => (
          <View className="mb-6 mt-10">
            <Text className="h2-bold text-dark-100">Order History</Text>
            {orders.length > 0 && (
              <Text className="paragraph-regular text-gray-400 mt-1">
                {orders.length} order{orders.length > 1 ? 's' : ''}
              </Text>
            )}
          </View>
        )}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}