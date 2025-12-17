import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Fonts } from '../../common/Fonts';
import { Colors } from '../../common/Colors';
import Header from '../../component/Header';
import { useIsFocused, useRoute } from '@react-navigation/native';
import *as _CONSULT_SERVICE from '../../services/ConsultServce';
import { showSuccessToast } from '../../config/Key';
import { DoctorCardSkeleton } from '../../Skeleton/CardSkeleton';


interface DoctorData {
  id: string;
  name: string;
  specialization: string;
  special_interest: string;
  assured_muni: boolean;
  Patient_recommendation: number;
  rating: string;
  experience_years: number;
  profile_image: string | null;
  consultation_fee: string;
  available_from: string;
  available_to: string;
  is_active: boolean;
}


interface NavigationProp {
  navigate: (screen: string, params?: any) => void;
}

interface ConsultCardProps {
  onJoinPress?: () => void;
  onThumbPress?: () => void;
  onRatingPress?: () => void;
  navigation: NavigationProp,
  selectedSpecialties: string[];
  All: Boolean,
  selectedTreatments: string[];
}


const DoctorSelect = (Props: any) => {

  const route = useRoute();
  const { selectedSpecialties, selectedTreatments, patientData, All } = route.params as {
    selectedSpecialties: string[];
    selectedTreatments: string[];
    patientData: any;
    All: Boolean
    //   navigation: NavigationProp;
    onJoinPress?: () => void;
    onThumbPress?: () => void;
    onRatingPress?: () => void;
  };

  const isFocused = useIsFocused();
  const [DoctorData, setDoctorData] = React.useState<any[]>([]);
  const [Isloading, setIsLoading] = React.useState(false);


  useEffect(() => {
    if (All) {
      getDoctor();
    }

    getDoctorBySpeciality();
  }, [isFocused]);


  const getDoctorBySpeciality = async () => {

    setIsLoading(true);
    //.join(",") 
    const send_data = {
      speciality_ids: selectedSpecialties,
      treatment_type_ids: selectedTreatments
    };

    try {
      const response: any = await _CONSULT_SERVICE.getDoctorBySpeciality(send_data);
      const responseData = await response.json();
      // Alert.alert(
      //   'Doctors Fetched',
      //   `Found ${responseData} doctors for the selected specialties and treatments.`
      // );
      console.log('Doctor By Speciality Response:', responseData);

      if (response.status === 200) {

        setDoctorData(responseData);
        setIsLoading(false);
      } else {
        // showSuccessToast('Please Select atleast one speciality', 'error');
      }

    } catch (error) {
      setIsLoading(false);
      console.log('API Error:', error);
      showSuccessToast('Something went wrong', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getDoctor = async () => {

    setIsLoading(true);
    //.join(",") 
    // const send_data = {
    //   speciality_ids: selectedSpecialties,
    //   treatment_type_ids: selectedTreatments
    // };

    try {
      const response: any = await _CONSULT_SERVICE.getDoctor();
      const responseData = await response.json();
      console.log('Doctor Response:', responseData);
      if (response.status === 200) {
        setDoctorData(responseData.data);
        setIsLoading(false);

      } else {
        // showSuccessToast('Please Select atleast one speciality', 'error');
      }

    } catch (error) {
      setIsLoading(false);
      console.log('API Error:', error);
      showSuccessToast('Something went wrong', 'error');
    } finally {
      setIsLoading(false);
    }
  };


  const handleJoinNow = (doctorData: DoctorData) => {

    Props.navigation.navigate('TimeSlotBooking', {
      doctorData: doctorData,
      patientData: patientData
    });

  };

  const renderConsultCard = ({ item }: { item: DoctorData }) => (
    <View style={{ marginBottom: 10, }}>
      <View style={styles.upcomingCard}>
        <View style={styles.doctorInfo}>
          <View style={{ paddingRight: 20, alignItems: 'center' }}>
            <Image
              source={item.profile_image || require('../../assets/images/user_profile.png')}
              style={styles.doctorAvatar}
            />
            {/* {item.assured_muni && (
              <Image
                source={item.profile_image || require('../../assets/images/user_profile.png')}
                style={{ height: 15, width: 100 }}
              />
            )} */}
          </View>

          <View style={styles.doctorDetails}>
            <Text style={styles.doctorName}>{item.name}</Text>
            <Text style={styles.doctorSpecialty}>{item.special_interest}</Text>
            <Text style={styles.doctorExperience}>{item.experience_years} years of experience</Text>
            <Text style={styles.doctorSpecialty}>{item.special_interest}</Text>
          </View>
        </View>

        <View style={{ marginBottom: 10 }}>
          <Image source={require('../../assets/images/Line.png')} style={{ width: '100%', tintColor: '#1E1E1ECC' }} />
        </View>


        <View style={{ flex: 1, justifyContent: 'center', paddingVertical: 10 }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingBottom: 10, justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={[styles.ratButton, { backgroundColor: '#FFC107' }]}
              onPress={() => ('')}
            >
              <Image source={require('../../assets/images/thumb.png')} style={{ height: 20, width: 20, margin: 3 }} />
              <Text style={styles.joinButtonText}>{item.Patient_recommendation || '0'}%</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.ratButton, { backgroundColor: '#71A33F', marginRight: 30 }]}
              onPress={() => ("")}
            >
              <Image source={require('../../assets/images/rating.png')} style={{ height: 20, width: 20, margin: 3 }} />
              <Text style={styles.joinButtonText}>{item.rating}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={styles.ratetext}>
              Patient {'\n'}Recommendation
            </Text>

            <Text style={styles.ratetext}>
              Consultancy {'\n'}Excellence Rating
            </Text>
          </View>
        </View>

        <View style={{ marginBottom: 10 }}>
          <Image source={require('../../assets/images/Line.png')} style={{ width: '100%', tintColor: '#1E1E1ECC' }} />
        </View>

        <View style={styles.consultationMeta}>
          <View style={styles.ratingContainer}>
            <Text style={styles.reviewCount}>Consultation fee</Text>
            <Text style={styles.price}>{item.consultation_fee}</Text>
          </View>

          <View style={{ flexDirection: 'row', width: '60%', paddingBottom: 15 }}>
            <View style={{ paddingRight: 10 }}>
              <Text style={{ color: 'black', fontFamily: Fonts.PoppinsSemiBold }}>Starting at </Text>
              <Text style={{ color: 'black', fontSize: 12 }}>{item.available_from}</Text>
            </View>

            <LinearGradient style={styles.joinButton} colors={[Colors.secondaryColor, Colors.primaryColor]}>
              <TouchableOpacity onPress={() => handleJoinNow(item)}>
                {/* <TouchableOpacity onPress={() => handleBookconsult()}> */}
                <Text style={styles.joinButtonText}>Book Now</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </View>
    </View>
  )

  const EmptyDoctorList = (onRetry: any) => {
    return (
      <View style={styles.emptyContainer}>
        <Image
          source={require('../../assets/images/consultnow.png')} // Add your empty state image
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <Text style={styles.emptyTitle}>No Doctors Available</Text>
        <Text style={styles.emptySubtitle}>
          We couldn't find any doctors at the moment. Please try again later.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={getDoctorBySpeciality}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyComponent = () => {
    return <EmptyDoctorList />;
  };
  return (

    <View style={styles.container}>
      <Header title='Select Doctors' navigation={Props.navigation} Is_Tab={false} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.section}>
          {
            Isloading ? (

              <DoctorCardSkeleton />

            ) : DoctorData?.length > 0 ? (
              <>
                <Text style={styles.sectionTitle}>Select the doctors to consult :</Text>

                <FlatList
                  data={DoctorData}
                  renderItem={renderConsultCard}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                  style={styles.categoriesList}
                />
              </>

            ) : (



              renderEmptyComponent()
            )
          }


        </View>
      </ScrollView>
    </View>

  );
};

const { height, width } = Dimensions.get('screen');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.PoppinsSemiBold,
    color: Colors.textColor,
    marginBottom: 15,
  },
  upcomingCard: {
    backgroundColor: '#E8EDE3',
    borderRadius: 12,
    padding: 15,
    width: width - 70 / 2,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  categoriesList: {

    // padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    // tintColor: '#E0E0E0',
  },
  emptyTitle: {
    fontSize: 20,
    color: Colors.textColor,
    fontFamily: Fonts.PoppinsSemiBold,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: Fonts.PoppinsRegular,
    color: Colors.textColor,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: Colors.secondaryColor,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.PoppinsMedium,
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  doctorInfo: {
    flexDirection: 'row',
    marginBottom: 12,

  },
  doctorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    marginBottom: 17,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: Colors.textColor,
    marginBottom: 2,
  },
  doctorExperience: {
    fontSize: 14,
    color: Colors.textColor,
    marginBottom: 2,
  },
  consultationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  ratingContainer: {
    flex: 1,
    width: '15%'
  },
  reviewCount: {
    fontSize: 12,
    color: '#666666',
  },
  ratetext: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'left'
  },
  price: {
    fontSize: 18,
    fontFamily: Fonts.PoppinsBold,
    color: '#4CAF50',
    marginBottom: 8,
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    width: 80
  },
  ratButton: {
    backgroundColor: '#4CAF50',
    padding: 5,
    width: 70,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    margin: 3,
    fontWeight: '600',
  },
});

export default DoctorSelect;