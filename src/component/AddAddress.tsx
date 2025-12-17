import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as _PROFILE_SERVICES from '../services/ProfileServices';
import * as _ADDRESS_SERVICE from '../services/AddressService';
import { Fonts } from '../common/Fonts';
import { Colors } from '../common/Colors';
import Header from './Header';
import { Styles } from '../common/Styles';
import { showSuccessToast } from '../config/Key';
import { useIsFocused } from '@react-navigation/native';
import { Utils } from '../common/Utils';

const Address = (props: any) => {

    const isFocused = useIsFocused();
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [houseNo, setHouseNo] = useState('');
    const [local_detail, setLocal_detail] = useState('');
    const [landmark, setLandmark] = useState('');
    const [pincode, setPincode] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [addressType, setAddressType] = useState(0); 
    const [btnLoader, setBtnLoader] = useState(false);
    const [other, setOther] = useState('');
    const [UserID, setUserID] = useState<string>();
    const [isDefault, setIsDefault] = useState(false);
    const [pincodeSuggestions, setPincodeSuggestions] = useState<any[]>([]);
    const [showPincodeDropdown, setShowPincodeDropdown] = useState(false);
    const [selectedPincodeId, setSelectedPincodeId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const ADDRESS_TYPE = [{ id: 0, title: 'Home' }, { id: 1, title: 'Work' }, { id: 2, title: 'Other' }];
    const { isEdit, addressData } = props.route.params || { isEdit: false, addressData: null };

    useEffect(() => {

        getUserID();
        if (isEdit && addressData) {
            fillFormWithAddressData();
        } else {
            clearForm();
        }
    }, [isFocused, isEdit, addressData]);


    const fillFormWithAddressData = () => {
        console.log('Editing Address Data:', addressData);
        if (addressData) {
            setName(addressData.full_name || '');
            setPhoneNumber(addressData.mobile_number || '');
            setHouseNo(addressData.house_details || '');
            setLocal_detail(addressData.street_details || '');
            setLandmark(addressData.landmark || '');
            setSelectedPincodeId(addressData.pincode || '');
            setPincode(addressData.pincode || '');
            setCity(addressData.city || '');
            setState(addressData.state || '');

            if (addressData.address_type === 'home') {
                setAddressType(0);
            } else if (addressData.address_type === 'office' || addressData.address_type === 'work') {
                setAddressType(1);
            } else {
                setAddressType(2);
                setOther(addressData.address_type || '');
            }

            setIsDefault(addressData.is_default === 1 || addressData.is_default === true);
        }
    };

    const clearForm = () => {
        setName('');
        setPhoneNumber('');
        setHouseNo('');
        setLocal_detail('');
        setLandmark('');
        setPincode('');
        setCity('');
        setState('');
        setAddressType(0);
        setOther('');
        setIsDefault(false);
    };

    const fetchPincodeSuggestions = async (query: string) => {
        try {
            if (query.length >= 3) {
                const response = await fetch(`https://clikshop.co.in/api/v3/search-pincode?query=${query}`);
                const data = await response.json();
                console.log('Pincode Suggestions:', data);
                const { data: suggestions } = data;
                setPincodeSuggestions(data);
                setShowPincodeDropdown(true);
            }
            else {
                setPincodeSuggestions([]);
                setShowPincodeDropdown(false);
            }
        } catch (error) {
            console.error('Error fetching pincode suggestions:', error);
        }
    };

    const onChangePincode = (text: string) => {
        setPincode(text);
        // fetchPincodeSuggestions(text);
    };

    const onSelectPincode = (item: any) => {
        console.log('Selected Pincode Item:', item);
        const result = item.office_name.match(/^\d+/)[0];
        setPincode(item.office_name);
        // setSelectedPincodeId(item.id);
        setSelectedPincodeId(result);
        setShowPincodeDropdown(false);
    };


    const renderPincodeSuggestion = ({ item }: { item: any }) => (
        <TouchableOpacity
            onPress={() => onSelectPincode(item)}
            style={styles.suggestionItem}>
            <Text style={styles.suggestionText}>{item.office_name} - {item.pincode}</Text>
        </TouchableOpacity>
    );

    const getUserID = async () => {
        try {
            const _USER = await Utils.getData('_USER_INFO');
            const _CUSTOMER_ID = await Utils.getData('_CUSTOMER_ID');
            setUserID(_USER?.id || _CUSTOMER_ID);

        } catch (error) {
            console.log(error);
        }
    }

    const handleUpdateAddress = async () => {
        setBtnLoader(true);
        try {

            const updateData = {
                customer: UserID,
                house_details: houseNo,
                city: city,
                street_details: local_detail,
                landmark: landmark,
                state: state,
                pincode: pincode, //pincode,
                mobile_number: phoneNumber,
                is_default: isDefault === true ? 1 : 0,
                address_type: addressType === 0 ? "home" : addressType === 1 ? "office" : other,
                full_name: name,
            };

            console.log('updateData:', updateData);
            const result: any = await _ADDRESS_SERVICE.editAddress(addressData.id, updateData);
            const { status } = result;

            if (status === 'success') {
                showSuccessToast("Address Successfully Updated", 'success');
                props.navigation.navigate('EditAddress');
            } else {
                showSuccessToast('Update failed', 'error');
            }
            setBtnLoader(false);

        } catch (error) {
            console.log("UPDATE ADDRESS ERROR:", error);
            showSuccessToast('Something went wrong', 'error');
            setBtnLoader(false);
        }
    };

    const handleSaveAddress = async () => {
        setBtnLoader(true);
        console.log('selectedPincodeId', pincode);
        try {
            
            if (!isFormValid()) {
                showSuccessToast("Please fill all required fields", 'error');
                setBtnLoader(false);
                return;
            }

            // if (pincode.length < 6) {
            //     showSuccessToast("Please enter valid pincode", 'error');
            //     setBtnLoader(false);
            //     return;
            // }
            
            const dataToSend = {
                customer: UserID,
                house_details: houseNo,
                city: city,
                street_details: local_detail,
                landmark: landmark,
                state: state,
                pincode: pincode,
                mobile_number: phoneNumber,
                is_default: isDefault === true ? 1 : 0,
                address_type: addressType === 0 ? "home" : addressType === 1 ? "office" : other,
                full_name: name,
            };

            console.log('dataToSend:', dataToSend);

            const result: any = await _ADDRESS_SERVICE.postAddress(dataToSend);
            const { status } = result;

            if (status === 'success') {
                showSuccessToast("Address Successfully Added", 'success');
                props.navigation.navigate('EditAddress');
            } else {
                showSuccessToast(result.detail || result.message || 'Failed to add address', 'error');
            }
            setBtnLoader(false);

        } catch (error) {
            console.log("SAVE ADDRESS ERROR:", error);
            showSuccessToast('Something went wrong', 'error');
            setBtnLoader(false);
        }
    };

    const renderAddressType = ({ item }: { item: any }) => {
        return (

            <TouchableOpacity
                onPress={() => { setAddressType(item.id); }}
                style={[
                    styles.addressTypeButton,
                    addressType === item.id ? styles.addressTypeButtonActive : styles.addressTypeButtonInactive
                ]}
            >
                <MaterialCommunityIcons
                    name={addressType === item.id ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                    size={16}
                    color={addressType === item.id ? Colors.secondaryColor : Colors.textColor}
                />
                <Text style={[
                    styles.addressTypeText,
                    addressType === item.id ? styles.addressTypeTextActive : styles.addressTypeTextInactive
                ]}>{item.title}</Text>
            </TouchableOpacity>
        )
    }

    

    function notNull(val: any) {
        return (
            val !== null &&
            val !== undefined &&
            val !== 'NULL' &&
            val !== 'null' &&
            val !== 'undefined' &&
            val !== 'UNDEFINED' &&
            (val + '').trim() !== ''
        );
    }

    const isFormValid = () => {
        const basicValidation = notNull(name) &&
            notNull(state) &&
            notNull(houseNo) &&
            notNull(local_detail) &&
            notNull(pincode) &&
            notNull(city) &&
            addressType !== null;

        if (addressType === 2) {
            return basicValidation && notNull(other);
        }
        return basicValidation;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header title={isEdit ? 'Edit Address' : 'Add Address'} navigation={props.navigation} Is_Tab={false} />

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size={'large'} color={Colors.orangeColor} />
                </View>
            ) : (
                <View style={styles.mainContainer}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerTitle}>
                                {isEdit ? 'Edit Address' : 'Add New Address'}
                            </Text>
                        </View>
                        <View style={styles.subHeaderContainer}>
                            <Text style={styles.subHeaderText}>
                                {isEdit
                                    ? 'Update your address details!'
                                    : 'Please complete the address to place your order!!'
                                }
                            </Text>
                        </View>

                        <View style={Styles.formContainer}>
                            <View style={Styles.labelContainer}>
                                <Text style={Styles.labelText}>Full name *</Text>
                            </View>
                            <TextInput
                                style={Styles.input}
                                placeholder="Enter Full Name"
                                value={name}
                                onChangeText={setName}
                                placeholderTextColor={Colors.placeholderColor}
                            />

                            <View style={Styles.labelContainer}>
                                <Text style={Styles.labelText}>Phone number </Text>
                            </View>
                            <View style={styles.phoneContainer}>
                                <View style={styles.countryCodeContainer}>
                                    <Text style={styles.countryCodeText}>+91</Text>
                                </View>
                                <View style={styles.phoneSeperator}></View>
                                <TextInput
                                    style={styles.phoneInput}
                                    value={phoneNumber}
                                    placeholder={'Enter phone number'}
                                    placeholderTextColor={Colors.placeholderColor}
                                    onChangeText={setPhoneNumber}
                                    autoComplete='off'
                                    keyboardType='number-pad'
                                    maxLength={10}
                                />
                            </View>


                            <View style={Styles.labelContainer}>
                                <Text style={Styles.labelText}>Flat, House no., Building, Company, Apartment *</Text>
                            </View>
                            <TextInput
                                style={Styles.input}
                                placeholder="Enter House number,Building Name"
                                value={houseNo}
                                onChangeText={setHouseNo}
                                placeholderTextColor={Colors.placeholderColor}
                            />

                            <View style={Styles.labelContainer}>
                                <Text style={Styles.labelText}>Area, Street, Sector, Village *</Text>
                            </View>
                            <TextInput
                                style={Styles.input}
                                placeholder="Enter locality"
                                value={local_detail}
                                onChangeText={setLocal_detail}
                                placeholderTextColor={Colors.placeholderColor}
                            />

                            <View style={styles.fullWidthContainer}>
                                <View style={styles.fullWidthItem}>
                                    <View style={Styles.labelContainer}>
                                        <Text style={Styles.labelText}>Landmark(optional)</Text>
                                    </View>
                                    <TextInput
                                        style={[Styles.input, styles.fullWidthInput]}
                                        placeholder="Landmark"
                                        value={landmark}
                                        onChangeText={setLandmark}
                                        placeholderTextColor={Colors.placeholderColor}
                                    />
                                </View>

                                <View style={styles.pincodeContainer}>
                                    <View style={Styles.labelContainer}>
                                        <Text style={Styles.labelText}>Pincode *</Text>
                                    </View>
                                    <TextInput
                                        style={[Styles.input, styles.fullWidthInput]}
                                        placeholder="Pincode"
                                        value={pincode}
                                        onChangeText={onChangePincode}
                                        keyboardType="phone-pad"
                                        placeholderTextColor={Colors.placeholderColor}
                                        maxLength={6}
                                    />
                                    {/* {showPincodeDropdown && pincodeSuggestions.length > 0 && (
                                        <View style={styles.PincodeStyle}>
                                            <FlatList
                                                data={pincodeSuggestions}
                                                renderItem={renderPincodeSuggestion}
                                                keyExtractor={(item) => item.id.toString()}
                                                style={{ backgroundColor: 'white' }}
                                                keyboardShouldPersistTaps="handled"
                                                nestedScrollEnabled={true}
                                            />
                                        </View>
                                    )} */}

                                    {/* {showPincodeDropdown && pincodeSuggestions.length > 0 && (
                                        <View style={styles.PincodeStyle}>
                                            <ScrollView
                                                style={{ backgroundColor: 'white', maxHeight: 150 }}
                                                nestedScrollEnabled={true}
                                                keyboardShouldPersistTaps="handled"   >

                                                {pincodeSuggestions.map((item) => (
                                                    <TouchableOpacity
                                                        onPress={() => onSelectPincode(item)}
                                                        style={styles.suggestionItem}
                                                    >
                                                        <Text style={styles.suggestionText}>{item.office_name} - {item.pincode}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    )} */}
                                </View>
                            </View>

                            <View style={styles.flexContainer}>
                                <View style={styles.fullWidthItem}>
                                    <View style={Styles.labelContainer}>
                                        <Text style={Styles.labelText}>City *</Text>
                                    </View>
                                    <TextInput
                                        style={[Styles.input, styles.fullWidthInput]}
                                        placeholder="City"
                                        value={city}
                                        onChangeText={setCity}
                                        placeholderTextColor={Colors.placeholderColor}
                                    />
                                </View>
                                <View style={styles.fullWidthItem}>
                                    <View style={Styles.labelContainer}>
                                        <Text style={Styles.labelText}>State *</Text>
                                    </View>
                                    <TextInput
                                        style={[Styles.input, styles.fullWidthInput]}
                                        placeholder="State"
                                        value={state}
                                        onChangeText={setState}
                                        keyboardType="default"
                                        placeholderTextColor={Colors.placeholderColor}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={styles.addressTypeContainer}>
                            <View>
                                <Text style={styles.addressTypeTitle}>Address type (optional)</Text>
                            </View>
                            <View style={styles.addressTypeListContainer}>

                                <FlatList
                                    horizontal
                                    data={ADDRESS_TYPE}
                                    renderItem={renderAddressType}
                                    keyExtractor={(i: any) => i.id.toString()}
                                />
                            </View>
                        </View>

                        {addressType === 2 && (
                            <>
                                <View style={styles.otherTagContainer}>
                                    <Text style={Styles.labelText}>Enter new Tag *</Text>
                                </View>
                                <TextInput
                                    style={Styles.input}
                                    placeholder="Enter new Tag"
                                    value={other}
                                    onChangeText={setOther}
                                    placeholderTextColor={Colors.placeholderColor}
                                    multiline
                                />
                            </>
                        )}
                    </ScrollView>

                    <View>
                        <TouchableOpacity
                            onPress={() => setIsDefault(!isDefault)}
                            style={styles.defaultCheckContainer}
                        >
                            <MaterialCommunityIcons
                                name={isDefault ? 'checkbox-outline' : 'checkbox-blank-outline'}
                                size={18}
                                color={Colors.primaryColor}
                            />
                            <Text style={styles.defaultCheckText}>mark this as default</Text>
                        </TouchableOpacity>

                        {btnLoader ? (
                            <View style={styles.saveButton}>
                                <ActivityIndicator size={'small'} color={'#fff'} />
                            </View>
                        ) : isFormValid() ? (
                            <TouchableOpacity
                                onPress={isEdit ? handleUpdateAddress : handleSaveAddress}
                                style={styles.saveButton}
                            >
                                <Text style={styles.saveButtonText}>
                                    {isEdit ? 'Update Address' : 'Save Address'}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                disabled={true}
                                style={[styles.saveButton, styles.disabledButton]}
                            >
                                <Text style={styles.saveButtonText}>
                                    {isEdit ? 'Update Address' : 'Save Address'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.white || '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerContainer: {
        marginTop: 16,
    },
    headerTitle: {
        fontSize: 20,
        color: Colors.textColor,
        fontFamily: Fonts.PoppinsMedium,
        letterSpacing: 0.5,
    },
    subHeaderContainer: {
        marginTop: 4,
    },
    subHeaderText: {
        fontSize: 15,
        color: Colors.textColor,
        fontFamily: Fonts.PoppinsRegular,
        letterSpacing: 0.5,
    },
    shippingHeaderContainer: {
        marginTop: 12,
        paddingBottom: 16,
    },
    shippingHeaderText: {
        fontSize: 15,
        color: Colors.textColor,
        fontFamily: Fonts.PoppinsMedium,
        letterSpacing: 0.5,
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    formContainer: {
        marginTop: 20,
    },
    labelContainer: {
        marginLeft: 4,
    },
    labelText: {
        color: Colors.textColor,
        fontSize: 14,
        fontFamily: Fonts.PoppinsMedium,
        lineHeight: 24,
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    input: {
        height: 50,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        backgroundColor: Colors.bgcolor,
        letterSpacing: 0.88,
        fontFamily: Fonts.PoppinsRegular,
        color: Colors.textColor,
    },
    phoneContainer: {
        flexDirection: 'row',
        marginTop: 4,
        marginHorizontal: 4,
        paddingHorizontal: 20,
        justifyContent: 'center',
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 10,
        borderColor: Colors.bgGrayColor,
        marginBottom: 16,
    },
    countryCodeContainer: {
        marginLeft: 4,
    },
    countryCodeText: {
        color: Colors.textColor,
        fontSize: 14,
        fontFamily: Fonts.PoppinsRegular,
        lineHeight: 24,
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    phoneSeperator: {
        height: '100%',
        width: 1,
        backgroundColor: Colors.borderColor,
        marginLeft: 8,
    },
    phoneInput: {
        flex: 1,
        height: 50,
        fontSize: 14,
        color: Colors.textColor,
        borderRadius: 10,
        fontFamily: Fonts.PoppinsMedium,
        lineHeight: 16,
        paddingHorizontal: 8,
    },
    errorContainer: {
        marginLeft: 4,
        marginBottom: 16,
    },
    errorText: {
        color: Colors.errorColor,
        fontSize: 12,
        fontFamily: Fonts.PoppinsMedium,
        letterSpacing: 0.5,
    },
    fullWidthContainer: {
        width: '100%',
    },
    fullWidthItem: {
        width: '100%',
    },
    fullWidthInput: {
        width: '100%',
    },
    pincodeContainer: {
        position: 'relative',
        width: '100%',
    },
    suggestionDropdown: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 10,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        backgroundColor: 'white',
        maxHeight: 200,
        top: '80%',
    },
    PincodeStyle: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB', // gray-200
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        maxHeight: 200, top: '80%'
    },
    suggestionList: {
        backgroundColor: 'white',
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
    },
    suggestionText: {
        fontFamily: Fonts.PoppinsRegular,
        color: Colors.textColor,
    },
    flexContainer: {
        flexDirection: 'column',
    },
    addressTypeContainer: {
        marginTop: 20,
    },
    addressTypeTitle: {
        color: Colors.textColor,
        fontSize: 18,
        fontFamily: Fonts.PoppinsMedium,
        letterSpacing: 0.5,
    },
    addressTypeListContainer: {
        marginTop: 16,
    },
    addressTypeButton: {
        width: 90,
        height: 40,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        flexDirection: 'row',
    },
    addressTypeButtonActive: {
        backgroundColor: Colors.bgcolor,
        borderColor: Colors.borderColor,
    },
    addressTypeButtonInactive: {
        backgroundColor: Colors.white,
        borderColor: Colors.borderColor,
    },
    addressTypeText: {
        fontSize: 14,
        fontFamily: Fonts.PoppinsRegular,
        letterSpacing: 0.5,
        marginLeft: 4,
    },
    addressTypeTextActive: {
        color: Colors.primaryColor,
    },
    addressTypeTextInactive: {
        color: Colors.textColor,
    },
    otherTagContainer: {
        marginLeft: 4,
        marginTop: 16,
    },
    defaultCheckContainer: {
        marginVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    defaultCheckText: {
        color: Colors.textColor,
        fontFamily: Fonts.PoppinsRegular,
        fontSize: 14,
        marginLeft: 4,
    },
    saveButton: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontFamily: Fonts.PoppinsMedium,
        fontSize: 14,
    },
    disabledButton: {
        opacity: 0.5,
    },
});

export default Address;