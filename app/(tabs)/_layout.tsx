import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect, Tabs } from 'expo-router';
import useAuthStore from '@/store/auth.store';

export default function Tabslayout() {
  console.log('📑 TABS LAYOUT RENDER:', Math.random());

  const { isAuthenticated } = useAuthStore();
  console.log('🔐 isAuthenticated:', isAuthenticated);

  if(!isAuthenticated){
    console.log('🚫 Not authenticated, redirecting...');
    return <Redirect href="/sign-in" />
  }

  console.log('✅ Authenticated, showing tabs');
  return (
    <Tabs>
        <Tabs.Screen
        name='index'
        options={{
            title:"Home"
        }}
        />
        <Tabs.Screen
        name='search'
        options={{
            title:"Search"
        }}
        />
        <Tabs.Screen
        name='cart'
        options={{
            title:"Cart"
        }}
        />
        <Tabs.Screen
        name='profile'
        options={{
            title:"Profile"
        }}
        />
    </Tabs>
  )
}

