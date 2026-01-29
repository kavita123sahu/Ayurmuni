import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ViewStyle,
  ListRenderItem
} from 'react-native';
import { Ionicons } from '../common/Vector';
import { Colors } from '../common/Colors';
import { Fonts } from '../common/Fonts';

interface DropdownTextInputProps {
  label: string;
  placeholder: string;
  value: string;
  onSelect: (item: string) => void;
  options?: string[];
  style?: ViewStyle;
  error?: boolean;
  errorMessage?: string;
}

const DropdownTextInput: React.FC<DropdownTextInputProps> = ({
  label,
  placeholder,
  value,
  onSelect,
  options = [],
  style,
  error = false,
  errorMessage = ''
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleSelect = (item: string): void => {
    onSelect(item);
    setIsVisible(false);
  };

  const renderOption: ListRenderItem<string> = ({ item }) => (
    <TouchableOpacity
      style={styles.option}
      onPress={() => handleSelect(item)}
    >
      <Text style={styles.optionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.inputContainer, style]}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.dropdown,
          error && styles.dropdownError
        ]}
        onPress={() => setIsVisible(true)}
      >
        <Text style={[
          styles.dropdownText,
          !value && styles.placeholderText
        ]}>
          {value || placeholder}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={error ? "#FF6B6B" : "#666666"}
        />
      </TouchableOpacity>

      {error && errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item: string, index: number) => index.toString()}
              style={styles.optionsList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  },

  dropdown: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
  },

  dropdownError: {
    borderColor: '#FF6B6B',
    borderWidth: 1.5,
  },

  dropdownText: {
    fontFamily: Fonts.PoppinsMedium,
    fontSize: 14,
    color: '#000',
    flex: 1,
  },

  placeholderText: {
    color: '#1E1E1E8C',
    fontFamily: Fonts.PoppinsMedium,
    fontSize: 14,
  },

  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontFamily: Fonts.PoppinsMedium,
    marginTop: 4,
    marginLeft: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    width: '80%',
    maxHeight: '50%',
  },

  optionsList: {
    maxHeight: 200,
  },

  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  optionText: {
    fontSize: 14,
    fontFamily: Fonts.PoppinsMedium,
    color: Colors.textColor,
  },
});

export default DropdownTextInput;