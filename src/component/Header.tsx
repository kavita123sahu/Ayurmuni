import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Text,
    Dimensions,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
const { width } = Dimensions.get('window');

interface HeaderProps {
    title?: string;
    navigation?: any;
    Is_Tab: boolean
}

const Header: React.FC<HeaderProps> = ({ title, navigation, Is_Tab }) => {


    return (
        <LinearGradient
            colors={['#466425', '#71A33F']}
            style={styles.header}>
            <View style={styles.headerTop}>
               
                {Is_Tab  ? null : 
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    {/* <Image source={require('../assets/images/backButton.png')} style={{ height: 20, width: 22, paddingRight: 5 }} /> */}
                </TouchableOpacity>}

                <Text style={styles.headerTitle}>{title}</Text>
                <View style={styles.rightSpace} />

            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({

    header: {
        backgroundColor: '#71A33F',
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: 8,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        paddingHorizontal: 8,
        marginTop: 12,
        marginBottom: 5,
    },
    
    backButton: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        padding: 10,
        // backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
    },


    backIcon: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
        flex: 1,
    },
    rightSpace: {
        width: 40,
    },
});

export default Header;