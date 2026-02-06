import { Text, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import { Product } from "@/type";
import { appwriteConfig } from "@/lib/appwrite";
import { useCartStore } from "@/store/cart.store";
import { router } from 'expo-router';

interface ProductCardProps {
  item: Product;
}

const ProductCard = ({ item }: ProductCardProps) => {
  if (!item || !item.$id) return null; // Safety check

  const { $id, image, name, price, category } = item;

  const imageUrl = image
    ? `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.bucketId}/files/${image}/view?project=${appwriteConfig.projectId}`
    : 'https://via.placeholder.com/150';

  const { addItem } = useCartStore();

  const handleCardPress = () => {
    try {
      router.push({
        pathname: '/product-details/[id]',
        params: { id: $id },
      });
    } catch {
      Alert.alert('Navigation error', 'Navigation is not available in this context.');
    }
  };

  const handleAddToCart = (e: any) => {
    e?.stopPropagation?.();
    addItem({ id: $id, name, price, image_url: imageUrl });
    Alert.alert('Added to cart', name);
  };

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      activeOpacity={0.7}
      style={[Platform.OS === 'android' ? { elevation: 6, shadowColor: '#000' } : {}]}
      className="bg-white rounded-3xl p-4 flex items-center justify-center mb-5"
    >
      <Image
        source={{ uri: imageUrl }}
        className="w-32 h-32 mb-2"
        resizeMode="contain"
      />

      {category && (
        <Text className="text-xs text-gray-400 uppercase mb-1">{category}</Text>
      )}

      <Text className="text-base font-bold text-dark-100 text-center mb-1" numberOfLines={1}>
        {name || 'Unnamed product'}
      </Text>

      <Text className="text-sm text-gray-500 mb-2">
        R{price != null ? price.toFixed(2) : '0.00'}
      </Text>

      <TouchableOpacity
        onPress={handleAddToCart}
        className="bg-lime-500 px-4 py-2 rounded-full"
      >
        <Text className="text-white font-bold text-sm text-center">Add to Cart +</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ProductCard;
