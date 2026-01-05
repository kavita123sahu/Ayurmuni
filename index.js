/**
 * @format
 */

import 'react-native-url-polyfill/auto';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import Assesment from './src/screens/assesment/Assesment';


AppRegistry.registerComponent(appName, () =>
    Assesment);
