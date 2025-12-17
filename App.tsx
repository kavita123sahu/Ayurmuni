import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import Navigator from './src/navigation/Navigator'
import Toast from 'react-native-toast-message';
import { AppState, Platform } from 'react-native';
import { store } from './src/reduxfile/Store';
import Login from './src/screens/auth/Login';


// const inAppUpdates = new SpInAppUpdates(
//   false
// );


const App = () => {

  //  const [appState, setAppState] = useState(AppState.currentState);


  //   useEffect(() => {
  //     const _handleAppStateChange = (nextAppState: any) => {
  //       console.log("inside  function  ", appState.match(/inactive|background/), '....', appState, '  ... ', nextAppState);
  //       if (!appState.match(/inactive|background/) && nextAppState === 'active') {
  //         if (Platform.OS === 'android') {
  //           checkUpdates();
  //         }
  //       }
  //       setAppState(nextAppState);
  //       return true;
  //     }

  //     const AppStateChangeHandler = AppState.addEventListener(
  //       "change",
  //       _handleAppStateChange
  //     );

  //     return () => AppStateChangeHandler.remove();

  //   }, [])


  useEffect(() => {
    console.log("Hello Debugger");
  }, []);

  //   const checkUpdates = () => {
  //     try {
  //       inAppUpdates.checkNeedsUpdate().then((result: any) => {
  //         if (result.shouldUpdate) {
  //           let updateOptions = {};
  //           if (Platform.OS === 'android') {
  //             updateOptions = {
  //               updateType: IAUUpdateKind.IMMEDIATE,
  //             };
  //           }
  //           inAppUpdates.startUpdate(updateOptions);
  //         }
  //       });

  //     } catch (e) {
  //       console.log(e);
  //     }

  //   }


  return (
    <Provider store={store}>
      <Navigator />
      <Toast />
    </Provider>

  )
}

export default App