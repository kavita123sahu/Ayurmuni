import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Dimensions,
  Image,
  StatusBar,
  Alert,
  Modal,
} from 'react-native';
import Header from '../../component/Header';
import { Colors } from '../../common/Colors';
import LinearGradient from 'react-native-linear-gradient';
import { Fonts } from '../../common/Fonts';
import { creditDebitOptions, moreWaysToPay, paymentMethods, paymentMethods1, RAZORPAY_KEY } from '../../common/datafile';
import { getExpectedDeliveryDate, showSuccessToast } from '../../config/Key';
import *as _CONSULT_SERVICE from '../../services/ConsultServce';
const { width, height } = Dimensions.get('window');
import *as _ADDRESS_SERVICE from '../../services/AddressService';
import { Utils } from '../../common/Utils';
import *as _CART_SERVICE from '../../services/CartService';
import *as _ORDER_SERVICE from '../../services/OrderService';
import * as _PROFILE_SERVICES from '../../services/ProfileServices';
import { useIsFocused } from '@react-navigation/native';
import * as _HOME_SERVICE from '../../services/HomeServices';
import RazorpayCheckout, { CheckoutOptions } from 'react-native-razorpay';

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
  // other properties add karo jo address object mein hain
}

const PaymentMethods: React.FC<SelectDoctorProps> = (props: any) => {
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [promoCode, setPromoCode] = useState('');
  const [upiId, setUpiId] = useState('');
  const [CustomerID, setCustomerID] = useState('');
  // Fixed: Changed from Address[] to Address | null
  const [UserAddress, setUserAddress] = useState<Address | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [btnLoader, setBtnLoader] = useState(false);
  const [totalWeight, setTotalWieght] = useState(0);
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: ''
  });
  const [showPromoSuccess, setShowPromoSuccess] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const isFocused = useIsFocused()
  const [EstimateData, setEstimateData] = useState<any>();
  const [ESTDate, setESTDate] = useState('');
  const { productData } = props.route.params;

  const { buyNow } = props.route.params;

  console.log("propspropspropsprops----->", props);

  const handleApplyPromo = () => {
    if (promoCode.trim() === '') {
      Alert.alert('Error', 'Please enter a promo code');
      return;
    }

    const validPromoCodes = ['SAVE10', 'FIRST20', 'HEALTH15', 'DISCOUNT5'];
    const discount = promoCode === 'SAVE10' ? 10 : promoCode === 'FIRST20' ? 20 :
      promoCode === 'HEALTH15' ? 15 : promoCode === 'DISCOUNT5' ? 5 : 0;

    if (validPromoCodes.includes(promoCode.toUpperCase())) {
      setPromoDiscount(discount);
      setPromoApplied(true);
      setShowPromoSuccess(true);

      setTimeout(() => {
        setShowPromoSuccess(false);
      }, 3000);
    } else {
      Alert.alert('Invalid Code', 'Please enter a valid promo code');
    }
  };

  type RazorpayMethod = {
    netbanking?: boolean;
    card?: boolean;
    wallet?: boolean;
    upi?: boolean;
    emi?: boolean;
  };

  const mapSelectedMethodToObject = (method: string): RazorpayMethod | undefined => {
    switch (method.toLowerCase()) {
      case 'card':
        return { card: true };
      case 'upi':
      case 'googlepay':
      case 'phonepe':
      case 'paytm':
        return { upi: true };
      case 'netbanking':
        return { netbanking: true };
      case 'wallet':
        return { wallet: true };
      case 'emi':
        return { emi: true };
      default:
        return undefined;
    }
  };


  useEffect(() => {
    data();
    // const calculatedTotalWeight = productData?.items.reduce((sum: any, item: any) =>
    //   sum + (Number(item.product.weight) * item.quantity / 1000), 0);
    // setTotalWieght(calculatedTotalWeight);
    getCustomerAddress();
    getESTDate(productData?.id);
  }, [isFocused])


  const data = async () => {

    const data = await Utils.getData('verify')
    console.log(data, "data")

  }


  const getCustomerAddress = async () => {
    try {
      const token = await Utils.getData('_TOKEN');

      if (token) {
        const result: any = await _PROFILE_SERVICES.user_profile();
        const JSONDATA = await result.json();

        console.log("JSONDATA====>>", JSONDATA);
        if (result.status === 200) {
          setUserData(JSONDATA);

          const defaultAddress = JSONDATA.addresses?.find((item: Address) => item.is_default === true);
          console.log("defaultAddress====>>", defaultAddress);

          if (defaultAddress) {
            // Fixed: Set single address object instead of array
            setUserAddress(defaultAddress);
          } else {
            console.log("Default address not found");
            setUserAddress(null);
          }

        } else {
          console.log("No address found");
          setUserAddress(null);
        }
      } else {
        console.log("Error fetching user profile");
        setUserAddress(null);
      }
    } catch (error) {
      console.log(error);
      setUserAddress(null);
    }
  }


  const verifyPayment = async (razorpaypaymentId: any, razorpayorderID: any, paymentID: any, razorpaySignature: any) => {

    console.log("datepaymentresponse", razorpaypaymentId, razorpayorderID, paymentID, razorpaySignature);

    try {

      const send_Data = {
        payment_id: paymentID,
        razorpay_order_id: razorpayorderID,   //
        razorpay_payment_id: razorpaypaymentId,
        razorpay_signature: razorpaySignature

      }

      // const send_Data = {
      //   order_id: orderId,
      //   payment_id: orderId,              // tumhari DB ka order
      //   razorpay_payment_id: razorpaypaymentId,
      //   razorpay_order_id: razorpayorderID,
      //   razorpay_signature: razorpaySignature
      // };

      const Response: any = await _ORDER_SERVICE.payment_verify_API(send_Data);

      console.log("Response--->", Response);
      const PaymentData = await Response.json();

      console.log("PaymentDataPaymentData--->", PaymentData);
      // Alert.alert('Success', 'Payment Successful');

      props.navigation.navigate('PaymentSuccessScreen', { paymentData: PaymentData, SuccessText: 'ecom', });
      showSuccessToast('Payment Suceefully Done', 'success')

      // if (Response.status === 200) {

      //   props.navigation.navigate('PaymentSuccessScreen', { paymentData: PaymentData });
      //   showSuccessToast('Payment Suceefully Done', 'success')

      // } else {

      //   Alert.alert(
      //     'Verification Failed',
      //     'Payment verification failed. Please try again.',
      //     [
      //       {
      //         text: 'Cancel',
      //         style: 'cancel',
      //       },
      //       {
      //         text: 'Retry',
      //         onPress: () => handlePaymentWithOrder(productData?.order_id),
      //       },
      //     ]
      //   );
      // }

    } catch (error) {
      console.error('Verification error:', error);

    }
  };

  const handlePaymentWithOrder = async (orderID: string) => {

    try {

      const send_Data = {
        // amount: 1,
        // customer_id: userData?.i
        order_id: orderID,

      }

      const orderResponse: any = await _CONSULT_SERVICE.create_razorpay_order_ID(send_Data);

      const orderData = await orderResponse.json();
      console.log("oderruuuuuuuuuuuuuuu--->", orderData);

      if (!orderResponse.ok) {
        setBtnLoader(false)
        throw new Error('Failed to create order');
      }


      const options: CheckoutOptions = {
        description: 'Ayurmuni Order Payment',
        currency: 'INR',
        key: RAZORPAY_KEY,
        amount: 1,    //orderData?.amount
        name: 'Ayurmuni',
        order_id: orderData?.razorpay_order_id,   // ✅ Razorpay ka order id yaha hona chahiye
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
          console.log("Razorpay response ===>", data);

          // data.razorpay_payment_id
          // data.razorpay_order_id
          // data.razorpay_signature
          setBtnLoader(false);
          console.log("orderDataorderDataorderData", orderData?.payment_id);
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


  const handlePaymentSelection = (paymentId: string) => {
    if (paymentId === 'add_new_card') {
      setShowCardModal(true);
    } else {
      setSelectedPayment(paymentId);
      if (paymentId !== 'upi_id') {
        setUpiId('');
      }
    }
  };

  const handleAddUPI = () => {
    if (upiId.trim() === '') {
      Alert.alert('Error', 'Please enter a valid UPI ID');
      return;
    }

    Alert.alert('Success', 'UPI ID added successfully');

  };


  const handleSaveCard = () => {
    if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardHolderName) {
      Alert.alert('Error', 'Please fill all card details');
      return;
    }

    setShowCardModal(false);
    Alert.alert('Success', 'Card added successfully');

    setCardDetails({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardHolderName: ''
    });
  };


  const getESTDate = async (vendor_pro_id: any) => {
    console.log("vendor_pro_id", vendor_pro_id);
    // setIsLoading(true);
    try {

      let serverResponse: any = await _HOME_SERVICE.get_EST_date(vendor_pro_id);
      let response = await serverResponse.json();
      console.log('estimatedddatateee=====>', response);
      setEstimateData(response);
      const date = getExpectedDeliveryDate(response.delivery_date_range || '');
      setESTDate(date);

      // if (serverResponse.status == 200) {
      //   setProductDetail(response);
      //   // setIsLoading(false);
      // }
      // else {
      //   console.log("Error in fetching product similar data", response);
      //   // setIsLoading(false);
      // }
    } catch (error) {
      console.log("Date ERROR:", error);
    }
  }


  const OnPayment = async () => {
    console.log("onpaymentttt", productData);

    try {

      // if (selectedPayment ) {
      //   showSuccessToast(`Total cart weight (${totalWeight.toFixed(2)} kg) cannot exceed 10 kg`, 'error');
      //   return;
      // }

      if (!selectedPayment) {
        showSuccessToast('Please select a payment method before proceeding.', 'error');
        return;
      }


      setBtnLoader(true);

      let dataToSend;

      if (buyNow) {

        dataToSend = {
          customer_id: userData?.id,
          delivery_address: UserAddress?.id,
          payment_method: selectedPayment === 'cod' ? "cash_on_delivery" : 'online',
          vendor_product_id: productData?.id,
          quantity: "1",

        }
      }
      

      else {
        dataToSend = {
          customer_id: userData?.id,
          delivery_address: UserAddress?.id,
          use_cart: true,
          payment_method: selectedPayment === 'cod' ? "cash_on_delivery" : 'online',
          // use_cart: true,// Add total amount
        }
      }

      console.log("data to send =============>", dataToSend, selectedPayment);

      // Single API call jo order 
      // create kare AUR razorpay order ID bhi return kare
      const result: any = await _CART_SERVICE.order_place_item(dataToSend);
      console.log("result====>>", result);
      const dataJson = await result.json();
      console.log("resounseeeorderr->>", dataJson)

      if (result.ok === true) {
        if (selectedPayment === 'cod') {
          showSuccessToast('Order placed successfully', 'success');
          props.navigation.navigate('PaymentSuccessScreen', {
            SuccessText: 'ecom',
            paymentData: ''
          });
          setBtnLoader(false);
        }

        else {
          // Online payment - razorpay
          if (dataJson?.order_id) {
            // result.data
            handlePaymentWithOrder(dataJson?.order_id);

          }

          else {
            showSuccessToast('Razorpay order creation failed', 'error');
            setBtnLoader(false);
          }
        }
      } else {
        showSuccessToast(dataJson.error || 'Order creation failed', 'error');
        setBtnLoader(false);
      }

    }
    catch (error) {
      console.log("Payment Error:", error);
      showSuccessToast('Something went wrong', 'error');
      setBtnLoader(false);
    }
  }

  const renderPaymentOption1 = (item: any, isSelected: boolean, onPress: () => void) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.paymentOption,
        isSelected && styles.selectedPaymentOption
      ]}
      onPress={onPress}
    >
      <View style={styles.paymentOptionLeft}>
        <View style={styles.radioButton}>
          {isSelected && <View style={styles.radioButtonSelected} />}
        </View>
        <View style={styles.paymentInfo}>
          <Image source={require('../../assets/images/statebank.png')} style={{ height: 45, width: 162 }} />
        </View>
      </View>
      <View style={[styles.paymentIcon]}>
        <Image source={require('../../assets/images/SBIlogo.png')} style={{ height: 36, width: 36 }} />
      </View>
    </TouchableOpacity>
  );


  const renderCreditOption = (item: any, isSelected: boolean, onPress: () => void) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.paymentOption,
        isSelected && styles.selectedPaymentOption
      ]}
      onPress={onPress}
    >
      <View style={styles.paymentOptionLeft}>
        {!item.isAddNew && (
          <View style={styles.radioButton}>
            {isSelected && <View style={styles.radioButtonSelected} />}
          </View>
        )}

        {item.isAddNew ? (
          <>
            <Image source={require('../../assets/images/solidadd.png')} style={{ height: 25, width: 25, resizeMode: 'cover' }} />
            <Text style={styles.paymentName1}>{item.name}</Text>
          </>
        ) : (
          <View style={styles.paymentInfo}>
            <Image source={require('../../assets/images/statebank.png')} style={{ height: 49, width: 162, resizeMode: 'cover' }} />
          </View>
        )}
      </View>

      {!item.isAddNew && <Image source={item.logo} style={{ width: 100, height: 36, resizeMode: 'contain' }} />}
    </TouchableOpacity>
  );

  const renderPaymentOption = (item: any, isSelected: boolean, onPress: () => void) => (
    <View key={item.id}>
      <TouchableOpacity
        style={[
          styles.paymentOption,
          isSelected && styles.selectedPaymentOption
        ]}
        onPress={onPress}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.paymentOptionLeft}>
            <View style={styles.radioButton}>
              {isSelected && <View style={styles.radioButtonSelected} />}
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>{item.name}</Text>
              {item.number && (
                <Text style={styles.paymentNumber}>{item.number}</Text>
              )}
            </View>
          </View>
          <Image source={item.logo} style={{ width: item.width, height: item.height }} />
        </View>
      </TouchableOpacity>

      {item.id === 'upi_id' && isSelected && (
        <View style={styles.upiContainer}>
          <View style={styles.promoCodeContainer}>
            <TextInput
              style={styles.promoCodeInput}
              placeholder="Enter UPI ID (e.g., user@paytm)"
              value={upiId}
              onChangeText={setUpiId}
              autoCapitalize="none"
            />
          </View>
          <TouchableOpacity style={styles.applyButton} onPress={handleAddUPI}>
            <Text style={styles.applyButtonText}>Add UPI</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );


  const PricingSection = ({
    currency = "₹" }) => {

    return (

      <View style={styles.container1}>
        <Text style={styles.title}>Pricing</Text>

        <View style={styles.contentContainer}>
          {/* Items Price */}
          <View style={styles.row}>
            <Text style={styles.label}>Items Price</Text>
            <Text style={styles.price}>
              {/* {currency}{itemsPrice} */}
              {currency}{(productData?.discounted_price || productData?.selling_price) ?? '0.00'}
            </Text>
          </View>

          {/* Delivery */}
          <View style={styles.row}>
            <Text style={styles.label}>Delivery</Text>
            <Text style={styles.price}>
              {currency}{productData?.delivery_charge ?? '0.00'}
            </Text>
          </View>


          {/* Promotion */}
          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.label}>Promotion</Text>
            <Text style={styles.promotionPrice}>
              -{currency}{productData?.promotion_discount ?? '0.00'}
            </Text>
          </View>

          {/* Total */}
          <View style={[styles.row]}>
            <Text style={styles.label}>Total</Text>
            <Text style={styles.price}>
              {currency}{(productData?.subtotal || productData?.selling_price) ?? '0.00'}
            </Text>
          </View>


          {/* Order Total */}
          <View style={[styles.row, styles.orderTotalRow]}>
            <Text style={styles.orderTotalLabel}>Order Total</Text>
            <Text style={styles.orderTotalPrice}>
              {currency}{(productData?.order_total || productData?.selling_price) ?? '0.00'}
            </Text>
          </View>
        </View>
      </View>
    )
  }


  const CardModal = () => (
    <Modal
      visible={showCardModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCardModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Credit/Debit Card</Text>
            <TouchableOpacity onPress={() => setShowCardModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="1234 5678 9012 3456"
                value={cardDetails.cardNumber}
                onChangeText={(text) => setCardDetails({ ...cardDetails, cardNumber: text })}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cardholder Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="John Doe"
                value={cardDetails.cardHolderName}
                onChangeText={(text) => setCardDetails({ ...cardDetails, cardHolderName: text })}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="MM/YY"
                  value={cardDetails.expiryDate}
                  onChangeText={(text) => setCardDetails({ ...cardDetails, expiryDate: text })}
                  maxLength={5}
                />
              </View>

              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChangeText={(text) => setCardDetails({ ...cardDetails, cvv: text })}
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCardModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveCard}
            >
              <Text style={styles.saveButtonText}>Save Card</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.primaryColor} />
      <Header title='Select Payment Method' navigation={props.navigation} Is_Tab={false} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {UserAddress ? (
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryTitle}>Delivering to {EstimateData?.vendor} {UserAddress?.city ?? ''} - {UserAddress?.pincode ?? ''}</Text>

            <View style={styles.deliveryAddressContainer}>
              {/* Fixed: Now correctly accessing properties from Address object */}
              <Text style={styles.deliveryAddress}>
                {UserAddress?.house_details ?? 'NA'}, {UserAddress?.city ?? 'NA'}, {UserAddress?.state ?? 'NA'} - {UserAddress?.country ?? "NA"}
              </Text>

              <TouchableOpacity style={styles.AddressContainer} onPress={() => props.navigation.navigate('EditAddress')}>
                <Text style={styles.changeAddress}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.deliveryInfo}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => props.navigation.navigate('AddAddress')}
            >
              <Text style={styles.applyButtonText}>Add address*</Text>
            </TouchableOpacity>
          </View>
        )}

        {EstimateData && (
          <View style={styles.deliveryContainer}>

            <Text style={styles.deliveryTitle}>Delivery: {ESTDate || ''}</Text>
            <Text style={styles.deliveryLocation}>Deliver to {EstimateData?.vendor + ' - ' || ''} {EstimateData?.location || ''} </Text>

          </View>
        )}

        <PricingSection />

        {/* Payment Methods */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Select payment method</Text>
          <Text style={styles.sectionTitle}>Recommended</Text>
          {paymentMethods1.map((item) =>
            renderPaymentOption1(
              item,
              selectedPayment === item.id,
              () => handlePaymentSelection(item.id)
            )
          )}
        </View> */}

        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>UPI</Text>

          {paymentMethods.map((item) =>
            renderPaymentOption(
              item,
              selectedPayment === item.id,
              () => handlePaymentSelection(item.id)
            )
          )}
        </View> */}


        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Credit/Debit Card</Text>
          {creditDebitOptions.map((item) =>
            renderCreditOption(
              item,
              selectedPayment === item.id,
              () => handlePaymentSelection(item.id)
            )
          )}
        </View> */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More ways to pay</Text>
          {moreWaysToPay.map((item) =>
            renderPaymentOption(
              item,
              selectedPayment === item.id,
              () => handlePaymentSelection(item.id)
            )
          )}
        </View>

        {/* Promo Code */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add gift card or Promo code</Text>
          <View style={styles.promoCodeContainer}>
            <TextInput
              style={styles.promoCodeInput}
              placeholder="Enter promo code"
              value={promoCode}
              onChangeText={setPromoCode}
            />
          </View>

          <TouchableOpacity style={styles.applyButton} onPress={handleApplyPromo}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <LinearGradient
            style={styles.buyNowButton}
            colors={[Colors.secondaryColor, Colors.secondaryColor, Colors.primaryColor]}
          >
            {/* handlePaymentWithOrder(productData?.order_id) */}
            {/* OnPayment() */}

            <TouchableOpacity disabled={btnLoader} onPress={() => (UserAddress ? OnPayment() : props.navigation.navigate('AddAddress'))}>

              <Text style={styles.buyNowText}>
                {/* {btnLoader ? 'Processing...' : 'Pay Now'} */}

                {btnLoader
                  ? 'Processing...'
                  : (selectedPayment === 'cash_on_delivery' || selectedPayment === 'cod')
                    ? 'Proceed'
                    : 'Pay Now'
                }
              </Text>

            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Card Modal */}
      <CardModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 16,
  },
  backArrow: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  deliveryInfo: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBlock: 10,
  },
  deliveryAddressContainer: {
    marginTop: 10,
    marginBlock: 10,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row'
  },
  AddressContainer: {
    borderRadius: 10,
    padding: 5,
    borderWidth: 1,
    marginLeft: 10
  },
  deliveryTitle: {
    fontSize: 16,
    fontFamily: Fonts.PoppinsSemiBold,
    color: '#333',
    marginBottom: 4,
  },

  deliveryContainer: { marginBottom: 10 },
  // deliveryTitle: { fontSize: 16, fontFamily: Fonts.PoppinsMedium, color: '#333333' },
  deliveryLocation: { fontSize: 14, color: '#2369FF', marginTop: 2, fontFamily: Fonts.PoppinsMedium },
  deliveryAddress: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    width: '80%',
    textAlign: 'left',
    fontFamily: Fonts.PoppinsMedium,
    marginBottom: 8,
  },
  changeAddress: {
    fontSize: 14,
    fontFamily: Fonts.PoppinsSemiBold,
    color: Colors.primaryColor,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16, color: Colors.textColor, fontFamily: Fonts.PoppinsSemiBold,
    marginBottom: 12,
  },

  sectionSubtitle: {
    fontSize: 18,
    color: '#000',
    fontFamily: Fonts.PoppinsSemiBold,
    marginBottom: 12,
  },

  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedPaymentOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#F8FFF8',
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCC',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  paymentInfo: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E1E1E',
    marginLeft: 10
  },
  paymentName1: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.secondaryColor,
    marginLeft: 10
  },
  paymentNumber: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  paymentIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // UPI Container Styles
  upiContainer: {
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  promoCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  promoCodeInput: {
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 15,
    flex: 1,
  },
  applyButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    marginTop: 10,
  },
  applyButtonText: {
    color: '#1E1E1E',
    fontSize: 16,
    padding: 5,
    textAlign: 'center',
    fontFamily: Fonts.PoppinsSemiBold
  },
  bottomActions: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  buyNowButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyNowText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: width * 0.9,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputGroupHalf: {
    flex: 0.48,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  cancelButton: {
    flex: 0.45,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 0.45,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  container1: {
    backgroundColor: 'white',
    // padding: 20,
    flex: 1,
    marginHorizontal: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    margin: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.PoppinsSemiBold,
    color: Colors.textColor,
    marginBottom: 16,
    marginTop: 10,
  },
  contentContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalRow: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 12,
  },
  orderTotalRow: {
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: Colors.greyBorder,
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.textColor, fontFamily: Fonts.PoppinsMedium
  },
  price: {
    fontSize: 14, color: Colors.black, fontFamily: Fonts.PoppinsMedium

  },
  promotionPrice: {
    fontSize: 14, color: Colors.secondaryColor, fontFamily: Fonts.PoppinsSemiBold
  },
  orderTotalLabel: {
    fontSize: 16, color: Colors.textColor, fontFamily: Fonts.PoppinsMedium
  },
  orderTotalPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
});

export default PaymentMethods;