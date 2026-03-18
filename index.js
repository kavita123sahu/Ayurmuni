/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import PatientFAQ from './src/screens/assesment/PatientFAQ'
import Login  from'./src/screens/auth/Login'
import { name as appName } from './app.json';




AppRegistry.registerComponent(appName, () =>  PatientFAQ);

