import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import Navigator from './src/navigation/Navigator'
import Toast from 'react-native-toast-message';
import { store } from './src/reduxfile/Store';




const App = () => {

  return (
    <Provider store={store}>
      <Navigator />
      <Toast />
    </Provider>

  )
}

export default App