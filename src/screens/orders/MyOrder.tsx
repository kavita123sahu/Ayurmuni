import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    Pressable,
} from 'react-native';
import Header from '../../component/Header';
import { Colors } from '../../common/Colors';
import { Fonts } from '../../common/Fonts';
import LinearGradient from 'react-native-linear-gradient';
import *as _CONSULT_SERVICE from '../../services/ConsultServce';
import *as _ORDER_SERVICE from '../../services/OrderService';
import { useNavigation } from '@react-navigation/native';
import EmptyList from '../../component/EmptyList';
import { Utils } from '../../common/Utils';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import CustomStarRating from '../../component/CustomStarRating';
import { showSuccessToast } from '../../config/Key';
import DoctorOrder from '../../component/DoctorOrder';


const { width, height } = Dimensions.get('window');

interface Product {
    total_reviews: number
}
interface Address {
    city: string,
    pincode: string
}


interface Order {
    id: number;
    productName: string;
    image: string;
    rating: number;
    reviews: string;
    total_amount: string;
    price: string;
    payment_status: string;
    order_status: string;
    vendor_product: Product
    delivery_address_details: Address
    customer: string;
    items: any;

    type: 'active' | 'previous';
    address: string;
}

interface DoctorData {
    id: string;
    doctor_name: string;
    specialization: string;
    special_interest: string;
    assured_muni: boolean;
    patient_recommendation: number;
    rating: string;
    doctor_interest: string;
    doctor_experience: number;
    consultation_date: string;
    total_amount: string;
    experience_years: number;
    profile_image: string | null;
    consultation_fee: string;
    available_from: string;
    available_to: string;
    is_active: boolean;
}


