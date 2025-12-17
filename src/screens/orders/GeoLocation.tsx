import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';

const GeocodingExample = () => {
  // const [address, setAddress] = useState('');

  // const geocodeLocation = async (lat : any , lng : any) => {
  //   try {
  //     const response = await fetch(
  //       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBwmmybQWla4yJB38xB3HvzLTQwyZf14JI`
  //     );
  //     const data = await response.json();
  //     const address = data.results[0].formatted_address;
  //     setAddress(address);
  //   } catch (error) {  
  //     Alert.alert('Error', 'Failed to fetch the address.');
  //   }
  // };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      // onPress={(e) => geocodeLocation(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)}
      />

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  addressContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'white',
    padding: 10,
  },
});

export default GeocodingExample;