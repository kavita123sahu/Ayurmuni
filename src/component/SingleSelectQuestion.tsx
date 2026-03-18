import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../common/Colors';

const SingleSelectQuestion = ({ options, selected, onSelect }: any) => {

  return (
    <View>

      {options.map((item: any, index: number) => {

        const active = selected === item;

        return (

          <TouchableOpacity
            key={index}
            style={[styles.card, active && styles.active]}
            onPress={() => onSelect(item)}
          >

            <Text style={[styles.text, active && styles.activeText]}>
              {item}
            </Text>

            {active && (
              <View style={styles.iconContainer}>
                <View style={styles.tickCircle}>
                  <Icon
                    name="checkmark"
                    size={13}
                    color={Colors.questionGreen}
                  />
                </View>
              </View>
            )}

          </TouchableOpacity>

        );
      })}

    </View>
  );
};

export default SingleSelectQuestion;

const styles = StyleSheet.create({

  card: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    paddingRight: 48,
    marginBottom: 12,
    backgroundColor: '#fff',
    minHeight: 60
  },

  active: {
    backgroundColor: Colors.questionGreen,
    borderColor: Colors.questionGreen
  },

  text: {
    fontSize: 15,
    color: '#111827',
    lineHeight: 20
  },

  activeText: {
    color: '#fff'
  },

  iconContainer: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },

  tickCircle: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center'
  }

});