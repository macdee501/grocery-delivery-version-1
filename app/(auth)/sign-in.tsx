import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Link, router } from 'expo-router';
import CustomInputField from '@/components/CustomInputField';
import CustomButton from '@/components/CustomButton';
import { signIn } from '@/lib/appwrite';
import useAuthStore from '@/store/auth.store';

export default function SignInScreen() {

    const [isSubmitting,setIsSubmitting] = useState(false);
    const [form,setForm] = useState({email:"",password:""})
    const { fetchAuthenticatedUser } = useAuthStore(); 

    async function submitForm()
    {
        // Destructure the form to access its variables
        const{email,password}= form;
        
         if(!email || !password) return Alert.alert("Error","Please enter valid email address & password");

        setIsSubmitting(true)

        try{
            await signIn({email,password})
            await fetchAuthenticatedUser();
            router.replace('/(tabs)')
        }
        catch(error)
        {
            Alert.alert('Error',`Could not Sign In ${error}`)
        }
        finally{
            setIsSubmitting(false)
        }
    }

  return (
    <View className='gap-10 bg-white rounded-lg p-5 mt-5'>
        <CustomInputField
        placeholder='Enter Email'
        value={form.email}
        onChangeText={(text)=> setForm((prev)=> ({...prev,email:text}))}
        label='Email'
        keyboardType='email-address'
        />
        <CustomInputField
        placeholder='Enter Password'
        value={form.password}
        onChangeText={(text)=> setForm((prev)=> ({...prev,password:text}))}
        label='Password'
        secureTextEntry={true}
        />
         <CustomButton
                title="Sign In"
                isLoading={isSubmitting}
                onPress={submitForm}
            />
        <View
        className='flex justify-center mt-5 flex-row gap-2'
        >
        <Text className='base-regular text-gray-100'>Dont have an Account?</Text>
        <Link
        href='/sign-up'
        className='base-bold text-primary'
        >
        Sign Up
        </Link>    
        </View>      
    </View>
  )
}

