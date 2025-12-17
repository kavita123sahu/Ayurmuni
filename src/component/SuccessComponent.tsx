import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Dimensions,
    Image,
    BackHandler,
} from 'react-native';
import { Ionicons } from '../common/Vector';
import { Fonts } from '../common/Fonts';
import { Colors } from '../common/Colors';
import LottieView from 'lottie-react-native';

const { width: screenWidth } = Dimensions.get('window');


interface NavigationProp {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
    replace: (screen: string, params?: any) => void;
}

interface PaymentLoadingProps {
    navigation: NavigationProp;
    ProcessText?: string
    onPaymentComplete?: () => void;
}

interface PaymentSuccessProps {
    navigation: NavigationProp;
    SuccessText?: string;
}

// Loading Screen Component
export const PaymentLoadingScreen: React.FC<PaymentLoadingProps> = ({
    navigation,
    ProcessText,
    onPaymentComplete

}) => {
    const [spinValue] = useState(new Animated.Value(0));

    useEffect(() => {
        // 🌀 Start the animation
        const spin = Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            })
        );
        spin.start();

        // ⏱️ Simulate payment process
        const timer = setTimeout(() => {
            spin.stop();
            if (onPaymentComplete) {
                onPaymentComplete();
            } else {
                navigation.navigate('PaymentSuccess');
            }
        }, 3000);

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                navigation.replace('TabStack', { screen: 'Shop' })
                return true;
            }
        );

        // 🧹 Cleanup
        return () => {
            clearTimeout(timer);
            spin.stop();
            backHandler.remove(); // remove listener
        };
    }, []);

    const spinInterpolate = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={loadingStyles.container}>
            <View style={loadingStyles.content}>
                {/* Loading Spinner */}

                <Text style={loadingStyles.mainText}>Please wait...</Text>


                <View style={loadingStyles.spinnerContainer}>
                    <Animated.View
                        style={[
                            loadingStyles.spinner,
                            {
                                transform: [{ rotate: spinInterpolate }],
                            },
                        ]}
                    >
                        {/* <View style={loadingStyles.spinnerInner} /> */}
                        <Image source={require('../assets/images/Spinner-Gradient.png')} style={{ height: 50, width: 50 }} />

                    </Animated.View>
                </View>

                {/* Main Text */}

                {/* Subtitle */}
                <Text style={loadingStyles.subtitle}>
                    Please wait the {ProcessText} is processing
                </Text>
            </View>
        </View>
    );
};

// Success Screen Component
export const PaymentSuccessScreen: React.FC<PaymentSuccessProps> = ({
    navigation,
    SuccessText

}) => {

    const [checkmarkScale] = useState(new Animated.Value(0));

    useEffect(() => {
        // Animate checkmark appearance
        Animated.sequence([
            Animated.delay(300),
            Animated.spring(checkmarkScale, {
                toValue: 1,
                tension: 150,
                friction: 5,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleGoHome = () => {
        navigation.navigate('Home');
    };

    return (
        <View style={successStyles.container}>
            {/* <View style={successStyles.content}>
                <Text style={successStyles.mainText}>Congratulation</Text>
                <Animated.View
                    style={[
                        successStyles.successIconContainer,
                        {
                            transform: [{ scale: checkmarkScale }],
                        },
                    ]}
                >
                    <Image source={require('../assets/images/Vectorright.png')} tintColor={Colors.secondaryColor} />

                </Animated.View>
                
                <Text style={successStyles.subtitle}>
                    {SuccessText} has booked
                </Text>

                <TouchableOpacity
                    style={successStyles.homeButton}
                    onPress={handleGoHome}
                    activeOpacity={0.8}
                >
                    <Text style={successStyles.homeButtonText}>Go to homescreen</Text>
                </TouchableOpacity>
            </View> */}

            <View style={[successStyles.emptyWishlist, { marginBottom: '20%' }]}>

                <LottieView
                    source={require('../assets/animations/thankyou.json')}
                    autoPlay
                    loop
                    style={{ width: screenWidth <= 360 ? 200 : 400, height: screenWidth <= 360 ? 200 : 400 }}
                />

                <Text style={successStyles.emptyWishlistText}>Your {SuccessText} {SuccessText == 'ecom' ? 'order is Placed' : 'Doctor is Booked'}</Text>

                <TouchableOpacity
                    onPress={() => navigation.replace('TabStack', { screen: 'Shop' })}
                    style={successStyles.browseButton} >
                    <Text style={successStyles.browseButtonText}>Continue to {SuccessText == 'ecom' ? 'Shop' : 'Book Again'}</Text>
                </TouchableOpacity>


            </View>
        </View>
    );
};

// Combined Component for Easy Usage
interface PaymentFlowProps {
    navigation: NavigationProp;
    SuccessText?: string;
    ProcessText?: string
}

export const PaymentFlow: React.FC<PaymentFlowProps> = ({ navigation, SuccessText, ProcessText }) => {
    const [currentScreen, setCurrentScreen] = useState<'loading' | 'success'>('loading');

    const handlePaymentComplete = () => {
        setCurrentScreen('success');
    };

    if (currentScreen === 'loading') {
        return (
            <PaymentLoadingScreen
                navigation={navigation}
                ProcessText={ProcessText}
                onPaymentComplete={handlePaymentComplete}
            />
        );
    }

    return (
        <PaymentSuccessScreen
            navigation={navigation}
            SuccessText={SuccessText}

        />
    );
};

// Loading Screen Styles
const loadingStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    spinnerContainer: {
        marginBottom: 60,
    },
    spinner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    spinnerInner: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 4,
        borderColor: '#E0E0E0',
        borderTopColor: '#8BC34A',
    },
    mainText: {
        fontSize: 24,
        fontFamily: Fonts.PoppinsSemiBold,
        color: Colors.textColor,
        marginBottom: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        fontFamily: Fonts.PoppinsSemiBold,
        color: Colors.textColor,
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 280,
    },
});

// Success Screen Styles
const successStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    successIconContainer: {
        marginBottom: 40,
    },
    successIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#8BC34A',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#8BC34A',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    mainText: {
        fontSize: 28,
        fontFamily: Fonts.PoppinsSemiBold,
        color: Colors.textColor,
        marginBottom: 20,

        // textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: Colors.textColor,
        textAlign: 'center',
        fontFamily: Fonts.PoppinsSemiBold,
        marginBottom: 50,
        lineHeight: 24,
    },
    homeButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: Colors.secondaryColor,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        minWidth: 180,
        alignItems: 'center',
    },
    homeButtonText: {
        fontSize: 16,
        textDecorationLine: 'underline',
        color: Colors.primaryColor,
        fontWeight: '600',
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
});

// Export individual components as default
export default PaymentFlow;