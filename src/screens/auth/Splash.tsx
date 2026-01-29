// import { View, Text, Image, StyleSheet, StatusBar } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import * as Animatable from 'react-native-animatable';
// import { Fonts } from '../../common/Fonts';
// import { useIsFocused } from '@react-navigation/native';
// import { Images } from '../../common/Images';
// import { Utils } from '../../common/Utils';
// import *as _PROFILE_SERVICES from '../../services/ProfileServices';
// import { showSuccessToast } from '../../config/Key';
// import { useDispatch } from 'react-redux';
// import { setUserInfo } from '../../reduxfile/action/UserInfoAction';



// const Splash = (props: any) => {
//     const isFocused = useIsFocused();
//     const dispatch = useDispatch();

//     useEffect(() => {

//         getUser();
//         // setTimeout(() => {
//         //     props.navigation.replace('HomeStack', { screeen: 'Home' })
//         // }, 2000);

//     }, [isFocused]);


//     const getUser = async () => {
//         try {
//             const token = await Utils.getData('_TOKEN');
//             console.log('tokenn', token);
//             if (token) {
//                 const result: any = await _PROFILE_SERVICES.user_profile();
//                 const JSONUser = await result.json();
//                 console.log("User Profile Data:", JSONUser);
//                 if (result.status === 200) {
//                     Utils.storeData('_USER_INFO', JSONUser);
//                     dispatch(setUserInfo(JSONUser));
//                     setTimeout(() => {
//                         props.navigation.replace('HomeStack', { screeen: 'Home' })
//                     }, 1000);
//                     // props.navigation.replace('HomeStack', { screeen: 'Home' })
//                 }

//                 else {
//                     showSuccessToast("Customer Not Found", 'error')
//                     props.navigation.replace('AuthStack', { screeen: 'Login' })
//                 }
//             }

//             else {

//                 setTimeout(() => {
//                     props.navigation.replace('AuthStack', { screeen: 'Login' })
//                 }, 2000);
//                 // props.navigation.replace('AuthStack', { screeen: 'Login' })

//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }




//     return (
//         <View style={styles.container} >

//             <StatusBar backgroundColor={'#466425'} barStyle={'light-content'} />

//             <Animatable.View
//                 animation={'slideInDown'}
//                 duration={2000}
//                 useNativeDriver={true}
//                 style={styles.logoContainer}
//             >
//                 <Image
//                     source={Images.splashlogo}
//                     style={styles.logo}
//                     resizeMode='center'
//                 />
//             </Animatable.View>

//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#fff',
//     },

//     logoContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: '100%',
//     },
//     logo: {
//         width: '70%',
//         height: '20%',
//     },
//     textContainer: {
//         position: 'absolute',
//         bottom: 60,
//     },
//     welcomeText: {
//         color: 'white',
//         fontSize: 24,
//     },
// });

// export default Splash;



import { View, Text, Image, StyleSheet, StatusBar } from 'react-native';
import React, { useEffect } from 'react';
import * as Animatable from 'react-native-animatable';
import { useIsFocused } from '@react-navigation/native';
import { Images } from '../../common/Images';
import { Utils } from '../../common/Utils';
import * as _PROFILE_SERVICES from '../../services/ProfileServices';
import { showSuccessToast } from '../../config/Key';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../reduxfile/action/UserInfoAction';

const API_TIMEOUT = 6000; // 🔥 6 seconds max wait

const Splash = (props: any) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isFocused) {
      getUser();
    }
  }, [isFocused]);

  // ⏱️ timeout wrapper
  const withTimeout = (promise: Promise<any>, timeout: number) => {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('API timeout')), timeout)
      ),
    ]);
  };

  const navigateToAuth = (delay = 1000) => {
    setTimeout(() => {
      props.navigation.replace('AuthStack', { screen: 'Login' });
    }, delay);
  };

//   const getUser = async () => {
//     try {
//       const token = await Utils.getData('_TOKEN');
//       console.log('TOKEN:', token);

//       // ❌ No token → direct login
//       if (!token) {
//         navigateToAuth(1500);
//         return;
//       }

//       // ✅ API call with timeout
//       const result: any = await withTimeout(
//         _PROFILE_SERVICES.user_profile(),
//         API_TIMEOUT
//       );

//       const JSONUser = await result.json();
//       console.log('User Profile:', JSONUser);

//       if (result.status === 200) {
//         await Utils.storeData('_USER_INFO', JSONUser);
//         dispatch(setUserInfo(JSONUser));

//         setTimeout(() => {
//           props.navigation.replace('HomeStack', { screen: 'Home' });
//         }, 1000);
//       } else {
//         showSuccessToast('Customer not found', 'error');
//         navigateToAuth();
//       }
//     } catch (error: any) {
//       console.log('SPLASH ERROR:', error);

//       showSuccessToast(
//         error.message === 'API timeout'
//           ? 'Server not responding'
//           : 'Network error, please login again',
//         'error'
//       );

//       navigateToAuth();
//     }
//   };

   const getUser = async () => {
        try {
            const token = await Utils.getData('_TOKEN');
            console.log('tokenn', token);
            if (token) {
                const result: any = await _PROFILE_SERVICES.user_profile();
                const JSONUser = await result.json();
                console.log("User Profile Data:", JSONUser);
                if (result.status === 200) {
                    Utils.storeData('_USER_INFO', JSONUser);
                    dispatch(setUserInfo(JSONUser));
                    setTimeout(() => {
                        props.navigation.replace('HomeStack', { screeen: 'Home' })
                    }, 1000);
                    // props.navigation.replace('HomeStack', { screeen: 'Home' })
                }

                else {
                    showSuccessToast("Customer Not Found", 'error')
                    props.navigation.replace('AuthStack', { screeen: 'Login' })
                }
            }

            else {

                setTimeout(() => {
                    props.navigation.replace('AuthStack', { screeen: 'Login' })
                }, 2000);
                // props.navigation.replace('AuthStack', { screeen: 'Login' })

            }
        } catch (error) {
            console.log(error);
        }
    }


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#466425'} barStyle={'light-content'} />

      <Animatable.View
        animation="slideInDown"
        duration={1500}
        useNativeDriver
        style={styles.logoContainer}
      >
        <Image
          source={Images.splashlogo}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animatable.View>
    </View>
  );
};

export default Splash;



 const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },

    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    logo: {
        width: '70%',
        height: '20%',
    },
    textContainer: {
        position: 'absolute',
        bottom: 60,
    },
    welcomeText: {
        color: 'white',
        fontSize: 24,
    },
});

