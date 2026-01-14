import { Functions } from 'react-native-appwrite';
import { client } from './appwrite';
import { FUNCTION_IDS } from '@/constants/functions';

const functions = new Functions(client);

export const processPayment = async (amount: number, description: string) => {
  try {
    console.log('💳 Processing payment...', amount);
    
    const response = await functions.createExecution(
      FUNCTION_IDS.STRIPE_PAYMENT,
      JSON.stringify({ 
        amount, 
        currency: 'zar',
        description 
      })
    );
    
    const result = JSON.parse(response.responseBody);
    console.log('✅ Payment result:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Payment error:', error);
    throw error;
  }
};

export const createOrder = async (
  paymentId: string,
  items: any[],
  userId: string,
  totalAmount: number,
  deliveryFee: number,
  discount: number
) => {
  try {
    console.log('📦 Creating order...', paymentId);
    
    const response = await functions.createExecution(
      FUNCTION_IDS.CREATE_ORDER,
      JSON.stringify({
        paymentId,
        items,
        userId,
        totalAmount,
        deliveryFee,
        discount
      })
    );
    
    const result = JSON.parse(response.responseBody);
    console.log('✅ Order created:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Order creation error:', error);
    throw error;
  }
};