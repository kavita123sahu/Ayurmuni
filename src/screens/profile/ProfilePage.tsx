import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '../../common/Vector';
import Header from '../../component/Header';
import { Colors } from '../../common/Colors';
import { Utils } from '../../common/Utils';
import { Fonts } from '../../common/Fonts';
import { CameraOptions, ImageLibraryOptions, ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { showSuccessToast } from '../../config/Key';
import { requestCameraPermission } from '../../common/Validator';
import *as _PROFILE_SERVICES from '../../services/ProfileServices';
import { useIsFocused } from '@react-navigation/native';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  hasArrow?: boolean;
  isDanger?: boolean;
}


interface UserData {
  id: string;
  verified_phone_number: string;
  user: string;
  first_name: string;
  last_name: string;
  email?: string;
  // ... other properties
}
interface ProfilePageProps {
  navigation?: any;


}

const ProfilePage: React.FC<ProfilePageProps> = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<UserData>({
    id: '',
    verified_phone_number: '',
    user: '',
    first_name: '',
    last_name: ''
  });

  const isFocused = useIsFocused();
  const userSettings: MenuItem[] = [
    { id: '1', title: 'Personal Information', icon: 'person-outline', hasArrow: true },
    { id: '2', title: 'Health Records', icon: 'heart-outline', hasArrow: true },
    { id: '3', title: 'My Orders', icon: 'bag-outline', hasArrow: true },
    { id: '4', title: 'My Cart', icon: 'cart-outline', hasArrow: true },
  ];

  const accountSettings: MenuItem[] = [
    { id: '4', title: 'Choose Language', icon: 'globe-outline', hasArrow: true },
  ];

  const supportSettings: MenuItem[] = [
    { id: '5', title: 'About Us', icon: 'information-circle-outline', hasArrow: true },
    { id: '6', title: 'Rate Us', icon: 'star-outline', hasArrow: true },
    { id: '7', title: 'Terms & Conditions', icon: 'document-text-outline', hasArrow: true },
    { id: '8', title: 'Report an Issue', icon: 'flag-outline', hasArrow: true },
    { id: '9', title: 'Log Out', icon: 'log-out-outline', hasArrow: true },
  ];


  useEffect(() => {
    getUserProfile();
  }, [isFocused]);


  const getUserProfile = async () => {

    try {
      const token = await Utils.getData('_TOKEN');

      if (token) {
        const result: any = await _PROFILE_SERVICES.user_profile();
        console.log("Profile Data ===>", result)
        const JSONDATA = await result.json();
        if (result.status === 200) {
          setProfileData(JSONDATA);
        }
        else if (result.status === 404) {
          navigation.replace('AuthStack', { screen: 'Login' })

        }

        else {
          console.log("Error in fetching profile data", JSONDATA);
        }
      }

    } catch (error) {
      console.log(error);
    }
  }


  const DeleteAccount = async () => {
    console.log("deleteee", profileData?.id)
    try {
      const result: any = await _PROFILE_SERVICES.delete_Profile(profileData.id);
      const { status, data, message = "" } = result;
      if (status === 200) {
        await Utils.clearAllData()
        navigation.replace('AuthStack', { screeen: 'Login' })
      }
      else {
        showSuccessToast(message || "User Not Deleted", 'error')
      }
    } catch (error) {
      console.log(error);
    }
  }

  const openCamera = async () => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        showSuccessToast('Camera permission denied', 'error');
        return;
      }

      const options: CameraOptions = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 1000,
        maxWidth: 1000,
        quality: 0.7,
        saveToPhotos: false,
      };

      launchCamera(options, (response: ImagePickerResponse) => {

        if (response.didCancel) {
          console.log('Camera cancelled');
          return;
        }

        if (response.errorCode) {
          console.log('Camera Error Code:', response.errorCode);
          showSuccessToast('Camera Error: ' + response.errorMessage, 'error');
          return;
        }

        if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          console.log('Asset URI:', asset.uri);

          if (asset.uri) {
            setProfileImage(asset.uri);
            showSuccessToast('Photo Captured Successfully', 'success');
          }
        }
      });
    } catch (error) {
      console.log('Camera error:', error);
      showSuccessToast('Camera failed to open', 'error');
    }
  };

  const openGallery = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {

        showSuccessToast('Gallery cancelled or error', 'error')
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        setProfileImage(asset.uri || null);
        showSuccessToast('Photo Selected Successfully', 'success')

      }
    });
  };



  const handleEditPicture = () => {
    Alert.alert(
      'Select Image',
      'Choose an option to select image',
      [
        {
          text: 'Camera',
          onPress: openCamera,
        },
        {
          text: 'Gallery',
          onPress: openGallery,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };


  const handleMenuPress = (item: MenuItem) => {
    if (item.title === 'Log Out') {
      Alert.alert('Log Out', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          onPress: () => logout()
        },
      ]);
    } else {

      switch (item.title) {
        case 'Personal Information':
          navigation.navigate('EditProfile');
          break;
        case 'Settings':
          navigation.navigate('Settings');
          break;
        case 'My Orders':
          navigation.navigate('MyOrders');
          break;
        case 'My Cart':
          navigation.navigate('CartScreen');
          break;
        case 'Health Records':
          navigation.navigate('HealthRecords');
          break;
        case 'Help & Support':
          navigation.navigate('HelpSupport');
          break;
        case 'Rate Us':
          navigation.navigate('RatingScreen');
          break;
        case 'Privacy Policy':
          navigation.navigate('PrivacyPolicy');
          break;

        case 'Terms & Conditions':
          navigation.navigate('TermsConditions', {
            agreed: true
          });
          break;
        case 'About Us':
          navigation.navigate('AboutUs');
          break;
        default:
          console.log('No navigation defined for:', item.title);
      }
    }
  };



  const logout = async () => {
    await Utils.clearAllData()
    navigation.replace('AuthStack', { screen: 'Login' });
  }



  const handleDeleteAccount = () => {
    Alert.alert('Delete Account', 'Are you sure you want to delete your account? This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => DeleteAccount() },
    ]);
  };


  const renderMenuItem = (item: MenuItem, index: number) => (

    <View key={`menu-item-${index}`}>
      <TouchableOpacity
        style={[styles.menuItem, item.isDanger && styles.dangerMenuItem]}
        onPress={() => handleMenuPress(item)}
      >
        <View style={styles.menuItemLeft}>
          <Ionicons
            name={item.icon as any}
            size={20}
            color={item.isDanger ? '#FF6B6B' : '#000'}
          />
          <Text style={[styles.menuItemText, item.isDanger && styles.dangerText]}>
            {item.title}
          </Text>
        </View>
        {item.hasArrow && (
          <Ionicons name="chevron-forward" size={20} color="#000" />
        )}

      </TouchableOpacity>

      <View style={{
        borderBottomWidth: 1,
        borderColor: "#eee",
      }} />
    </View>

  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryColor} />

      <Header title='Profile' Is_Tab={true} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <TouchableOpacity onPress={handleEditPicture}>
              {profileImage && profileImage !== '' ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.profilePlaceholder}>
                  {/* {profileData?.first_name.charAt(0).toUpperCase()} */}
                  <Text style={{ fontSize: 40, color: 'white', fontFamily: Fonts.PoppinsBold }}> {profileData?.first_name?.charAt(0)?.toUpperCase()} </Text>
                  {/* <Image source={require('../../assets/images/user_profile.png')} style={[styles.profileImage, { backgroundColor: 'black' }]} /> */}
                </View>
              )}


            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleEditPicture}>
          </TouchableOpacity>
        </View>

        <View style={styles.menuContainer}>
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>User settings</Text>
            <View style={{
              borderBottomWidth: 1,
              borderColor: "#eee",
            }} />
            {userSettings.map((item, index) => renderMenuItem(item, index))}
          </View>

          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            <View style={{
              borderBottomWidth: 1,
              borderColor: "#eee",
            }} />
            {accountSettings.map((item, index) => renderMenuItem(item, index))}
          </View>

          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>More Info and Support</Text>
            <View style={{
              borderBottomWidth: 1,
              borderColor: "#eee",
            }} />
            {supportSettings.map((item, index) => renderMenuItem(item, index))}

          </View>

          <View style={styles.deleteSection}>
            <TouchableOpacity onPress={handleDeleteAccount}>
              <Text style={styles.deleteAccountText}>Delete my account</Text>
            </TouchableOpacity>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginLeft: -40,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
  },
  profileSection: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 1,
  },
  profileImageContainer: {
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 50,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'cover',
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primaryColor,
    // backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
  },
  editPictureText: {
    fontSize: 16,
    color: '#8BC34A',
    fontFamily: Fonts.PoppinsMedium,
  },
  menuContainer: {
    flex: 1,
  },
  menuSection: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#ffff',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.PoppinsMedium,
    color: Colors.textColor,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    backgroundColor: 'white',
    borderRadius: 10,

    paddingHorizontal: 0,
  },
  dangerMenuItem: {
    // Add any danger-specific styling here
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.textColor,
    marginLeft: 15,
    fontFamily: Fonts.PoppinsRegular,
  },
  dangerText: {
    color: '#FF6B6B',
  },
  deleteSection: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  deleteAccountText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontFamily: Fonts.PoppinsSemiBold
  },

});

export default ProfilePage;