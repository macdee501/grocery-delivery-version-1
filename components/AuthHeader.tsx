import React from "react";
import { View, Image, ImageBackground, Dimensions } from "react-native";
import { images } from "@/constants";

type AuthHeaderProps = {
  height?: number; // Optional custom height
};

export default function AuthHeader({ height }: AuthHeaderProps) {
  const HEADER_HEIGHT = height || Dimensions.get("window").height / 2.8;

  return (
    <View style={{ height: HEADER_HEIGHT }}>
      <ImageBackground
        source={images.siteHeader}
        style={{ flex: 1 }}
        resizeMode="cover"
      />
      <Image
        source={images.avocado}
        style={{
          width: 96,
          height: 96,
          position: "absolute",
          alignSelf: "center",
          bottom: -16,
        }}
      />
    </View>
  );
}
