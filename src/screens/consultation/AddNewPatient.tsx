import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import CustomTextInput from '../../component/CustomeTextInput';
import DropdownTextInput from '../../component/DropdownTextInput';
import Header from '../../component/Header';
import { Colors } from '../../common/Colors';
import { Fonts } from '../../common/Fonts';
import * as _CONSULT_SERVICE from '../../services/ConsultServce';
import { showSuccessToast } from '../../config/Key';
import { Utils } from '../../common/Utils';

interface PatientData {
  name: string;
  age: string;
  gender: string;
  description: string;
}

interface FormErrors {
  name: boolean;
  age: boolean;
  gender: boolean;
  description: boolean;
}

interface AddNewPatientProps {
  navigation?: any;
}

const AddNewPatient: React.FC<AddNewPatientProps> = ({ navigation }) => {
  const [patientData, setPatientData] = useState<PatientData>({
    name: '',
    age: '',
    gender: '',
    description: '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: false,
    age: false,
    gender: false,
    description: false,
  });

  const [USER_ID, set_USER_ID] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const genderOptions: string[] = ['Male', 'Female', 'Other'];

  const handleInputChange = (field: keyof PatientData, value: string): void => {
    setPatientData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: false
      }));
    }
  };


  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {

      const _USER_INFO = await Utils.getData('_USER_INFO');
      const CUSTOMER_ID = await Utils.getData('_CUSTOMER_ID');

      console.log('_USER_INFO:', _USER_INFO);
      console.log('CUSTOMER_ID:', CUSTOMER_ID);
      set_USER_ID(_USER_INFO?.id || CUSTOMER_ID);

    } catch (error) {
      console.log('Error getting user ID:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: !patientData.name.trim(),
      age: !patientData.age.trim(),
      gender: !patientData.gender.trim(),
      description: false,
    };

    setErrors(newErrors);
    if (newErrors.name) {
      return false;
    }

    if (newErrors.age) {
      return false;
    }
    if (newErrors.gender) {
      return false;
    }

    return true;
  };

  const AddPatientAPI = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const send_data = {

      doctor: '',
      customer : USER_ID,
      name: patientData.name.trim(),
      age: patientData.age.trim(),
      gender: patientData.gender.toLocaleLowerCase().trim(),
      description: patientData.description.trim(),
    };

    
    console.log('Add Patient Data:', send_data);


    try {

      const response: any = await _CONSULT_SERVICE.addPatient(send_data);
      const responseData = await response.json();

      console.log('Add Patient Response:', responseData);

      if (response.status === 200) {
        showSuccessToast('Patient added successfully', 'success');
        navigation.goBack();
      } else {
        showSuccessToast('Please fill valid data', 'error');
      }
    } catch (error) {

      console.log('API Error:', error);
      showSuccessToast(`${error}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <Header title='Add New Patient' navigation={navigation} Is_Tab={false} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Enter the detail of patient according to the section below.
        </Text>

        <View style={styles.formContainer}>
          <CustomTextInput
            label="Patient Name *"
            placeholder="Enter the patient's name here"
            value={patientData.name}
            onChangeText={(value: string) => handleInputChange('name', value)}
            autoCapitalize="words"
            error={errors.name}
            errorMessage="Patient name is required"
          />

          <CustomTextInput
            label="Age *"
            placeholder="Enter the patient's age here"
            value={patientData.age}
            onChangeText={(value: string) => handleInputChange('age', value)}
            keyboardType="numeric"
            maxLength={3}
            error={errors.age}
            errorMessage="Patient age is required"
          />

          <DropdownTextInput
            label="Gender *"
            placeholder="Select the patient's gender"
            value={patientData.gender}
            onSelect={(value: string) => handleInputChange('gender', value)}
            options={genderOptions}
            error={errors.gender}
            errorMessage="Please select gender"
          />

          <CustomTextInput
            label="Description"
            placeholder="Tell us more about what kind of health issues do you have."
            value={patientData.description}
            onChangeText={(value: string) => handleInputChange('description', value)}
            multiline={true}
            numberOfLines={4}
            error={errors.description}
          />
        </View>

        <TouchableOpacity
          style={[styles.doneButton,]}
          onPress={AddPatientAPI}
          disabled={isLoading}
        >
          <Text style={styles.doneButtonText}>
            {isLoading ? 'Adding Patient...' : 'Done'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },

  content: {
    flex: 1,
    paddingHorizontal: 15,
  },

  description: {
    fontSize: 16,
    color: Colors.textColor,
    marginTop: 20,
    fontFamily: Fonts.PoppinsMedium,
    marginBottom: 30,
    lineHeight: 20,
  },

  formContainer: {
    marginBottom: 20,
  },

  doneButton: {
    backgroundColor: '#6B9B47',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },

  disabledButton: {
    backgroundColor: '#A0A0A0',
    elevation: 0,
  },

  doneButtonText: {
    fontSize: 16,
    fontFamily: Fonts.PoppinsMedium,
    color: '#FFFFFF',
  },
});

export default AddNewPatient;