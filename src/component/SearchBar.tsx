import React, { useEffect, useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Text,
    Dimensions,
    Image,
    Pressable,
} from 'react-native';
import { Images } from '../common/Images';
import { Utils } from '../common/Utils';
const { width } = Dimensions.get('window');
import *as _PROFILE_SERVICES from '../services/ProfileServices';
import *as _ADDRESS_SERVICE from '../services/AddressService';
import * as _HOME_SERVICE from '../services/HomeServices';
import { Fonts } from '../common/Fonts';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Colors } from '../common/Colors';
import { MaterialCommunityIcons } from '../common/Vector';

interface SearchBarProps {
    placeholder?: string;
    onSearch?: (text: string) => void;
    onVoicePress?: () => void;
    value?: string;
    navigation?: any;
    type?: string,
    onChangeText?: (text: string) => void;
    showVoiceIcon?: boolean;
}
interface Address {
    id: string;
    address_type: string;
    full_name: string;
    mobile_number: string;
    house_details: string;
    street_details: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
    delivery_instructions: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
    latitude: string | null;
    longitude: string | null;
    customer: string;
};


interface Address {
    city: string;
    house_details: string;
    street_details: string
};

interface User {
    first_name: string;
    profile_picture: any
};

interface NavigationProp {
    navigate: (screen: string, params?: any) => void;
    replace: (screen: string, params?: any) => void;

}


