import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Colors } from '../common/Colors';
import { Fonts } from '../common/Fonts';

interface NavigationProp {
    navigate: (screen: string, params?: any) => void;
}

interface ConsultDoctorProps {
    navigation: NavigationProp;
    title: string;
    subTitle: string;
    buttonText: string;
    image: any
}

const ConsultDoctor: React.FC<ConsultDoctorProps> = ({
    navigation,
    title,
    subTitle,
    buttonText,
    image
}) => {
    
    return (
        <View style={styles.banner}>
            <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>{title}</Text>
                <Text style={styles.bannerSubtitle}>{subTitle}</Text>
                <TouchableOpacity

                    style={styles.consultButton}
                    onPress={() => navigation.navigate('PatientSelect')}
                >
                    <Text style={styles.consultButtonText}>{buttonText}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.bannerImageContainer}>
                {/* <Image
                    source={image}
                    style={styles.consultantImage}
                /> */}
            </View>
        </View>
    );
};

export default ConsultDoctor;

const { width, height } = Dimensions.get('screen');


const styles = StyleSheet.create({
    banner: {
     
            flex: 1,
        backgroundColor: '#FFE28C',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: height * 0.15, // 15% of screen height
    
    },

    bannerContent: {
        flex: 1,
        paddingRight: 12,
        justifyContent: 'center',
    },

    bannerTitle: {
        fontSize: width > 400 ? 16 : 14, // Responsive font size
        fontFamily: Fonts.PoppinsSemiBold,
        color: Colors.textColor,
        marginBottom: 6,
        lineHeight: width > 400 ? 24 : 20,
    },

    bannerSubtitle: {
        fontSize: width > 400 ? 14 : 12,
        color: '#1E1E1EA6',
        marginBottom: 12,
        fontFamily: Fonts.PoppinsMedium,
        lineHeight: width > 400 ? 20 : 18,
    },

    consultButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 6,
        alignSelf: 'flex-start',
        maxWidth: '100%', // Button won't exceed 80% of content width
    },

    consultButtonText: {
        fontSize: width > 400 ? 12 : 12,
       fontFamily :Fonts.PoppinsMedium,
        color: Colors.black,
        textAlign: 'center',
    },

    bannerImageContainer: {
        width: width * 0.25,        // 25% of screen width
        minWidth: 80,               // Minimum width
        maxWidth: 120,              // Maximum width
        aspectRatio: 1,             // Keep it square
        justifyContent: 'center',
        alignItems: 'center',
    },

    consultantImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },

    // Container styles if needed
    bannerContainer: {
        paddingHorizontal: 16,
        paddingVertical: 20,
    },

    bannerRow: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'stretch',
    },

    assistButton: {
        backgroundColor: '#FFC18D',
        width: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
    },

    assistButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.textColor,
        textAlign: 'center',
        transform: [{ rotate: '270deg' }],
        width: 100,
    },
});
