// hooks/useCamera.js
import { useState } from 'react';
import { CameraOptions, ImageLibraryOptions, ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { PermissionsAndroid, Platform } from 'react-native';
import { showSuccessToast } from '../config/Key';

const useCamera = () => {
  const [loading, setLoading] = useState(false);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera to take photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const openCamera = async (options = {}) => {
    try {
      setLoading(true);
      const hasPermission = await requestCameraPermission();

      if (!hasPermission) {
        showSuccessToast('Camera permission denied', 'error');
        return null;
      }

      const defaultOptions: CameraOptions = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 1000,
        maxWidth: 1000,
        quality: 0.7,
        saveToPhotos: false,
        ...options, // User ke custom options merge kar denge
      };

      return new Promise((resolve, reject) => {
        launchCamera(defaultOptions, (response: ImagePickerResponse) => {
         

          if (response.didCancel) {
           
            resolve(null);
            return;
          }

          if (response.errorCode) {
           
            showSuccessToast('Camera Error: ' + response.errorMessage, 'error');
            reject(new Error(response.errorMessage));
            return;
          }

          if (response.assets && response.assets.length > 0) {
            const asset = response.assets[0];
            console.log('Asset URI:', asset.uri);
            
            if (asset.uri) {
              showSuccessToast('Photo Captured Successfully', 'success');
              resolve(asset.uri); // Sirf URI return karo
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.log('Camera error:', error);
      showSuccessToast('Camera failed to open', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const openGallery = async (options = {}) => {
    try {
      setLoading(true);

      const defaultOptions: ImageLibraryOptions = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 1000,
        maxWidth: 1000,
        quality: 0.7,
        ...options,
      };

      return new Promise((resolve, reject) => {
        launchImageLibrary(defaultOptions, (response: ImagePickerResponse) => {
         
          if (response.didCancel) {
            resolve(null);
            return;
          }

          if (response.errorCode) {
           
            showSuccessToast('Gallery Error: ' + response.errorMessage, 'error');
            reject(new Error(response.errorMessage));
            return;
          }

          if (response.assets && response.assets.length > 0) {
            const asset = response.assets[0];
            console.log('Asset URI:', asset.uri);

            if (asset.uri) {
              showSuccessToast('Photo Selected Successfully', 'success');
              resolve(asset);
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.log('Gallery error:', error);
      showSuccessToast('Gallery failed to open', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    openCamera,
    openGallery,
    loading,
  };
};

export default useCamera;