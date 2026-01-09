import { Text, TouchableOpacity, Image, Platform } from 'react-native'
import { Product } from "@/type";
import { appwriteConfig } from "@/lib/appwrite";
import { useCartStore } from "@/store/cart.store"; // ✅ Add this import

interface ProductCardProps {
    item: Product;
}

const ProductCard = ({ item }: ProductCardProps) => {
    const { $id, image, name, price } = item;
    
    const imageUrl = image 
        ? `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.bucketId}/files/${image}/view?project=${appwriteConfig.projectId}`
        : 'https://via.placeholder.com/150';
    
    const { addItem } = useCartStore(); // ✅ Add this
    
    const handleAddToCart = () => {
        addItem({ // ✅ Actually add to cart
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
        >
            <Image 
                source={{ uri: imageUrl }} 
                className="size-32 absolute -top-10" 
                resizeMode="contain" 
            />
            <Text 
                className="text-center base-bold text-dark-100 mb-2" 
                numberOfLines={1}
            >
                {name}
            </Text>
            <Text className="body-regular text-gray-200 mb-4">
                R{price.toFixed(2)}
            </Text>
            <TouchableOpacity onPress={handleAddToCart}>
                <Text className="paragraph-bold text-primary">Add to Cart +</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

export default ProductCard;