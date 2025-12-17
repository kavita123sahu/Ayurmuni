import React, { useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    Dimensions,
    Animated,
} from 'react-native';
import { Fonts } from '../common/Fonts';
import { Colors } from '../common/Colors';
import LinearGradient from 'react-native-linear-gradient';
import { Styles } from '../common/Styles';
import { useNavigation } from '@react-navigation/native';


type Specialization = {
    id: string;
    icon: string;
    name: string;
};

interface DoctorData {
    id: string;
    name: string;
    special_interest: string;
    specializations: any;
    assured_muni: boolean;
    patient_recommendation: number;
    rating: string;
    experience_years: number;
    profile_image: string | null;
    consultation_fee: string;
    available_from: string;
    available_to: string;
    is_active: boolean;
}

interface ConsultCardProps {
    doctorData: DoctorData[];
    title: string
    onJoinPress?: (doctor: DoctorData) => void; // Pass doctor data
    onThumbPress?: (doctor: DoctorData) => void;
    onRatingPress?: (doctor: DoctorData) => void;
    showActive?: string;
}

const ConsultCard: React.FC<ConsultCardProps> = ({
    doctorData,
    title,
    showActive,
    onJoinPress,
    onThumbPress,
    onRatingPress,
}) => {

    const CARD_WIDTH = width - 50;
    const visibleItems = doctorData.slice(0, 5);
    const scrollX = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();


    const handleNavigation = () => {
        // navigation.navigate('DoctorSelect', { All: true })
    }
    const renderConsultCard = ({ item }: { item: DoctorData }) => (

        <TouchableOpacity style={styles.cardWrapper}>
            <View style={styles.upcomingCard}>

                <View style={styles.doctorInfo}>
                    <View style={styles.avatarContainer}>
                        {/* {item.profile_image ? <Image
                            source={
                                item.profile_image
                                    ? { uri: item.profile_image }
                                    : require('../assets/images/user_profile.png')
                            }
                            style={styles.doctorAvatar}
                        /> : <Image
                            source={
                                require('../assets/images/user_profile.png')
                            }
                            style={styles.doctorAvatar}
                        />}

                        {item.assured_muni && (
                            <Image
                                source={require('../assets/images/assured.png')}
                                style={styles.assuredBadge}
                            />
                        )} */}
                    </View>

                    <View style={styles.doctorDetails}>
                        <Text style={styles.doctorName}>{item.name}</Text>
                        <Text style={styles.doctorSpecialty}>{item.special_interest ?? 'NA'}</Text>
                        <Text style={styles.doctorExperience}>
                            {item.experience_years} years of exp. overall
                        </Text>
                        <Text style={styles.doctorSpecialty}>{item.specializations.map((s: { name: string }) => s.name).join(', ')}</Text>
                    </View>
                </View>

                <View style={styles.divider}>
                    <Image
                        source={require('../assets/images/Line.png')}
                        style={styles.lineImage}
                    />
                </View>

                <View style={{ flex: 1, justifyContent: 'center', paddingVertical: 10 }}>
                    <View style={styles.ratingButtons}>
                        <TouchableOpacity
                            style={[styles.ratButton, styles.thumbButton]}
                            onPress={() => onThumbPress?.(item)}
                        >
                            <Image
                                source={require('../assets/images/thumb.png')}
                                style={styles.buttonIcon}
                            />
                            <Text style={styles.joinButtonText}>
                                {item.patient_recommendation || '0'}%
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.ratButton, styles.ratingButton]}
                            onPress={() => onRatingPress?.(item)}
                        >
                            <Image
                                source={require('../assets/images/rating.png')}
                                style={styles.buttonIcon}
                            />
                            <Text style={styles.joinButtonText}>{item.rating || '0'}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                        <Text style={styles.ratetext}>
                            Patient {'\n'}Recommendation
                        </Text>

                        <Text style={[styles.ratetext, { textAlign: 'right' }]}>
                            Consultancy {'\n'}Excellence Rating
                        </Text>
                    </View>

                </View>

                <View style={styles.divider}>
                    <Image
                        source={require('../assets/images/Line.png')}
                        style={styles.lineImage}
                    />
                </View>

                <View style={styles.consultationMeta}>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.reviewCount}>Consultation fee</Text>
                        <Text style={styles.price}>{item.consultation_fee}</Text>
                    </View>


                    <View style={styles.joinSection}>
                        {item?.is_active ? (
                            <View style={styles.availabilityInfo}>
                                <Text style={styles.startingText}>Starting at</Text>
                                <Text style={styles.timeText}>
                                    {item.available_from ?? ''} Today
                                </Text>
                            </View>
                        ) :
                            <View style={styles.availabilityInfo}>
                                <Text style={styles.startingText}>Next Available at</Text>
                                <Text style={styles.timeText}>
                                    {item.available_from ?? ''}
                                </Text>
                            </View>}

                        <LinearGradient
                            style={styles.joinButton}
                            colors={[Colors.secondaryColor, Colors.primaryColor]}
                        >
                            <TouchableOpacity onPress={() => onJoinPress?.(item)}>
                                <Text style={styles.joinButtonText}>Book Now</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <>
            <View style={styles.titleRow}>
                <Text style={Styles.sectionTitle}>{title}</Text>
                <TouchableOpacity onPress={handleNavigation}>
                    <Text style={Styles.viewAll}>View All</Text>
                </TouchableOpacity>
            </View>


            <FlatList
                data={doctorData}
                renderItem={renderConsultCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesList}
                removeClippedSubviews={true}
                maxToRenderPerBatch={3}
                pagingEnabled
                snapToInterval={CARD_WIDTH}
                decelerationRate="fast"

                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}

                getItemLayout={(data, index) => ({
                    length: CARD_WIDTH,
                    offset: CARD_WIDTH * index,
                    index,
                })}

            />

            {visibleItems.length > 1 && (
                <View style={styles.paginationContainer}>
                    {visibleItems.map((_, i) => {
                        const inputRange = [
                            (i - 1) * CARD_WIDTH,
                            i * CARD_WIDTH,
                            (i + 1) * CARD_WIDTH
                        ];

                        const opacity = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: "clamp",
                        });

                        const scale = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.6, 1.3, 0.6],
                            extrapolate: "clamp",
                        });

                        return (
                            <Animated.View
                                key={i}
                                style={[
                                    styles.dot,
                                    { opacity, transform: [{ scale }] },
                                ]}
                            />
                        );
                    })}
                </View>
            )}



        </>
    );
};

const { height, width } = Dimensions.get('window'); // Use 'window' instead of 'screen'

const styles = StyleSheet.create({
    cardWrapper: {
        paddingHorizontal: 8,
    },
     titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    upcomingCard: {
        backgroundColor: '#E8EDE3',
        borderRadius: 12,
        padding: 15,
        width: width - 50, // Fixed calculation
        borderWidth: 1,
        borderColor: '#E8E8E8',
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
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
    dot: {
        height: 10,
        width: 10,
        backgroundColor: Colors.primaryColor,
        borderRadius: 100,
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
        // textAlign: 'center',
        flex: 1,
    },

    consultationMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    ratingContainer: {
        flex: 1,
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
});

export default ConsultCard;