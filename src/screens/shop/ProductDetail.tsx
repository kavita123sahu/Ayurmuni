import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ProductScroll from '../../component/ProductScroll'
import ProductCard from '../../component/ProductCard';
import { Colors } from '../../common/Colors';
import LinearGradient from 'react-native-linear-gradient';
import HeaderSearch from '../../component/HeaderSearch';
import { useIsFocused } from '@react-navigation/native';
import RatingCard from '../../component/RatingCard';
import *as _HOME_SERVICE from '../../services/HomeServices';
import { AntDesign, MaterialIcons } from '../../common/Vector';
import { renderStars } from '../../common/datafile';
import { getExpectedDeliveryDate, showSuccessToast } from '../../config/Key';
import { Utils } from '../../common/Utils';
import *as _CART_SERVICE from '../../services/CartService';
import { Fonts } from '../../common/Fonts';
import CustomStarRating from '../../component/CustomStarRating';
import { useDispatch } from 'react-redux';
import { isAddedToCart } from '../../reduxfile/action/CartActions';
const { width } = Dimensions.get('window');



const ProductDetail = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [ProductDetail, setProductDetail] = useState([]);
  const isFocused = useIsFocused()
  const [btnLoader, setBtnLoader] = useState(false);
  const [customerID, setcustomerID] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [EstimateData, setEstimateData] = useState<any>();
  const [ESTDate, setESTDate] = useState('');
  const { PropsData } = props.route.params;

  useEffect(() => {
    console.log("PropsData in ProductDetail ===>", PropsData)
    getUser()
    getProductSimilar();
    getESTDate(PropsData?.id);
  }, [isFocused]);



  const getUser = async () => {

    const _USER_INFO = await Utils.getData('_USER_INFO');
    const CUSTOMER_ID = await Utils.getData('_CUSTOMER_ID');
    console.log("USER INFO ===>", _USER_INFO?.id, CUSTOMER_ID);
    setcustomerID(_USER_INFO?.id || CUSTOMER_ID);

  }


  const getProductSimilar = async () => {
    // setIsLoading(true);
    try {

      let serverResponse: any = await _HOME_SERVICE.getProductSimilar(PropsData?.brand, PropsData?.form, PropsData?.treatment, PropsData?.category?.name);
      let response = await serverResponse.json();
      console.log('productsimilarrr=====>', response);
      // if (serverResponse.status == 200) {
      //   setProductDetail(response);
      //   // setIsLoading(false);
      // }

      // else {
      //   console.log("Error in fetching product similar data", response);
      //   // setIsLoading(false);
      // }
    } catch (error) {
      console.log("PRODUCT DATA ERROR:", error);
    }
  }

  const getESTDate = async (vendor_pro_id: any) => {
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

  const addToCart = async (buyNow?: string) => {
    console.log("buyNowbuyNowbuyNow", buyNow);

    try {

      if (buyNow === 'BUY_NOW') {
        console.log("Buy Now Clicked");
        props.navigation.navigate('PaymentMethods', { productData: PropsData, buyNow: true })
        setBtnLoader(false)
        return;

      } else {
        setBtnLoader(true);
      }

      const token = await Utils.getData('_TOKEN');
      console.log("token===>", token);

      if (token) {

        setIsLoggedIn(true);

        const dataToSend = {
          vendorproduct_id: PropsData?.id,
          quantity: selectedQuantity.toString(),
          variant: PropsData?.variant_details?.id,
          customer: customerID.toString(),
          price: PropsData?.selling_price ?? '0',
          discounted_price: PropsData?.discount_amount ?? '0',
        }

        console.log("dataToSend===>", dataToSend);

        let result: any = await _CART_SERVICE.add_cart_item(dataToSend);

        const response = await result.json();

        if (result.ok === true) {
          dispatch(isAddedToCart(true));
          setBtnLoader(false);
          showSuccessToast('Product Added to cart Successfully🎉', 'success');
          props.navigation.navigate('CartScreen', { ProductSimilar: ProductDetail });
          setBtnLoader(false);
        }
        // }

        else {
          console.log("Error in adding product to cart", response.error);
          showSuccessToast(response.error, 'error')
          setBtnLoader(false);
        }
      }

      else {
        console.log("User is not logged in", token);
        setIsLoggedIn(false);
        setBtnLoader(false);
      }

    } catch (error) {
      console.log((error));
    }
  }






  const CapsuleQuantityDropdown = () => {
    return (
      <>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsOpen(!isOpen)}
          activeOpacity={0.8}
        >
          <Text style={styles.dropdownText}>
            Capsule Quantities: {PropsData?.variant?.weight ?? ''}
          </Text>
          {/* {isOpen ? <MaterialIcons name='keyboard-arrow-up' style={{ height: 10, width: 10 }} /> : <MaterialIcons name='keyboard-arrow-down' style={{ height: 10, width: 10 }} />} */}
        </TouchableOpacity>

      </>
    )
  }

  const DetailSection = () => {

    return (
      <View>
        <Text style={styles.productName}>{PropsData.title} {PropsData?.treatment}  {PropsData?.short_description}</Text>

        <CapsuleQuantityDropdown />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignContent: 'center' }}>
          <View style={styles.ratingContainer}>
            {/* <View style={styles.starsContainer}>
              {renderStars(PropsData.rating)}
            </View> */}
            <CustomStarRating
              rating={PropsData?.average_rating}
              maxRating={5}
              starSize={15}
            />
            <Text style={styles.reviewCount}> ({PropsData?.total_reviews ?? ''}) </Text>

          </View>

          <TouchableOpacity>
            <Image source={require('../../assets/images/Assurance.png')} style={{ height: 27, width: 105 }} />
          </TouchableOpacity>

        </View>

        <View style={styles.mrpcontainer}>
          <Text style={styles.MRPtext}>MRP:</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>₹{PropsData.selling_price}</Text>
            <Text style={styles.originalPrice}>₹{PropsData?.variant_details?.mrp ?? ''}</Text>

            {PropsData?.discount_percentage != null &&
              <View style={styles.discountBadge}>
                <Text style={styles.discount}>{PropsData.discount_percentage}% off</Text>
              </View>
            }

          </View>

          <Image source={require('../../assets/images/Line.png')} style={{ width: '100%', tintColor: '#999999', paddingHorizontal: 10 }} />
        </View>
      </View>
    )
  }

  const QuantitySection = () => {
    // Disable conditions
    const isDecreaseDisabled = selectedQuantity <= 1; // 1 se kam nahi ho sakti
    const isIncreaseDisabled = selectedQuantity >= PropsData?.stock || PropsData?.stock <= 0; // Stock limit ya out of stock

    return (
      <View>
        <Text style={[
          styles.StockText,
          { color: PropsData?.stock > 0 ? Colors.primaryColor : Colors.errorColor }
        ]}>

          {PropsData?.stock > 0 ? `In Stock (${PropsData?.stock} available)` : 'Out of Stock'}

        </Text>

        <View style={styles.quantityControlSection}>
          <Text style={styles.quantityLabel}>Quantity: </Text>
          <View style={styles.quantityControls}>

            {/* Decrease Button */}
            <TouchableOpacity
              style={[
                styles.quantityButton,
                isDecreaseDisabled && styles.disabledButton
              ]}
              onPress={() => {
                if (!isDecreaseDisabled) {
                  setSelectedQuantity(Math.max(1, selectedQuantity - 1));
                }
              }}
              disabled={isDecreaseDisabled}
            >
              <AntDesign
                name='minus'
                size={20}
                color={isDecreaseDisabled ? Colors.greyBorder : 'black'}
                style={{ fontFamily: Fonts.PoppinsMedium }}
              />
            </TouchableOpacity>

            <Text style={styles.quantityValue}>{selectedQuantity}</Text>

            <TouchableOpacity
              style={[
                styles.quantityButton,
                isIncreaseDisabled && styles.disabledButton
              ]}
              onPress={() => {
                if (!isIncreaseDisabled) {
                  if (selectedQuantity >= PropsData?.stock) {
                    showSuccessToast(`Only ${PropsData?.stock} items available in stock`, 'error');
                    return;
                  }
                  setSelectedQuantity(selectedQuantity + 1);
                }
              }}
              disabled={isIncreaseDisabled}
            >
              <AntDesign
                name='plus'
                size={20}
                color={isIncreaseDisabled ? Colors.greyBorder : 'black'}
                style={{ fontFamily: Fonts.PoppinsMedium }}
              />
            </TouchableOpacity>
          </View>

          {/* Helper Text */}
          {/* {PropsData?.stock > 0 && selectedQuantity >= PropsData?.stock && (
          <Text style={styles.StockText}>
            Maximum {PropsData?.stock} items can be added
          </Text>
        )} */}
        </View>
      </View>
    );
  };

  const ProductInfoSection = () => {
    return (
      <View>
        <View style={styles.productInfo}>
          <Text style={styles.quantityText}>Quantities: {PropsData?.variant?.weight ?? ''}</Text>
          <Text style={styles.categoryText}>Form : {PropsData.form}</Text>
          <Text style={styles.categoryText}>Category :{PropsData?.category?.name} </Text>
          <Text style={styles.categoryText}>{PropsData.manufacturer} </Text>
          <Text style={styles.categoryText}>Brand : {PropsData.brand}</Text>
          <Text style={styles.categoryText}>Treatment : {PropsData.treatment}</Text>
        </View>

        <View style={{ marginBottom: 10 }}>
          <Image source={require('../../assets/images/Line.png')} style={{ width: '100%', tintColor: '#999999', paddingHorizontal: 10 }} />
        </View>


        <View style={styles.deliveryContainer}>
          {EstimateData &&
            <>
              <Text style={styles.deliveryTitle}>Delivery: {ESTDate || ''}</Text>
              <Text style={styles.deliveryLocation}>Deliver to  {EstimateData.vendor + ' - ' || ''} {EstimateData.location || ''} </Text>

            </>}

        </View>
      </View>
    )
  }


  const ActionSection = () => {
    return (

      <View style={styles.buttonContainer}>

        {
          !isLoggedIn && (
            <View>
              <Text >You are not logged in, Please log in or Register New Account</Text>
              <Text style={{ fontSize: 14, fontFamily: Fonts.PoppinsMedium, textAlign: 'center' }}>Please Register Here</Text>
            </View>
          )
        }

        <LinearGradient style={styles.buyNowButton} colors={[Colors.secondaryColor, Colors.primaryColor]} >
          {/* <TouchableOpacity onPress={() => AddBuyNow()} > */}
          <TouchableOpacity onPress={() => addToCart('BUY_NOW')} >
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>
        </LinearGradient>

        {
          btnLoader ?
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, }}>
              <ActivityIndicator size={'small'} color={Colors.primaryColor} />
            </View>
            :
            // <TouchableOpacity style={styles.addToCartButton} onPress={() => props.navigation.navigate('CartScreen')}>
            <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart("")}>
              <Text style={styles.addToCartText}>Add to cart</Text>
            </TouchableOpacity>
        }

      </View>
    )
  }

  const ConfidenceSection = () => {
    return (
      <View style={styles.trustContainer}>
        <Text style={styles.trustTitle}>Shop with Confidence:</Text>
        <View style={styles.trustRow}>
          {PropsData?.is_top_brand &&
            <View style={styles.trustItem}>
              <Image source={require('../../assets/images/brand.png')} style={styles.iconStyle} />
              <Text style={styles.trustText}>Top brand</Text>
            </View>
          }

          {!PropsData?.is_non_returnable &&
            <View style={styles.trustItem}>
              <Image source={require('../../assets/images/returnable.png')} style={styles.iconStyle} />
              <Text style={styles.trustText}>Non-Returnable</Text>
            </View>
          }

        </View>

        <View style={styles.trustRow}>
          {PropsData?.pay_on_delivery &&
            <View style={styles.trustItem}>
              <Image source={require('../../assets/images/delivery.png')} style={styles.iconStyle} />
              <Text style={styles.trustText}>Pay on delivery</Text>
            </View>
          }

          {PropsData?.is_secure_transaction &&
            <View style={styles.trustItem}>
              <Image source={require('../../assets/images/transection.png')} style={styles.iconStyle} />
              <Text style={styles.trustText}>Secure Transection</Text>
            </View>
          }

        </View>

      </View>
    )
  }

  const ProductDetails = () => {
    return (
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Product Detail:</Text>
        <View style={styles.detailsList}>

          <View style={styles.detailRow}>
            <View style={styles.dotIcon} />
            <Text style={styles.detailText}>Manufacturer: {PropsData?.manufacturer ?? ''}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.dotIcon} />
            <Text style={styles.detailText}>Origin: {PropsData?.origin ?? ''}</Text>
          </View>


          <View style={styles.detailRow}>
            <View style={styles.dotIcon} />
            <Text style={styles.detailText}>Item Model Number : {PropsData?.model_number ?? ''}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.dotIcon} />
            <Text style={styles.detailText}>SIN: {PropsData?.sin_number ?? ''}</Text>
          </View>


        </View>

        <View style={styles.brandSection}>
          <Text style={styles.subsectionTitle}>About Brand:</Text>
          <View style={styles.brandRow}>
            <Text style={styles.brandName}>{PropsData?.brand ?? ''}</Text>
            <TouchableOpacity>
              <Image source={require('../../assets/images/Assurance.png')} style={{ height: 27, width: 105 }} />
            </TouchableOpacity>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.featureRow}>
              <Image source={require('../../assets/images/Vectorright.png')} style={{ height: 20, width: 20 }} />
              <Text style={styles.featureText}>90% Positive Rating from over 15k customers</Text>
            </View>
            <View style={styles.featureRow}>
              <Image source={require('../../assets/images/Vectorright.png')} style={{ height: 20, width: 20 }} />
              <Text style={styles.featureText}>15k+ recent order from this brand</Text>
            </View>
            <View style={styles.featureRow}>
              <Image source={require('../../assets/images/Vectorright.png')} style={{ height: 20, width: 20 }} />
              <Text style={styles.featureText}>10+ years in ayurveda</Text>
            </View>
          </View>

        </View>

      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>

      <LinearGradient
        colors={['#466425', '#71A33F']}
        style={styles.header}>
        <HeaderSearch title='Product Detail' navigation={props.navigation} />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>

        <ProductScroll Productdata={PropsData?.gallery_images} />

        <View style={styles.detailsContainer}>

          <DetailSection />
          <ProductInfoSection />
          <QuantitySection />
          {PropsData?.stock > 0 && (
            <ActionSection />
          )}

          <ConfidenceSection />

          <ProductCard title='You might also like:' navigation={props.navigation} PropsData={PropsData} />

          <ProductDetails />

          <RatingCard title='Customer Reviews:' />

        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#71A33F', paddingHorizontal: 15, paddingTop: 10, paddingBottom: 10 },
  imageContainer: { backgroundColor: '#ffffff', alignItems: 'center', paddingVertical: 20, position: 'relative' },
  productImage: { width: width * 0.8, height: 300, resizeMode: 'contain' },
  imageNavigation: { position: 'absolute', top: '50%', width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  navButton: { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 15, width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
  navButtonText: { color: '#ffffff', fontSize: 18, fontFamily: Fonts.PoppinsSemiBold },
  detailsContainer: { marginTop: 10, paddingHorizontal: 15, paddingVertical: 20 },
  productName: { fontSize: 16, fontFamily: Fonts.PoppinsMedium, color: '#333333', lineHeight: 22, marginBottom: 12 },
  dropdownButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, minHeight: 48 },
  dropdownText: { fontSize: 16, color: '#333', fontFamily: Fonts.PoppinsMedium },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  dropdownContainer: { backgroundColor: 'white', borderRadius: 8, marginHorizontal: 20, maxHeight: 250, minWidth: width * 0.7, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  optionsList: { maxHeight: 250 },
  optionItem: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  selectedOption: { backgroundColor: '#e8f5e8' },
  optionText: { fontSize: 16, color: '#333' },
  selectedOptionText: { color: '#2d5a2d', fontFamily: Fonts.PoppinsMedium },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  starsContainer: { flexDirection: 'row', marginRight: 8 },
  star: { color: '#FFC107', fontSize: 16 },
  reviewCount: { color: '#000', fontSize: 14, fontFamily: Fonts.PoppinsMedium },
  MRPtext: { color: '#999999', fontSize: 14, fontFamily: Fonts.PoppinsMedium },
  priceContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  currentPrice: { fontSize: 24, fontFamily: Fonts.PoppinsSemiBold, color: Colors.black, marginRight: 8 },
  originalPrice: { fontSize: 16, color: '#999999', textDecorationLine: 'line-through', marginRight: 8 },
  discountBadge: { paddingHorizontal: 6, paddingVertical: 2, borderStyle: 'dashed', borderColor: '#7B0000', borderWidth: 0.4, borderRadius: 4, gap: 2 },
  discount: { fontSize: 16, color: '#7B0000', fontFamily: Fonts.PoppinsMedium },
  mrpcontainer: { marginBottom: 10 },
  deliveryContainer: { marginBottom: 10 },
  deliveryTitle: { fontSize: 16, fontFamily: Fonts.PoppinsMedium, color: '#333333' },
  deliveryLocation: { fontSize: 14, color: '#2369FF', marginTop: 2, fontFamily: Fonts.PoppinsMedium },
  productInfo: { marginBottom: 10 },
  quantityText: { fontSize: 16, color: '#666666', marginBottom: 4, fontFamily: Fonts.PoppinsMedium },
  categoryText: { fontSize: 16, color: '#666666', marginBottom: 4, fontFamily: Fonts.PoppinsMedium },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  quantitySelector: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#dddddd', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8, marginLeft: 8 },
  quantityValue: { fontSize: 14, color: '#333333', padding: 10, fontFamily: Fonts.PoppinsMedium },
  disabledButton: {
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    opacity: 0.5,
  },
  dropdown: { fontSize: 10, color: '#666666' },
  buttonContainer: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  buyNowButton: { flex: 1, backgroundColor: Colors.secondaryColor, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  buyNowText: { color: '#ffffff', fontSize: 16, fontFamily: Fonts.PoppinsMedium },
  addToCartButton: { flex: 1, backgroundColor: '#ffffff', paddingVertical: 14, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#1E1E1E40' },
  StockText: { color: Colors.primaryColor, fontSize: 16, fontFamily: Fonts.PoppinsMedium },
  addToCartText: { color: '#333', fontSize: 16, fontFamily: Fonts.PoppinsMedium },
  quantityControlSection: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between', marginBottom: 20 },
  quantityLabel: { fontSize: 16, color: '#333', marginRight: 16, fontFamily: Fonts.PoppinsMedium },
  quantityControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, width: '70%', borderColor: '#e0e0e0', borderRadius: 8 },
  quantityButton: { width: 80, height: 40, borderRadius: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  quantityButtonText: { fontSize: 18, color: '#333', width: 50, },
  trustContainer: { marginBottom: 20 },
  trustTitle: { fontSize: 16, fontFamily: Fonts.PoppinsMedium, color: '#333333', marginBottom: 8 },
  trustRow: { flexDirection: 'row', marginTop: 5, justifyContent: 'space-between' },
  trustItem: { alignItems: 'center', flex: 1, margin: 5, flexDirection: 'row' },
  trustIcon: { fontSize: 16, marginBottom: 4 },
  iconStyle: { height: 20, width: 20 },
  trustText: { fontSize: 16, marginLeft: 5, color: '#666666', textAlign: 'center', fontFamily: Fonts.PoppinsRegular },
  relatedContainer: { marginTop: 10 },
  relatedTitle: { fontSize: 16, fontFamily: Fonts.PoppinsMedium, color: '#333333', marginBottom: 12 },
  relatedProduct: { width: 120, marginRight: 12, backgroundColor: '#ffffff', borderRadius: 8, padding: 8, borderWidth: 1, borderColor: '#f0f0f0' },
  relatedProductImage: { width: '100%', height: 80, resizeMode: 'contain', marginBottom: 8 },
  relatedProductName: { fontSize: 10, color: '#333333', marginBottom: 4, lineHeight: 12 },
  relatedProductCategory: { fontSize: 8, color: '#666666', marginBottom: 4 },
  relatedPriceContainer: { flexDirection: 'row', alignItems: 'center' },
  relatedCurrentPrice: { fontSize: 12, fontFamily: Fonts.PoppinsSemiBold, color: '#4CAF50', marginRight: 4 },
  relatedOriginalPrice: { fontSize: 10, color: '#999999', textDecorationLine: 'line-through' },
  detailsCard: { borderRadius: 12, padding: 16, paddingHorizontal: 15, marginBottom: 16, shadowRadius: 4 },
  sectionTitle: { fontSize: 18, fontFamily: Fonts.PoppinsMedium, color: '#1F2937', marginBottom: 16 },
  detailsList: { marginBottom: 20, justifyContent: 'center', textAlignVertical: 'center' },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dotIcon: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#6B7280', marginRight: 12, marginTop: 2 },
  detailText: { fontSize: 16, color: '#1E1E1EBF', flex: 1, textAlign: 'left', fontFamily: Fonts.PoppinsRegular },
  brandSection: { borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 16 },
  subsectionTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  brandName: { fontSize: 16, color: '#1F2937', fontFamily: Fonts.PoppinsMedium, marginRight: 8 },
  assuranceText: { fontSize: 14, color: '#EA580C' },
  featuresContainer: { flex: 1, marginTop: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  checkIcon: { fontSize: 16, color: '#10B981', marginRight: 8, fontFamily: Fonts.PoppinsSemiBold },
  featureText: { fontSize: 14, color: '#374151', marginLeft: 5, flex: 1, fontFamily: Fonts.PoppinsRegular },
  reviewsCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 16, shadowRadius: 4 },
  ratingOverview: { flexDirection: 'row', marginBottom: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  ratingScore: { alignItems: 'center', marginRight: 32 },
  scoreNumber: { fontSize: 36, fontFamily: Fonts.PoppinsSemiBold, color: '#1F2937', marginBottom: 8 },
  ratingBars: { flex: 1 },
  ratingBarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  ratingNumber: { fontSize: 14, color: '#6B7280', width: 16, marginRight: 12 },
  progressBarContainer: { flex: 1, marginRight: 12 },
  progressBarBg: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4 },
  progressBarFill: { height: 8, backgroundColor: '#FBBF24', borderRadius: 4 },
  ratingCount: { fontSize: 12, color: '#6B7280' },
  rateSection: { marginBottom: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  rateRow: { flexDirection: 'row', alignItems: 'center' },
  userAvatar: { borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 18 },
  ratingStar: { height: 20, width: 20, color: '#D1D5DB', marginRight: 4 },
  topReviewsSection: { marginBottom: 24 },
  reviewItem: { marginBottom: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  reviewHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  reviewerAvatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  reviewerInitials: { fontSize: 14, fontFamily: Fonts.PoppinsMedium },
  reviewContent: { flex: 1 },
  reviewerInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' },
  reviewerName: { fontSize: 14, fontFamily: Fonts.PoppinsMedium, color: '#1F2937', marginRight: 8 },
  verifiedBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginLeft: 8 },
  verifiedText: { fontSize: 11, color: '#166534' },
  reviewTitle: { fontSize: 16, fontFamily: Fonts.PoppinsMedium, color: '#1F2937', marginBottom: 8 },
  reviewDate: { fontSize: 12, color: '#6B7280', marginBottom: 8 },
  reviewText: { fontSize: 14, color: '#374151', lineHeight: 20, marginBottom: 12 },
  reviewActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  helpfulButton: { marginRight: 16, borderRadius: 8, borderWidth: 1 },
  helpfulText: { fontSize: 14, color: '#6B7280', padding: 5 },
  reportText: { fontSize: 14, fontFamily: Fonts.PoppinsMedium, color: '#EF4444' },
  viewMoreContainer: { alignItems: 'center' },
  viewMoreButton: { backgroundColor: '#2563EB', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  viewMoreText: { color: '#FFFFFF', fontSize: 16, fontFamily: Fonts.PoppinsMedium }
});

export default ProductDetail;