import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../../component/Header';
import { Colors } from '../../common/Colors';
import { Fonts } from '../../common/Fonts';

const AboutUs = (props: any) => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:ayurmuniinfo@gmail.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:9306220796');
  };
  const handlePhonePress2 = () => {
    Linking.openURL('tel:7807425002');
  };

  const handleWebsitePress = () => {
    // Linking.openURL('https://clikshop.co.in/');
  };

  const onTrackOrder = () => {
    Linking.openURL('https://clikshop.co.in/track_your_order')
  }

  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} title='About US' Is_Tab={false} />
      <ScrollView>
        <View style={styles.mainContainer}>
          <View style={styles.safetyNoticeContainer}>
            <Text style={styles.sectionTitle}>Safety Notice</Text>
            <Text style={styles.safetyNoticeText}>
              Dear Customers,
              {'\n'}
              {'\n'}
              Beware of scams offering free gifts for payments via unsoliciated calls or SMS.We do not take resposibility for such transactions.Report any suspicious activity to ayurmuniinfo@gmail.com
            </Text>
          </View>

          <View style={styles.trackOrderContainer}>
            <Text style={styles.sectionTitle}>Track your order</Text>
            <Text style={styles.descriptionText}>
              Please visit the following website with your order or tracking number :
            </Text>
            <Text onPress={onTrackOrder} style={styles.trackOrderLink}>
              Track Order
            </Text>
            <Text style={styles.descriptionText}>
              if no tracking information is available,please wait for few days while the system updates.
            </Text>
          </View>
          

          <LinearGradient
            colors={[Colors.secondaryColor, Colors.primaryColor]}
            style={styles.gradientContainer}
          >
            <View>
              <Text style={styles.gradientTitle}>Get in touch</Text>
            </View>

            <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
              <Icon name="email" size={24} color="white" />
              <Text style={styles.contactText}>ayurmuniinfo@gmail.com</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactItem}>
              <Icon name="phone" size={24} color="white" />
              <Text onPress={handlePhonePress} style={styles.contactText}>+91 7807425002 </Text>
              <Text onPress={handlePhonePress2} style={styles.contactText}>+91 9306220796</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactItem} onPress={handleWebsitePress}>
              <Icon name="language" size={24} color="white" />
              <Text style={styles.contactText}>www.ayurmuni.co.in</Text>
            </TouchableOpacity>

            <View style={styles.addressContainer}>
              <Icon name="location-on" size={24} color="white" />
              <Text style={styles.addressText}>
                Shop No - 53,Ward No - 49,Near super mall,subhash chouck Nagar,{'\n'}
                Gurugram 122018, Haryana{'\n'}
                India
              </Text>
            </View>
          </LinearGradient>

          <View style={styles.bottomSection}>
            <Text style={styles.descriptionText}>
              We are committed to providing timely delivery and appreciate your patience.For any questions or assistance, please contact us at
            </Text>
            <Text onPress={handleEmailPress} style={styles.contactEmail}>
              contact@ayurmuni.co.in
            </Text>
            <Text style={styles.descriptionText}>
              Please note that our response time may take 24-48 business hours.
              {'\n'}
              Thank you for your understanding.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    padding: 20,
  },
  safetyNoticeContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5', 
    borderRadius: 6,
  },
  trackOrderContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 6,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    textAlign: 'left',
    color: '#333333', 
    fontFamily: Fonts.PoppinsBlack,
  },
  safetyNoticeText: {
    fontSize: 14,
    textAlign: 'left',
    color: '#333333',
    fontFamily: Fonts.PoppinsMedium,
    marginTop: 4,
    lineHeight: 24,
  },
  descriptionText: {
    fontSize: 14,
    textAlign: 'left',
    color: '#333333',
    fontFamily: Fonts.PoppinsMedium,
    marginTop: 4,
    lineHeight: 24,
  },
  trackOrderLink: {
    fontSize: 16,
    textDecorationLine : 'underline',
    textAlign: 'left',
    color: Colors.errorColor, 
    fontFamily: Fonts.PoppinsMedium,
    marginTop: 4,
  },
  gradientContainer: {
    padding: 16,
    borderRadius: 6,
    marginTop: 20,
  },
  gradientTitle: {
    fontSize: 24,
    color: 'white',
    textAlign: 'left',
    fontFamily: Fonts.PoppinsMedium,
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 12,
    fontFamily: Fonts.PoppinsRegular,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  addressText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 12,
    fontFamily: Fonts.PoppinsRegular,
    flex: 1,
  },
  bottomSection: {
    marginTop: 20,
    paddingBottom: 16,
  },
  contactEmail: {
    fontSize: 14,
    textAlign: 'left',
    color: Colors.primaryColor,
    fontFamily: Fonts.PoppinsBlack,
    marginTop: 4,
    lineHeight: 24,
  },
});

export default AboutUs;