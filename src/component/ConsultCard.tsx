import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import { Fonts } from '../common/Fonts';
import { Colors } from '../common/Colors';
import LinearGradient from 'react-native-linear-gradient';

interface DoctorData {
    name: string;
    specialty: string;
    experience: string;
    specialization: string;
    avatar: string;
    recommendationPercentage: string;
    rating: string;
    consultationFee: string;
    availableTime: string;
    isAssured: boolean;
}

interface ConsultCardProps {
    doctorData: DoctorData;
    onJoinPress: () => void;
    onThumbPress: () => void;
    onRatingPress: () => void;
    // showActive?: string
}

const ConsultCard: React.FC<ConsultCardProps> = ({
    doctorData,
    // showActive,
    onJoinPress,
    onThumbPress,
    onRatingPress
}) => {
    return (
        <View style={styles.upcomingCard}>
            <View style={styles.doctorInfo}>
                <View style={{ paddingRight: 20, alignItems: 'center' }}>
                    <Image
                        source={{ uri: doctorData.avatar }}
                        style={styles.doctorAvatar}
                    />
                    {doctorData.isAssured && (
                        <Image
                            source={require('../assets/images/assured.png')}
                            style={{ height: 15, width: 100 }}
                        />
                    )}
                </View>

                <View style={styles.doctorDetails}>
                    <Text style={styles.doctorName}>{doctorData.name}</Text>
                    <Text style={styles.doctorSpecialty}>{doctorData.specialty}</Text>
                    <Text style={styles.doctorExperience}>{doctorData.experience} years of exp. overall</Text>
                    <Text style={styles.doctorSpecialty}>{doctorData.specialization}</Text>
                </View>
                
            </View>

            <View style={{ marginBottom: 10 }}>
                {/* <Image source={require('../assets/images/Line.png')} style={{ width: '100%', tintColor: '#1E1E1ECC' }} /> */}
            </View>



            <View style={{ flex: 1, justifyContent: 'center', paddingVertical: 10 }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingBottom: 10, justifyContent: 'space-between' }}>
                    <TouchableOpacity
                        style={[styles.ratButton, { backgroundColor: '#FFC107' }]}
                        onPress={onThumbPress}>

                        {/* <Image source={require('../assets/images/thumb.png')} style={{ height: 20, width: 20, margin: 3 }} /> */}
                        <Text style={styles.joinButtonText}>{doctorData.recommendationPercentage}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.ratButton, { backgroundColor: '#71A33F', marginRight: 30 }]}
                        onPress={onRatingPress}
                    >
                        {/* <Image source={require('../assets/images/rating.png')} style={{ height: 20, width: 20, margin: 3 }} /> */}
                        <Text style={styles.joinButtonText}>{doctorData.rating}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.ratetext}>
                        Patient {'\n'}Recommendation
                    </Text>

                    <Text style={styles.ratetext}>
                        Consultancy {'\n'}Excellence Rating
                    </Text>
                </View>
            </View>


            <View style={{ marginBottom: 10 }}>
                {/* <Image source={require('../assets/images/Line.png')} style={{ width: '100%', tintColor: '#1E1E1ECC' }} /> */}
            </View>

            <View style={styles.consultationMeta}>
                <View style={styles.ratingContainer}>
                    <Text style={styles.reviewCount}>Consultation fee</Text>
                    <Text style={styles.price}>{doctorData.consultationFee}</Text>
                </View>

                <View style={{ flexDirection: 'row', width: '60%', paddingBottom: 15 }}>
                    <View style={{ paddingRight: 15 }}>
                        <Text style={{ color: 'black', fontFamily: Fonts.PoppinsSemiBold }}>Starting at </Text>
                        <Text style={{ color: 'black', fontSize: 12 }}>{doctorData.availableTime}</Text>
                    </View>

                    <LinearGradient style={styles.joinButton} colors={[Colors.secondaryColor, Colors.primaryColor]}>
                        <TouchableOpacity onPress={onJoinPress}>
                            <Text style={styles.joinButtonText}>Join Now</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    upcomingCard: {
        backgroundColor: '#E8EDE3',
        borderRadius: 12,
        marginBottom: 10,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    doctorInfo: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    doctorAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        marginBottom: 17,
    },
    doctorDetails: {
        flex: 1,
    },
    doctorName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.black,
        marginBottom: 2,
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
    consultationMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    ratingContainer: {
        flex: 1,
        width: '15%'
    },
    reviewCount: {
        fontSize: 12,
        color: '#666666',
    },
    ratetext: {
        fontSize: 12,
        color: '#666666',
        textAlign: 'left'
    },
    price: {
        fontSize: 18,
        fontFamily: Fonts.PoppinsBold,
        color: '#4CAF50',
        marginBottom: 8,
    },
    joinButton: {
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        width: 80
    },
    ratButton: {
        backgroundColor: '#4CAF50',
        padding: 5,
        width: 70,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
    },
    joinButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        margin: 3,
        fontWeight: '600',
    },
});

export default ConsultCard;