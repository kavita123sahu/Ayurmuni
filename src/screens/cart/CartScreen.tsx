import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, StatusBar, Dimensions, ActivityIndicator } from 'react-native';
import Header from '../../component/Header';
import { Colors } from '../../common/Colors';
import { Fonts } from '../../common/Fonts';
import LinearGradient from 'react-native-linear-gradient';
import *as _CART_SERVICE from '../../services/CartService';
import { useIsFocused } from '@react-navigation/native';
import ProductCard from '../../component/ProductCard';
import CustomStarRating from '../../component/CustomStarRating';
import { Utils } from '../../common/Utils';
import LottieView from 'lottie-react-native';
import { showSuccessToast } from '../../config/Key';
import * as _HOME_SERVICE from '../../services/HomeServices';
import { Entypo, Feather, FontAwesome5, Fontisto } from '../../common/Vector';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { SafeAreaView } from 'react-native-safe-area-context';


interface VendorProduct {
    title: string;
    selling_price: number;
    total_reviews: number;
    average_rating: number;
    category: {
        name: string;
    };
    variant_details: {
        mrp: number;
    };
    stock: number;
}

interface CartItem {
    id: string;
    quantity: number;
    vendorproduct: VendorProduct;
}


interface DoctorBooking {
    id: string;
    doctorName: string;
    specialization: string;
    hospitalName: string;
    appointmentDate: string;
    appointmentTime: string;
    consultationType: 'video' | 'in-person';
    location?: string;
    consultationFee: number;
    doctorImage?: string;
    status: 'pending' | 'confirmed' | 'completed';
    discount?: string;
}


