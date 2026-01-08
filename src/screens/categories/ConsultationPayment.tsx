import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, StatusBar, Alert, } from 'react-native';
import { Colors } from '../../common/Colors';
import LinearGradient from 'react-native-linear-gradient';
import { Fonts } from '../../common/Fonts';
import { RAZORPAY_KEY } from '../../common/datafile';
import { showSuccessToast } from '../../config/Key';
import *as _CONSULT_SERVICE from '../../services/ConsultServce';
import *as _ADDRESS_SERVICE from '../../services/AddressService';
import { Utils } from '../../common/Utils';
import *as _CART_SERVICE from '../../services/CartService';
import *as _ORDER_SERVICE from '../../services/OrderService';
import * as _PROFILE_SERVICES from '../../services/ProfileServices';
import { useIsFocused } from '@react-navigation/native';
import * as _HOME_SERVICE from '../../services/HomeServices';
import RazorpayCheckout, { CheckoutOptions } from 'react-native-razorpay';
import { Entypo, Feather, FontAwesome } from '../../common/Vector';
import { SafeAreaView } from 'react-native-safe-area-context';

interface NavigationProp {
  navigate: (screen: string, params?: any) => void;
}

interface SelectDoctorProps {
  navigation: NavigationProp;
  props?: any
}


interface Address {
  id: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  house_details: string;
  is_default: boolean;
}

