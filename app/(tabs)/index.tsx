import CartButton from "@/components/CartButton";
import { images } from "@/constants";
import { Fragment, useEffect, useState } from "react";
import { FlatList, Image, Pressable, Text, TouchableOpacity, View, ActivityIndicator, Modal, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import cn from 'clsx';
import { getHomeOffers, getFileView } from "@/lib/appwrite";

type Offer = {
  $id: string;
  title: string;
  image: string;
  description?: string;
};

export default function Index() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await getHomeOffers();
        setOffers(data);
      } catch (error) {
        console.error("❌ Failed to fetch offers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#84CC16" />
        <Text className="mt-4 text-gray-600">Loading offers...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" pointerEvents="box-none">
      {/* Modal for offer details */}
      <Modal
        visible={!!selectedOffer}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedOffer(null)}
      >
        <View className="flex-1 justify-center items-center bg-black/30">
          <View className="bg-white rounded-3xl w-11/12 p-6 max-h-4/5 shadow-lg">
            <ScrollView showsVerticalScrollIndicator={false}>
              <Image
                source={{ uri: selectedOffer ? getFileView(selectedOffer.image) : "" }}
                className="h-64 w-full mb-4 rounded-2xl"
                resizeMode="cover"
              />
              <Text className="h1-bold text-gray-900 mb-2">{selectedOffer?.title}</Text>
              <Text className="paragraph-regular text-gray-600">
                {selectedOffer?.description || "No additional details."}
              </Text>
              <Pressable
                className="mt-4 bg-lime-400 py-3 rounded-2xl"
                onPress={() => setSelectedOffer(null)}
              >
                <Text className="text-white text-center font-bold">Close</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <FlatList
        data={offers}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={{ paddingBottom: 28, paddingHorizontal: 20 }}
        ListHeaderComponent={() => (
          <View className="flex-between flex-row w-full my-5">
            <View className="flex-start">
              <Text className="small-bold text-lime-500">DELIVER TO</Text>
              <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
                <Text className="paragraph-bold text-gray-900">This Address?</Text>
                <Image source={images.arrowDown} resizeMode="contain" className="size-3" />
              </TouchableOpacity>
            </View>
            <CartButton />
          </View>
        )}
        renderItem={({ item }) => (
          <Pressable
            className="w-full h-48 my-3 rounded-2xl overflow-hidden shadow-md flex-row items-center gap-4 bg-white"
            onPress={() => setSelectedOffer(item)}
          >
            <View className="h-full w-1/2 rounded-l-2xl overflow-hidden">
              <Image
                source={{ uri: getFileView(item.image) }}
                className="h-full w-full"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1 h-full flex flex-col justify-center px-4 gap-2">
              <Text className="h1-bold text-gray-900">{item.title}</Text>
              {item.description && (
                <Text className="paragraph-regular text-gray-600 line-clamp-2">
                  {item.description}
                </Text>
              )}
              <Image
                source={images.arrowRight}
                className="w-6 h-6 mt-2"
                resizeMode="contain"
              />
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}
