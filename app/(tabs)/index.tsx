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
  color?: string;
  description?: string; // optional description
  colour?: string;
};

export default function Index() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await getHomeOffers();
        const normalized: Offer[] = data.map((o: any) => ({
          ...o,
          color: o.color || o.colour || "#000",
        }));
        setOffers(normalized);
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
        <ActivityIndicator size="large" color="#FF6B2C" />
        <Text className="mt-4 text-gray-600">Loading offers...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" pointerEvents="box-none">
      {/* Modal for offer details */}
      <Modal
        visible={!!selectedOffer}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedOffer(null)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl w-11/12 p-5 max-h-3/4">
            <ScrollView>
              <Image
                source={{ uri: selectedOffer ? getFileView(selectedOffer.image) : "" }}
                className="h-64 w-full mb-4 rounded-xl"
                resizeMode="cover"
              />
              <Text className="h1-bold text-dark-100 mb-2">{selectedOffer?.title}</Text>
              <Text className="paragraph-regular text-gray-600">{selectedOffer?.description || "No additional details."}</Text>
              <Pressable
                className="mt-4 bg-primary py-2 rounded-lg"
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
              <Text className="small-bold text-primary">DELIVER TO</Text>
              <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
                <Text className="paragraph-bold text-dark-100">This Address?</Text>
                <Image source={images.arrowDown} resizeMode="contain" className="size-3" />
              </TouchableOpacity>
            </View>
            <CartButton />
          </View>
        )}
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0;

          return (
            <Pressable
              className={cn("offer-card", isEven ? "flex-row-reverse" : "flex-row")}
              style={{ backgroundColor: item.color }}
              onPress={() => setSelectedOffer(item)}
            >
              <Fragment>
                <View className="h-full w-1/2">
                  <Image
                    source={{ uri: getFileView(item.image) }}
                    className="h-full w-full"
                    resizeMode="contain"
                  />
                </View>

                <View className={cn("offer-card__info", isEven ? "pl-10" : "pr-10")}>
                  <Text className="h1-bold text-white leading-tight">{item.title}</Text>
                  <Image
                    source={images.arrowRight}
                    className="size-10"
                    resizeMode="contain"
                    tintColor="#ffffff"
                  />
                </View>
              </Fragment>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}
