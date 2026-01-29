import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import { Colors } from '../common/Colors';
import { Fonts } from '../common/Fonts';

const { width, height } = Dimensions.get('window');

const isSmallDevice = width < 360;
const isTablet = width >= 768;

interface YesNoScreenProps {
    selected: string | null;
    onSelect: (value: string) => void;
    options: string[];
}

const YesNoScreen: React.FC<YesNoScreenProps> = ({
    selected,
    onSelect,
    options,
}) => {
    return (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >


            {options.map(option => {
                const isSelected = selected === option;

                return (

                    <TouchableOpacity
                        key={option}
                        style={[
                            styles.optionButton,
                            isSelected && styles.optionSelected,
                        ]}
                        onPress={() => onSelect(option)}
                        activeOpacity={0.85}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                isSelected && styles.optionTextSelected,
                            ]}
                            numberOfLines={2}
                            adjustsFontSizeToFit
                        >
                            {option}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

export default YesNoScreen;


const styles = StyleSheet.create({
    scroll: {
        width: '100%',
        maxHeight: height * 0.45, // 🔥 auto adjust on all screens
    },

    container: {
        paddingVertical: 8,
        gap: isSmallDevice ? 10 : 14,
    },

    optionButton: {
        width: '100%',
        paddingVertical: isSmallDevice ? 12 : isTablet ? 18 : 14,
        paddingHorizontal: isTablet ? 24 : 16,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: '#C9CFBC',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },

    optionSelected: {
        backgroundColor: Colors.primaryColor,
        borderColor: Colors.primaryColor,
    },

    optionText: {
        fontSize: isSmallDevice ? 14 : isTablet ? 18 : 16,
        fontFamily: Fonts.PoppinsMedium,
        color: '#6B7280',
        textAlign: 'center',
    },

    optionTextSelected: {
        color: '#FFFFFF',
    },
});
