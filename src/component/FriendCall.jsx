import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';

export default function HomeScreen({ navigation }) {
  const [callIdInput, setCallIdInput] = useState('');

  // Start new call with Sunaina
  const startNewCall = () => {
    const callID = `call_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    navigation.navigate('VideoPlayer', {
      friendUserId: 'sunaina_123',
      friendName: 'Sunaina',
      currentUserId: 'kavita_456',
      currentUserName: 'Kavita',
      callID: callID,
      isNewCall: true,
    });
  };

  // Join existing call
  const joinExistingCall = () => {
    if (!callIdInput.trim()) {
      Alert.alert('Error', 'Please enter Call ID');
      return;
    }

    navigation.navigate('VideoPlayer', {
      currentUserId: 'kavita_456',
      currentUserName: 'Kavita',
      callID: callIdInput.trim(),
      isNewCall: false,
    });
  };

  // Quick call with predefined call ID (for testing)
  const quickCall = () => {
    const fixedCallID = 'test_call_123';

    navigation.navigate('VideoPlayer', {
      friendUserId: 'sunaina_123',
      friendName: 'Sunaina',
      currentUserId: 'kavita_456',
      currentUserName: 'Kavita',
      callID: fixedCallID,
      isNewCall: true,
    });
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      <View style={styles.header}>
        <Text style={styles.title}>Video Call App</Text>
        <Text style={styles.subtitle}>Hi Kavita! 👋</Text>
      </View>

      <View style={styles.content}>
        {/* Start New Call */}
        <TouchableOpacity style={styles.primaryButton} onPress={startNewCall}>
          <Text style={styles.primaryButtonText}>📞 Call Sunaina</Text>
        </TouchableOpacity>

        {/* Quick Test Call */}
        <TouchableOpacity style={styles.secondaryButton} onPress={quickCall}>
          <Text style={styles.secondaryButtonText}>🚀 Quick Test Call</Text>
        </TouchableOpacity>

        {/* Join Call Section */}
        <View style={styles.joinSection}>
          <Text style={styles.sectionTitle}>Join Existing Call</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter Call ID"
            placeholderTextColor="#888"
            value={callIdInput}
            onChangeText={setCallIdInput}
          />

          <TouchableOpacity style={styles.joinButton} onPress={joinExistingCall}>
            <Text style={styles.joinButtonText}>Join Call</Text>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>How to use:</Text>
          <Text style={styles.instructionText}>1. Tap "Call Sunaina" to start a new call</Text>
          <Text style={styles.instructionText}>2. Share the Call ID with Sunaina</Text>
          <Text style={styles.instructionText}>3. Sunaina can join using the same Call ID</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
  joinSection: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#3a3a3a',
    color: 'black',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#555',
  },
  joinButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  joinButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructionsContainer: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 15,
    marginTop: 10,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 5,
    lineHeight: 20,
  },
});