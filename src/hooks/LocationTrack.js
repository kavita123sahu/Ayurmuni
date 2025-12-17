
// import Geolocation from 'react-native-geolocation-service';
// import { PermissionsAndroid, Platform, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// class LocationService {
//   constructor() {
//     this.watchId = null;
//     this.currentPosition = null;
//     this.locationCallbacks = [];
//   }

//   async requestLocationPermission() {
//     try {
//       if (Platform.OS === 'android') {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Location Permission',
//             message: 'This app needs location access to show nearby stores and delivery options.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       }
//       return true;
//     } catch (err) {
//       console.warn(err);
//       return false;
//     }
//   }

//   async getCurrentLocation() {
//     return new Promise(async (resolve, reject) => {
//       const hasPermission = await this.requestLocationPermission();
      
//       if (!hasPermission) {
//         reject(new Error('Location permission denied'));
//         return;
//       }

//       Geolocation.getCurrentPosition(
//         (position) => {
//           this.currentPosition = position;
//           this.saveLocationToStorage(position);
//           resolve(position);
//         },
//         (error) => {
//           this.handleLocationError(error);
//           reject(error);
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 15000,
//           maximumAge: 10000,
//         }
//       );
//     });
//   }

//   async startWatchingLocation(callback) {
//     const hasPermission = await this.requestLocationPermission();
    
//     if (!hasPermission) {
//       return null;
//     }

//     this.locationCallbacks.push(callback);

//     if (this.watchId !== null) {
//       return this.watchId;
//     }

//     this.watchId = Geolocation.watchPosition(
//       (position) => {
//         this.currentPosition = position;
//         this.saveLocationToStorage(position);
//         this.locationCallbacks.forEach(cb => cb(position));
//       },
//       (error) => {
//         this.handleLocationError(error);
//       },
//       {
//         interval: 10000,
//         fastestInterval: 5000,
//         enableHighAccuracy: true,
//         distanceFilter: 100,
//         useSignificantChanges: false,
//         timeout: 20000,
//         maximumAge: 10000,
//       }
//     );

//     return this.watchId;
//   }

//   stopWatchingLocation(callback) {
//     if (callback) {
//       this.locationCallbacks = this.locationCallbacks.filter(cb => cb !== callback);
//     }

//     if (this.locationCallbacks.length === 0 && this.watchId !== null) {
//       Geolocation.clearWatch(this.watchId);
//       this.watchId = null;
//     }
//   }

//   async saveLocationToStorage(position) {
//     try {
//       const locationData = {
//         latitude: position.coords.latitude,
//         longitude: position.coords.longitude,
//         timestamp: position.timestamp,
//         address: null
//       };
      
//       await AsyncStorage.setItem('userLocation', JSON.stringify(locationData));
//     } catch (error) {
//       console.error('Error saving location:', error);
//     }
//   }

//   async getSavedLocation() {
//     try {
//       const locationData = await AsyncStorage.getItem('userLocation');
//       return locationData ? JSON.parse(locationData) : null;
//     } catch (error) {
//       console.error('Error getting saved location:', error);
//       return null;
//     }
//   }

//   handleLocationError(error) {
//     let message = 'Unable to get location';
    
//     switch (error.code) {
//       case error.PERMISSION_DENIED:
//         message = 'Location permission denied. Please enable location access in settings.';
//         break;
//       case error.POSITION_UNAVAILABLE:
//         message = 'Location information is unavailable. Please check your GPS settings.';
//         break;
//       case error.TIMEOUT:
//         message = 'Location request timed out. Please try again.';
//         break;
//       default:
//         message = `Location error: ${error.message}`;
//         break;
//     }

//     Alert.alert('Location Error', message);
//   }

//   async reverseGeocode(latitude, longitude) {
//     try {
//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY`
//       );
      
//       const data = await response.json();
      
//       if (data.results && data.results.length > 0) {
//         return {
//           address: data.results[0].formatted_address,
//           components: data.results[0].address_components
//         };
//       }
      
//       return null;
//     } catch (error) {
//       console.error('Geocoding error:', error);
//       return null;
//     }
//   }

//   calculateDistance(lat1, lon1, lat2, lon2) {
//     const R = 6371;
//     const dLat = this.deg2rad(lat2 - lat1);
//     const dLon = this.deg2rad(lon2 - lon1);
    
//     const a = 
//       Math.sin(dLat/2) * Math.sin(dLat/2) +
//       Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
//       Math.sin(dLon/2) * Math.sin(dLon/2);
    
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//     const distance = R * c;
    
//     return distance;
//   }

//   deg2rad(deg) {
//     return deg * (Math.PI/180);
//   }

//   async findNearbyStores(userLat, userLon, stores) {
//     const nearbyStores = stores.map(store => ({
//       ...store,
//       distance: this.calculateDistance(
//         userLat, 
//         userLon, 
//         store.latitude, 
//         store.longitude
//       )
//     })).sort((a, b) => a.distance - b.distance);

//     return nearbyStores.filter(store => store.distance <= 10);
//   }
// }

// export default new LocationService();
