import { TextInput, Text, View } from 'react-native';
import React, { useState } from 'react';
import { CustomInputProps } from '@/type';
import cn from 'clsx';

export default function CustomInputField({
  placeholder = 'Enter text',
  value,
  onChangeText,
  label,
  secureTextEntry = false,
  keyboardType = "default",
}: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="w-full mb-4">
      {label && <Text className="text-gray-700 font-semibold mb-1">{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder={placeholder}
        placeholderTextColor="#888"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "bg-white rounded-xl px-4 py-3 border",
          isFocused ? "border-lime-400 shadow-md" : "border-gray-300"
        )}
      />
    </View>
  );
}
