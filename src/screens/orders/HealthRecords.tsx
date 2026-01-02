import React, { useState, useEffect } from 'react';
import {View,Text,ScrollView,TouchableOpacity,Image,StyleSheet,Dimensions,SafeAreaView,StatusBar,} from 'react-native';
import Header from '../../component/Header';
import { Colors } from '../../common/Colors';
import { Fonts } from '../../common/Fonts';
import LinearGradient from 'react-native-linear-gradient';
import { Images } from '../../common/Images';
import * as _HOME_SERVICE from '../../services/HomeServices';
import ProductCard from '../../component/ProductCard';
import * as _CONSULT_SERVICE from '../../services/ConsultServce';
const { width, height } = Dimensions.get('window');


interface UserModule {
    id: string;
    name: string;
    checkIn: string;
    checkOut: string;
    dates: string;
    guests: number;
    program: string;
    features: string[];
    nights: string;
    totalAmount: string;
    status: 'active' | 'previous';
}
const HealthRecords = (props: any) => {
  const [selectedUser, setSelectedUser] = useState('Select Patient');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const [UsersList, setUsersList] =useState<UserModule[]>([]);
  const [SellingProduct, setSellingProduct] = useState([])


  useEffect(() => {
    getProducts()
    getPatientList()
  }, [])

  const getProducts = async () => {
    try {
      let response: any = await _HOME_SERVICE.getHomePage();
      if (response.status_code == 200) {
        setSellingProduct(response.best_selling);

      }

      else {
        console.log("Error fetching products:", response.message);
      }
    } catch (error) {
      console.log("CATEGORY DATA ERROR:", error);
    }
  }

  const getPatientList = async () => {
    try {
      let response: any = await _CONSULT_SERVICE.getPatient();
      console.log(response, 'responsepatient');
      setUsersList(response);

    } catch (error) {
      console.log("CATEGORY DATA ERROR:", error);
    }
  }



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryColor} />

      <Header title='Health Records' navigation={props.navigation} Is_Tab={false} />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patients</Text>

          <TouchableOpacity
            style={styles.userSelector}
            onPress={() => setShowUserDropdown(!showUserDropdown)}
          >
            <Text style={styles.userSelectorText}>{selectedUser}</Text>
            <Image
              source={require('../../assets/images/dropdown.png')}
              style={[styles.dropdownIcon, showUserDropdown && styles.dropdownIconRotated]}
            />
          </TouchableOpacity>

          {showUserDropdown && (
            <View style={styles.dropdownContainer}>
              <ScrollView
                style={styles.horizontalScroll}
                showsVerticalScrollIndicator={false} 
                nestedScrollEnabled={true} 
              >
                {UsersList.map((user) => (
                  <TouchableOpacity
                    key={user.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedUser(user?.name ?? '');
                      setShowUserDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{user?.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Records</Text>

          <View style={styles.recordsContainer}>
            <View style={styles.recordsGrid}>
              <TouchableOpacity style={styles.recordItem}>
                <View style={styles.recordIconContainer}>

                  <Image
                    source={require('../../assets/images/testrecord.png')}
                    style={styles.recordIcon}
                  />

                </View>
                <Text style={styles.recordLabel}>Test Reports</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.recordItem}>
                <View style={styles.recordIconContainer}>
                  <Image
                    source={require('../../assets/images/testprescription.png')}
                    style={styles.recordIcon}
                  />
                </View>
                <Text style={styles.recordLabel}>Prescriptions</Text>
              </TouchableOpacity>
            </View>

            <LinearGradient
              colors={[Colors.primaryColor, Colors.secondaryColor]}
              style={styles.addRecordsButton}
            >
              <TouchableOpacity onPress={() => console.log('Add Records')}>
                <Text style={styles.addRecordsButtonText}>Add Records</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>


        <View style={[styles.section, { marginBottom: 20 }]}>

          <ProductCard title='Best Selling Products:' navigation={props.navigation} PropsData={SellingProduct} />

        </View>


        <View style={styles.takeChargeSection}>
          <Image source={Images.takechnageIcons} style={{ height: 112, resizeMode: "contain", width: 290, }} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    paddingHorizontal: 5,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
    fontFamily: Fonts.PoppinsBold,
  },


  userSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  userSelectorText: {
    fontSize: 16,
    color: '#333333',
    fontFamily: Fonts.PoppinsMedium,
  },
  dropdownIcon: {
    width: 20,
    height: 20,
    tintColor: '#666666',
  },
  dropdownIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    minHeight: 100,
    marginTop: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333333',
    fontFamily: Fonts.PoppinsRegular,
  },
  // Records Section Styles
  recordsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recordsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  recordItem: {
    alignItems: 'center',
    flex: 1,
  },
  recordIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  recordIcon: {
    width: 40,
    height: 40,
    // tintColor: Colors.primaryColor,
  },
  recordLabel: {
    fontSize: 14,
    color: '#333333',
    fontFamily: Fonts.PoppinsMedium,
    textAlign: 'center',
  },
  addRecordsButton: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  addRecordsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.PoppinsSemiBold,
  },

  // Previous Orders Styles
  previousOrdersTitle: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 15,
    fontFamily: Fonts.PoppinsMedium,
  },
  horizontalScroll: {
    maxHeight: 150, // Same as container
  },
  horizontalScrollContent: {
    paddingRight: 20,
  },

  takeChargeSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  // Product Card Styles
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    width: width * 0.7,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImageContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: Fonts.PoppinsSemiBold,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 5,
  },
  star: {
    fontSize: 14,
    color: '#FFD700',
    marginRight: 2,
  },
  emptyStar: {
    color: '#E0E0E0',
  },
  ratingText: {
    fontSize: 12,
    color: '#666666',
    fontFamily: Fonts.PoppinsRegular,
  },
  productInfo: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666666',
    fontFamily: Fonts.PoppinsRegular,
  },
  infoValue: {
    fontSize: 12,
    color: '#666666',
    fontFamily: Fonts.PoppinsRegular,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    fontFamily: Fonts.PoppinsBold,
  },
  productActions: {
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Fonts.PoppinsSemiBold,
  },
  
  // Bottom Banner Styles
  bottomBanner: {
    backgroundColor: '#E8F5E8',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: Fonts.PoppinsBold,
    marginBottom: 5,
  },
  bannerSubtitle: {
    fontSize: 20,
    color: '#666666',
    fontFamily: Fonts.PoppinsRegular,
  },
  bannerImageContainer: {
    marginLeft: 15,
  },
  bannerImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});

export default HealthRecords;