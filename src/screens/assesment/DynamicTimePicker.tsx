import React, { useRef, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent 
} from 'react-native';
import { Colors } from '../../common/Colors';
import { Fonts } from '../../common/Fonts';

interface TimePickerProps {
  onTimeChange: (hour: number, minute: number, second: number) => void;
  initialHour?: number;
  initialMinute?: number;
  initialSecond?: number;
}

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;
const { height } = Dimensions.get('window');

const DynamicTimePicker: React.FC<TimePickerProps> = ({
  onTimeChange,
  initialHour = 5,
  initialMinute = 13,
  initialSecond = 26,
}) => {
  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);
  const secondScrollRef = useRef<ScrollView>(null);

  const [selectedHour, setSelectedHour] = useState(initialHour);
  const [selectedMinute, setSelectedMinute] = useState(initialMinute);
  const [selectedSecond, setSelectedSecond] = useState(initialSecond);

  // Generate arrays for hours (0-23), minutes (0-59), seconds (0-59)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const seconds = Array.from({ length: 60 }, (_, i) => i);

  useEffect(() => {
    // Initial scroll to selected values
    setTimeout(() => {
      hourScrollRef.current?.scrollTo({ 
        y: initialHour * ITEM_HEIGHT, 
        animated: false 
      });
      minuteScrollRef.current?.scrollTo({ 
        y: initialMinute * ITEM_HEIGHT, 
        animated: false 
      });
      secondScrollRef.current?.scrollTo({ 
        y: initialSecond * ITEM_HEIGHT, 
        animated: false 
      });
    }, 100);
  }, []);

  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
    type: 'hour' | 'minute' | 'second'
  ) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);

    if (type === 'hour' && index !== selectedHour) {
      setSelectedHour(index);
      onTimeChange(index, selectedMinute, selectedSecond);
    } else if (type === 'minute' && index !== selectedMinute) {
      setSelectedMinute(index);
      onTimeChange(selectedHour, index, selectedSecond);
    } else if (type === 'second' && index !== selectedSecond) {
      setSelectedSecond(index);
      onTimeChange(selectedHour, selectedMinute, index);
    }
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
    scrollRef: React.RefObject<ScrollView>
  ) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    scrollRef.current?.scrollTo({ 
      y: index * ITEM_HEIGHT, 
      animated: true 
    });
  };

  const renderScrollPicker = (
    data: number[],
    selectedValue: number,
    scrollRef: React.RefObject<ScrollView>,
    type: 'hour' | 'minute' | 'second',
    label: string
  ) => (
    <View style={styles.pickerColumn}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onScroll={(e) => handleScroll(e, type)}
        onMomentumScrollEnd={(e) => handleMomentumScrollEnd(e, scrollRef)}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingVertical: ITEM_HEIGHT * 2,
        }}
      >
        {data.map((value) => {
          const isSelected = value === selectedValue;
          const distance = Math.abs(value - selectedValue);
          const opacity = Math.max(0.3, 1 - distance * 0.3);
          const scale = isSelected ? 1 : Math.max(0.7, 1 - distance * 0.15);

          return (
            <View
              key={value}
              style={[
                styles.timeItem,
                { 
                  opacity, 
                  transform: [{ scale }] 
                },
              ]}
            >
              <Text
                style={[
                  styles.timeText,
                  isSelected && styles.selectedTimeText,
                ]}
              >
                {value.toString().padStart(2, '0')}
              </Text>
            </View>
          );
        })}
      </ScrollView>
      {/* <Text style={styles.labelText}>{label}</Text> */}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Selection Indicator */}
      <View style={styles.selectionIndicator} />
      
      <View style={styles.pickersContainer}>
        {renderScrollPicker(hours, selectedHour, hourScrollRef, 'hour', 'H')}
        <View style={styles.separator} />
        {renderScrollPicker(minutes, selectedMinute, minuteScrollRef, 'minute', 'M')}
        <View style={styles.separator} />
        {renderScrollPicker(seconds, selectedSecond, secondScrollRef, 'second', 'S')}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    justifyContent: 'center',
    position: 'relative',
  },
  pickersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerColumn: {
    width: 80,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    alignItems: 'center',
  },
  timeItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 24,
    fontFamily: Fonts.PoppinsMedium,
    color: '#9CA3AF',
  },
  selectedTimeText: {
    fontSize: 28,
    fontFamily: Fonts.PoppinsBold,
    color: Colors.primaryColor,
  },
  labelText: {
    fontSize: 14,
    fontFamily: Fonts.PoppinsMedium,
    color: '#6B7280',
    marginTop: 8,
  },
  separator: {
    width: 2,
    height: 30,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 10,
  },
  selectionIndicator: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: Colors.primaryColor + '15',
    borderRadius: 12,
    transform: [{ translateY: -ITEM_HEIGHT / 2 }],
    zIndex: -1,
  },
});

export default DynamicTimePicker;