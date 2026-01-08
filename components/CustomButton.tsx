import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { CustomButtonProps } from '@/type'
import cn from 'clsx'

export default function CustomButton( {onPress,
    title="Click Me",
    style,
    textStyle,
    leftIcon,
    isLoading = false}: CustomButtonProps) {

  return (
    <TouchableOpacity className={cn("custom-btn",style)}
    onPress={onPress}
    >
        <View className='flex-center flex-row'>
            {isLoading ?(
                <ActivityIndicator size='small' color='white'/>
            ):(
                <Text className={cn('text-white-100 paragraph-semibold',textStyle)}>
                    {title}
                </Text>
            )}
        </View>
    </TouchableOpacity>
  )
}

