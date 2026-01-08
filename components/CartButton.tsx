import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { images } from '@/constants'
import { router } from 'expo-router';

export default function CartButton() {


    const totalItemsInCart = 10;
  return (
    <TouchableOpacity
    className='cart-btn'
    onPress={()=> router.push('/cart')}
    >
        <Image
        source={images.bag} 
        className='size-5'
        resizeMode='contain'/>

        {totalItemsInCart > 0 &&(
            <View className='cart-badge'>
                <Text className='small-bold text-white'>{totalItemsInCart}</Text>
            </View>
        )}
    </TouchableOpacity>
  )
}

