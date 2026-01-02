import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { Colors } from '../common/Colors'
import { Fonts } from '../common/Fonts'


const DoctorOrder = (doctor: any, showReorder = false) => {
    return (
        <TouchableOpacity style={styles.cardWrapper} >
            <View style={styles.upcomingCard}>
                <View style={styles.doctorInfo}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={
                                doctor.profile_image
                                    ? { uri: doctor.profile_image }
                                    : require('../assets/images/user_profile.png')
                            }
                            style={styles.doctorAvatar}
                        />

                        {doctor.assured_muni && (
                            <Image
                                source={require('../assets/images/assured.png')}
                                style={styles.assuredBadge}
                            />
                        )}
                    </View>

                    <View style={styles.doctorDetails}>
                        <Text style={styles.doctorName}>{doctor.doctor_name}</Text>
                        <Text style={styles.doctorSpecialty}>{doctor.doctor_name}</Text>
                        <Text style={styles.doctorExperience}>
                            {doctor.doctor_experience} years of exp. overall
                        </Text>
                        {/* <Text style={styles.doctorSpecialty}>{doctor.doctor_interest}</Text> */}
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
                        //    onPress={() => onThumbPress?.(item)}
                        >
                            <Image
                                source={require('../assets/images/thumb.png')}
                                style={styles.buttonIcon}
                            />
                            <Text style={styles.joinButtonText}>
                                {doctor.patient_recommendation}%
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.ratButton, styles.ratingButton]}
                        //    onPress={() => onRatingPress?.(item)}
                        >
                            <Image
                                source={require('../assets/images/rating.png')}
                                style={styles.buttonIcon}
                            />
                            <Text style={styles.joinButtonText}>{doctor.rating}</Text>
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
                    <View style={styles.ratingDoctorContainer}>
                        <Text style={styles.reviewCount}>Consultation fee</Text>
                        <Text style={styles.price}>{doctor.total_amount}</Text>
                    </View>

                    <View style={styles.joinSection}>
                        {doctor?.is_active && (
                            <View style={styles.availabilityInfo}>
                                <Text style={styles.startingText}>Starting at</Text>
                                <Text style={styles.timeText}>
                                    {doctor.consultation_date}
                                </Text>
                            </View>
                        )}

                        <LinearGradient
                            style={styles.joinButton}
                            colors={[Colors.secondaryColor, Colors.primaryColor]}
                        >
                            <TouchableOpacity
                            //  onPress={() => onJoinPress?.(doctor)}
                            >
                                <Text style={styles.joinButtonText}>  {showReorder ? 'Book Again' : 'Join Now '} </Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default DoctorOrder

const styles = StyleSheet.create({

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

    ratingDoctorContainer: {
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



})