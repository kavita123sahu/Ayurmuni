import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Asset, CameraOptions, ImageLibraryOptions, ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Fonts } from "../common/Fonts";
import { Colors } from "../common/Colors";


interface ProfileData {
    first_name: string;
    mobile_number: string;
    email: string;
    address: string;
    profile_picture: Asset | null;
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

export const ProfileField: React.FC<ProfileFieldProps> = ({
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


const styles = StyleSheet.create({
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
})