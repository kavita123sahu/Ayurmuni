import React from 'react';
import { Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

const TopCurve = () => {
  return (
    <Svg
      width={width}
      height={70}
      viewBox={`0 0 ${width} 70`}
      style={{ position: 'absolute', bottom: -1 }}
    >
      <Path
        d={`
          M0 0
          C ${width * 0.25} 60, ${width * 0.75} 60, ${width} 0
          L ${width} 70
          L 0 70
          Z
        `}
        fill="#FFFFFF"
      />
    </Svg>
  );
};

export default TopCurve;
