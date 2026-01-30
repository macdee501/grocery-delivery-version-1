import { View, Text, Image, TouchableOpacity, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuthStore from '@/store/auth.store';
import { router } from 'expo-router';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
}

export default function Profile() {
  const { user, signOutUser, isLoading } = useAuthStore();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => await signOutUser()
        }
      ]
    );
  };

  const menuItems: MenuItem[] = [
    { id: '1', title: 'Edit Profile', icon: '✏️', onPress: () => console.log('Edit Profile') },
    { id: '2', title: 'Order History', icon: '📦', onPress: () => router.push('/(protected)/order-history') },
    { id: '3', title: 'Payment Methods', icon: '💳', onPress: () => console.log('Payment Methods') },
    { id: '4', title: 'Settings', icon: '⚙️', onPress: () => router.push('/settings') },
  ];

  if (!user) {
    return (
      <SafeAreaView className="bg-white flex-1 items-center justify-center">
        <Text className="text-gray-500">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white flex-1">
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-5 pb-32"
        ListHeaderComponent={() => (
          <View>
            <Text className="text-2xl font-bold text-gray-900 mb-8 mt-10">My Profile</Text>

            {/* User Info Card */}
            <View className="bg-gray-50 rounded-2xl p-6 mb-6">
              <View className="items-center mb-6">
                <Image 
                  source={{ uri: user.avatar }}
                  className="w-24 h-24 rounded-full bg-lime-500"
                  resizeMode="cover"
                />
              </View>

              <View className="gap-4">
                <View>
                  <Text className="text-xs font-bold text-gray-400 mb-1">NAME</Text>
                  <Text className="text-sm font-semibold text-gray-900">{user.name}</Text>
                </View>

                <View>
                  <Text className="text-xs font-bold text-gray-400 mb-1">EMAIL</Text>
                  <Text className="text-sm font-semibold text-gray-900">{user.email}</Text>
                </View>
              </View>
            </View>

            <Text className="text-base font-bold text-gray-900 mb-3">Account Settings</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity 
            className="bg-gray-50 p-4 rounded-xl flex-row items-center justify-between mb-3"
            onPress={item.onPress}
          >
            <View className="flex-row items-center">
              <Text className="text-2xl mr-3">{item.icon}</Text>
              <Text className="text-sm font-semibold text-gray-900">{item.title}</Text>
            </View>
            <Text className="text-xl text-gray-400">›</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={() => (
          <TouchableOpacity 
            className="bg-red-50 p-4 rounded-xl items-center border border-red-200 mt-3"
            onPress={handleSignOut}
            disabled={isLoading}
          >
            <Text className="text-red-600 text-sm font-bold">{isLoading ? 'Signing Out...' : 'Sign Out'}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
