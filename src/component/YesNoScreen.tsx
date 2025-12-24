import { View, Text, StatusBar, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../common/Colors';
import { Fonts } from '../common/Fonts';

// ============ TYPE DEFINITIONS ============

interface YesNoScreenProps {
    selected: string | null;
    onSelect: (value: string) => void;
}

// ============ MAIN COMPONENT ============

// IMPORTANT: Props ko object format mein destructure karna hai { } ke andar
const YesNoScreen: React.FC<YesNoScreenProps> = ({ selected, onSelect }) => {
    return (
        <View style={styles.optionsContainer}>
            <TouchableOpacity
                style={[
                    styles.optionButton,
                    selected === 'yes' && styles.optionButtonSelected
                ]}
                onPress={() => onSelect('yes')}
            >
                <Text
                    style={[
                        styles.optionButtonText,
                        selected === 'yes' && styles.optionButtonTextSelected
                    ]}
                >
                    Yes
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.optionButton,
                    selected === 'no' && styles.optionButtonSelected
                ]}
                onPress={() => onSelect('no')}
            >
                <Text
                    style={[
                        styles.optionButtonText,
                        selected === 'no' && styles.optionButtonTextSelected
                    ]}
                >
                    No
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default YesNoScreen

const styles = StyleSheet.create({
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    optionButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionButtonSelected: {
        backgroundColor: Colors.primaryColor,
        borderColor: Colors.secondaryColor,
    },
    optionButtonText: {
        fontSize: 16,
     fontFamily  : Fonts.PoppinsMedium,
        color: '#6B7280',
    },
    optionButtonTextSelected: {
        color: '#FFFFFF',
        fontFamily : Fonts.PoppinsSemiBold,
    },
})