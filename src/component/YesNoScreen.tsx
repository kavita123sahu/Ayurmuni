import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../common/Colors';
import { Fonts } from '../common/Fonts';

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
  const isTwo = options.length === 2;

  return (
    <View
      style={[
        styles.container,
        isTwo ? styles.row : styles.wrap,
      ]}
    >
      {options.map(option => {
        const isSelected = selected === option;

        return (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              isTwo ? styles.twoButton : styles.gridButton,
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
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default YesNoScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },

  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },

  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#C9CFBC',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  twoButton: {
    minWidth: 140,
  },

  gridButton: {
    minWidth: '45%',
  },

  optionSelected: {
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.primaryColor,
  },

  optionText: {
    fontSize: 14,
    fontFamily: Fonts.PoppinsMedium,
    color: '#6B7280',
  },

  optionTextSelected: {
    color: '#FFFFFF',
  },
});
