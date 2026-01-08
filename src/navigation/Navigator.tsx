import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";
import { NavigationContainer } from "@react-navigation/native";
import Splash from "../screens/auth/Splash";
import Login from "../screens/auth/Login";
import { Dimensions, Image, View } from "react-native";
import { Colors } from "../common/Colors";
import HomePage from "../screens/home/HomePage";
import NetworkError from "../screens/NetworkError";
import ConsultHome from "../screens/consultation/ConsultHome";
import ProfilePage from "../screens/profile/ProfilePage";
import { Images } from "../common/Images";
import ShopPage from "../screens/shop/ShopPage";
import AddAddress from "../component/AddAddress";
import AddNewPatient from "../screens/consultation/AddNewPatient";
import OtpVerify from "../screens/auth/OtpVerify";
import PatientSelect from "../screens/consultation/PatientSelect";
import SelectSpecialty from "../screens/consultation/SelectSpecialty";
import AllSpecialty from "../screens/consultation/AllSpecialty";
import DoctorSelect from "../screens/consultation/DoctorSelect";
import PaymentFlow, { PaymentLoadingScreen, PaymentSuccessScreen } from "../component/SuccessComponent";
import ProductDetail from "../screens/shop/ProductDetail";
import PackageSelect from "../screens/centers/PackageSelect";
import CenterDetail from "../screens/centers/CenterDetail";
import TermsConditions from "../screens/TermsCondition";
import Onboarding from "../screens/auth/Onboarding";
import UpdateAvailable from "../screens/UpdateAvailable";
import CartScreen from "../screens/cart/CartScreen";
import EditProfile from "../screens/profile/EditProfile";
import EditAddress from "../screens/profile/EditAddress";
import MyOrder from "../screens/orders/MyOrder";
import HealthRecords from "../screens/orders/HealthRecords";
import Search from "../screens/home/Search";
import AccessEnable from "../screens/AccessEnable";
import PaymentMethods from "../screens/categories/PaymentMethods";
import OrderDetails from "../screens/orders/OrderDetails";
import AboutUs from "../screens/profile/AboutUs";
import ProductSearch from "../screens/home/ProductSearch";
import InvoiceScreen from "../screens/orders/InvoiceScreen";
import TimeSlotBooking from "../screens/consultation/SlotBooking";
import { useNetworkStatus } from "../hooks/useDebaunce";
import GeocodingExample from "../screens/orders/GeoLocation";
import ConsultationPayment from "../screens/categories/ConsultationPayment";
import RatingScreen from "../screens/profile/Ratingus";
import CenterWellness from "../screens/centers/CenterWellness";
import { BackHandler, ToastAndroid } from "react-native";
import { useNavigationState, useNavigation } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import { RootBottomParamList, RootStackParamList } from "../../type";
import HealthAssesment from "../screens/assesment/HealthAssesment";

enableScreens();

const hideHeader = { headerShown: false };
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootBottomParamList>();
const screen_height = Dimensions.get('screen').height;


const TabStack = () => {

    const navigation = useNavigation();
    const navState = useNavigationState(state => state);
    const exitCount = useRef(0);

    useEffect(() => {
        const onBackPress = () => {
            if (navigation.canGoBack()) {
                return false;
            }

            if (exitCount.current === 0) {
                exitCount.current = 1;
                ToastAndroid.show("Press again to exit", ToastAndroid.SHORT);

                setTimeout(() => (exitCount.current = 0), 2000);
                return true;
            }

            BackHandler.exitApp();
            return true;
        };

        const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
        return () => sub.remove();
    }, [navigation, navState]);


    return (
        <Tab.Navigator
            initialRouteName="Home"
            backBehavior="history"
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: Colors.white,
                    height: screen_height * 0.08,
                },
                tabBarActiveTintColor: Colors.primaryColor,
                tabBarInactiveTintColor: Colors.tabtrasparent,
                tabBarLabelStyle: { fontSize: 12, bottom: '10%', fontWeight: '500' },
            }}>

            <Tab.Screen name="Home" component={HomePage}
                options={{
                    tabBarLabel: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => (
                        <Image source={Images.home} style={{ height: 20, width: 20, tintColor: focused ? Colors.primaryColor : Colors.tabtrasparent }} />
                    ),
                }}
            />

            <Tab.Screen name="Shop" component={ShopPage}
                options={{
                    tabBarLabel: 'Shop',
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => (

                        <Image source={Images.shop} style={{ height: 20, width: 20, tintColor: focused ? Colors.primaryColor : Colors.tabtrasparent }} />

                    ),
                }}
            />

            <Tab.Screen name="Consultation" component={ConsultHome}
                options={{
                    tabBarLabel: 'Consultation',
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => (
                        <View style={{ height: 55, width: 130, justifyContent: 'center', alignItems: 'center', }}>
                            <Image source={Images.consult} style={{ height: 20, width: 20, tintColor: focused ? Colors.primaryColor : Colors.tabtrasparent }} />
                        </View>
                    ),
                }}
            />

            <Tab.Screen name="Centers" component={CenterWellness}
                options={{
                    tabBarLabel: 'Centers',
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => (
                        <View style={{ height: 55, width: 130, justifyContent: 'center', alignItems: 'center', }}>
                            <Image source={Images.centers} style={{ height: 20, width: 20, tintColor: focused ? Colors.primaryColor : Colors.tabtrasparent }} />
                        </View>
                    ),
                }}
            />

            <Tab.Screen name="Profile" component={ProfilePage}
                options={{
                    tabBarLabel: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => (
                        <View style={{ height: 55, width: 130, justifyContent: 'center', alignItems: 'center', }}>
                            <Image source={Images.profile} style={{
                                height: 20, width: 20, tintColor: focused ? Colors.primaryColor : Colors.tabtrasparent

                            }} />
                        </View>
                    ),
                }} />
        </Tab.Navigator >

    );
};

