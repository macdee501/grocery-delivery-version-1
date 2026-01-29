import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { CustomButtonProps } from '@/type';
import cn from 'clsx';

export default function CustomButton({
  onPress,
  title = "Click Me",
  style,
  textStyle,
  leftIcon,
  isLoading = false,
}: CustomButtonProps) {

  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn(
        "bg-lime-400 hover:bg-lime-500 rounded-full py-3 px-5 w-full flex flex-row justify-center items-center shadow-md",
        style
      )}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <View className="flex flex-row items-center justify-center gap-2">
          {leftIcon && <View>{leftIcon}</View>}
          <Text className={cn("text-gray-900 font-bold text-lg", textStyle)}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