const CartScreen = (props: any) => {
    const isFocused = useIsFocused();
    const [loader, setLoader] = useState(false);
    const [cartDetails, setCartDetails] = useState<any>({});
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [doctorBookings, setDoctorBookings] = useState<DoctorBooking[]>([]);
    const [activeTab, setActiveTab] = useState<'orders' | 'bookings'>('orders');
    const { ProductSimilar } = props.route.params || {};


    useEffect(() => {
        if (!isFocused) return;

        fetchInitialData();
    }, [isFocused]);

    const fetchInitialData = async () => {
        await Promise.all([
            getUserDetail(),
            getBookingsList(),
        ]);
    };






    const getBookingsList = async () => {
        try {

            const sampleBookings: DoctorBooking[] = [
                {
                    id: '1',
                    doctorName: "Dr. Rajesh Kumar",
                    specialization: "Cardiologist",
                    hospitalName: "Apollo Hospital",
                    appointmentDate: "Dec 15, 2024",
                    appointmentTime: "10:30 AM",
                    consultationType: "video",
                    consultationFee: 500,
                    status: 'confirmed',
                    discount: '50'
                },
                {
                    id: '2',
                    doctorName: "Dr. Priya Sharma",
                    specialization: "Dermatologist",
                    hospitalName: "Max Hospital",
                    appointmentDate: "Dec 18, 2024",
                    appointmentTime: "2:00 PM",
                    consultationType: "in-person",
                    location: "Saket, Delhi",
                    consultationFee: 800,
                    status: 'pending',
                    discount: '0'
                }
            ];

            setDoctorBookings(sampleBookings);
        } catch (error) {
            console.log("Fetch bookings error:", error);
        }
    };



    const updateCartItemQuantity = (id: string, newQuantity: number) => {
        console.log(id, newQuantity, "updatedddddd")
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
        const updatedItems = cartItems.map((item: any) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        );

        const newTotalPrice = updatedItems.reduce((sum: number, item: any) => sum + (item.vendorproduct?.selling_price * item.quantity), 0);


    };

    const decreaseQuantity = async (id: string, currentQuantity: number) => {
        if (currentQuantity > 1) {
            const newQuantity = currentQuantity - 1;

            updateCartItemQuantity(id, newQuantity);

            try {
                const dataToSend = { quantity: newQuantity };
                const result: any = await _CART_SERVICE.update_cart_item_quantity(id, dataToSend);

                if (result.status === 200) {
                    const userInfo = await Utils.getData('_USER_INFO');
                    const customerId = await Utils.getData('_CUSTOMER_ID');
                    await getCartLists(userInfo?.id || customerId);
                } else {

                    updateCartItemQuantity(id, currentQuantity);
                    showSuccessToast(result?.message || 'Failed to update quantity', 'error')
                }
            } catch (error) {
                console.log("UPDATE CART ERROR:", error);
                updateCartItemQuantity(id, currentQuantity);
                showSuccessToast('Network error occurred', 'error')
            }
        }
    };




    const increaseQuantity = async (id: string, currentQuantity: number, maxStock: number) => {

        if (currentQuantity < maxStock) {
            const newQuantity = currentQuantity + 1;

            updateCartItemQuantity(id, newQuantity);

            try {
                const dataToSend = { quantity: newQuantity };
                const result: any = await _CART_SERVICE.update_cart_item_quantity(id, dataToSend);

                if (result.status === 200) {
                    const userInfo = await Utils.getData('_USER_INFO');
                    const customerId = await Utils.getData('_CUSTOMER_ID');
                    await getCartLists(userInfo?.id || customerId);
                } else {
                    updateCartItemQuantity(id, currentQuantity);
                    showSuccessToast(result?.message || 'Failed to update quantity', 'error')
                }
            } catch (error) {
                console.log("UPDATE CART ERROR:", error);
                updateCartItemQuantity(id, currentQuantity);
                showSuccessToast('Network error occurred', 'error')
            }
        }
    };


    const getUserDetail = async () => {

        try {
            const _USER_INFO = await Utils.getData('_USER_INFO');
            const CUSTOMER_ID = await Utils.getData('_CUSTOMER_ID');

            console.log('_USER_INFO', _USER_INFO, 'CUSTOMER_ID', CUSTOMER_ID);
            getCartLists(_USER_INFO?.id || CUSTOMER_ID)

        } catch (error) {
            console.log(error);
        }
    }

    const rescheduleAppointment = (bookingId: string) => {
        // Navigate to reschedule screen
        // props.navigation.navigate('RescheduleAppointment', { bookingId });
    };

    const removeBooking = async (bookingId: string) => {
        try {

            setDoctorBookings(doctorBookings.filter(booking => booking.id !== bookingId));
            showSuccessToast('Booking cancelled successfully', 'Success');
        } catch (error) {
            console.log("Remove booking error:", error);
            showSuccessToast('Failed to cancel booking', 'error');
        }
    };

    const calculateBookingTotals = () => {
        const subtotal = doctorBookings.reduce((sum, booking) => sum + booking.consultationFee, 0);
        const totalDiscount = doctorBookings.reduce((sum, booking) => sum + Number(booking.discount || 0), 0);
        const total = subtotal - totalDiscount;

        return {
            subtotal,
            discount: totalDiscount,
            total
        };
    };

    const getCartLists = async (customerID: string) => {
        const data = await Utils.getData('razorpayData')

        setLoader(true);
        try {
            const result: any = await _CART_SERVICE.get_cart_list(customerID);
            const { data, message = "", status_code } = result;
            console.log("FETCHINGCART:", result);
            const JSONData = await result.json();
            console.log("FETCHING CART LIST:", JSONData.cart?.items);
            if (result.status === 200) {
                setLoader(false);
                setCartItems(JSONData.cart?.items || []);
                setCartDetails(JSONData.cart || {});
            }

            else {
                setLoader(false);
                console.log("Error fetching cart items:", message);
            }

        } catch (error) {
            setLoader(false);
            console.log("FETCHING CART LIST ERROR:", error);

        }
    }


    const RemoveCartItem = async (itemId: string) => {

        try {
            const result: any = await _CART_SERVICE.delete_item(itemId);
            const { data, message = "", status_code } = result;
            const JSONData = await result.json();

            if (result.status === 200) {
                setCartItems(cartItems.filter(item => item.id !== itemId));
                console.log("Item removed successfully");
                showSuccessToast('Item removed from cart', 'Success');

            }

            else {
                console.log("Error fetching cart items:", message);
            }

        } catch (error) {
            console.log("FETCHING CART LIST ERROR:", error);

        }
    }


    const RenderBooking = () => {

        if (doctorBookings.length > 0) {
            return (
                <View style={styles.doctorBookingMainSection}>
                    <View style={styles.doctorSectionHeader}>
                        <View style={styles.headerLeft}>
                            <Text style={styles.doctorSectionIcon}>🩺</Text>
                            <Text style={styles.doctorSectionTitle}>Doctor Appointments</Text>
                        </View>

                        <View style={styles.bookingCountBadge}>
                            <Text style={styles.bookingCountText}>{doctorBookings.length}</Text>
                        </View>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >

                        {doctorBookings.map((booking, index) => (
                            <View key={booking.id} style={styles.bookingCard}>

                                <View style={styles.bookingNumberBadge}>
                                    <Text style={styles.bookingNumberText}>Booking #{index + 1}</Text>
                                </View>

                                <View style={styles.doctorInfoSection}>

                                    <View style={styles.doctorAvatarContainer}>
                                        {booking.doctorImage ? (
                                            <Image
                                                source={{ uri: booking.doctorImage }}
                                                style={styles.doctorAvatar}
                                            />
                                        ) : (
                                            <View style={styles.doctorAvatarPlaceholder}>
                                                <Text style={styles.doctorAvatarText}>
                                                    {booking.doctorName.split(' ').map(n => n[0]).join('')}
                                                </Text>
                                            </View>
                                        )}
                                    </View>


                                    <View style={styles.doctorDetailsSection}>
                                        <Text style={styles.doctorNameText}>{booking.doctorName}</Text>
                                        <Text style={styles.doctorSpecialization}>{booking.specialization}</Text>
                                        <Text style={styles.doctorHospital}>{booking.hospitalName}</Text>
                                    </View>

                                    <TouchableOpacity
                                        style={styles.removeBookingBtn}
                                        onPress={() => removeBooking(booking.id)}>

                                        <FontAwesome5Icon name='delete-left' color={Colors.secondaryColor} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.appointmentDetailsSection}>
                                    <View style={styles.detailItemRow}>
                                        <Fontisto name='date' color={Colors.primaryColor} />
                                        <Text style={styles.detailLabel}>Date:</Text>
                                        <Text style={styles.detailValue}>{booking?.appointmentDate}</Text>
                                    </View>

                                    <View style={styles.detailItemRow}>
                                        <Entypo name='back-in-time' color={Colors.textColor} />
                                        <Text style={styles.detailLabel}>Time:</Text>
                                        <Text style={styles.detailValue}>{booking?.appointmentTime}</Text>
                                    </View>


                                    <View style={styles.detailItemRow}>
                                        <Text style={styles.detailIcon}>
                                            {booking.consultationType == 'video'
                                                ? <Feather name='video' color={Colors.black} />
                                                :
                                                <FontAwesome5 name='hospital' color={Colors.black} />
                                            }

                                        </Text>


                                        <Text style={styles.detailLabel}>Type:</Text>
                                        <Text style={styles.detailValue}>
                                            {booking.consultationType === 'video' ? 'Video Consultation' : 'In-Person Visit'}
                                        </Text>
                                    </View>

                                    {booking.consultationType === 'in-person' && booking.location && (
                                        <View style={styles.locationDetailRow}>
                                            <Text style={styles.detailIcon}>📍</Text>
                                            <Text style={styles.locationText}>{booking.location}</Text>
                                        </View>
                                    )}

                                </View>

                                <View style={[
                                    styles.statusBadge,
                                    booking.status === 'confirmed' && styles.statusConfirmed,
                                    booking.status === 'pending' && styles.statusPending
                                ]}>
                                    <Text style={styles.statusText}>
                                        {booking.status === 'confirmed' ? '✓ Confirmed' : '⏳ Pending'}
                                    </Text>
                                </View>

                                <View style={styles.bookingPriceSection}>
                                    <View style={styles.priceLeftSection}>
                                        <Text style={styles.consultationFeeLabel}>Consultation Fee</Text>
                                        <View style={styles.priceRow}>
                                            <Text style={styles.consultationFeeAmount}>₹{booking.consultationFee}</Text>

                                            {booking?.discount && (
                                                <View style={styles.discountBadgeSmall}>
                                                    <Text style={styles.discountTextSmall}>-₹{booking.discount}</Text>
                                                </View>
                                            )}

                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        style={styles.rescheduleButton}
                                        onPress={() => rescheduleAppointment(booking.id)}>
                                        <Text style={styles.rescheduleButtonText}>Reschedule</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        ))}


                        <View style={styles.consultationPricingSection}>
                            <Text style={styles.consultationPricingTitle}>Consultation Summary</Text>

                            <View style={styles.consultationPricingRow}>
                                <Text style={styles.consultationPricingLabel}>Total Consultations</Text>
                                <Text style={styles.consultationPricingValue}>
                                    ₹{calculateBookingTotals().subtotal}
                                </Text>
                            </View>

                            {calculateBookingTotals().discount > 0 && (
                                <View style={styles.consultationPricingRow}>
                                    <Text style={styles.consultationPricingLabel}>Discount</Text>
                                    <Text style={styles.consultationDiscountValue}>
                                        -₹{calculateBookingTotals().discount}
                                    </Text>
                                </View>
                            )}

                            <View style={styles.consultationTotalRow}>
                                <Text style={styles.consultationTotalLabel}>Consultation Total</Text>
                                <Text style={styles.consultationTotalAmount}>
                                    ₹{calculateBookingTotals().total}
                                </Text>
                            </View>

                            <TouchableOpacity style={{ paddingVertical: 10 }} onPress={() => props.navigation.navigate('PaymentMethods', { productData: doctorBookings })}>
                                <LinearGradient style={styles.finalProceedButton} colors={[Colors.secondaryColor, Colors.primaryColor]}  >
                                    <Text style={styles.finalProceedButtonText}>Proceed to Buy</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                        </View>
                    </ScrollView>
                </View>
            )
        }

        else {
            <View style={[styles.emptyWishlist, { marginBottom: '20%' }]}>

                <LottieView
                    source={require('../../assets/animations/emptycart.json')}
                    autoPlay
                    loop
                    style={{ width: screenWidth <= 360 ? 200 : 400, height: screenWidth <= 360 ? 200 : 400 }}
                />
                <Text style={styles.emptyWishlistText}>Your cart is empty</Text>
                <TouchableOpacity
                    onPress={() => props.navigation.replace('TabStack', { screen: 'Shop' })}
                    style={styles.browseButton}
                >
                </TouchableOpacity>

            </View>
        }

    }


    const RenderCartItem = () => {
        if (cartItems.length > 0) {
            return (
                <ScrollView style={styles.scrollView}>

                    <View style={styles.subtotalContainer}>
                        <Text style={styles.subtotalText}>Subtotal ₹{cartDetails?.subtotal ?? ''}</Text>
                    </View>

                    <LinearGradient style={styles.proceedButton} colors={[Colors.secondaryColor, Colors.primaryColor]}>
                        <Text style={styles.proceedButtonText}>Total Items ({cartItems?.length})</Text>
                    </LinearGradient>


                    <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                        <View style={styles.dividerLine} />
                    </View>

                    <View style={styles.cartItems}>

                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalScrollContainer}>

                            {cartItems.map((item: CartItem) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.productCard}
                                >

                                    <Image
                                        source={require('../../assets/images/productimage.png')}
                                        style={styles.productImage}
                                        defaultSource={require('../../assets/images/productimage.png')}
                                    />


                                    <View style={styles.productInfo}>
                                        <Text style={styles.productName} numberOfLines={2}>{item?.vendorproduct?.title}</Text>

                                        <View style={styles.ratingContainer}>


                                            <CustomStarRating
                                                rating={item?.vendorproduct?.total_reviews}
                                                starSize={14}
                                                maxRating={5}
                                            />
                                            <Text style={styles.reviewCount}>({item.vendorproduct?.average_rating})</Text>
                                        </View>

                                        {item?.vendorproduct?.stock === 0 && (
                                            <View style={[styles.removebutton, { backgroundColor: '#ffcccb80', borderColor: '#ff000080', marginVertical: 4 }]}>
                                                <Text style={[styles.discountText, { color: 'black' }]}>{item?.vendorproduct?.stock > 0 ? '' : 'Out of stock'}</Text>
                                            </View>
                                        )}


                                        <Text style={styles.productDetails}>
                                            Category: {item.vendorproduct?.category?.name}
                                        </Text>

                                        <View style={styles.priceContainer}>
                                            <Text style={styles.currentPrice}>₹{item?.vendorproduct?.selling_price}</Text>
                                            <Text style={styles.originalPrice}>₹{item?.vendorproduct?.variant_details?.mrp}</Text>


                                        </View>


                                        <View style={styles.quantitySection}>
                                            <Text style={styles.productDetails}>Quantity:  </Text>

                                            <View style={styles.quantityContainer}>
                                                <TouchableOpacity
                                                    style={[
                                                        styles.quantityButton,
                                                        item.quantity <= 1 && styles.quantityButtonDisabled
                                                    ]}
                                                    onPress={() => decreaseQuantity(item.id, item.quantity)}
                                                    disabled={item.quantity <= 1}>
                                                    <Text style={[
                                                        styles.quantityButtonText,
                                                        item.quantity <= 1 && styles.quantityButtonTextDisabled
                                                    ]}>
                                                        -
                                                    </Text>
                                                </TouchableOpacity>

                                                <Text style={styles.quantityText}>{item.quantity}</Text>

                                                <TouchableOpacity
                                                    style={[
                                                        styles.quantityButton,
                                                        item.quantity >= (item?.vendorproduct?.stock) && styles.quantityButtonDisabled
                                                    ]}

                                                    onPress={() => increaseQuantity(item.id, item.quantity, item?.vendorproduct?.stock)}
                                                    disabled={item.quantity >= (item?.vendorproduct?.stock)}>

                                                    <Text style={[
                                                        styles.quantityButtonText,
                                                        item.quantity >= (item?.vendorproduct?.stock || 10) && styles.quantityButtonTextDisabled
                                                    ]}>
                                                        +
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>

                                    <TouchableOpacity style={styles.removebutton} onPress={() => RemoveCartItem(item.id)}>
                                        <Text style={styles.discountText}>Remove</Text>
                                    </TouchableOpacity>

                                </TouchableOpacity>
                            ))}

                        </ScrollView>
                    </View>

                    <View style={styles.deselectContainer}>
                        <Text style={styles.pricingTitle}>Pricing</Text>
                    </View>

                    <View style={styles.pricingSection}>

                        <View style={styles.pricingRow}>
                            <Text style={styles.pricingLabel}>Items Price</Text>
                            <Text style={styles.pricingValue}>₹{cartDetails?.subtotal ?? '0.0'}</Text>
                        </View>

                        <View style={styles.pricingRow}>
                            <Text style={styles.pricingLabel}>Delivery</Text>
                            <Text style={styles.pricingValue}>₹{cartDetails?.delivery_charge ?? '0.0'}</Text>
                        </View>


                        <View style={styles.pricingRow}>
                            <Text style={styles.pricingLabel}>Promotion</Text>
                            <Text style={styles.promotion}>-₹{Math.abs(cartDetails?.promotion_discount ?? '0')}</Text>
                        </View>

                        <View style={styles.orderTotalRow}>
                            <Text style={styles.orderTotalText}>Order Total</Text>
                            <Text style={styles.orderTotalAmount}>₹{cartDetails?.order_total ?? '0.00'}</Text>
                        </View>
                        <TouchableOpacity style={{ paddingVertical: 10 }} onPress={() => props.navigation.navigate('PaymentMethods', { productData: cartDetails })}>

                            <LinearGradient style={styles.finalProceedButton} colors={[Colors.secondaryColor, Colors.primaryColor]}  >
                                <Text style={styles.finalProceedButtonText}>Proceed to Buy</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.recommendationsSection}>
                        <ProductCard title='You might also like:' navigation={props.navigation} PropsData={ProductSimilar} />
                    </View>
                </ScrollView>

            )
        }

        else {
            return (
                <View style={[styles.emptyWishlist, { marginBottom: '20%' }]}>
                    <LottieView
                        source={require('../../assets/animations/emptycart.json')}
                        autoPlay
                        loop
                        style={{ width: screenWidth <= 360 ? 200 : 400, height: screenWidth <= 360 ? 200 : 400 }}
                    />
                    <Text style={styles.emptyWishlistText}>Your cart is empty</Text>
                    <TouchableOpacity
                        onPress={() => props.navigation.replace('TabStack', { screen: 'Shop' })}
                        style={styles.browseButton}
                    >
                        <Text style={styles.browseButtonText}>Browse Products</Text>
                    </TouchableOpacity>

                </View>
            )
        }

    }



    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={Colors.primaryColor} barStyle="light-content" />
            <Header title='My Cart' navigation={props.navigation} Is_Tab={false} />

            {loader ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={'large'} color={Colors.primaryColor} />
                </View>
            ) : (
                <>
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'orders' && styles.activeTabButton]}
                            onPress={() => setActiveTab('orders')}>
                            <Text style={[styles.tabButtonText, activeTab === 'orders' && styles.activeTabButtonText]}>
                                Orders ({cartItems.length})
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'bookings' && styles.activeTabButton]}
                            onPress={() => setActiveTab('bookings')}>
                            <Text style={[styles.tabButtonText, activeTab === 'bookings' && styles.activeTabButtonText]}>
                                Bookings ({doctorBookings.length})
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {activeTab === 'orders' ? RenderCartItem() : RenderBooking()}
                    {/* {activeTab === 'orders' ? RenderCartItem() : RenderBooking()} */}

                </>
            )}
        </SafeAreaView>
    );
};


