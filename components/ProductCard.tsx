import { Text, TouchableOpacity, Image, Platform } from 'react-native';
import { Product } from "@/type";
import { appwriteConfig } from "@/lib/appwrite";
import { useCartStore } from "@/store/cart.store";
import { router } from 'expo-router';

interface ProductCardProps {
    item: Product;
}

const ProductCard = ({ item }: ProductCardProps) => {
    const { $id, image, name, price, category } = item;
    
    const imageUrl = image 
        ? `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.bucketId}/files/${image}/view?project=${appwriteConfig.projectId}`
        : 'https://via.placeholder.com/150';
    
    const { addItem } = useCartStore();
    
    const handleCardPress = () => {
        router.push({
            pathname: '/product-details/[id]',
            params: { id: $id }
        });
    };
    
    const handleAddToCart = (e: any) => {
        e?.stopPropagation?.();
        addItem({
            id: $id, 
            name, 
            price, 
            image_url: imageUrl,
        });
        console.log('✅ Added to cart:', name);
    };
    
    return (
        <TouchableOpacity 
            className="menu-card"
            style={Platform.OS === 'android' ? { elevation: 10, shadowColor: '#878787' } : {}}
            onPress={handleCardPress} 
            activeOpacity={0.7}
        >
            {/* Product Image */}
            <Image 
                source={{ uri: imageUrl }} 
                className="size-32 absolute -top-10" 
                resizeMode="contain" 
            />
            
            {/* Category */}
            {category && (
                <Text className="small-bold text-gray-100 uppercase mb-1">
                    {category}
                </Text>
            )}
            
            {/* Product Name */}
            <Text 
                className="base-bold text-dark-100 text-center mb-2" 
                numberOfLines={1}
            >
                {name}
            </Text>
            
            {/* Price */}
            <Text className="body-regular text-gray-100 mb-4">
                R{price.toFixed(2)}
            </Text>
            
            {/* Add to Cart */}
            <TouchableOpacity onPress={handleAddToCart}>
                <Text className="text-primary font-quicksand-bold text-base">
                    Add to Cart +
                </Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

export default ProductCard;
