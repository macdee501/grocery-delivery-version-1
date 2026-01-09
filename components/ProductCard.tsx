import { Text, TouchableOpacity, Image, Platform } from 'react-native'
import { Product } from "@/type";
import { appwriteConfig } from "@/lib/appwrite";
// import { useCartStore } from "@/store/cart.store"; // Create this next

interface ProductCardProps {
    item: Product;
}

const ProductCard = ({ item }: ProductCardProps) => {
    const { $id, image, name, price } = item;
    
    // If using Appwrite storage
    const imageUrl = image 
        ? `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.bucketId}/files/${image}/view?project=${appwriteConfig.projectId}`
        : 'https://via.placeholder.com/150'; // Fallback image
    
    // Uncomment when you create cart store
    // const { addItem } = useCartStore();
    
    const handleAddToCart = () => {
        console.log('Add to cart:', name);
        // Uncomment when cart store is ready
        // addItem({ 
        //     id: $id, 
        //     name, 
        //     price, 
        //     image_url: imageUrl, 
        //     quantity: 1 
        // });
    };
    
    return (
        <TouchableOpacity 
            className="menu-card" // Reuse same class or rename to product-card
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