import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import { databases, appwriteConfig } from '@/lib/appwrite'
import { Product } from '@/type'
import { useCartStore } from '@/store/cart.store'

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.shopProductsTableId,
        id as string
      );
      setProduct(response as unknown as Product);
    } catch (error) {
      console.error('Error fetching product:', error);
      Alert.alert('Error', 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const imageUrl = product.image 
      ? `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.bucketId}/files/${product.image}/view?project=${appwriteConfig.projectId}`
      : 'https://via.placeholder.com/150';
    
    // Add to cart with quantity
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.$id,
        name: product.name,
        price: product.price,
        image_url: imageUrl,
      });
    }
    
    Alert.alert('Success', `Added ${quantity} ${product.name} to cart`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/(tabs)/cart');
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-white h-full items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
        <Text className="paragraph-regular text-gray-400 mt-4">
          Loading product...
        </Text>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="bg-white h-full items-center justify-center px-8">
        <Text className="h2-bold text-dark-100 mb-4">Product Not Found</Text>
        <TouchableOpacity
          className="bg-primary px-8 py-4 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="paragraph-bold text-white">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const imageUrl = product.image 
    ? `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.bucketId}/files/${product.image}/view?project=${appwriteConfig.projectId}`
    : 'https://via.placeholder.com/400';

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View className="h-96 bg-gray-50 items-center justify-center">
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-full"
            resizeMode="contain"
          />
          
          {/* Back Button */}
          <TouchableOpacity
            className="absolute top-4 left-4 bg-white p-3 rounded-full"
            onPress={() => router.back()}
          >
            <Text className="text-xl">←</Text>
          </TouchableOpacity>
        </View>

        {/* Product Info */}
        <View className="px-5 pt-6">
          {/* Category */}
          {product.category && (
            <Text className="small-bold text-gray-400 uppercase mb-2">
              {product.category}
            </Text>
          )}

          {/* Product Name */}
          <Text className="h2-bold text-dark-100 mb-3">
            {product.name}
          </Text>

          {/* Price */}
          <Text className="h1-bold text-primary mb-6">
            R{product.price.toFixed(2)}
          </Text>

          {/* Description */}
          {product.description && (
            <View className="mb-6">
              <Text className="h3-bold text-dark-100 mb-2">Description</Text>
              <Text className="paragraph-regular text-gray-400 leading-6">
                {product.description}
              </Text>
            </View>
          )}

          {/* Quantity Selector */}
          <View className="mb-6">
            <Text className="h3-bold text-dark-100 mb-3">Quantity</Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                className="bg-gray-100 p-4 rounded-xl"
                onPress={decrementQuantity}
              >
                <Text className="h3-bold text-dark-100">−</Text>
              </TouchableOpacity>
              
              <Text className="h2-bold text-dark-100 mx-8 min-w-[40px] text-center">
                {quantity}
              </Text>
              
              <TouchableOpacity
                className="bg-gray-100 p-4 rounded-xl"
                onPress={incrementQuantity}
              >
                <Text className="h3-bold text-dark-100">+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="px-5 py-4 border-t border-gray-200 gap-3">
        <TouchableOpacity
          className="bg-gray-100 py-4 rounded-xl items-center"
          onPress={handleAddToCart}
        >
          <Text className="paragraph-bold text-dark-100">Add to Cart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="bg-primary py-4 rounded-xl items-center"
          onPress={handleBuyNow}
        >
          <Text className="paragraph-bold text-white">Buy Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
