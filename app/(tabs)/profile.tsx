import { View, Text, Image, TouchableOpacity, Alert, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAuthStore from '@/store/auth.store'
import { Functions } from 'react-native-appwrite';
import { client } from '@/lib/appwrite';

interface MenuItem {
    id: string;
    title: string;
    icon: string;
    onPress: () => void;
}

export default function Profile() {
    const { user, signOutUser, isLoading } = useAuthStore();


    const testHelloWorld = async ()=>{
      try{
        console.log('testing hello-world function');

        const functions = new Functions(client)

        const response = await functions.createExecution(
          '695a57b800041d4f2a66',
          JSON.stringify({name:user?.name||"Guest"})
        );

        console.log('Raw response:', response);

        const result = JSON.parse(response.responseBody);
        console.log('Parsed result',result);

        Alert.alert('Success',result.message);
      }
      catch(error)
      {
        console.error('❌ Function error:', error);
            Alert.alert('Error', error.message || 'Function call failed');
      }
    }
    
    const handleSignOut = async () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        console.log('🚪 Signing out...');
                        await signOutUser();
                    }
                }
            ]
        );
    };
    
    // Menu items for the list
    const menuItems: MenuItem[] = [
        {
            id: '1',
            title: 'Edit Profile',
            icon: '✏️',
            onPress: () => console.log('Edit Profile')
        },
        {
            id: '2',
            title: 'Order History',
            icon: '📦',
            onPress: () => console.log('Order History')
        },
        {
            id: '3',
            title: 'Payment Methods',
            icon: '💳',
            onPress: () => console.log('Payment Methods')
        },
        {
            id: '4',
            title: 'Settings',
            icon: '⚙️',
            onPress: () => console.log('Settings')
        },
    ];
    
    if (!user) {
        return (
            <SafeAreaView className="bg-white h-full items-center justify-center">
                <Text>Loading profile...</Text>
            </SafeAreaView>
        );
    }
    
    return (
        <SafeAreaView className="bg-white h-full">
            <FlatList
                data={menuItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        className="bg-gray-50 p-4 rounded-xl flex-row items-center justify-between mb-3"
                        onPress={item.onPress}
                    >
                        <View className="flex-row items-center">
                            <Text className="text-2xl mr-3">{item.icon}</Text>
                            <Text className="paragraph-semibold text-dark-100">
                                {item.title}
                            </Text>
                        </View>
                        <Text className="text-gray-400 text-xl">›</Text>
                    </TouchableOpacity>
                )}
                contentContainerClassName="px-5 pb-32"
                ListHeaderComponent={() => (
                    <View>
                        {/* Page Title */}
                        <Text className="h2-bold text-dark-100 mb-8 mt-10">My Profile</Text>
                        
                        {/* User Info Card */}
                        <View className="bg-gray-50 rounded-2xl p-6 mb-6">
                            {/* Avatar */}
                            <View className="items-center mb-6">
                                <Image 
                                    source={{ uri: user.avatar }}
                                    className="size-24 rounded-full bg-primary"
                                    resizeMode="cover"
                                />
                            </View>
                            
                            {/* User Details */}
                            <View className="gap-4">
                                <View>
                                    <Text className="small-bold text-gray-400 mb-1">
                                        NAME
                                    </Text>
                                    <Text className="paragraph-semibold text-dark-100">
                                        {user.name}
                                    </Text>
                                </View>
                                
                                <View>
                                    <Text className="small-bold text-gray-400 mb-1">
                                        EMAIL
                                    </Text>
                                    <Text className="paragraph-semibold text-dark-100">
                                        {user.email}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        
                        {/* Menu Section Title */}
                        <Text className="paragraph-bold text-dark-100 mb-3">
                            Account Settings
                        </Text>

                        <TouchableOpacity
                        className='bg-blue-500 p-4 rounded-xl mb-4'
                        onPress={testHelloWorld}
                        >
                          <Text
                          className='text-white text-center font-bold'
                          >
                            Test Hello WOrld funtion 
                          </Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListFooterComponent={() => (
                    <TouchableOpacity 
                        className="bg-red-50 p-4 rounded-xl items-center border border-red-200 mt-3"
                        onPress={handleSignOut}
                        disabled={isLoading}
                    >
                        <Text className="paragraph-bold text-red-600">
                            {isLoading ? 'Signing Out...' : 'Sign Out'}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    )
}