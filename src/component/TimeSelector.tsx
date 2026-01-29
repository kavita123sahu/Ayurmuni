import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Fonts } from '../common/Fonts';
import { Colors } from '../common/Colors';


interface TimeSelectorProps {
    times: string[];
    selectedTime: string | null;
    onSelect: (time: string) => void;
}


const TimeSelector: React.FC<TimeSelectorProps> = ({ times, selectedTime, onSelect }) => {
    return (
        <View style={styles.timeSelectorContainer}>
            {times.map((time: any, index: any) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.timeButton,
                        selectedTime === time && styles.timeButtonSelected
                    ]}
                    onPress={() => onSelect(time)}
                >
                    <Text
                        style={[
                            styles.timeButtonText,
                            selectedTime === time && styles.timeButtonTextSelected
                        ]}
                    >
                        {time}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}


const styles = StyleSheet.create({

    timeSelectorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    timeButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeButtonSelected: {
        backgroundColor: Colors.primaryColor,
        borderColor: Colors.secondaryColor,
    },
    timeButtonText: {
        fontSize: 16,
        fontFamily: Fonts.PoppinsMedium,
        color: '#6B7280',
    },
    timeButtonTextSelected: {
        color: '#FFFFFF',
        fontFamily : Fonts.PoppinsSemiBold,
    },

})


export default TimeSelector