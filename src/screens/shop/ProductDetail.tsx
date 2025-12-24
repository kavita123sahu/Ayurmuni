import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, } from 'react-native';
import ProductScroll from '../../component/ProductScroll'
import ProductCard from '../../component/ProductCard';
import { Colors } from '../../common/Colors';
import LinearGradient from 'react-native-linear-gradient';
import HeaderSearch from '../../component/HeaderSearch';
import { useIsFocused } from '@react-navigation/native';
import RatingCard from '../../component/RatingCard';
import *as _HOME_SERVICE from '../../services/HomeServices';
import { AntDesign } from '../../common/Vector';
import { getExpectedDeliveryDate, showSuccessToast } from '../../config/Key';
import { Utils } from '../../common/Utils';
import *as _CART_SERVICE from '../../services/CartService';
import { Fonts } from '../../common/Fonts';
import CustomStarRating from '../../component/CustomStarRating';
import { useDispatch } from 'react-redux';
import { isAddedToCart } from '../../reduxfile/action/CartActions';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width } = Dimensions.get('window');



const ProductDetail = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [ProductDetail, setProductDetail] = useState([]);
  const isFocused = useIsFocused()
  const [btnLoader, setBtnLoader] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [customerID, setcustomerID] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [EstimateData, setEstimateData] = useState<any>();
  const [ESTDate, setESTDate] = useState('');
  const { PropsData } = props.route.params;

  

  useEffect(() => {
  if (!isFocused) return;

  initScreen();
}, [isFocused]);


const initScreen = async () => {
  try {
    setIsLoading(true);

    await Promise.all([
      fetchUser(),
      fetchProductSimilar(),
      fetchESTDate(PropsData?.id),
    ]);
  } catch (err) {
    console.log('INIT SCREEN ERROR:', err);
  } finally {
    setIsLoading(false);
  }
};


const fetchUser = async () => {
  try {
    const [_USER_INFO, CUSTOMER_ID] = await Promise.all([
      Utils.getData('_USER_INFO'),
      Utils.getData('_CUSTOMER_ID'),
    ]);

    setcustomerID(_USER_INFO?.id ?? CUSTOMER_ID ?? null);
  } catch (error) {
    console.log('USER FETCH ERROR:', error);
  }
};




const fetchProductSimilar = async () => {
  if (!PropsData) return;

  try {
    const serverResponse: any =
      await _HOME_SERVICE.getProductSimilar(
        PropsData?.brand,
        PropsData?.form,
        PropsData?.treatment,
        PropsData?.category?.name
      );

    const response = await serverResponse.json();

    if (serverResponse.status === 200) {
      setProductDetail(response);
    } else {
      console.log('PRODUCT SIMILAR ERROR:', response);
    }
  } catch (error) {
    console.log('PRODUCT SIMILAR API ERROR:', error);
  }
};

 


const fetchESTDate = async (vendorProId?: any) => {
  if (!vendorProId) return;

  try {
    const serverResponse: any =
      await _HOME_SERVICE.get_EST_date(vendorProId);

    const response = await serverResponse.json();

    if (serverResponse.status === 200) {
      setEstimateData(response);

      const date = getExpectedDeliveryDate(
        response?.delivery_date_range ?? ''
      );
      setESTDate(date);
    } else {
      console.log('EST DATE ERROR:', response);
    }
  } catch (error) {
    console.log('EST DATE API ERROR:', error);
  }
};





  
  const addToCart = async (buyNow?: string) => {
    try {

      if (buyNow === 'BUY_NOW') {
        props.navigation.navigate('PaymentMethods', { productData: PropsData, buyNow: true })
        setBtnLoader(false)
        return;

      } else {
        setBtnLoader(true);
      }

      const token = await Utils.getData('_TOKEN');

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

    const isDecreaseDisabled = selectedQuantity <= 1;
    const isIncreaseDisabled = selectedQuantity >= PropsData?.stock || PropsData?.stock <= 0;

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
  detailsContainer: { marginTop: 10, paddingHorizontal: 15, paddingVertical: 20 },
  productName: { fontSize: 16, fontFamily: Fonts.PoppinsMedium, color: '#333333', lineHeight: 22, marginBottom: 12 },
  dropdownButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, minHeight: 48 },
  dropdownText: { fontSize: 16, color: '#333', fontFamily: Fonts.PoppinsMedium },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
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
  quantityValue: { fontSize: 14, color: '#333333', padding: 10, fontFamily: Fonts.PoppinsMedium },
  disabledButton: {
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    opacity: 0.5,
  },
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
  trustContainer: { marginBottom: 20 },
  trustTitle: { fontSize: 16, fontFamily: Fonts.PoppinsMedium, color: '#333333', marginBottom: 8 },
  trustRow: { flexDirection: 'row', marginTop: 5, justifyContent: 'space-between' },
  trustItem: { alignItems: 'center', flex: 1, margin: 5, flexDirection: 'row' },
  iconStyle: { height: 20, width: 20 },
  trustText: { fontSize: 16, marginLeft: 5, color: '#666666', textAlign: 'center', fontFamily: Fonts.PoppinsRegular },
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
  featuresContainer: { flex: 1, marginTop: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  featureText: { fontSize: 14, color: '#374151', marginLeft: 5, flex: 1, fontFamily: Fonts.PoppinsRegular },

});

export default ProductDetail;