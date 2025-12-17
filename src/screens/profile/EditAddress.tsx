import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    Modal,
    Animated,
    Dimensions,
    PanResponder,
} from 'react-native';
import { Fonts } from '../../common/Fonts';
import { Colors } from '../../common/Colors';
import Header from '../../component/Header';
import LinearGradient from 'react-native-linear-gradient';
import { useIsFocused } from '@react-navigation/native';
import * as _ADDRESS_SERVICE from '../../services/AddressService';
import { showSuccessToast } from '../../config/Key';
import { Utils } from '../../common/Utils';
import *as _PROFILE_SERVICES from '../../services/ProfileServices';
import { MaterialIcons } from '../../common/Vector';

const { height: screenHeight } = Dimensions.get('window');

const EditAddress = (props: any) => {
    const [selectedAddress, setSelectedAddress] = useState(1);
    const [selectedAddressType, setSelectedAddressType] = useState('Home');
    const [formData, setFormData] = useState({
        fullName: '',
        mobile: '',
        building: '',
        area: '',
        landmark: '',
        city: ''
    });
    const [addresses, setAddresses] = useState<any[]>([]);
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const isFocused = useIsFocused();

    useEffect(() => {
        getCustomerAddress();
    }, [isFocused]);


    const getCustomerAddress = async () => {

        try {
            const token = await Utils.getData('_TOKEN');

            if (token) {

                const result: any = await _PROFILE_SERVICES.user_profile();

                const JSONDATA = await result.json();

                if (result.status === 200) {
                    setAddresses(JSONDATA.addresses);
                }

                else {
                    showSuccessToast("No Address found", 'error')
                }
            }
            else {
                props.navigation.replace('AuthStack', { screen: 'Login' })

            }

        } catch (error) {
            console.log(error);
        }
    }



    const openBottomSheet = () => {
        // setShowEditForm(true);
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(overlayOpacity, {
                toValue: 0.5,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const closeBottomSheet = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: screenHeight,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(overlayOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // setShowEditForm(false);
            // setEditingAddressId(null);
            resetForm();
        });
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            mobile: '',
            building: '',
            area: '',
            landmark: '',
            city: ''
        });
        setSelectedAddressType('Home');
    };

    const editAddress = (addressId: number) => {
        const addressToEdit = addresses.find(addr => addr.id === addressId);

        props.navigation.navigate('AddAddress', {
            isEdit: true,
            addressData: addressToEdit,


        })



    };


  
    const UpdateDefaultAddress = async (addressId: string) => {

        try {

            const updateData = {

                is_default: true
            };


            const result: any = await _ADDRESS_SERVICE.editAddress(addressId, updateData);
            const { status } = result;

            if (status === 'success') {
                console.log("addressupdateee", result);
                showSuccessToast("Address Successfully Updated", 'success');
                props.navigation.goBack()

            } else {
                showSuccessToast(result.message || 'Update failed', 'error');
            }

        } catch (error) {
            console.log("UPDATE ADDRESS ERROR:", error);
            showSuccessToast('Something went wrong', 'error');
        }
    };

    const DeleteAddress = async (addressId: string) => {
        console.log("addresid", addressId);

        try {
            const result: any = await _ADDRESS_SERVICE.DeleteAddressByID(addressId);
            const { status } = result;
            if (status === 'success') {
                console.log("addressupdateee", result);
                showSuccessToast("Address Successfully Deleted", 'success');
                getCustomerAddress();

            } else {
                showSuccessToast(result.message || 'Delete failed', 'error');
            }

        } catch (error) {
            console.log("DELETE ADDRESS ERROR:", error);
            showSuccessToast('Something went wrong', 'error');
        }
    };

    const handleAddressSelection = async (addressId: any) => {
        try {
            setSelectedAddress(addressId);
            await UpdateDefaultAddress(addressId);

        } catch (error) {
            console.error('Error:', error);
        } finally {
            // setIsUpdating(false);
        }
    };




    const MainForm = () => (
        <View style={styles.container}>
            <Header title='Edit Address' navigation={props.navigation} Is_Tab={false} />

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
                {addresses.length > 0 && (
                    <Text style={styles.sectionTitle}>Select your primary address for delivery</Text>
                )}

                {addresses && addresses.length > 0 ? (
                    addresses.map((address) => (
                        <TouchableOpacity
                            key={address.id}
                            style={[
                                styles.addressCard,
                                selectedAddress === address.id && styles.selectedCard
                            ]}
                            onPress={() => handleAddressSelection(address.id)}
                        >
                            <View style={styles.addressTypeChip}>
                                <Text style={styles.addressTypeText}>{address.address_type}</Text>
                            </View>

                            <Text style={styles.addressText}>
                                {address.house_details} {address?.city} {address?.state}
                            </Text>

                            <View style={styles.actionButtons}>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.editButton]}
                                    onPress={() => editAddress(address.id)}
                                >
                                    <MaterialIcons name="edit" size={16} color="#4CAF50" />
                                    <Text style={styles.editButtonText}>Edit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.actionButton, styles.deleteButton]}
                                    onPress={() => DeleteAddress(address.id)}
                                >
                                    <MaterialIcons name="delete" size={16} color="#F44336" />
                                    <Text style={styles.deleteButtonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={[
                                styles.radioButton,
                                selectedAddress === address.id && styles.selectedRadio
                            ]}>
                                {selectedAddress === address.id && <View style={styles.radioDot} />}
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconContainer}>
                            <Text style={styles.emptyIcon}>📍</Text>
                        </View>

                        <Text style={styles.emptyTitle}>No Addresses Found</Text>
                        <Text style={styles.emptySubtitle}>
                            You haven't added any delivery addresses yet.{'\n'}
                            Add your first address to get started.
                        </Text>

                        <TouchableOpacity
                            style={styles.addAddressButton}
                            onPress={() => props.navigation.navigate('AddAddress', { isEdit: false })}
                        >
                            <Text style={styles.addAddressButtonText}>+ Add New Address</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </ScrollView>

            {addresses.length > 0 && (
                <View style={{ paddingHorizontal: 15, paddingVertical: 15 }}>
                    <LinearGradient colors={[Colors.secondaryColor, Colors.primaryColor]} style={[styles.addAddressBtn, { paddingHorizontal: 15 }]} >
                        <TouchableOpacity onPress={() => props.navigation.navigate('AddAddress', { isEdit: false })}>
                            <Text style={styles.addAddressBtnText}>Add New Address</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            )}

        </View>
    );

    return <MainForm />;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    formContainer: {
        flex: 1,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.black,
        marginBottom: 20,
    },
    addAddressBtn: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    addAddressBtnText: {
        color: 'white',
        fontSize: 16,
        fontFamily: Fonts.PoppinsMedium,
    },
    addressCard: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        backgroundColor: '#ffffff',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    selectedCard: {
        borderColor: '#7CB342',
        backgroundColor: '#f8fff8',
        borderWidth: 2,
    },
    addressTypeChip: {
        backgroundColor: '#7CB342',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 15,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    addressTypeText: {
        color: 'white',
        fontSize: 12,
        fontFamily: Fonts.PoppinsMedium,
    },
    addressText: {
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.textColor,
        fontSize: 14,
        marginBottom: 10,
        paddingRight: 80,
        lineHeight: 20,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    deleteButton: {
        backgroundColor: '#FFEBEE',
        borderWidth: 1,
        borderColor: '#F44336',
    },

    deleteButtonText: {
        fontSize: 12,
        color: '#F44336',
        fontWeight: '500',
    },
    editButton: {
        backgroundColor: '#E8F5E8',
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    editButtonText: {
        fontSize: 12,
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.primaryColor
    },
    radioButton: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 12,
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedRadio: {
        borderColor: '#7CB342',
        backgroundColor: '#7CB342',
    },
    radioDot: {
        width: 10,
        height: 10,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 60,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyIcon: {
        fontSize: 40,
    },
    emptyImage: {
        width: 200,
        height: 200,
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontFamily: Fonts.PoppinsMedium,
        color: '#000000',
        marginBottom: 12,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        fontFamily: Fonts.PoppinsMedium,
        marginBottom: 32,
    },
    addAddressButton: {
        backgroundColor: Colors.primaryColor,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    addAddressButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: Fonts.PoppinsMedium
    },
    primaryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 10,
        marginBottom: 12,
        minWidth: 200,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        minWidth: 200,
    },
    secondaryButtonText: {
        color: '#374151',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
    },
    overlayTouch: {
        flex: 1,
    },
    bottomSheet: {
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        height: screenHeight * 0.8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#ddd',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    bottomSheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    bottomSheetTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    closeButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
    },
    closeButtonText: {
        fontSize: 16,
        color: '#666',
        fontWeight: 'bold',
    },
    bottomSheetContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    formGroup: {
        marginBottom: 20,
    },
    formLabel: {
        marginBottom: 8,
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.textColor,
        fontSize: 16,
    },
    required: {
        color: '#e53e3e',
        fontFamily: Fonts.PoppinsMedium,
    },
    addressTypeTabs: {
        flexDirection: 'row',
        gap: 12,
    },
    addressTypeTab: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        backgroundColor: '#f5f5f5',
        borderRadius: 25,
    },
    activeTab: {
        backgroundColor: '#7CB342',
        borderColor: '#7CB342',
    },
    tabText: {
        fontSize: 14,
        fontFamily: Fonts.PoppinsMedium,
        color: 'black',
    },
    activeTabText: {
        color: 'white',
        fontFamily: Fonts.PoppinsMedium,
    },
    formInput: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        fontSize: 14,
        fontFamily: Fonts.PoppinsRegular,
        backgroundColor: '#fafafa',
    },
    buttonContainer: {
        paddingBottom: 30,
    },
    saveBtn: {
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    saveBtnText: {
        color: 'white',
        fontSize: 16,
        fontFamily: Fonts.PoppinsMedium,
    },
});

export default EditAddress;