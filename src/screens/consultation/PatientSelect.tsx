import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  StyleSheet,
  StatusBar,
  ListRenderItem,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../common/Colors';
import Header from '../../component/Header';
import { Fonts } from '../../common/Fonts';
import { useIsFocused } from '@react-navigation/native';
import * as _CONSULT_SERVICE from '../../services/ConsultServce';
import { Utils } from '../../common/Utils';

interface Patient {
  id: number;
  name: string;
  customer: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  relation: string;
  description: string;
  user: string;
  doctor: string;
}

interface PatientCardProps {
  item: Patient;
  isSelected: boolean;
  onSelect: (patient: Patient) => void;
}

interface AddPatientCardProps {
  onPress?: () => void;
}

interface PatientSelectProps {
  navigation?: any;
  route?: any;
}

const PatientSelect: React.FC<PatientSelectProps> = ({
  navigation,
  route
}) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [PatientList, setPatientList] = useState([]);
  const isFocused = useIsFocused();
  const [customerID, setcustomerID] = useState<string>('');

  console.log("RouteParams:", route);

  useEffect(() => {
    getPatientAPI();
    getUser()
  }, [isFocused, customerID]);


  const getUser = async () => {
    const _USER_INFO = await Utils.getData('_USER_INFO');
    const CUSTOMER_ID = await Utils.getData('_CUSTOMER_ID');

    console.log('_USER_INFO:', _USER_INFO);
    console.log('CUSTOMER_ID:', CUSTOMER_ID);
    setcustomerID(_USER_INFO?.id || CUSTOMER_ID);
  };



  const getPatientAPI = async () => {
    console.log("Fetching patients for customer ID:", customerID);
    try {
      let response: any = await _CONSULT_SERVICE.getPatient();
      console.log("PATIENT LIST:", response);

      const filteredData = response?.filter(
        (patient: Patient) => patient?.customer === customerID
      );

      console.log("Filtered Patients:", filteredData);

      if (filteredData.length > 0) {
        setPatientList(filteredData);
      }

      else {
        console.log("No patient found for id:", route.params?.id);
      }

    } catch (error) {
      console.log("PATIENT DATA ERROR:", error);
    }
  };


  const filteredPatients: Patient[] = PatientList.filter((patient: Patient) =>
    patient.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handlePatientSelect = (patient: Patient): void => {
    setSelectedPatient(patient);
  };


  const handleProceed = (): void => {
    navigation.navigate('SelectSpecialty', {
      patient: selectedPatient,
    })
  };

  const handleAddPatient = (): void => {
    if (navigation) {
      navigation.navigate('AddNewPatient');
    }
  };

  const PatientCard: React.FC<PatientCardProps> = ({ item, isSelected, onSelect }) => {
    return (
      <TouchableOpacity
        style={[styles.patientCard, isSelected && styles.selectedCard]}
        onPress={() => onSelect(item)}
        activeOpacity={0.7}
        testID={`patient-card-${item.id}`}
      >
        <View style={styles.cardContent}>
          <LinearGradient
            colors={[Colors.secondaryColor, Colors.primaryColor]}
            style={styles.avatar}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Icon
              name="person-outline"
              size={28}
              color="white"
            />
          </LinearGradient>

          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{item.name}</Text>
            <View style={styles.detailsRow}>
              <Text style={styles.patientDetails}>Age: {item.age}</Text>
              <Text style={styles.patientDetails}>• {item.gender}</Text>
            </View>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>

          {isSelected && (
            <View style={styles.checkIcon}>
              <Icon name="checkmark-circle" size={24} color={Colors.secondaryColor} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const AddPatientCard: React.FC<AddPatientCardProps> = ({ onPress }) => (
    <TouchableOpacity
      style={styles.addPatientCard}
      activeOpacity={0.7}
      onPress={onPress || handleAddPatient}
      testID="add-patient-card"
    >
      <View style={styles.addIcon}>
        <Icon name="add-outline" size={32} color="black" />
      </View>
      <Text style={styles.addPatientText}>Add New Patient</Text>
    </TouchableOpacity>
  );

  const renderPatientItem: ListRenderItem<Patient> = ({ item }) => (
    <PatientCard
      item={item}
      isSelected={selectedPatient?.id === item.id}
      onSelect={handlePatientSelect}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryColor} />

      <Header title='Select Patient' navigation={navigation} Is_Tab={false} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Icon
              name="search-outline"
              size={20}
              color="#666"
              style={styles.searchIcon}
            />

            <TextInput
              style={styles.searchInput}
              placeholder="Search patients by name or condition..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={(text: string) => setSearchText(text)}
              testID="search-input"
            />
          </View>

        </View>

        <View style={styles.patientsContainer}>
          <FlatList
            data={filteredPatients}
            renderItem={renderPatientItem}
            keyExtractor={(item: Patient) => item.id.toString()}
            numColumns={1}
            scrollEnabled={false}
            ListFooterComponent={<AddPatientCard />}
            showsVerticalScrollIndicator={false}
            testID="patients-list"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.proceedButton,
            !selectedPatient && styles.proceedButtonDisabled
          ]}
          disabled={!selectedPatient}
          activeOpacity={0.8}
          onPress={handleProceed}
          testID="proceed-button"
        >
          <LinearGradient
            colors={selectedPatient ? [Colors.secondaryColor, Colors.primaryColor] : ['#ddd', '#ccc']}
            style={styles.proceedGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
            <Text style={[
              styles.proceedText,

              !selectedPatient && styles.proceedTextDisabled
            ]}>
              {selectedPatient ? `Proceed with ${selectedPatient.name}` : 'Select a Patient'}
            </Text>
            <Icon
              name="chevron-forward-outline"
              size={20}
              color={selectedPatient ? "white" : "#999"}
            />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  searchContainer: {
    marginBottom: 25,
    marginTop: 20
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    paddingHorizontal: 20,
    borderWidth: 0.1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  searchIcon: {
    marginRight: 15,
  },
  searchInput: {
    flex: 1,
    height: 55,
    fontSize: 14,
    fontFamily: Fonts.PoppinsRegular,
    color: '#333',
  },
  patientsContainer: {
    marginBottom: 20,
  },
  patientCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    marginBottom: 15,
    elevation: 1,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: Colors.secondaryColor,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    elevation: 1,
    shadowOpacity: 0.2,
  },
  cardContent: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontFamily: Fonts.PoppinsSemiBold,
    color: Colors.textColor,
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  patientDetails: {
    fontSize: 14,
    color: '#636e72',
  },
  descriptionText: {
    fontSize: 13,
    color: Colors.placeholderColor,
    fontFamily: Fonts.PoppinsMedium
  },
  checkIcon: {
    marginLeft: 10,
  },
  addPatientCard: {
    backgroundColor: 'rgba(46, 64, 25, 0.1)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(98, 67, 67, 0.4)',
    borderStyle: 'dashed',
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  addIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(55, 73, 17, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  addPatientText: {
    fontSize: 16,
    color: Colors.textColor,
    fontWeight: '500',
  },
  proceedButton: {
    marginBottom: 30,
    borderRadius: 15,
    elevation: 8,
    shadowColor: Colors.primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  proceedButtonDisabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  proceedGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 15,
  },
  proceedText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginRight: 10,
  },
  proceedTextDisabled: {
    color: '#999',
  },
});

export default PatientSelect;