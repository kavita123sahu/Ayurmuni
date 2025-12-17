import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle
} from 'react-native';
import { Fonts } from '../common/Fonts';
import { Colors } from '../common/Colors';

interface CustomTextInputProps extends TextInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  error?: boolean;
  errorMessage?: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  numberOfLines = 1,
  style,
  error = false,
  errorMessage = '',
  ...props
}) => {
  return (
    <View style={[styles.inputContainer, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.textInput,
          error && styles.textInputError,
          multiline && styles.multilineInput,
          multiline && { height: numberOfLines * 40 }
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        placeholderTextColor="#A0A0A0"
        {...props}
      />
      {error && errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },

  label: {
    fontSize: 16,
    fontFamily: Fonts.PoppinsMedium,
    color: Colors.textColor,
    marginBottom: 8,
    paddingHorizontal: 5
  },

  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: Fonts.PoppinsMedium,
    color: '#000',
    backgroundColor: '#FFFFFF',
    minHeight: 48,
  },

  textInputError: {
    borderColor: '#FF6B6B',
    borderWidth: 1.5,
  },

  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: 12,
  },

  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontFamily: Fonts.PoppinsMedium,
    marginTop: 4,
    marginLeft: 5,
  },
});

export default CustomTextInput;