const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - 44) / 2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginTop: 15,
        marginBottom: 10,
        borderRadius: 10,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: 'transparent',
    },
    activeTabButton: {
        backgroundColor: Colors.primaryColor,
    },
    tabButtonText: {
        fontSize: 14,
        fontFamily: Fonts.PoppinsMedium,
        color: '#666',
    },
    activeTabButtonText: {
        color: '#fff',
        fontFamily: Fonts.PoppinsSemiBold,
    },
    subtotalContainer: {

        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    subtotalText: {
        color: Colors.textColor,
        fontFamily: Fonts.PoppinsSemiBold,
        fontSize: 20,
    },
    proceedButton: {
        backgroundColor: '#5D8C2E',
        marginHorizontal: 20,
        marginVertical: 10,
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: 'center',
    },

    proceedButtonText: {
        color: '#fff',
        fontSize: 14, fontFamily: Fonts.PoppinsMedium
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    deselectContainer: {
        paddingHorizontal: 20,
        // paddingVertical: 10,
    },

    cartItems: {
        // backgroundColor: '#fff',
        marginHorizontal: 8,
        marginVertical: 8,
        borderRadius: 5,
        padding: 10,
    },

    horizontalScrollContainer: {
        paddingVertical: 5,
    },

    productCard: {
        width: cardWidth,
        marginRight: 8,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    productImage: {
        width: '100%',
        height: 120,
        alignContent: 'flex-start',
        borderRadius: 10,
        resizeMode: 'contain',
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 14,
        color: Colors.textColor,
        fontFamily: Fonts.PoppinsSemiBold,
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },


    productDetails: {
        fontSize: 12,
        fontFamily: Fonts.PoppinsMedium,
        marginBottom: 2,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    currentPrice: {
        fontSize: 14,
        fontFamily: Fonts.PoppinsMedium,
        color: '#2e7d32',
        marginRight: 5,
    },
    originalPrice: {
        fontSize: 12,
        color: '#999',
        fontFamily: Fonts.PoppinsMedium,
        textDecorationLine: 'line-through',
        marginRight: 5,
    },

    removebutton: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.bgGrayColor,
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: Colors.white
    },

    discountText: {
        fontSize: 10,
        color: Colors.primaryColor,
        fontFamily: Fonts.PoppinsMedium
    },
    quantitySection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 4,
    },

    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 6,
        borderWidth: 0.5,
        borderColor: '#e0e0e0',
    },

    quantityButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonDisabled: {
        backgroundColor: '#f5f5f5',
        borderColor: '#d6d6d6',
    },
    quantityButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#007bff',
    },
    quantityButtonTextDisabled: {
        color: '#999',
    },
    quantityText: {
        textAlign: 'center',
        fontSize: 12,
        fontFamily: Fonts.PoppinsMedium,
        color: '#333',
        backgroundColor: '#fff',
        paddingVertical: 5,
        paddingHorizontal: 10,
    },



    removeButton: {
        color: '#7CB342',
        fontSize: 14,
    },

    pricingSection: {

        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginVertical: 10,
        borderRadius: 5,
        padding: 15,
    },

    pricingTitle: {
        fontSize: 16,
        fontFamily: Fonts.PoppinsMedium,
        marginBottom: 10,
        color: Colors.textColor
    },
    pricingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    pricingLabel: {
        fontSize: 14, color: Colors.textColor,
        fontFamily: Fonts.PoppinsMedium,
    },
    pricingValue: {
        fontSize: 14, color: Colors.textColor,
        fontFamily: Fonts.PoppinsSemiBold,
    },
    promotion: {
        fontSize: 14, color: Colors.secondaryColor,
        fontFamily: Fonts.PoppinsMedium,
    },
    orderTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    orderTotalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    orderTotalAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    finalProceedButton: {
        marginVertical: 10,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    finalProceedButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    recommendationsSection: {
        borderRadius: 5,
        padding: 15,
        marginBottom: 30,
    },
    recommendationsTitle: {
        fontSize: 16,
        fontFamily: Fonts.PoppinsSemiBold,
        color: Colors.textColor,
        marginBottom: 15,
    },
    recommendationsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    recommendationItem: {
        width: '30%',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 5,
        marginBottom: 15,
    },
    recommendationImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
        marginBottom: 8,
    },
    recommendationName: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
    },
    recommendationRating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    star: {
        fontSize: 12,
        marginRight: 1,
    },
    starFilled: {
        fontSize: 16,
        color: '#FCD34D',
    },
    starEmpty: {
        fontSize: 16,
        color: '#ccc',
    },
    reviewCount: {
        fontSize: 12,
        color: Colors.textColor,
        fontFamily: Fonts.PoppinsSemiBold,
        marginLeft: 3,
    },
    recommendationQuantity: {
        fontSize: 8,
        color: '#666',
        textAlign: 'center',
        marginBottom: 2,
    },
    recommendationCategory: {
        fontSize: 8,
        color: '#666',
        textAlign: 'center',
        marginBottom: 5,
    },
    recommendationPrice: {
        alignItems: 'center',
    },
    recommendationCurrentPrice: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
    },
    recommendationOriginalPrice: {
        fontSize: 10,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    recommendationDiscount: {
        fontSize: 8,
        color: '#7CB342',
        fontWeight: 'bold',
    },
    emptyWishlist: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyWishlistText: {
        fontSize: 18,
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.placeholderColor,
        marginBottom: 16,
    },
    browseButton: {
        backgroundColor: Colors.primaryColor,
        padding: 12,
        borderRadius: 4,
    },
    browseButtonText: {
        color: 'white',
        fontFamily: Fonts.PoppinsMedium,
        fontSize: 16,
    },
    doctorBookingMainSection: {
        flex: 1,
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginVertical: 15,
        borderRadius: 12,
        padding: 16,
        shadowOpacity: 0.08,
        shadowRadius: 8,
        // elevation: 4,
    },
    doctorSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 2,
        borderBottomColor: '#e8f5e9',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    doctorSectionIcon: {
        fontSize: 24,
    },
    doctorSectionTitle: {
        fontSize: 18,
        fontFamily: Fonts.PoppinsSemiBold,
        color: Colors.textColor,
    },
    bookingCountBadge: {
        backgroundColor: Colors.primaryColor,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    bookingCountText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: Fonts.PoppinsSemiBold,
    },

    bookingCard: {
        borderColor: '#e0e0e0',
    },
    bookingNumberBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: Colors.secondaryColor,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    bookingNumberText: {
        color: '#fff',
        fontSize: 10,
        fontFamily: Fonts.PoppinsMedium,
    },
    doctorInfoSection: {
        flexDirection: 'row',
        marginBottom: 14,
        paddingRight: 80,
    },
    doctorAvatarContainer: {
        marginRight: 12,
    },
    doctorAvatar: {
        width: 50,
        height: 50,
        borderRadius: 32.5,
        backgroundColor: '#e0e0e0',
    },
    doctorAvatarPlaceholder: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
        backgroundColor: Colors.primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    doctorAvatarText: {
        color: '#fff',
        fontSize: 20,
        fontFamily: Fonts.PoppinsSemiBold,
    },
    doctorDetailsSection: {
        flex: 1,
        justifyContent: 'center',
    },
    doctorNameText: {
        fontSize: 16,
        fontFamily: Fonts.PoppinsSemiBold,
        color: Colors.textColor,
        marginBottom: 3,
    },
    doctorSpecialization: {
        fontSize: 13,
        fontFamily: Fonts.PoppinsMedium,
        color: '#666',
        marginBottom: 2,
    },
    doctorHospital: {
        fontSize: 12,
        fontFamily: Fonts.PoppinsRegular,
        color: '#999',
    },
    removeBookingBtn: {
        position: 'absolute',
        top: 5,
        right: 5,
        padding: 8,
    },
    removeBookingIcon: {
        fontSize: 18,
    },
    appointmentDetailsSection: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    detailItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    detailIcon: {
        fontSize: 16,
        width: 22,
    },
    detailLabel: {
        fontSize: 13,
        fontFamily: Fonts.PoppinsMedium,
        color: '#666',
        width: 50,
    },
    detailValue: {
        fontSize: 13,
        fontFamily: Fonts.PoppinsSemiBold,
        color: Colors.textColor,
        flex: 1,
    },
    locationDetailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginTop: 4,
    },
    locationText: {
        fontSize: 12,
        fontFamily: Fonts.PoppinsRegular,
        color: '#999',
        flex: 1,
        lineHeight: 18,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        marginBottom: 12,
    },
    statusConfirmed: {
        backgroundColor: '#e8f5e9',
        borderWidth: 1,
        borderColor: '#4caf50',
    },
    statusPending: {
        backgroundColor: '#fff3e0',
        borderWidth: 1,
        borderColor: '#ff9800',
    },
    statusText: {
        fontSize: 11,
        fontFamily: Fonts.PoppinsSemiBold,
        color: '#333',
    },
    bookingPriceSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    priceLeftSection: {
        flex: 1,
    },
    consultationFeeLabel: {
        fontSize: 11,
        fontFamily: Fonts.PoppinsRegular,
        color: '#999',
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    consultationFeeAmount: {
        fontSize: 20,
        fontFamily: Fonts.PoppinsSemiBold,
        color: '#2e7d32',
    },
    discountBadgeSmall: {
        backgroundColor: '#ffebee',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#e57373',
    },
    discountTextSmall: {
        fontSize: 10,
        fontFamily: Fonts.PoppinsMedium,
        color: '#d32f2f',
    },
    rescheduleButton: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: Colors.primaryColor,
    },
    rescheduleButtonText: {
        color: Colors.primaryColor,
        fontSize: 13,
        fontFamily: Fonts.PoppinsSemiBold,
    },
    consultationPricingSection: {
        backgroundColor: '#f0f8ff',
        borderRadius: 10,
        padding: 16,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#bbdefb',
    },
    consultationPricingTitle: {
        fontSize: 15,
        fontFamily: Fonts.PoppinsSemiBold,
        color: Colors.textColor,
        marginBottom: 12,
    },
    consultationPricingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    consultationPricingLabel: {
        fontSize: 13,
        fontFamily: Fonts.PoppinsMedium,
        color: '#666',
    },
    consultationPricingValue: {
        fontSize: 13,
        fontFamily: Fonts.PoppinsSemiBold,
        color: Colors.textColor,
    },
    consultationDiscountValue: {
        fontSize: 13,
        fontFamily: Fonts.PoppinsSemiBold,
        color: '#d32f2f',
    },
    consultationTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#90caf9',
    },
    consultationTotalLabel: {
        fontSize: 15,
        fontFamily: Fonts.PoppinsSemiBold,
        color: Colors.textColor,
    },
    consultationTotalAmount: {
        fontSize: 18,
        fontFamily: Fonts.PoppinsBold,
        color: '#2e7d32',
    },
});

export default CartScreen;