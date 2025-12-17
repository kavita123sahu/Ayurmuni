import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface CustomStarRatingProps {
  rating: number;
  maxRating?: number;
  starSize?: number;
  activeColor?: string;
  inactiveColor?: string;
}

const CustomStarRating: React.FC<CustomStarRatingProps> = ({
  rating,
  maxRating,
  starSize,
  activeColor = '#FFD700',
  inactiveColor = '#CCCCCC'
}) => {
  return (
    <View style={styles.container}>
      {[...Array(maxRating)].map((_, index) => (
        <Icon
          key={index}
          name={index < Math.floor(rating) ? 'star' : 'star-o'}
          size={starSize}
          color={index < Math.floor(rating) ? activeColor : inactiveColor}
          style={styles.star}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 2,
  },
});

export default CustomStarRating;