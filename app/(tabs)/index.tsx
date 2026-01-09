import CartButton from "@/components/CartButton";
import { images, offers } from "@/constants";
import { Fragment } from "react";
import { FlatList, Image, Pressable, Text, Touchable, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import cn from 'clsx'

export default function Index() {
  console.log('🏠 HOME SCREEN RENDER:', Math.random());
  console.log('📦 Offers data:', offers?.length);
  return (

    // Safe area allows everything to be displayed correctly on the screen
    <SafeAreaView
    className="flex-1 bg-white"
    >
       {console.log('🏗️ Inside SafeAreaView')}
      <FlatList
      data={offers}
      renderItem={({item,index}) =>{
        
        console.log('🔲 Rendering offer item:', index);
        const iseEven = index % 2 === 0;

        return (
        <View>
          <Pressable
          className={cn("offer-card",iseEven?'flex-row-reverse':'flex-row')}
          style={{backgroundColor:item.color}}
          >
            {/* When the button is pressed, the background color will change to red */}
            {({pressed})=>(
              <Fragment>
                <View
                className="h-full w-1/2"
                >

                <Text>Place an image here?</Text>
                </View>

                <View
                className={cn("offer-card__info",iseEven ? "pl-10":"pr-10")}
                >
                  <Text
                  className="h1-bold text-white leading-tight"
                  >{item.title}</Text>
                  <Image
                  source={images.arrowRight}
                  className="size-10"
                  resizeMode="contain"
                  tintColor="#fffff"
                  />
                </View>
              </Fragment>
            )}
          </Pressable>
        </View>
        )
   
      
      }}

      contentContainerClassName="pb-28 px-5"
      ListHeaderComponent={()=>{
        console.log('📋 Rendering ListHeader');
        return (

        <View
        className="flex-between flex-row w-full my-5">
          <View className="flex-start">
            <Text className="small-bold text-primary">DELIVER TO</Text>
            <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
              <Text className="paragraph-bold text-dark-100">This Address?</Text>
              <Image
              source={images.arrowDown}
              resizeMode="contain"
              className="size-3"
              />
            </TouchableOpacity>
          </View>

          <CartButton/>
        </View>
      )
    
    }}
      />

    
    </SafeAreaView>
  );
}