const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = "Search for products",
    // onSearch,
    onVoicePress,
    value,
    // navigation,
    type,
    // onChangeText,
    showVoiceIcon = true,
}) => {

    const navigation = useNavigation<NavigationProp>(); // ✅ This always works
    const isFocused = useIsFocused()
    const [searchText, setSearchText] = useState(value || '');
    const [UserData, setUserData] = useState<User>();
    const [UserAddress, setUserAddress] = useState<Address>();

    useEffect(() => {
        // getUser();
        getCustomerAddress();
    }, [isFocused]);

    const getCustomerAddress = async () => {

        try {
            const token = await Utils.getData('_TOKEN');

            if (token) {
                const result: any = await _PROFILE_SERVICES.user_profile();
                console.log("tokeennnn->", token);
                const JSONDATA = await result.json();
                console.log("reponsee-userr", result);
                if (result.status === 200) {
                    setUserData(JSONDATA);
                    console.log("User Dataaa", JSONDATA);
                    const defaultAddress = JSONDATA.addresses?.find((item: Address) => item.is_default === true);
                    if (defaultAddress) {
                        setUserAddress(defaultAddress);

                    } else {
                        console.log("Default address not found");
                    }
                }

                else if (result.status === 404) {
                    navigation.replace('AuthStack', { screen: 'Login' })

                }

                else {

                }
            }

        } catch (error) {
            console.log(error);
        }
    }




    return (
        <View style={styles.container}>
            <View style={styles.headerTop}>
                <View style={styles.locationContainer}>

                    {type === 'consult' || type === 'wellness' ?
                        (<TouchableOpacity style={[styles.profileheader, { width: 20, }]} onPress={() => navigation.navigate('Profile')}>
                            <Image source={require('../assets/images/location.png')} style={{ height: 24, width: 24 }} />
                        </TouchableOpacity>)
                        :
                        (
                            <TouchableOpacity
                                style={[
                                    styles.profileheader,
                                    {
                                        backgroundColor: '#fff',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }
                                ]}
                                onPress={() => navigation.navigate('Profile')}
                            >
                                {UserData ? <Text style={[styles.UserText, { textAlign: 'center' }]}>
                                    {/* {UserData?.first_name.charAt(0).toUpperCase()} */}
                                    {UserData?.first_name?.charAt(0)?.toUpperCase()}
                                </Text> : ""
                                    // <Image source={{ uri: UserData?.profile_picture }} style={{ height: 20, width: 20, tintColor: '#fff' }} /> 

                                }
                            </TouchableOpacity>
                        )}

                    <View style={styles.headerprofile}>
                        <Text style={styles.locationText}>{UserAddress?.city}</Text>
                        <Text style={styles.sublocationText}>{UserAddress?.house_details}</Text>
                    </View>
                </View>

                {type === 'consult' || type === 'wellness' ?

                    (<View style={styles.askMuniButton}>
                        {/* <TouchableOpacity style={styles.askMuniButton} >
                            <Text style={styles.askMuniText}>Ask Muni</Text>
                            <Image source={Images.messageIcon} style={{ height: 20, width: 24, tintColor: '#fff' }} />
                        </TouchableOpacity> */}

                        {/* <TouchableOpacity style={styles.askMuniButton}>
                            <Image source={require('../assets/images/user_profile.png')} style={{ height: 20, width: 20, tintColor: '#fff' }} />
                        </TouchableOpacity> */}

                    </View>)

                    :
                    <></>
                    // (
                    //     <TouchableOpacity style={styles.askMuniButton}>
                    //         <Text style={styles.askMuniText}>Ask Muni</Text>
                    //         <Image source={Images.messageIcon} style={{ height: 20, width: 24, tintColor: '#fff' }} />
                    //     </TouchableOpacity>)
                }


            </View>


            {type === 'wellness' ? <></> :
                (
                    // <TouchableOpacity style={styles.searchContainer} onPress={()=>console.log("searchhhhhhhh")}>

                    //     <TextInput
                    //         style={styles.textInput}
                    //         placeholder={placeholder}
                    //         placeholderTextColor="#999"
                    //         // value={searchText}
                    //         // onChangeText={handleTextChange}
                    //         // onSubmitEditing={handleSearch}
                    //         // returnKeyType="search"
                    //     />

                    //     <Image source={Images.linemark} style={[styles.iconstyle, { width: 1, height: 25 }]} />
                    //     {showVoiceIcon && (
                    //         <TouchableOpacity onPress={onVoicePress} style={styles.voiceIconContainer}>
                    //             <Image source={Images.micIcon} style={styles.iconstyle} />
                    //         </TouchableOpacity>
                    //     )}
                    // </TouchableOpacity>



                    <Pressable style={styles.searchContainer}
                        onPress={() => navigation.navigate('ProductSearch')}  >

                        {/* <TextInput
                            style={styles.textInput}
                            placeholder={placeholder}
                            placeholderTextColor="#999"
                            // value={searchText}
                            // onChangeText={handleTextChange}
                            // onSubmitEditing={handleSearch}
                            // returnKeyType="search"
                        /> */}

                        <Text
                            style={[
                                styles.textFieldText,
                                { color: value ? Colors.textColor : Colors.placeholderColor }
                            ]}
                        >
                            {value || placeholder}
                        </Text>


                        <Image source={Images.linemark} style={[styles.iconstyle, { width: 1, height: 25 }]} />

                        {showVoiceIcon ? (
                            <TouchableOpacity onPress={onVoicePress} style={styles.voiceIconContainer}>
                                <Image source={Images.micIcon} style={styles.iconstyle} />

                            </TouchableOpacity>
                        ) :

                            <MaterialCommunityIcons name="arrow-right" size={20} color={Colors.textColor} />
                        }
                    </Pressable>


                )
            }


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 1,
        paddingVertical: 8,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 15,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    headerprofile: {
        paddingHorizontal: 10,
        width: width * 0.6,
    },

    locationText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: Fonts.PoppinsSemiBold
    },
    profileheader: {
        // backgroundColor: '#fff',
        borderRadius: 40,
        height: 50,
        alignContent: 'center',
        // borderWidth: 1,
        // borderColor: Colors.textColor,
        justifyContent: 'center',
        alignItems: 'center',
        width: 50
    },
    UserText: {
        color: Colors.textColor,
        textAlign: 'center',
        fontFamily: Fonts.PoppinsMedium,
    },
    sublocationText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontFamily: Fonts.PoppinsMedium
    },
    askMuniButton: {
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
    },
    askMuniText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },

    textFieldContainer: {
        borderWidth: 1,
        flexDirection: 'row',
        // alignItems: 'center',
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        backgroundColor: '#fff',
        minHeight: 45,
        justifyContent: 'space-between',
    },
    textFieldText: {
        fontSize: 16,
        flex: 1,
        color: '#333',
        paddingVertical: 0,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingVertical: 0,
    },
    iconstyle: {
        height: 17,
        width: 17,
    },
    voiceIconContainer: {
        marginLeft: 12,
    },
});

export default SearchBar;