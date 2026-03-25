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
  profile_picture: string | null;
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
    last_name: '',
    email: '',
    profile_picture: null,
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
        console.log("ProfileJSONDATA ===>", JSONDATA);
        if (result.status === 200) {
          setProfileData(JSONDATA);
        }
        else if (result.status === 404) {
          showSuccessToast('Authorization Error', 'error');
          // navigation.replace('AuthStack', { screen: 'Login' })
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
        showSuccessToast(message || "User Deleted Successfully", 'success');
        navigation.replace('AuthStack', { screeen: 'Login' })
      }
      else {
        showSuccessToast(message || "User Not Deleted", 'error')
      }
    } catch (error) {
      console.log(error);
    }
  }

  
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
    <StatusBar barStyle="dark-content" backgroundColor="#F7F8FA" />

    <Header title="Profile" Is_Tab={true} />

    <ScrollView showsVerticalScrollIndicator={false}>

      {/* PROFILE HEADER */}
      <View style={styles.profileCard}>
        <View style={styles.profileImageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : profileData.profile_picture ? (
            <Image source={{ uri: profileData.profile_picture }} style={styles.profileImage} />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Text style={styles.profileText}>
                {profileData.first_name?.charAt(0)?.toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.name}>
          {profileData.first_name} {profileData.last_name}
        </Text>

        <Text style={styles.phone}>
          {profileData.verified_phone_number}
        </Text>
      </View>

      {/* USER SETTINGS */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Account</Text>
        {userSettings.map((item, index) => renderMenuItem(item, index))}
      </View>

      {/* ACCOUNT SETTINGS */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        {accountSettings.map((item, index) => renderMenuItem(item, index))}
      </View>

      {/* SUPPORT */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Support</Text>
        {supportSettings.map((item, index) => renderMenuItem(item, index))}
      </View>

      {/* LOGOUT BUTTON */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Ionicons name="log-out-outline" size={20} color="#FF4D4F" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* DELETE */}
      <TouchableOpacity onPress={handleDeleteAccount}>
        <Text style={styles.deleteAccountText}>Delete my account</Text>
      </TouchableOpacity>

    </ScrollView>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  profileCard: {
    alignItems: 'center',
    margin: 16,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 4,
  },

  profileImageContainer: {
    marginBottom: 10,
  },

  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },

  profilePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: Colors.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileText: {
    fontSize: 36,
    color: '#fff',
    fontFamily: Fonts.PoppinsBold,
  },

  name: {
    fontSize: 18,
    fontFamily: Fonts.PoppinsSemiBold,
    marginTop: 5,
  },

  phone: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.PoppinsSemiBold,
    marginBottom: 10,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },

   dangerMenuItem: {
    // Add any danger-specific styling here
  },
   dangerText: {
    color: '#FF6B6B',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuItemText: {
    fontSize: 14,
    marginLeft: 12,
    fontFamily: Fonts.PoppinsRegular,
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#FFF1F0',
  },

  logoutText: {
    marginLeft: 8,
    color: '#FF4D4F',
    fontFamily: Fonts.PoppinsSemiBold,
  },

  deleteAccountText: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
    color: '#FF6B6B',
    fontFamily: Fonts.PoppinsSemiBold,
  },
});

export default ProfilePage;