const ConsultationPayment: React.FC<SelectDoctorProps> = (props: any) => {
  const [selectedPayment, setSelectedPayment] = useState('upi');

  const [UserAddress, setUserAddress] = useState<Address | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [btnLoader, setBtnLoader] = useState(false);
  const isFocused = useIsFocused()

  const { booking } = props.route.params?.productData || {};

  useEffect(() => {
    if (!isFocused) return;
    fetchCustomerAddress();
  }, [isFocused]);


  const fetchCustomerAddress = async () => {
    try {
      const token = await Utils.getData('_TOKEN');
      if (!token) {
        setUserAddress(null);
        return;
      }

      const response: any = await _PROFILE_SERVICES.user_profile();
      if (response.status !== 200) {
        setUserAddress(null);
        return;
      }

      const data = await response.json();
      setUserData(data);

      const defaultAddress =
        data?.addresses?.find((addr: Address) => addr?.is_default);

      setUserAddress(defaultAddress || null);

    } catch (error) {
      console.log('FETCH CUSTOMER ADDRESS ERROR:', error);
      setUserAddress(null);
    }
  };



  const verifyPayment = async (razorpaypaymentId: any, razorpayorderID: any, paymentID: any, razorpaySignature: any) => {
    try {

      const send_Data = {
        payment_id: paymentID,
        razorpay_order_id: razorpayorderID,
        razorpay_payment_id: razorpaypaymentId,
        razorpay_signature: razorpaySignature

      }

      const Response: any = await _ORDER_SERVICE.payment_verify_API(send_Data);
      const PaymentData = await Response.json();
      props.navigation.navigate('PaymentSuccessScreen', { paymentData: PaymentData, SuccessText: 'doctor', });

      if (Response.status === 200) {
        showSuccessToast('Payment Suceefully Done', 'success')
        props.navigation.navigate('PaymentSuccessScreen', { paymentData: PaymentData });

      } else {
        Alert.alert(
          'Verification Failed',
          'Payment verification failed. Please try again.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Retry',
              onPress: () => handlePaymentWithOrder(PaymentData?.order_id),
            },
          ]
        );
      }

    } catch (error) {
      console.error('Verification error:', error);

    }
  };

  const handlePaymentWithOrder = async (orderID: string) => {

    try {

      const send_Data = {
        order_id: orderID,

      }

      const orderResponse: any = await _CONSULT_SERVICE.create_razorpay_order_ID(send_Data);
      const orderData = await orderResponse.json();
      if (!orderResponse.ok) {
        setBtnLoader(false)
        throw new Error('Failed to create order');
      }

      const options: CheckoutOptions = {
        description: 'Ayurmuni Order Payment',
        currency: 'INR',
        key: RAZORPAY_KEY,
        amount: orderData?.amount,
        name: 'Ayurmuni',
        order_id: orderData?.razorpay_order_id,
        prefill: {
          email: userData?.email,
          contact: userData?.verified_phone_number,
          name: userData?.first_name,
        },
        modal: {
          backdropclose: false,
          escape: true,
          handleback: true,
          confirm_close: true
        },

        notes: {
          address: UserAddress?.pincode || 'Corporate Office',
          merchant_order_id: `order_${Date.now()}`,
          user_id: userData?.user
        },
        theme: {
          color: Colors.primaryColor,
          backdrop_color: Colors.secondaryColor
        }
      };

      RazorpayCheckout.open(options)
        .then(data => {
          setBtnLoader(false);
          verifyPayment(
            data.razorpay_payment_id,
            data.razorpay_order_id,
            orderData?.payment_id,
            data.razorpay_signature
          );
        })
        .catch(() => {
          Alert.alert(`Payment cancelled by you`);
          setBtnLoader(false);
        });

    } catch (error) {
      console.log("RAZORPAY ERROR:", error);
    }
  };


  return (

    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryColor} />

      <LinearGradient
        colors={[Colors.primaryColor, Colors.secondaryColor]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => props.navigation.goBack()}
        >
          <Entypo name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Payment Method</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <View style={styles.doctorCard}>
          <LinearGradient
            colors={['#f5f7fa', '#c3cfe2']}
            style={styles.doctorCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.doctorImageContainer}>
              <Image
                source={{
                  uri: booking?.image || 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png',
                }}
                style={styles.doctorImage}
              />
              <View style={styles.verifiedBadge}>
                <Entypo name="check" size={12} color="#fff" />
              </View>
            </View>

            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>Dr. {booking?.doctor_name ?? ''}</Text>
              <View style={styles.clinicRow}>
                <Entypo name="location-pin" size={14} color="#718096" />
                <Text style={styles.clinicName}>{booking?.clinic_name ?? 'Clinic Name'}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>


        <View style={styles.summaryCard}>
          <View style={styles.sectionTitleContainer}>
            <View style={styles.titleAccent} />
            <Text style={styles.sectionTitle}>Appointment Summary</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Entypo name="calendar" color={Colors.secondaryColor} size={18} />
            </View>
            <Text style={styles.infoText}>{booking?.slot_date ?? ""}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Feather name="clock" color={Colors.secondaryColor} size={18} />
            </View>
            <Text style={styles.infoText}>{booking?.slot_time ?? ''}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <FontAwesome name="user" color={Colors.secondaryColor} size={18} />
            </View>
            <Text style={styles.infoText}>{booking?.patient ?? 'Patient Name'}</Text>
          </View>
        </View>


        <View style={styles.pricingCard}>
          <View style={styles.sectionTitleContainer}>
            <View style={styles.titleAccent} />
            <Text style={styles.sectionTitle}>Payment Details</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Consultation Fee</Text>
            <Text style={styles.priceValue}>₹ {booking?.consultation_fee ?? '0.00'}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service Charge</Text>
            <Text style={styles.priceValue}>₹ {booking?.service_charge ?? '0.00'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹ {booking?.consultation_fee ?? '0.0'}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>


      <View style={styles.bottomContainer}>
        <LinearGradient
          colors={[Colors.primaryColor, Colors.secondaryColor]}
          style={styles.payButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity
            disabled={btnLoader}
            onPress={() => handlePaymentWithOrder(booking?.order_id)}
            style={styles.payButtonTouchable}
            activeOpacity={0.8}
          >
            <Text style={styles.payButtonText}>
              {btnLoader
                ? 'Processing...'
                : selectedPayment === 'cash_on_delivery' || selectedPayment === 'cod'
                  ? 'Proceed'
                  : 'Pay Now'}
            </Text>
            {!btnLoader && (
              <Entypo name="chevron-right" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.PoppinsBold,
    color: '#fff',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  doctorCard: {
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  doctorCardGradient: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  doctorImageContainer: {
    position: 'relative',
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.secondaryColor,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 16,
  },
  doctorName: {
    fontSize: 18,
    fontFamily: Fonts.PoppinsBold,
    color: '#1a202c',
    marginBottom: 4,
  },
 
  clinicRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clinicName: {
    fontSize: 13,
    color: '#718096',
    marginLeft: 4,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleAccent: {
    width: 4,
    height: 20,
    backgroundColor: Colors.secondaryColor,
    borderRadius: 2,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.PoppinsBold,
    color: '#1a202c',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f0f4ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#4a5568',
    fontWeight: '500',
    flex: 1,
  },
  pricingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  priceLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    color: '#1e293b',
    fontFamily: Fonts.PoppinsBold,
  },
  totalValue: {
    fontSize: 20,
    color: Colors.secondaryColor,
    fontFamily: Fonts.PoppinsBold,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  payButton: {
    borderRadius: 14,
    elevation: 4,
    shadowColor: Colors.secondaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  payButtonTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  payButtonText: {
    fontSize: 16,
    fontFamily: Fonts.PoppinsBold,
    color: '#fff',
    marginRight: 8,
  },
});

export default ConsultationPayment;