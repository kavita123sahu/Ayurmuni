import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Fonts } from '../../common/Fonts';

interface TimePickerProps {
  onTimeChange: (hour: number, minute: number, second: number) => void;
  initialHour?: number;
  initialMinute?: number;
  initialSecond?: number;
}

const ITEM_HEIGHT = 45;
const VISIBLE_ITEMS = 3;

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const SECONDS = Array.from({ length: 60 }, (_, i) => i);

const DynamicTimePicker: React.FC<TimePickerProps> = ({
  onTimeChange,
  initialHour = 5,
  initialMinute = 0,
  initialSecond = 26,
}) => {
  const hourRef = useRef<ScrollView>(null);
  const minuteRef = useRef<ScrollView>(null);
  const secondRef = useRef<ScrollView>(null);

  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);
  const [second, setSecond] = useState(initialSecond);

  useEffect(() => {
    setTimeout(() => {
      hourRef.current?.scrollTo({ y: initialHour * ITEM_HEIGHT, animated: false });
      minuteRef.current?.scrollTo({ y: initialMinute * ITEM_HEIGHT, animated: false });
      secondRef.current?.scrollTo({ y: initialSecond * ITEM_HEIGHT, animated: false });
    }, 50);
  }, []);

  const onScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
    type: 'h' | 'm' | 's',
  ) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);

    if (type === 'h') setHour(index);
    if (type === 'm') setMinute(index);
    if (type === 's') setSecond(index);

    onTimeChange(
      type === 'h' ? index : hour,
      type === 'm' ? index : minute,
      type === 's' ? index : second,
    );
  };

  const renderColumn = (
    data: number[],
    selected: number,
    ref: React.RefObject<ScrollView>,
    type: 'h' | 'm' | 's',
    suffix: string,
  ) => (
    <ScrollView
      ref={ref}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      onMomentumScrollEnd={(e) => onScrollEnd(e, type)}
      contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
    >
      {data.map((val) => (
        <View key={val} style={styles.item}>
          <Text
            style={[
              styles.value,
              val === selected && styles.selectedValue,
            ]}
          >
            {val.toString().padStart(2, '0')}
            {val === selected && ` ${suffix}`}
          </Text>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.picker}>
        {/* CENTER SELECTION OUTLINE */}
        <View style={styles.centerOutline} />

        <View style={styles.row}>
          {renderColumn(HOURS, hour, hourRef, 'h', 'H')}
          {renderColumn(MINUTES, minute, minuteRef, 'm', 'M')}
          {renderColumn(SECONDS, second, secondRef, 's', 'S')}
        </View>
      </View>
    </View>
  );
};

export default DynamicTimePicker;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#3F4B1A',
    borderRadius: 24,
    paddingVertical: 14,
    width: '95%',
  },

  picker: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    justifyContent: 'center',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  item: {
    height: ITEM_HEIGHT,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },

  value: {
    fontSize: 14,
    fontFamily: Fonts.PoppinsMedium,
    color: '#A8AF8E',
  },

  selectedValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: Fonts.PoppinsSemiBold,
  },

 centerOutline: {
  position: 'absolute',
  top: ITEM_HEIGHT,
  height: ITEM_HEIGHT,
  width: '99%',              
  alignSelf: 'center',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '#9fa195ff',   

},
}
);
