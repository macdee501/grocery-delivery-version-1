import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect, Tabs } from 'expo-router';

export default function _layout() {
    const isUserAuthenticated = true;

    if(!isUserAuthenticated) return <Redirect href='/sign-in' />
  return (
    <Tabs>
        <Tabs.Screen
        name='index'
        options={{
            title:"Home"
        }}
        />
    </Tabs>
  )
}

