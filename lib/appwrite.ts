import { CreateUserParams, GetProductParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    platform: "com.pain.grocerydelivery",
    databaseId: '695a370a00012c4487d0',
    bucketId: '6979a56500356949b236',
    userWithMoreAttributesId: '695fcfbc00060332df29',
    categoriesTableId: '6960c007003e37257a63',
    shopProductsTableId: '6960c0f1002811bfd6ac',
    ordersTableId:"695bb514002d5aacad77",
    offersTableId:"697bc2a40004ff123ef7",
    
}

export const client = new Client();

client.setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId).setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

//function to create a user to appwrite
export const createUser = async ({ email, password, name }: CreateUserParams) => {
    try {

        const newAccount = 
        await account.create(ID.unique(), email, password, name)
        console.log('✅ Account created:', newAccount.$id);
        
        if(!newAccount) throw Error;

        // const session =await signIn({ email, password });
        // console.log('Session after signIn:', session);

        const avatarUrl = avatars.getInitialsURL(name);
        console.log('✅ Avatar URL:', avatarUrl);

       
        const userDoc = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userWithMoreAttributesId,
            ID.unique(),
            { email, name, accountId: newAccount.$id, avatar: avatarUrl }
        );
        
        console.log('✅ User document created:', userDoc.$id, 'for accountId:', newAccount.$id);
        return userDoc;
    } catch (e) {
        throw new Error(e as string);
    }
}

// function to sign in and create a session
export const signIn = async ({ email, password }: SignInParams) => {
    try {
        // Check if there's an existing session
        try {
            const existingSession = await account.get();
            if (existingSession) {
                console.log('⚠️ Existing session found, deleting...');
                await account.deleteSession('current');
            }
        } catch (error) {
            // No existing session, which is fine
            console.log('ℹ️ No existing session');
        }

        // Create new session
        const session = await account.createEmailPasswordSession(email, password);
        console.log('✅ Session created successfully:', session.$id);
        return session;
    } catch (e: any) {
        console.error('❌ Sign in error:', e);
        throw new Error(e.message || e);
    }
}

export const getCurrentUser = async () => {
    try {
      const accountData = await account.get();
  
      // User IS authenticated if this succeeds
      const userDoc = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userWithMoreAttributesId,
        [Query.equal("accountId", accountData.$id)]
      );
  
      // If no profile document exists — that's OK
      if (userDoc.documents.length === 0) {
        console.log("⚠️ No user profile document found — using account only");
  
        return {
          $id: accountData.$id,
          email: accountData.email,
          name: accountData.name,
          accountOnly: true,
        };
      }
  
      return userDoc.documents[0];
    } catch (error) {
      console.log("❌ getCurrentUser error:", error);
      return null;
    }
  };
  

// function to sign out user
export const signOut = async () => {
    try {
        await account.deleteSession('current');
        console.log(' User signed out successfully');
    } catch (e) {
        console.error(' Sign out error:', e);
        throw new Error(e as string);
    }
};


export const getProducts = async ({ category, query, limit }: GetProductParams) => {
    try {
      const queries: string[] = [];
  
      if (category) {
        queries.push(Query.equal("categories", category));
      }
  
      if (query) {
        queries.push(Query.search("name", query));
      }
  
      if (limit) {
        queries.push(Query.limit(limit));
      }
  
      const products = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.shopProductsTableId,
        queries
      );
  
      return products.documents;
    } catch (e) {
      console.error("getProducts error:", e);
      throw new Error(e as string);
    }
  };
  
export const getCategories = async () => {
    try {
        const categories = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesTableId,
        );
        
        return categories.documents;
    } catch (e) {
        console.error('getCategories error:', e);
        throw new Error(e as string);
    }
};

// Get user orders
export const getUserOrders = async (userId:string)=>{

try{

    console.log('🔍 Attempting to fetch orders for userId:', userId);
    console.log('📊 Database ID:', appwriteConfig.databaseId);
    console.log('📋 Collection ID:', appwriteConfig.ordersTableId);

    // try to get all order and store them
    const orders = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.ordersTableId,
        [
            Query.equal('userId',userId),
            Query.orderDesc('$createdAt'),
            Query.limit(15),
        ]
    );

    return orders.documents;
}
catch(error)
{
    console.error('getUserOrders error:', error);
    throw new Error(error as string);
}
}



// Get order detail
export const getOrderById=async(orderId:string)=>{
    try{
        const order= await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.ordersTableId,
            orderId
        );

        return order;
    }
    catch(error)
    {
        console.error('getOrderById error:', error);
        throw new Error(error as string);
    }
}

export const getHomeOffers = async () => {
    try {
      const res = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.offersTableId
      );
  
  
      return res.documents;
    } catch (error) {
      console.error("getHomeOffers error:", error);
      return [];
    }
  };
  

  export const getFileView = (fileId: string) => {
    return storage.getFileView(
      appwriteConfig.bucketId,
      fileId
    ).href;
  };
  
  
  
  

