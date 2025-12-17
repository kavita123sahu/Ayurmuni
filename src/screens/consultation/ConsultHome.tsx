import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { NavigationProp, useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import SearchBar from '../../component/SearchBar';
import { Images } from '../../common/Images';
import { doctorData } from '../../common/datafile';
import { Colors } from '../../common/Colors';
import { Fonts } from '../../common/Fonts';
import ConsultCard from '../../component/ConsultCard';
import CategoryPage from '../home/CategoryPage';
import ConsultCard1 from '../../component/ConsultCard1';
import GradientButton from '../../component/GradientButton';
import ProductCard from '../../component/ProductCard';
import FAQComponent from '../../component/FAQComponent';
import ConsultDoctor from '../../component/ConsultDoctor';
import * as _CONSULT_SERVICE from '../../services/ConsultServce';
import * as _HOME_SERVICE from '../../services/HomeServices';
import { CategorySkeleton, DoctorCardSkeleton, ProductSkeleton } from '../../Skeleton/CardSkeleton';

const ConsultImage = require('../../assets/images/consultant.png');


interface ConsultHomeProps {
  navigation: NavigationProp<any>;
}

const ConsultHome: React.FC<ConsultHomeProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [DoctorList, setDoctorList] = useState([])
  const [PrevPlaced, setPrevPlaced] = useState([])
  const [HealthConcern, setHealthConcern] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const isFocused = useIsFocused();
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingBest, setLoadingBest] = useState(true);
  const [loadingHealth, setLoadingHealth] = useState(true);


  //   useEffect(() => {
  //   getDoctorAPI();
  //   getConsultApi();
  //   getHealthCategory();
  // }, [isFocused]);


  const fetchAllData = useCallback(async () => {

    _CONSULT_SERVICE.getDoctor()
      .then((res: any) => res.json())
      .then(json => {
        const filteredData = json?.data?.filter((item: any) => item.assured_muni === true);
        setDoctorList(filteredData);
      })
      .catch(err => console.log("doctor Error", err))
      .finally(() => setLoadingDoctors(false));

    _HOME_SERVICE.get_health_category()
      .then((res: any) => res.json())
      .then(json => setHealthConcern(json))
      .catch(err => console.log("Health Error", err))
      .finally(() => setLoadingHealth(false));

    // _HOME_SERVICE.getBestSellerProduct()
    //   .then((res: any) => res?.json())
    //   .then(json => setPrevPlaced(json))
    //   .catch(err => console.log("Best Selling Error", err))
    //   .finally(() => setLoadingBest(false));

  }, []);



  useEffect(() => {
    if (isFocused) {
      fetchAllData();
    }
  }, [isFocused, fetchAllData]);

  const getDoctorAPI = async () => {
    setIsLoading(true);
    try {
      let response: any = await _CONSULT_SERVICE.getDoctor();

      const DataJSON = await response.json();
      console.log("doctorlist-->", DataJSON);
      const filteredData = DataJSON?.data?.filter((item: any) => item.assured_muni === true);
      console.log("filteredData-->", filteredData);
      setIsLoading(false);
      setDoctorList(filteredData);
    } catch (error) {
      setIsLoading(false);
      console.log("CATEGORY DATA ERROR:", error);
    }
  }



  const getConsultApi = async () => {
    setIsLoading(true);
    try {
      let response: any = await _CONSULT_SERVICE.getHomePage();
      const responseData = await response.json();
      if (responseData.status_code == 200) {
        // setHealthConcern(responseData.health_concerns)
        setPrevPlaced(responseData?.best_selling);
        setIsLoading(false);
      }

      else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log("CATEGORY DATA ERROR:", error);
    }
  }

  const getHealthCategory = async () => {
    setIsLoading(true);
    try {
      let response: any = await _HOME_SERVICE.get_health_category();

      const DataCategory = await response.json();
      console.log("healthhhh-->", DataCategory);
      if (response.status == 200) {
        setHealthConcern(DataCategory)
        setIsLoading(false);
      }

      else {
        setIsLoading(false);
      }

    } catch (error) {
      setIsLoading(false);
      console.log("CATEGORY DATA ERROR:", error);
    }
  }

  const handleSearch = (text: string) => {
    console.log('Searching for:', text);
  };



  const handleVoicePress = () => {
    console.log('Voice search pressed');
  };

  const ConsultNow = () => {
    return (
      <View style={styles.onlineBanner}>
        <View style={styles.onlineBannerContent}>
          <Text style={styles.onlineBannerTitle}>Online Consultation with</Text>
          <Text style={styles.onlineBannerTitle}>Qualified Doctors</Text>

          <View style={styles.benefitsList}>
            <View style={styles.detailRow}>
              <View style={styles.dotIcon} />
              <Text style={styles.benefitItem}>Highly Qualified Doctors</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.dotIcon} />
              <Text style={styles.benefitItem}>Available 24*7</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.dotIcon} />
              <Text style={styles.benefitItem}>With all live available Specialists</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.dotIcon} />
              <Text style={styles.benefitItem}>100% Secure and private</Text>
            </View>
          </View>
        </View>
        <View style={styles.onlineBannerImage}>
          <Image
            source={require('../../assets/images/consultnow.png')}
            style={styles.doctorBannerImage}
          />
        </View>
      </View>
    )
  }


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#466425" barStyle="light-content" />

      <LinearGradient
        colors={['#466425', '#71A33F']}
        style={styles.header}>
        <SearchBar
          type='consult'
          showVoiceIcon={false}
          placeholder="Search for products"
          onSearch={handleSearch}
          onVoicePress={handleVoicePress}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </LinearGradient>


      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.bannerContainer}>
          <View style={styles.bannerRow}>
            <ConsultDoctor title="Don't have Prescription?" subTitle="Consult with our doctors." buttonText="Consult With Doctor" navigation={navigation} image={ConsultImage} />
            <TouchableOpacity style={styles.assistButton} onPress={() => navigation.navigate('HealthAssistant')}>
              <Text style={styles.assistButtonText}>Health Assistant</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Upcoming Consultation</Text>

          {loadingDoctors ?
            <DoctorCardSkeleton /> :
            <ConsultCard
              doctorData={doctorData}
              // showActive='up'
              onJoinPress={() => navigation.navigate('FriendCall')}
              onThumbPress={() => console.log('Recommendation pressed')}
              onRatingPress={() => console.log('Rating pressed')}
            />

          }
        </View>

        <View style={styles.sectionContainer}>
          {loadingHealth ?
            <CategorySkeleton /> :
            <CategoryPage title='Consult by health concern:' categories={HealthConcern} navigation={navigation} />
          }
        </View>

        <View style={[styles.sectionContainer]}>

          {loadingDoctors ?
            <DoctorCardSkeleton /> :

            <ConsultCard1
              title='Consult with top doctors:'
              doctorData={DoctorList}
              showActive='top'
              onJoinPress={() => console.log('Join button pressed')}
              onThumbPress={() => console.log('Recommendation pressed')}
              onRatingPress={() => console.log('Rating pressed')}
            />
          }

        </View>

        <View style={styles.sectionContainer}>
          <ConsultNow />
        </View>

        <TouchableOpacity style={styles.sectionContainer} >
          <GradientButton text='Consult Now' onPress={() => navigation.navigate('PatientSelect')}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.sectionContainer} onPress={() => navigation.navigate('PatientSelect')}>
          <LinearGradient style={styles.prescriptionButton} colors={["#71A33F26", '#fff', "#71A33F26",]}>
            <Image source={Images.prescription} style={{ width: 17, height: 22, }} />
            <Text style={styles.prescriptionText}>Order with Prescription</Text>
          </LinearGradient>
        </TouchableOpacity>


        <View style={styles.sectionContainer}>

          {/* {loadingDoctors ?
            <ProductSkeleton /> :
            <ProductCard title='Your previous placed orders:' navigation={navigation} PropsData={PrevPlaced} />
          } */}

        </View>



        <FAQComponent />
      </ScrollView>
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomColor: '#F0F0F0',
  },
  bannerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  bannerRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'stretch',
  },
  assistButton: {
    backgroundColor: '#FFC18D',
    width: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  assistButtonText: {
    fontSize: 12,
    fontFamily: Fonts.PoppinsMedium,
    color: Colors.textColor,
    textAlign: 'center',
    transform: [{ rotate: '270deg' }],
    width: 100,
  },
  sectionContainer: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  prescriptionButton: {
    backgroundColor: '#71A33F1A',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  prescriptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 15,
    paddingHorizontal: 10
  },
  onlineBanner: {
    backgroundColor: '#B8D0FF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineBannerContent: {
    flex: 1,
  },
  onlineBannerTitle: {
    fontSize: 16,
    fontFamily: Fonts.PoppinsSemiBold,
    color: Colors.textColor,
    marginBottom: 2,
  },
  benefitsList: {
    marginVertical: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotIcon: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6B7280',
    marginBottom: 4,
    marginRight: 12,
  },
  benefitItem: {
    fontSize: 12,
    color: '#1E1E1EA6',
    marginBottom: 4,
    fontFamily: Fonts.PoppinsMedium
  },
  onlineBannerImage: {
    marginLeft: 15,
  },
  doctorBannerImage: {
    width: 100,
    height: 150,
  },
});

export default ConsultHome;