import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';

type UseImagePickerProps = {
  onImageSelected: (asset: any) => void;
  onErrorClear?: () => void;
  onSuccess?: (message: string) => void;
  onCancelOrError?: () => void;
};

export const useImagePicker = ({
  onImageSelected,
  onErrorClear,
  onSuccess,
  onCancelOrError,
}: UseImagePickerProps) => {

  const cameraOptions: CameraOptions = {
    mediaType: 'photo',
    includeBase64: false,
    maxHeight: 2000,
    maxWidth: 2000,
    quality: 0.8,
  };

  const galleryOptions: ImageLibraryOptions = {
    mediaType: 'photo',
    includeBase64: false,
    maxHeight: 2000,
    maxWidth: 2000,
    quality: 0.8,
  };

  const openCamera = () => {
    launchCamera(cameraOptions, (response: ImagePickerResponse) => {
      handleResponse(response, 'Photo Captured Successfully');
    });
  };

  const openGallery = () => {
    launchImageLibrary(galleryOptions, (response: ImagePickerResponse) => {
      handleResponse(response, 'Photo Selected Successfully');
    });
  };

  const handleResponse = (
    response: ImagePickerResponse,
    successMessage: string
  ) => {
    if (response.didCancel || response.errorMessage) {
      onCancelOrError?.();
      return;
    }

    if (response.assets && response.assets[0]) {
      const asset = response.assets[0];
      onImageSelected(asset);
      onSuccess?.(successMessage);
      onErrorClear?.();
    }
  };

  return {
    openCamera,
    openGallery,
  };
};
