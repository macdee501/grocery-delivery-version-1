import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect, Tabs } from 'expo-router';
import useAuthStore from '@/store/auth.store';

export default function _layout() {

  const { isAuthenticated } = useAuthStore();

  if(!isAuthenticated) return <Redirect href="/sign-in" />

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

