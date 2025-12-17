import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'
import { Fonts } from '../common/Fonts'
import { Colors } from '../common/Colors'

const { width: screenWidth } = Dimensions.get('window');
export default function EmptyList(props: any) {
    return (
        <View style={[styles.emptyWishlist, { marginBottom: '20%' }]}>

            <LottieView
                source={require('../assets/animations/emptyorder.json')}
                autoPlay
                loop
                style={{ width: screenWidth <= 360 ? 100 : 100, height: screenWidth <= 360 ? 200 : 200 }}
            />
            <Text style={styles.emptyWishlistText}>Your order is empty</Text>
            <TouchableOpacity
                onPress={() => props.navigation.replace('TabStack', { screen: 'Shop' })}
                style={styles.browseButton}
            >
                <Text style={styles.browseButtonText}>Browse Products</Text>
            </TouchableOpacity>
        </View>


    )
}



export const styles = StyleSheet.create({

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
})