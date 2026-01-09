import { SplashScreen, Stack } from "expo-router";
import "./globals.css";
import{useFonts} from "expo-font";
import { useEffect } from "react";
import useAuthStore from "@/store/auth.store";


export default function RootLayout() {
  console.log('🌍 ROOT LAYOUT RENDER:', Math.random());
  
 
  const { isLoading, fetchAuthenticatedUser } = useAuthStore();
  console.log('📊 Auth state:', { isLoading });


  const [fontsLoaded, error] = useFonts({
    "QuickSand-Bold": require('../assets/fonts/Quicksand-Bold.ttf'),
    "QuickSand-Medium": require('../assets/fonts/Quicksand-Medium.ttf'),
    "QuickSand-Regular": require('../assets/fonts/Quicksand-Regular.ttf'),
    "QuickSand-SemiBold": require('../assets/fonts/Quicksand-SemiBold.ttf'),
    "QuickSand-Light": require('../assets/fonts/Quicksand-Light.ttf'),
  });
  console.log('🔤 Fonts loaded:', fontsLoaded);

  useEffect(() => {
    console.log('🎨 Font useEffect triggered');
    if(error) throw error;
    if(fontsLoaded) {
      console.log('✅ Hiding splash screen');
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  useEffect(() => {
    console.log('🔐 Fetching authenticated user...');
    fetchAuthenticatedUser()
  }, []);



  if(!fontsLoaded || isLoading){ 
    console.log('⏳ Waiting for fonts or auth...');
    return null;
  }

  console.log('🚀 Rendering Stack');
  return <Stack screenOptions={{headerShown: false}}/>;
}
