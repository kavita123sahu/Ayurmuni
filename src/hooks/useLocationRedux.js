
// import { useSelector, useDispatch } from 'react-redux';
// import { useEffect, useCallback } from 'react';
// import {
//   getCurrentLocation,
//   reverseGeocode,
//   findNearbyStores,
//   initializeLocation,
//   setWatchId,
//   setLocation,
//   setAddress,
//   clearLocationError,
// } from '../store/slices/locationSlice';
// import { fetchAllStores } from '../store/slices/storeSlice';
// import LocationService from '../services/LocationService';


// export const useLocationRedux = () => {
//   const dispatch = useDispatch();

//   const locationState = useSelector((state) => state.location);
//   const storeState = useSelector((state) => state.stores);

//   console.log("locationState", locationState, storeState);

//   // Initialize location on mount
//   useEffect(() => {
//     dispatch(initializeLocation());
//     dispatch(fetchAllStores());

//     return () => {
//       // Cleanup location watching
//       if (locationState.watchId) {
//         LocationService.stopWatchingLocation();
//       }
//     };
//   }, []);

//   // Update nearby stores when location or stores change
//   useEffect(() => {
//     if (locationState.currentLocation && storeState.allStores.length > 0) {
//       dispatch(findNearbyStores({
//         latitude: locationState.currentLocation.coords.latitude,
//         longitude: locationState.currentLocation.coords.longitude,
//         stores: storeState.allStores,
//       }));
//     }
//   }, [locationState.currentLocation, storeState.allStores]);

//   // Update location manually
//   const updateLocation = useCallback(() => {
//     dispatch(getCurrentLocation()).then((action) => {
//       if (action.payload) {
//         dispatch(reverseGeocode({
//           latitude: action.payload.coords.latitude,
//           longitude: action.payload.coords.longitude,
//         }));
//       }
//     });
//   }, [dispatch]);

//   // Start location watching
//   const startLocationTracking = useCallback((callback) => {
//     const watchId = LocationService.startWatchingLocation((position) => {
//       dispatch(setLocation(position));

//       // Get address for new location
//       dispatch(reverseGeocode({
//         latitude: position.coords.latitude,
//         longitude: position.coords.longitude,
//       }));

//       if (callback) callback(position);
//     });

//     dispatch(setWatchId(watchId));
//     return watchId;
//   }, [dispatch]);

//   // Stop location watching
//   const stopLocationTracking = useCallback(() => {
//     if (locationState.watchId) {
//       LocationService.stopWatchingLocation();
//       dispatch(setWatchId(null));
//     }
//   }, [dispatch, locationState.watchId]);

//   // Get address for coordinates
//   const getAddressForLocation = useCallback((latitude, longitude) => {
//     dispatch(reverseGeocode({ latitude, longitude }));
//   }, [dispatch]);

//   // Clear errors
//   const clearErrors = useCallback(() => {
//     dispatch(clearLocationError());
//   }, [dispatch]);

//   return {
//     // State
//     currentLocation: locationState.currentLocation,
//     currentAddress: locationState.currentAddress,
//     nearbyStores: locationState.nearbyStores,
//     isLocationLoading: locationState.isLocationLoading,
//     isAddressLoading: locationState.isAddressLoading,
//     isStoresLoading: locationState.isStoresLoading,
//     locationError: locationState.locationError,
//     addressError: locationState.addressError,
//     storesError: locationState.storesError,
//     isWatching: locationState.isWatching,
//     lastUpdated: locationState.lastUpdated,

//     // Store state
//     allStores: storeState.allStores,
//     selectedStore: storeState.selectedStore,

//     // Actions
//     updateLocation,
//     startLocationTracking,
//     stopLocationTracking,
//     getAddressForLocation,
//     clearErrors,
//   };
// };