const MyOrder = (props: any) => {
    const [activeTab, setActiveTab] = useState<string>('Products');
    const isFocused = useNavigation();
    const [loader, setLoader] = useState<boolean>(false);
    const [DoctorList, setDoctorList] = useState([])
    const [orderData, setorderData] = useState<any[]>([]);

    useEffect(() => {
        getCustomrOrderAPI()
    }, [isFocused])


    const getCustomrOrderAPI = async () => {
        setLoader(true);

        try {
            let response: any = await _ORDER_SERVICE.getCustomerOrder();
            console.log('responseorderrr->', response);
            const DataJSON = await response.json();
            console.log('ordeeerrrDataJSON->', DataJSON.data);
            setorderData(DataJSON.data);
            if (response.status === 200) {
                setLoader(false);
                setorderData(DataJSON.data);
                const consultationOrders = DataJSON.data.filter((order: any) => order.order_type === "consultation");
                console.log("consultationOrdersconsultationOrders", consultationOrders);
                setDoctorList(consultationOrders);

            }

            else {
                setLoader(false);
                console.log("data not fetch", response.message);
            }
        } catch (error) {
            setLoader(false);
            console.log("ORDER DATA ERROR:", error);
        }
    }


    const confirmedOrCancelled = orderData.filter(
        order => order.order_status === 'placed' || order.order_status === 'cancelled'
    );

    const pendingOrders = orderData.filter(order => order.order_status === 'confirmed');

    const handleViewInvoice = async (order_id: number) => {
        console.log("orderiddd", order_id);
        const downloadDest = `${RNFS.DocumentDirectoryPath}/invoice_${order_id}.pdf`;
        console.log("Download Destination:", downloadDest);
        const dataToSend = {
            order_id: order_id

        }

        const res: any = await _ORDER_SERVICE.generate_invoice_API(dataToSend);
        console.log("Response:", res);

        const { pdfUrl } = await res.json();

        console.log("PDF URL:", pdfUrl);

        if (pdfUrl) {
            const download = await RNFS.downloadFile({
                fromUrl: pdfUrl,
                toFile: downloadDest,
            }).promise;

            console.log("Download Result:", download);
            if (download && download.statusCode === 200) {
                FileViewer.open(downloadDest, { showOpenWithDialog: true });
            }
        }
    };




    const CancleOrder = async (order_id: number) => {

        console.log("orderiddd", order_id);

        try {

            const dataToSend = {
                order_id: order_id

            }

    
            const result: any = await _ORDER_SERVICE.order_cancle_API(dataToSend);

            if (result.status === 200) {

                showSuccessToast('Order Cancelled Successfully ', 'success');
                setorderData(prevData =>
                    prevData.map(order =>
                        order.id === order_id
                            ? { ...order, order_status: 'cancelled' }
                            : order
                    )
                );
                // props.navigation.navigate('PaymentSuccessScreen', { SuccessText: 'Cancel' });
            }

            else {

                showSuccessToast("Something Issue to Cancle the Order", 'error')

            }


        } catch (error) {
            console.log(error);
        }
    }

    // const DoctorOrder: React.FC<{ doctor: DoctorData; showReorder?: boolean }> = ({ doctor, showReorder = false }) => (
    //     <TouchableOpacity style={styles.cardWrapper} >
    //         <View style={styles.upcomingCard}>
    //             <View style={styles.doctorInfo}>
    //                 <View style={styles.avatarContainer}>
    //                     <Image
    //                         source={
    //                             doctor.profile_image
    //                                 ? { uri: doctor.profile_image }
    //                                 : require('../../assets/images/user_profile.png')
    //                         }
    //                         style={styles.doctorAvatar}
    //                     />

    //                     {doctor.assured_muni && (
    //                         <Image
    //                             source={require('../../assets/images/assured.png')}
    //                             style={styles.assuredBadge}
    //                         />
    //                     )}
    //                 </View>

    //                 <View style={styles.doctorDetails}>
    //                     <Text style={styles.doctorName}>{doctor.doctor_name}</Text>
    //                     <Text style={styles.doctorSpecialty}>{doctor.doctor_name}</Text>
    //                     <Text style={styles.doctorExperience}>
    //                         {doctor.doctor_experience} years of exp. overall
    //                     </Text>
    //                     {/* <Text style={styles.doctorSpecialty}>{doctor.doctor_interest}</Text> */}
    //                 </View>
    //             </View>

    //             <View style={styles.divider}>
    //                 <Image
    //                     source={require('../../assets/images/Line.png')}
    //                     style={styles.lineImage}
    //                 />
    //             </View>

    //             <View style={{ flex: 1, justifyContent: 'center', paddingVertical: 10 }}>
    //                 <View style={styles.ratingButtons}>
    //                     <TouchableOpacity
    //                         style={[styles.ratButton, styles.thumbButton]}
    //                     //    onPress={() => onThumbPress?.(item)}
    //                     >
    //                         <Image
    //                             source={require('../../assets/images/thumb.png')}
    //                             style={styles.buttonIcon}
    //                         />
    //                         <Text style={styles.joinButtonText}>
    //                             {doctor.patient_recommendation}%
    //                         </Text>
    //                     </TouchableOpacity>

    //                     <TouchableOpacity
    //                         style={[styles.ratButton, styles.ratingButton]}
    //                     //    onPress={() => onRatingPress?.(item)}
    //                     >
    //                         <Image
    //                             source={require('../../assets/images/rating.png')}
    //                             style={styles.buttonIcon}
    //                         />
    //                         <Text style={styles.joinButtonText}>{doctor.rating}</Text>
    //                     </TouchableOpacity>
    //                 </View>

    //                 <View style={{ flexDirection: 'row', alignContent: 'center' }}>
    //                     <Text style={styles.ratetext}>
    //                         Patient {'\n'}Recommendation
    //                     </Text>

    //                     <Text style={[styles.ratetext, { textAlign: 'right' }]}>
    //                         Consultancy {'\n'}Excellence Rating
    //                     </Text>
    //                 </View>

    //             </View>

    //             <View style={styles.divider}>
    //                 <Image
    //                     source={require('../../assets/images/Line.png')}
    //                     style={styles.lineImage}
    //                 />
    //             </View>


    //             <View style={styles.consultationMeta}>
    //                 <View style={styles.ratingDoctorContainer}>
    //                     <Text style={styles.reviewCount}>Consultation fee</Text>
    //                     <Text style={styles.price}>{doctor.total_amount}</Text>
    //                 </View>

    //                 <View style={styles.joinSection}>
    //                     {doctor?.is_active && (
    //                         <View style={styles.availabilityInfo}>
    //                             <Text style={styles.startingText}>Starting at</Text>
    //                             <Text style={styles.timeText}>
    //                                 {doctor.consultation_date}
    //                             </Text>
    //                         </View>
    //                     )}

    //                     <LinearGradient
    //                         style={styles.joinButton}
    //                         colors={[Colors.secondaryColor, Colors.primaryColor]}
    //                     >
    //                         <TouchableOpacity
    //                         //  onPress={() => onJoinPress?.(doctor)}
    //                           >
    //                             <Text style={styles.joinButtonText}>  {showReorder ? 'Book Again' : 'Join Now '} </Text>
    //                         </TouchableOpacity>
    //                     </LinearGradient>
    //                 </View>
    //             </View>
    //         </View>
    //     </TouchableOpacity>
    // )


    const OrderCard: React.FC<{ order: Order; showReorder?: boolean }> = ({ order, showReorder = false }) => (

        <Pressable style={styles.orderCard} onPress={() => props.navigation.navigate('OrderDetails', { orderData: order })}>

            <View style={[styles.orderContent, { flex: 1 }]}>
                <View style={styles.productImageContainer}>
                    <Image
                        source={require('../../assets/images/productimage.png')}
                        style={styles.productImage}
                        defaultSource={require('../../assets/images/productimage.png')}
                    />
                </View>

                <View style={styles.productDetails}>
                    <View style={{
                        alignItems: 'flex-start',
                        justifyContent: 'space-between'
                    }}>

                    </View>
                    <Text style={styles.productName}> {order?.items?.map((item: any) => item.product_name).join(', ') ?? ''}</Text>
                    <View style={[styles.statusBadge, {
                        backgroundColor:
                            order.order_status === 'delivered' ? '#D4EDDA' : order.order_status === 'cancelled' ? '#F8D7DA' :
                                order.order_status === 'shipped' ? '#FFF3CD' : '#D1ECF1'
                    }]}>
                        <Text style={[styles.statusText, { color: 'black' }]}>{order.order_status}</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <View style={[styles.priceStatusContainer,]}>
                            <View style={styles.ratingContainer}>
                                <CustomStarRating
                                    rating={order?.vendor_product?.total_reviews}
                                    maxRating={5}
                                    starSize={15}
                                />
                                <Text style={styles.reviewsText}>({order?.vendor_product?.total_reviews ?? '0'})</Text>
                            </View>

                            <Text style={styles.addressText}>{order.delivery_address_details?.city ?? ''} {order?.delivery_address_details?.pincode ?? ''}</Text>
                        </View>

                        <View style={[styles.addressContainer]}>
                            <Text style={styles.price}>{order.total_amount
                            }</Text>
                            <Text style={styles.taxText}>(Including all taxes)</Text>
                        </View>
                    </View>
                </View>


                <TouchableOpacity style={styles.arrowButton}>
                    <Image source={require('../../assets/images/backButton.png')} style={{
                        height: 15,
                        width: 15,
                        tintColor: 'black',
                        transform: [{ rotate: '180deg' }],
                    }} />
                </TouchableOpacity>
            </View>

            <View style={styles.actionButtons}>
                <LinearGradient style={styles.invoiceButton} colors={[Colors.primaryColor, Colors.secondaryColor]}>
                    <TouchableOpacity onPress={() => handleViewInvoice(order.id)} style={styles.fullAreaButton}>
                        <Text style={styles.invoiceButtonText}>View Invoice</Text>
                    </TouchableOpacity>
                </LinearGradient>

                <View style={styles.buttonDivider} />

                <LinearGradient
                    colors={[showReorder ? Colors.primaryColor : Colors.primaryColor, showReorder ? Colors.secondaryColor : Colors.secondaryColor]}
                    style={[styles.actionButton, showReorder ? styles.reorderButton : styles.cancelButton]}
                >
                    <TouchableOpacity
                        onPress={() => showReorder ? "again" : CancleOrder(order.id)}
                        style={styles.fullAreaButton}
                    >
                        <Text style={[styles.actionButtonText, showReorder ? styles.reorderButtonText : styles.cancelButtonText]}>
                            {/* {order.order_status === 'cancelled'
                                ? (showReorder ? 'Reorder' : 'Cancel Order')
                                : 'Cancel Order' } */}
                            {showReorder || order.order_status == 'cancelled' ? 'Reorder' : 'Cancel Order'}
                        </Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </Pressable>
        
    );


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.primaryColor} />

            <Header title='My Orders' navigation={props.navigation} Is_Tab={false} />
            <View style={styles.tabContainer}>
                {['Products', 'Consulting'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {loader ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={Colors.primaryColor} style={{}} />
                    </View>
                ) :
                    activeTab === 'Products' ?
                        <>
                            <View style={styles.section}>
                                {pendingOrders.length > 0 ? (
                                    <>
                                        <Text style={styles.sectionTitle}>Active Orders</Text>
                                        {pendingOrders.map((order) => (
                                            <OrderCard order={order} />
                                        ))}
                                    </>
                                ) : <EmptyList navigation={props.navigation} />
                                }

                            </View>

                            <View style={styles.section}>
                                {confirmedOrCancelled.length > 0 ? (
                                    <>
                                        <Text style={styles.sectionTitle}>Previous Orders</Text>

                                        {confirmedOrCancelled.map((order) => (
                                            <OrderCard order={order} showReorder />
                                        ))}
                                    </>
                                ) : <>

                                </>}

                            </View>
                        </>

                        : activeTab === 'Consulting' ?
                            <>
                                <View style={styles.section}>
                                    {DoctorList.length > 0 ? (
                                        <>
                                            <Text style={styles.sectionTitle}>Active Orders</Text>
                                            {DoctorList.map((order, index) => (
                                                <DoctorOrder doctor={order} />
                                            ))}
                                        </>
                                    ) :

                                        <>
                                            <EmptyList navigation={props.navigation} />
                                        </>}
                                </View>


                                <View style={styles.section}>

                                    {DoctorList.length > 0 ? (
                                        <>
                                            <Text style={styles.sectionTitle}>Previous Orders</Text>

                                            {DoctorList.map((order, index) => (
                                                <DoctorOrder doctor={order} showReorder />

                                            ))}
                                        </>) :
                                        <>

                                        </>
                                    }

                                </View>
                            </>
                            : null
                    //  <EmptyList navigation={props.navigation} />

                    // <View style={styles.section}>
                    //     <Text style={styles.sectionTitle}>Active Orders</Text>
                    //     {orders.filter(order => order.status === 'active').map((order) => (
                    //         <WellnessOrder WellnessOrder={order} />
                    //     ))}

                    //     <Text style={styles.sectionTitle}>Previous Orders</Text>
                    //     {orders.filter(order => order.status === 'previous').map((order) => (
                    //         <WellnessOrder WellnessOrder={order} />
                    //     ))}
                    // </View>
                }
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
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    headerRight: {
        width: 40,
    },

    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginTop: 10
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderRadius: 10,
        backgroundColor: '#F0F0F0',
    },
    activeTab: {
        backgroundColor: Colors.primaryColor,
    },
    tabText: {
        fontSize: 12,
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.textColor
    },
    activeTabText: {
        color: '#FFFFFF',
        fontFamily: Fonts.PoppinsMedium,
        fontSize: 12
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
    },
    section: {
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 12,
    },
    orderCard: {
        backgroundColor: '#fff',
        marginVertical: 8,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: 'hidden',
    },
    orderContent: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'flex-start',
    },
    productImageContainer: {
        marginRight: 12,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    productDetails: {
        flex: 1,
    },
    statusBadge: {
        backgroundColor: Colors.tabinactive,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    statusText: {
        color: Colors.primaryColor,
        fontSize: 12,
        fontWeight: '600',
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
        lineHeight: 22,
    },
    priceStatusContainer: {
        paddingRight: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    ratingDoctorContainer: {
        flex: 1,
    },
    starsContainer: {
        flexDirection: 'row',
        marginRight: 4,
    },
    star: {
        fontSize: 14
    },
    reviewsText: {
        fontSize: 12,
        color: '#666',
    },
    addressText: {
        fontSize: 13,
        color: '#666',
        width: width / 3.5,
        lineHeight: 18,
    },
    addressContainer: {
        alignItems: 'flex-end',
        paddingLeft: 8,
    },

    taxText: {
        fontSize: 10,
        color: '#666',
        textAlign: 'right',
    },
    arrowButton: {
        paddingLeft: 8,
        justifyContent: 'center',
    },

    cardWrapper: {
        paddingHorizontal: 5,
    },
    upcomingCard: {
        backgroundColor: '#E8EDE3',
        borderRadius: 12,
        padding: 15,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#E8E8E8',

    },
    categoriesList: {
        // paddingHorizontal: 16,
    },
    verticalList: {
        paddingHorizontal: 10,
    },

    verticalContentContainer: {
        paddingBottom: 10,
    },

    verticalSeparator: {
        height: 12, // Space between vertical items
    },

    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    paginationDots: {
        height: 7,
        width: 70,
    },
    doctorInfo: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    avatarContainer: {
        paddingRight: 20,
        alignItems: 'center',
    },
    doctorAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 8,
    },
    assuredBadge: {
        height: 15,
        width: 100,
    },
    doctorDetails: {
        flex: 1,
    },
    doctorName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.black,
        marginBottom: 4,
    },
    doctorSpecialty: {
        fontSize: 14,
        color: Colors.textColor,
        marginBottom: 2,
    },
    doctorExperience: {
        fontSize: 14,
        color: Colors.textColor,
        marginBottom: 2,
    },
    divider: {
        marginVertical: 12,
    },
    lineImage: {
        width: '100%',
        tintColor: '#1E1E1ECC',
    },
    ratingSection: {
        paddingVertical: 10,
    },
    ratingButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    ratButton: {
        padding: 8,
        width: 70,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
    },
    thumbButton: {
        backgroundColor: '#FFC107',
    },
    ratingButton: {
        backgroundColor: '#71A33F',
    },
    buttonIcon: {
        height: 18,
        width: 18,
        marginRight: 4,
    },
    ratingLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratetext: {
        fontSize: 12,
        color: '#666666',
        textAlign: 'center',
        flex: 1,
    },
    consultationMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },

    reviewCount: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 4,
    },
    price: {
        fontSize: 18,
        fontFamily: Fonts.PoppinsBold,
        color: '#4CAF50',
    },
    joinSection: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        flex: 1,
        justifyContent: 'flex-end',
    },
    availabilityInfo: {
        marginRight: 12,
        alignItems: 'flex-end',
    },
    startingText: {
        color: 'black',
        fontFamily: Fonts.PoppinsSemiBold,
        fontSize: 12,
    },
    timeText: {
        color: 'black',
        fontSize: 11,
    },
    joinButton: {
        borderRadius: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    joinButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },

    actionButtons: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    invoiceButton: {
        flex: 1,
        paddingVertical: 10,
        // backgroundColor: '#4CAF50',
        alignItems: 'center',
        borderBottomLeftRadius: 12,
    },
    invoiceButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    buttonDivider: {
        width: 1,
        backgroundColor: '#fff',
    },
    actionButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderBottomRightRadius: 12,
    },
    fullAreaButton: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 12,
    },

    cancelButton: {
        backgroundColor: '#4CAF50',
    },
    reorderButton: {
        backgroundColor: '#2196F3',
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    
    cancelButtonText: {
        color: '#fff',
    },
    reorderButtonText: {
        color: '#fff',
    },
});

export default MyOrder;