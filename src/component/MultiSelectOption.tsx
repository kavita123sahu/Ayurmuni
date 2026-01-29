import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors } from '../common/Colors';
import { Fonts } from '../common/Fonts';

interface Props {
  selected: string[];
  options: string[];
  onChange: (values: string[]) => void;
}

const MultiSelectOptions: React.FC<Props> = ({
  selected,
  options,
  onChange,
}) => {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(i => i !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <View style={styles.container}>
      {options.map(option => {
        const isSelected = selected.includes(option);

        return (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              isSelected && styles.optionSelected,
            ]}
            onPress={() => toggleOption(option)}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.text,
                isSelected && styles.textSelected,
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

export default MultiSelectOptions;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },

  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#C9CFBC',
    backgroundColor: '#FFFFFF',
  },

  optionSelected: {
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.primaryColor,
  },

  text: {
    fontSize: 14,
    fontFamily: Fonts.PoppinsMedium,
    color: '#6B7280',
  },

  textSelected: {
    color: '#FFFFFF',
  },
});
