import React, { useEffect, useState } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,TextInput,Image,ScrollView,Alert,SafeAreaView,StatusBar,Keyboard,} from 'react-native';
import { Ionicons, } from '../../common/Vector';
import Header from '../../component/Header';
import * as _PROFILE_SERVICES from '../../services/ProfileServices';
import { useIsFocused } from '@react-navigation/native';
import { Fonts } from '../../common/Fonts';
import { Colors } from '../../common/Colors';
import LinearGradient from 'react-native-linear-gradient';
import { Utils } from '../../common/Utils';
import { showSuccessToast } from '../../config/Key';
import * as _ADDRESS_SERVICE from '../../services/AddressService';
import { Asset, CameraOptions, ImageLibraryOptions, ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { EmailValidator, requestCameraPermission } from '../../common/Validator';
import { useSelector } from 'react-redux';

interface ProfileData {
    first_name: string;
    mobile_number: string;
    email: string;
    address: string;
    profile_picture: Asset | null;
}

interface EditingState {
    first_name: boolean;
    mobile_number: boolean;
    email: boolean;
    address: boolean;
    profile_picture: boolean;
}

interface ProfileFieldProps {
    label: string;
    value: string;
    field: keyof ProfileData;
    placeholder: string;
    isEditing: boolean;
    onEdit: (field: keyof ProfileData) => void;
    onSave: (field: keyof ProfileData, value: string) => void;
}

interface EditProfileProps {
    navigation?: any;
}

const EditProfile: React.FC<EditProfileProps> = (props) => {
    const [profileData, setProfileData] = useState<ProfileData>({
        first_name: '',
        mobile_number: '',
        email: '',
        address: '',
        profile_picture: null
    });

    const userDetails = useSelector((state: any) => {
        return state.user_info_reducer?.user_info;
    })

    console.log(userDetails, 'userDetailsuserDetai0ls')

    const [originalData, setOriginalData] = useState<ProfileData>({
        first_name: '',
        mobile_number: '',
        email: '',
        address: '',
        profile_picture: null
    });

    const [profileImage, setprofileImage] = useState('');
    const isFocused = useIsFocused();
    const [customerID, setcustomerID] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isEditing, setIsEditing] = useState<EditingState>({
        first_name: false,
        mobile_number: false,
        email: false,
        address: false,
        profile_picture: false
    });

    const hasChanges = (): boolean => {
        return (
            profileData.first_name !== originalData.first_name ||
            profileData.mobile_number !== originalData.mobile_number ||
            profileData.email !== originalData.email ||
            profileData.address !== originalData.address ||
            profileData.profile_picture !== originalData.profile_picture
        );
    };

    const handleEdit = (field: keyof ProfileData): void => {
        if (field === 'address') {
            props.navigation.navigate('EditAddress');
            return;
        }

        setIsEditing({
            ...isEditing,
            [field]: !isEditing[field],
        });
    };

    const handleSave = (field: keyof ProfileData, value: string): void => {
        setProfileData({
            ...profileData,
            [field]: value,
        });

        setIsEditing({
            ...isEditing,
            [field]: false,
        });
    };

    const handleImagePicker = () => {
        Alert.alert(
            'Select Image',
            'Choose an option to select image',
            [
                {
                    text: 'Camera',
                    onPress: openCamera,
                },
                {
                    text: 'Gallery',
                    onPress: openGallery,
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
    };

    const openCamera = async () => {
        try {
            const hasPermission = await requestCameraPermission();
            if (!hasPermission) {
                showSuccessToast('Camera permission denied', 'error');
                return;
            }

            const options: CameraOptions = {
                mediaType: 'photo',
                includeBase64: false,
                maxHeight: 1000,
                maxWidth: 1000,
                quality: 0.7,
                saveToPhotos: false,
            };

            launchCamera(options, (response: ImagePickerResponse) => {

                if (response.didCancel) {

                    return;
                }

                if (response.errorCode) {

                    showSuccessToast('Camera Error: ' + response.errorMessage, 'error');
                    return;
                }

                if (response.assets && response.assets.length > 0) {
                    const asset = response.assets[0];

                    if (asset.uri) {
                        setProfileData(prev => ({ ...prev, profile_picture: asset }));
                        showSuccessToast('Photo Captured Successfully', 'success');
                    }
                }
            });
        } catch (error) {
            showSuccessToast('Camera failed to open', 'error');
        }
    };

    const openGallery = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
            quality: 0.8,
        };

        launchImageLibrary(options, (response: ImagePickerResponse) => {
            if (response.didCancel || response.errorMessage) {
                showSuccessToast('Gallery cancelled or error', 'error');
                return;
            }

            if (response.assets && response.assets[0]) {
                const asset = response.assets[0];
                console.log(asset, 'data');
                setProfileData(prev => ({ ...prev, profile_picture: asset }));
                showSuccessToast('Photo Selected Successfully', 'success');
            }
        });
    };

    useEffect(() => {
        getUser();
    }, [isFocused]);

    const removeCountryCodeRobust = (phoneNumber: string): string => {
        if (!phoneNumber) return '';
        return phoneNumber
            .replace(/^\+91/, '')
            .replace(/^91/, '')
            .replace(/^\+/, '')
            .trim();
    };

    const getDefaultAddressString = (addresses: any) => {
        const defaultAddr = addresses?.find((item: any) => item.is_default === true);
        if (defaultAddr) {
            return `${defaultAddr.house_details}, ${defaultAddr.street_details}, ${defaultAddr.city}, ${defaultAddr.state} - ${defaultAddr.pincode}`;
        }
        return '';
    };

    const getUser = async () => {
        const _USER_INFO = await Utils.getData('_USER_INFO');
        const CUSTOMER_ID = await Utils.getData('_CUSTOMER_ID');
        setcustomerID(_USER_INFO?.id || CUSTOMER_ID);

        try {
            const result: any = await _PROFILE_SERVICES.user_profile();

            const responseJSON = await result.json();
            const { status, message = "" } = result;

            if (status === 200) {
                const userData = {
                    first_name: responseJSON?.first_name,
                    mobile_number: removeCountryCodeRobust(responseJSON?.verified_phone_number),
                    email: responseJSON?.email,
                    address: getDefaultAddressString(responseJSON?.addresses),
                    profile_picture: responseJSON?.profile_picture || ""
                };

                setProfileData(userData);
                setOriginalData(userData); // Original data store karo
                setprofileImage(responseJSON?.profile_picture);
            } else if (result.status === 404) {
                props.navigation.replace('AuthStack', { screen: 'Login' });
            } else {
                showSuccessToast(responseJSON.error, 'error');
            }
        } catch (error) {
            console.log(error);
        }

    };

    

    const ProfileField: React.FC<ProfileFieldProps> = ({
        label,
        value,
        field,
        placeholder,
        isEditing: fieldIsEditing,
        onEdit,
        onSave
    }) => {
        const [tempValue, setTempValue] = useState<string>(value);

        useEffect(() => {
            setTempValue(value);
        }, [value]);

        return (
            <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>{label}</Text>
                <View style={styles.fieldRow}>
                    {fieldIsEditing ? (
                        <TextInput
                            style={styles.editInput}
                            value={tempValue}
                            onChangeText={setTempValue}
                            placeholder={placeholder}
                            onBlur={() => onSave(field, tempValue)}
                            autoFocus
                        />
                    ) : (
                        <Text style={styles.fieldValue}>{value}</Text>
                    )}
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => onEdit(field)}
                    >
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const MobileField: React.FC = () => {
        const [tempValue, setTempValue] = useState<string>(profileData.mobile_number);

        useEffect(() => {
            setTempValue(profileData.mobile_number);
        }, [profileData.mobile_number]);

        return (
            <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Mobile Number</Text>
                <View style={styles.fieldRow}>
                    {isEditing.mobile_number ? (
                        <View style={styles.mobileInputContainer}>
                            <View style={styles.countryCode}>
                                <Text style={styles.countryCodeText}>+91</Text>
                            </View>
                            <TextInput
                                style={styles.mobileInput}
                                value={tempValue}
                                placeholderTextColor={'#666'}
                                onChangeText={setTempValue}
                                placeholder="Mobile Number"
                                keyboardType="numeric"
                                maxLength={10}
                                onBlur={() => handleSave('mobile_number', tempValue)}
                                autoFocus
                            />
                        </View>
                    ) : (
                        <View style={styles.mobileDisplay}>
                            <Text style={styles.countryCodeDisplay}>+91</Text>
                            <Text style={styles.mobileNumber}>{profileData.mobile_number}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEdit('mobile_number')}
                    >
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const handleSaveChanges = async () => {
        Keyboard.dismiss();

        if (profileData.email.trim() && !EmailValidator(profileData.email.trim())) {
            showSuccessToast('Please enter a valid email address', 'error');
            return;
        }

        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const formData = new FormData();

            formData.append('first_name', profileData.first_name);
            formData.append('email', profileData.email);
            formData.append('verified_phone_number', `+91${profileData.mobile_number}`);
            formData.append('address', profileData.address);

            if (profileData.profile_picture && profileData.profile_picture.uri) {
                const imageFile = {
                    uri: profileData.profile_picture.uri,
                    type: profileData.profile_picture.type || 'image/jpeg',
                    name: profileData.profile_picture.fileName || `profile_${Date.now()}.jpg`,
                };
                formData.append('profile_picture', imageFile as any);
            }

            const response: any = await _PROFILE_SERVICES.update_Profile(formData);

            if (!response) {
                throw new Error('No response from server');
            }

            const jsonResponse = await response.json();

            if (response.status === 200) {
                setOriginalData({ ...profileData });
                setIsEditing({
                    first_name: false,
                    mobile_number: false,
                    email: false,
                    address: false,
                    profile_picture: false
                });

                showSuccessToast(jsonResponse?.message || 'Profile updated successfully', 'success');

                getUser();

            } else if (response.status === 401) {
                showSuccessToast('Authorization Error', 'error');
                props.navigation.replace('AuthStack', { screen: 'Login' });
            } else {
                showSuccessToast(jsonResponse?.message || 'Please fill valid data', 'error');
            }

        } catch (error) {
            console.log("Network Error:", error);
            showSuccessToast('Something went wrong. Please check your connection.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const shouldShowButton = hasChanges() || Object.values(isEditing).some(value => value === true);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.primaryColor} />

            <Header title='Edit Profile' navigation={props.navigation} Is_Tab={false} />

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                <View style={styles.profileSection}>
                    <View style={styles.profileImageContainer}>
                        {/* {profileData.profile_picture && profileData.profile_picture.uri ? (
                            <Image source={{ uri: profileData.profile_picture.uri }} style={styles.profileImage} />
                        ) : */}
                        {profileImage && profileImage !== '' ? (
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        ) : (
                            <View style={styles.ProfileContainer}>
                                <Text style={styles.profileText}>
                                    {profileData?.first_name?.charAt(0)?.toUpperCase()}
                                </Text>
                            </View> 
                        )}

                        <TouchableOpacity
                            style={styles.editPictureButton}
                            onPress={handleImagePicker}
                        >
                            <Ionicons name="camera" size={20} color={Colors.primaryColor} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.formContainer}>
                    <ProfileField
                        label="Full Name"
                        value={userDetails?.first_name || profileData.first_name}
                        field="first_name"
                        placeholder="Enter your full name"
                        isEditing={isEditing.first_name}
                        onEdit={handleEdit}
                        onSave={handleSave}
                    />

                    <MobileField />

                    <ProfileField
                        label="Email Address"
                        value={profileData.email}
                        field="email"
                        placeholder="Enter your email"
                        isEditing={isEditing.email}
                        onEdit={handleEdit}
                        onSave={handleSave}
                    />

                    <ProfileField
                        label="Address"
                        value={profileData.address}
                        field="address"
                        placeholder="Enter your address"
                        isEditing={isEditing.address}
                        onEdit={handleEdit}
                        onSave={handleSave}
                    />
                </View>

                {/* Conditional Save Button */}
                {shouldShowButton && (
                    <TouchableOpacity
                        onPress={handleSaveChanges}
                        disabled={isSubmitting}
                        style={{ opacity: isSubmitting ? 0.6 : 1 }}
                    >
                        <LinearGradient colors={['#71A33F', '#466425']} style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    headerRight: {
        width: 24,
    },
    scrollContainer: {
        flex: 1,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: '#FAFAFA',
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    ProfileContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileText: {
        fontSize: 48,
        fontFamily: Fonts.PoppinsBold,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E5E5E5',
    },
    ProfileContain: {
        justifyContent: 'center'
    },
    editPictureButton: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    editPictureText: {
        fontSize: 16,
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.primaryColor
    },
    formContainer: {
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    fieldContainer: {
        marginBottom: 24,
    },
    fieldLabel: {
        fontSize: 16,
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.textColor,
        marginBottom: 8,
    },
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    fieldValue: {
        fontSize: 16,
        fontFamily: Fonts.PoppinsRegular,
        color: Colors.textColor,
        flex: 1,
    },
    editInput: {
        fontSize: 16,
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.textColor,
        flex: 1,
        padding: 0,
    },
    editButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    editButtonText: {
        fontSize: 14,
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.primaryColor
    },
    mobileInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    countryCode: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#E8F5E8',
        borderRadius: 6,
        marginRight: 12,
    },
    countryCodeText: {
        fontSize: 16,
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.textColor
    },
    mobileInput: {
        fontSize: 16,
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.textColor,
        flex: 1,
        padding: 0,
    },
    mobileDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    countryCodeDisplay: {
        fontSize: 16,
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.textColor,
        marginRight: 8,
    },
    mobileNumber: {
        fontSize: 16,
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.textColor
    },
    saveButton: {
        marginHorizontal: 16,
        marginTop: 32,
        marginBottom: 24,
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
});

export default EditProfile;