import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, StyleSheet, Alert, Image, ScrollView, ActivityIndicator, } from 'react-native';
import { Ionicons } from '../../common/Vector';
import { Colors } from '../../common/Colors';
import { Fonts } from '../../common/Fonts';
import * as _AUTH_SERVICES from '../../services/AuthService';
import { showSuccessToast } from '../../config/Key';
import { Utils } from '../../common/Utils';
import { launchImageLibrary, launchCamera, ImagePickerResponse, ImageLibraryOptions, CameraOptions, Asset } from 'react-native-image-picker';
import { EmailValidator } from '../../common/Validator';
import { GenderOption, genderOptions } from '../../common/datafile';
import { useIsFocused } from '@react-navigation/native';
import GradientButton from '../../component/GradientButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useImagePicker } from '../../hooks/useImagePicker';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    profileImage: Asset | null;
    user: string;
}

interface FormErrors {
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    profileImage: string;
}


const Onboarding = (props: any) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        profileImage: null,
        user: ''
    });

    const [errors, setErrors] = useState<FormErrors>({
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        profileImage: ''
    });

    const isFocused = useIsFocused();

    useEffect(() => {
        getUser();
    }, [isFocused]);


    const getUser = async () => {
        try {
            const user_id = await Utils.getData('_USER_ID');
            setFormData(prev => ({ ...prev, user: user_id }));
        } catch (error) {
            console.log(error);
        }
    };


    const { openCamera, openGallery } = useImagePicker({
        onImageSelected: (asset) => {
            setFormData(prev => ({
                ...prev,
                profileImage: asset,
            }));
        },
        onSuccess: (msg) => {
            showSuccessToast(msg, 'success');
        },
        onCancelOrError: () => {
            showSuccessToast('Image selection cancelled or error', 'error');
        },
        onErrorClear: () => {
            if (errors.profileImage) {
                setErrors(prev => ({ ...prev, profileImage: '' }));
            }
        },
    });



    const handleBack = () => {
        props.navigation.goBack();
        console.log('Back pressed');
    };


    const handleAddImage = () => {
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

    const handleFieldChange = (field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors: FormErrors = {
            firstName: '',
            lastName: '',
            email: '',
            gender: '',
            profileImage: ''
        };

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
            isValid = false;
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
            isValid = false;
        }

        if (formData.email.trim() && !EmailValidator(formData.email.trim())) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        if (!formData.gender) {
            newErrors.gender = 'Gender is required';
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };



    const handleProcees = async () => {

        if (!validateForm()) return;

        setIsLoading(true);
        const send_data = new FormData();
        send_data.append('user', formData.user);
        send_data.append('first_name', formData.firstName);
        send_data.append('last_name', formData.lastName);
        send_data.append('email', formData.email);
        send_data.append('gender', formData.gender);

        if (formData.profileImage && formData.profileImage.uri) {
            const imageFile = {
                uri: formData.profileImage.uri,
                type: formData.profileImage.type || 'image/jpeg',
                name: formData.profileImage.fileName || `profile_${Date.now()}.jpg`,
            };
            send_data.append('profile_picture', imageFile as any);
        }

        try {

            const response: any = await _AUTH_SERVICES.onBoarding(send_data);
            if (!response.ok) {

                setIsLoading(false);
                const errorText = await response.text();
                showSuccessToast('API Error', 'error');
                return;
            }

            const jsonResponse = await response.json();
            console.log("Response JSON:", jsonResponse);
            const { data, message = "", status } = jsonResponse;
            console.log("ResponseData:", data);

            if (status === 'success' || response.status === 200) {
                setIsLoading(false);
                Utils.storeData('_TOKEN', jsonResponse?.access);
                Utils.storeData('_USER_INFO', data);
                showSuccessToast('Welcome to Ayurmuni', 'success');
                props.navigation.replace('HomeStack', { screen: 'Home' });
            } else {

                setIsLoading(false);
                showSuccessToast(message || 'Login failed', 'error');
            }
        } catch (error) {

            setIsLoading(false);
            console.log("Network Error:", error);
            showSuccessToast('Something went wrong', 'error');
        }
    };


    const renderGenderOption = (option: GenderOption) => (
        <TouchableOpacity
            key={option.id}
            style={styles.genderOption}
            onPress={() => handleFieldChange('gender', option.value)}
        >
            <View style={styles.radioButton}>
                {formData.gender === option.value && (
                    <View style={styles.radioButtonSelected} />
                )}
            </View>
            <Text style={styles.genderLabel}>{option.label}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#ffffff" />

            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Personal Information</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.imageSection}>
                        <TouchableOpacity style={styles.imageContainer} onPress={handleAddImage}>
                            {formData.profileImage ? (
                                <Image source={{ uri: formData.profileImage.uri }} style={styles.profileImage} />
                            ) : (
                                <View style={styles.addImagePlaceholder}>
                                    <Ionicons name="camera" size={24} color="#CCCCCC" />
                                    <Text style={styles.addImageText}>Add Image</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formSection}>
                        <View style={styles.nameRow}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>
                                    First name<Text style={styles.required}>*</Text>
                                </Text>
                                <TextInput
                                    style={[styles.input, errors.firstName && styles.inputError]}
                                    value={formData.firstName}
                                    onChangeText={(text) => handleFieldChange('firstName', text)}
                                    placeholder="First name"
                                    placeholderTextColor="#CCCCCC"
                                />
                                {errors.firstName ? (
                                    <Text style={styles.errorText}>{errors.firstName}</Text>
                                ) : null}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Last name*</Text>
                                <TextInput
                                    style={[styles.input, errors.lastName && styles.inputError]}
                                    value={formData.lastName}
                                    onChangeText={(text) => handleFieldChange('lastName', text)}
                                    placeholder="Last name"
                                    placeholderTextColor="#CCCCCC"
                                />
                                {errors.lastName ? (
                                    <Text style={styles.errorText}>{errors.lastName}</Text>
                                ) : null}
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={[styles.input, errors.email && styles.inputError]}
                                value={formData.email}
                                onChangeText={(text) => handleFieldChange('email', text)}
                                placeholder="Email"
                                placeholderTextColor="#CCCCCC"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            {errors.email ? (
                                <Text style={styles.errorText}>{errors.email}</Text>
                            ) : null}
                        </View>

                        <View style={styles.genderSection}>
                            <Text style={styles.label}>
                                Gender<Text style={styles.required}>*</Text>
                            </Text>
                            <View style={styles.genderOptions}>
                                {genderOptions.map(renderGenderOption)}
                            </View>
                            {errors.gender ? (
                                <Text style={styles.errorText}>{errors.gender}</Text>
                            ) : null}
                        </View>
                    </View>
                </View>

                <View style={styles.buttonContainer}>


                    {isLoading ? (
                        <TouchableOpacity
                            // onPress={handleProcees}
                            disabled={true}
                            style={[styles.verifyButton, styles.verifyButtonLoading]}
                        >

                            <ActivityIndicator size="small" color={Colors.primaryColor} />
                            <Text style={[styles.verifyButtonText, styles.loadingText]}>
                                Processing...

                            </Text>

                        </TouchableOpacity>
                    ) : (
                        <GradientButton
                            onPress={handleProcees}
                            text='Proceed'
                        />

                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 40,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontFamily: Fonts.PoppinsSemiBold,
        color: Colors.textColor,
        textAlign: 'center',
        marginLeft: 10,
    },
    headerSpacer: {
        width: 40,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    imageSection: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    imageContainer: {
        width: 150,
        height: 150,
        borderRadius: 50,
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F8F8F8',
        borderWidth: 2,
        borderColor: '#E8E8E8',
        borderRadius: 150,
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'cover',
    },
    addImagePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F8F8F8',
        borderWidth: 2,
        borderColor: '#E8E8E8',
        borderRadius: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addImageText: {
        fontSize: 12,
        color: '#CCCCCC',
        marginTop: 4,
    },
    formSection: {
        justifyContent: "center"
    },
    nameRow: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 25,
    },
    inputGroup: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.textColor,
        marginBottom: 8,
    },
    required: {
        color: Colors.textColor,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontFamily: Fonts.PoppinsRegular,
        fontSize: 16,
        color: Colors.textColor,
        backgroundColor: '#FAFAFA',
    },
    inputError: {
        borderColor: '#FF6B6B',
        borderWidth: 1,
    },
    errorText: {
        fontSize: 12,
        color: '#FF6B6B',
        marginTop: 4,
        fontFamily: Fonts.PoppinsRegular,
    },
    genderSection: {
        marginBottom: 30,
        marginTop: 30,
    },
    genderOptions: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 8,
    },
    genderOption: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#CCCCCC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    radioButtonSelected: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4CAF50',
    },
    genderLabel: {
        fontSize: 14,
        color: Colors.textColor,
        fontFamily: Fonts.PoppinsMedium,
    },
    buttonContainer: {
        paddingBottom: 30,
        paddingHorizontal: 15,
    },

    verifyButtonLoading: {
        backgroundColor: '#f0f0f0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    verifyButton: {
        height: 50,
        backgroundColor: '#E8EDE3',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },

    verifyButtonText: {
        color: Colors.primaryColor,
        fontSize: 16,
        fontWeight: '600',
    },
    loadingText: {
        marginLeft: 8,
        color: Colors.primaryColor,
    },
});

export default Onboarding;