const HomeStack = () => {
    return (
        <Stack.Navigator initialRouteName="TabStack" screenOptions={hideHeader} >
            <Stack.Screen name={'TabStack'} component={TabStack} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'ProductDetail'} component={ProductDetail} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'AddAddress'} component={AddAddress} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'PaymentSuccessScreen'} component={PaymentSuccessScreen} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'AddNewPatient'} component={AddNewPatient} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'PaymentLoadingScreen'} component={PaymentLoadingScreen} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'PaymentMethods'} component={PaymentMethods} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'AllSpecialty'} component={AllSpecialty} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'PatientSelect'} component={PatientSelect} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'SelectSpecialty'} component={SelectSpecialty} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'DoctorSelect'} component={DoctorSelect} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'PackageSelect'} component={PackageSelect} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'CenterDetail'} component={CenterDetail} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'PaymentFlow'} component={PaymentFlow} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'EditProfile'} component={EditProfile} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'TermsConditions'} component={TermsConditions} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'Onboarding'} component={Onboarding} options={{ headerShown: false, animation: 'slide_from_right' }} />
            {/* <Stack.Screen name={'VideoPlayer'} component={VideoPlayer} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'FriendCall'} component={FriendCall} options={{ headerShown: false, animation: 'slide_from_right' }} /> */}
            <Stack.Screen name={'CartScreen'} component={CartScreen} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'MyOrders'} component={MyOrder} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'EditAddress'} component={EditAddress} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'HealthRecords'} component={HealthRecords} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'Search'} component={Search} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'UpdateAvailable'} component={UpdateAvailable} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'AccessEnable'} component={AccessEnable} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'OrderDetails'} component={OrderDetails} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'AboutUs'} component={AboutUs} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'ProductSearch'} component={ProductSearch} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'InvoiceScreen'} component={InvoiceScreen} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'TimeSlotBooking'} component={TimeSlotBooking} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'GeocodingExample'} component={GeocodingExample} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'ConsultationPayment'} component={ConsultationPayment} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'RatingScreen'} component={RatingScreen} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name={'HealthAssesment'} component={HealthAssesment} options={{ headerShown: false, animation: 'slide_from_right' }} />
            
        </Stack.Navigator>

    )
}


const AuthStack = () => {
    return (
        <Stack.Navigator initialRouteName="Login" screenOptions={hideHeader}>
            <Stack.Screen name={'Login'} component={Login} options={{
                headerShown: false,
                animation: 'slide_from_right',
            }} />
            <Stack.Screen name={'OtpVerify'} component={OtpVerify} options={{
                headerShown: false,
                animation: 'slide_from_right',
            }} />
        </Stack.Navigator>
    );
};


const SplashStack = () => {

    return (
        <Stack.Navigator initialRouteName="Splash" screenOptions={hideHeader}>
            <Stack.Screen name={'Splash'} component={Splash} options={{
                headerShown: false,
                animation: 'slide_from_right',
            }} />
        </Stack.Navigator>
    );
};


const MainNavigator = () => {
    return (
        <Stack.Navigator initialRouteName='SplashStack' screenOptions={hideHeader}>
            <Stack.Screen name='SplashStack' component={SplashStack} options={hideHeader} />
            <Stack.Screen name='AuthStack' component={AuthStack} options={hideHeader} />
            <Stack.Screen name='HomeStack' component={HomeStack} options={hideHeader} />
        </Stack.Navigator>
    )
}




const Navigator = () => {
    const isConnected = useNetworkStatus();

    return (
        <NavigationContainer>

            {isConnected ?
                <MainNavigator />
                :
                <NetworkError />
            }
        </NavigationContainer>
    )
}


export default Navigator                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           