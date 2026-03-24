import { View, Text, Image, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import { Images } from '../../common/Images';
import { Utils } from '../../common/Utils';
import * as _PROFILE_SERVICES from '../../services/ProfileServices';
import { showSuccessToast } from '../../config/Key';


const NewSplash = (props: any) => {



 
  const getUser = async () => {
    try {
      const token = await Utils.getData('_TOKEN');

      if (token) {
        const result: any = await _PROFILE_SERVICES.user_profile();
        const JSONUser = await result.json();

        if (result.status === 200) {
          Utils.storeData('_USER_INFO', JSONUser);
       

          props.navigation.replace('HomeStack', { screen: 'Home' });

        } else {
          showSuccessToast("Please Fill the Onboarding Form to Access the Application", 'error');
          props.navigation.navigate('Login');
        }

      } else {
        props.navigation.navigate('Login');
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#FFFFFF'} barStyle={'dark-content'} />

      {/* Logo Section */}
      <Animatable.View
        animation="fadeInDown"
        duration={1200}
        style={styles.logoWrapper}
      >
        <Text style={styles.title}>
          Ayur <Text style={styles.highlight}>Muni</Text>
        </Text>

        <Text style={styles.subtitle}>
          Ancient wisdom for your modern lifestyle.
        </Text>

        
        <View style={styles.imageContainer}>
          <Image source={Images.backgroundFlower} style={styles.bgImage} resizeMode="contain" />
          <Image source={Images.meditationIcon} style={styles.topImage} resizeMode="contain" />
        </View>
      </Animatable.View>

      {/* Bottom Buttons */}
      <Animatable.View
        animation="fadeInUp"
        duration={1200}
        delay={300}
        style={styles.bottomContainer}
      >
        <Text style={styles.continueText}>Continue With</Text>

        {/* GOOGLE BUTTON */}
        <TouchableOpacity
          style={styles.googleBtn}
          onPress={getUser} 
        >
          <View style={styles.row}>
            <Image source={Images.googleIcon} style={styles.icon} />
            <Text style={styles.googleText}>Google</Text>
          </View>
        </TouchableOpacity>

        {/* MOBILE BUTTON */}
        <TouchableOpacity
          style={styles.mobileBtn}
          onPress={() => props.navigation.navigate('Login')}
        >
          <View style={styles.row}>
            <Image source={Images.phoneIcon} style={styles.icon} />
            <Text style={styles.mobileText}>Mobile Number</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text
            style={styles.loginHighlight}
            onPress={() => props.navigation.navigate('Login')}
          >
            Login
          </Text>
        </Text>
      </Animatable.View>
    </View>
  );
};

export default NewSplash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },

  logoWrapper: {
    alignItems: 'center',
    marginTop: 100,
  },

  title: {
    fontSize: 36,
    fontWeight: '600',
    color: '#1E1E1E',
  },

  highlight: {
    color: '#0D614E',
    fontWeight: '700',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '400',
  },

  imageContainer: {
    marginTop: 80,
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bgImage: {
    position: 'absolute',
    width: 350,
    height: 350,
  },

  topImage: {
    width: 120,
    height: 120,
  },

  bottomContainer: {
    marginBottom: 40,
  },

  continueText: {
    textAlign: 'center',
    color: '#1E293B',
    marginBottom: 10,
    fontSize: 20,
    fontWeight: '400',
    top:-60
  },

  googleBtn: {
    borderWidth: 1,
    borderColor: '#0D614E33',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    top:-30
  },

  mobileBtn: {
    borderWidth: 1,
    borderColor: '#0D614E33',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
     top:-30
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  icon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },

  googleText: {
    fontSize: 16,
    color: '#0D614E',
    fontWeight: '500',
  },

  mobileText: {
    fontSize: 14,
    color: '#0D614E',
    fontWeight: '500',
  },

  loginText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#52525B',
    fontWeight:400,
     top:-30
  },

  loginHighlight: {
    color: '#0D614E',
    fontWeight: '600',
  },
});