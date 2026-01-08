/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
// import HealthAssessment from './src/screens/assesment/HealthAssesment';
// import Wakeup from './src/screens/assesment/Wakeup';
// import ChiktisaDone from './src/screens/assesment/ChiktisaDone';
// import PatientPQ from './src/screens/patientQuesttions/PatientPQ';
import NewPatient from './src/screens/patientQuesttions/NewPatient';

AppRegistry.registerComponent(appName, () => NewPatient);
