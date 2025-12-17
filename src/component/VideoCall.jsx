import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  PermissionsAndroid,
  Text,
  TouchableOpacity,
  Share,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { ZegoUIKitPrebuiltCall, ONE_ON_ONE_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn';


export default function VoiceCallPage({ route, navigation }) {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get params from navigation
  const {
    friendUserId,
    friendName,
    currentUserId,
    currentUserName,
    callID,
    isNewCall = false,
  } = route?.params || {};

  // Your Zego credentials (replace with your actual keys)
  const ZEGO_APP_ID = 712416091; // Replace with your actual App ID
  const ZEGO_APP_SIGN = 'c6de6e9ebf00826ca6a1834aaf6db203e722d67f5976cb9ede3f023db73232e8'; // Replace with your actual App Sign

  useEffect(() => {
    console.log('Call Details:', {
      friendUserId,
      friendName,
      currentUserId,
      currentUserName,
      callID,
      isNewCall,
    });

    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);

        if (
          granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          setHasPermissions(true);
        } else {
          Alert.alert(
            'Permissions Required',
            'Audio and camera permissions are required for video calls',
            [
              { text: 'Cancel', onPress: () => navigation.goBack() },
              { text: 'Try Again', onPress: requestPermissions },
            ]
          );
        }
      } catch (err) {
        console.warn('Permission request error:', err);
      }
    } else {
      // iOS permissions are handled automatically by Zego SDK
      setHasPermissions(true);
    }
    setIsLoading(false);
  };

  
  const shareCallID = async () => {
    try {
      const shareMessage = `Hey ${friendName || 'Friend'}! Join my video call using this Call ID: ${callID}`;

      await Share.share({
        message: shareMessage,
        title: 'Join Video Call',
      });
    } catch (error) {
      console.error('Error sharing call ID:', error);
    }
  };

  const startCall = () => {
    setIsCallStarted(true);
  };

  const goBack = () => {
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Setting up call...</Text>
      </SafeAreaView>
    );
  }

  if (!hasPermissions) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Camera and microphone permissions are required for video calls
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermissions}>
            <Text style={styles.permissionButtonText}>Grant Permissions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!isCallStarted) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />

        <View style={styles.preCallContainer}>
          <Text style={styles.title}>Video Call</Text>

          <View style={styles.callInfo}>
            <Text style={styles.infoLabel}>Call ID:</Text>
            <Text style={styles.infoValue}>{callID}</Text>
          </View>

          <View style={styles.callInfo}>
            <Text style={styles.infoLabel}>Your Name:</Text>
            <Text style={styles.infoValue}>{currentUserName}</Text>
          </View>

          {friendName && (
            <View style={styles.callInfo}>
              <Text style={styles.infoLabel}>
                {isNewCall ? 'Calling:' : 'Joining:'}
              </Text>
              <Text style={styles.infoValue}>{friendName}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.startButton} onPress={startCall}>
            <Text style={styles.startButtonText}>
              {isNewCall ? '📞 Start Call' : '🔗 Join Call'}
            </Text>
          </TouchableOpacity>

          {isNewCall && (
            <TouchableOpacity style={styles.shareButton} onPress={shareCallID}>
              <Text style={styles.shareButtonText}>📤 Share Call ID</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.callContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <ZegoUIKitPrebuiltCall
        appID={ZEGO_APP_ID}
        appSign={ZEGO_APP_SIGN}
        userID={currentUserId}
        userName={currentUserName}
        callID={callID}
        config={{
          ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
          onOnlySelfInRoom: () => {
            console.log('Waiting for other participant...');
            // You can show a custom waiting UI here
          },
          onLeaveRoom: () => {
            console.log('Call ended');
            setIsCallStarted(false);
            navigation.goBack();
          },
          onUserJoin: (users) => {
            console.log('User joined:', users);
          },
          onUserLeave: (users) => {
            console.log('User left:', users);
          },
          // Video call configuration
          turnOnCameraWhenJoining: true,
          turnOnMicrophoneWhenJoining: true,
          useSpeakerWhenJoining: true,
          // UI customization
          showLeaveRoomConfirmDialog: true,
          showRemoveUserConfirmDialog: false,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  preCallContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  callInfo: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    color: '#ccc',
    marginRight: 10,
    minWidth: 80,
  },
  infoValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 30,
    marginTop: 30,
    marginBottom: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#555',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  callContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
});