import React, { } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar, } from 'react-native';
import { Dimensions } from 'react-native';
import { Images } from '../../common/Images';
import LinearGradient from 'react-native-linear-gradient';
import SearchBar from '../../component/SearchBar';
import Servicecard from '../../component/servicecard';
import * as _PROFILE_SERVICES from '../../services/ProfileServices';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width } = Dimensions.get('window');



const HomePage: React.FC = () => {
    const navigation = useNavigation();


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#466425" barStyle="light-content" />

            <LinearGradient
                colors={['#466425', '#71A33F']}
                style={styles.header}>

                <TouchableOpacity>
                    <SearchBar
                        type='home'
                        showVoiceIcon={false}
                        placeholder="Search for products"
                        navigation={navigation}
                    // onSearch={handleSearch}
                    // onVoicePress={handleVoicePress}
                    // value={searchQuery}
                    // onChangeText={setSearchQuery}
                    />

                </TouchableOpacity>

                <View style={styles.advisorCard}>
                    <View style={styles.advisorIcon}>
                        <Image source={Images.robotIcon} resizeMode='cover' style={{ height: 100, width: 150 }} />
                    </View>
                    <View style={styles.advisorContent}>
                        <Text style={styles.advisorTitle}>Your Personal Ayurvedic Advisor, Anytime.</Text>
                        <Text style={styles.advisorSubtitle}>Get instant, personalized wellness guidance rooted in ancient Ayurvedic wisdom—powered by AI.</Text>
                    </View>
                </View>

                <View style={styles.askNowContainer}>
                    <TouchableOpacity style={styles.askNowButton}>
                        <Image source={Images.askbutton} style={{ height: 32, width: 122, borderRadius: 20 }} />
                    </TouchableOpacity>
                </View>

            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

                <Servicecard navigation={navigation} />

                <View style={styles.takeChargeSection}>
                    <Image source={Images.takechnageIcons} style={{ height: 112, resizeMode: "contain", width: 290, }} />
                </View>

            </ScrollView>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        backgroundColor: '#71A33F',
        paddingHorizontal: 20,
        paddingBottom: 10,
        paddingVertical: 5,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,

    },

    advisorCard: {
        padding: 15,
        paddingHorizontal: 20,
        width: '100%',
        flexDirection: 'row',
    },

    advisorIcon: {
        width: '40%',
        alignItems: 'center',

    },
    advisorContent: {

        width: '60%',
        marginLeft: 30
    },

    advisorTitle: {
        color: '#FFFFFF',
        fontSize: 14,
        lineHeight: 20,
        fontFamily : 'Poppins-Medium',
        marginBottom: 5,
    },
    
    advisorSubtitle: {
        marginTop: 5,
        color: '#FFFFFF',
        fontSize: 12,
        opacity: 0.9,
        marginBottom: 10,
        lineHeight: 16,
    },

    askNowContainer: {
        position: 'absolute',
        bottom: -20,
        left: width / 2 - 80,
        zIndex: 10,
    },
    askNowButton: {
        paddingHorizontal: 25,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
    },

    content: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },

    takeChargeSection: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },


});

export default HomePage;