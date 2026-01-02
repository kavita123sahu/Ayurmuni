import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import api from '../services/API';

// API base URL (apni backend URL lagao)
// const api = axios.create({
//   baseURL: "https://vcxtv1pq-5173.inc1.devtunnels.ms/"  // eg: http://192.168.1.10:5000
// });


export default function FriendCall({ navigation, route }) {
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);

  const createRoom = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/calls/create");
      console.log("CreateRoomuser Response", res,);
      navigation.navigate("VideoCall", { roomId: res.data.room.roomId, userId: "694e6c0488d1fe757794170d" });

    } catch (err) {
      console.log(err);
      alert("Failed to create room");
    }
    setLoading(false);
  };



  const joinRoom = async () => {

    // if (!roomId.trim()) return alert("Enter a Room ID!");

    setLoading(true);

    try {
      console.log("room joining")
      await api.post(`/api/calls/join/${roomId}`);
      navigation.navigate("VideoCall", { roomId, userId: "694e6c0488d1fe757794170d" });
    } catch (err) {
      alert(err.response?.data?.error || "Failed to join room");
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4b6cb7" barStyle="light-content" />
      <View style={styles.card}>
        <Text style={styles.title}>🎥 Video Call Dashboard</Text>

        <TouchableOpacity
          onPress={createRoom}
          disabled={loading}
          style={styles.createButton}
        >
          <Text style={styles.btnText}>
            {loading ? "Creating..." : "➕ Create New Room"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.orText}>──────── OR ────────</Text>

        <TextInput
          placeholder="Enter Room ID"
          placeholderTextColor="#777"
          value={roomId}
          onChangeText={setRoomId}
          style={styles.input}
        />

        <TouchableOpacity
          onPress={joinRoom}
          disabled={loading}
          style={styles.joinButton}
        >
          <Text style={styles.btnText}>🔗 Join Room</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#4b6cb7" />}
      </View>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4b6cb7",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
    color: "#333",
  },
  createButton: {
    backgroundColor: "#1E90FF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  joinButton: {
    backgroundColor: "#6A0DAD",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  orText: {
    textAlign: "center",
    color: "#777",
    marginVertical: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#000",
  },
});
