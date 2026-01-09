// import { useCallback, useEffect, useState } from "react";
// import { Alert } from "react-native";

// interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
//     fn: (params: P) => Promise<T>;
//     params?: P;
//     skip?: boolean;
// }

// interface UseAppwriteReturn<T, P> {
//     data: T | null;
//     loading: boolean;
//     error: string | null;
//     refetch: (newParams?: P) => Promise<void>;
// }

// const useAppwrite = <T, P extends Record<string, string | number>>({
//     fn,
//     params = {} as P,
//     skip = false,
// }: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
//     console.log('🎣 useAppwrite INIT:', { params, skip });
    
//     const [data, setData] = useState<T | null>(null);
//     const [loading, setLoading] = useState(!skip);
//     const [error, setError] = useState<string | null>(null);

//     const fetchData = useCallback(
//         async (fetchParams: P) => {
//             console.log('📡 fetchData CALLED with params:', fetchParams);
//             setLoading(true);
//             setError(null);

//             try {
//                 console.log('⏳ Calling fn...');
//                 const result = await fn(fetchParams);
//                 console.log('✅ fn SUCCESS, result:', result);
//                 setData(result);
//             } catch (error: unknown) {
//                 const errorMessage = error instanceof Error 
//                     ? error.message 
//                     : 'An unknown error occurred';
//                 console.error('❌ fetchData ERROR:', errorMessage);
//                 setError(errorMessage);
//                 Alert.alert("Error", errorMessage);
//             } finally {
//                 console.log('🏁 fetchData COMPLETE');
//                 setLoading(false);
//             }
//         },
//         [fn]
//     );

//     useEffect(() => {
//         console.log('🔄 useEffect TRIGGERED:', { skip, params });
//         if (!skip) {
//             fetchData(params);
//         }
//     }, [skip, params, fetchData]);

//     const refetch = async (newParams?: P) => { 
//         console.log('🔃 refetch CALLED with:', newParams || params);
//         await fetchData(newParams || params);
//     };

//     console.log('🎣 useAppwrite RETURN:', { 
//         dataIsNull: data === null, 
//         loading, 
//         errorIsNull: error === null 
//     });

//     return { data, loading, error, refetch };
// };

// export default useAppwrite;