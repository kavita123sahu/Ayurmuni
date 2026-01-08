import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Props = {
  onAccept: () => void;
  onReject: () => void;
};

const IncomingCallScreen: React.FC<Props> = ({ onAccept, onReject }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Incoming Video Call</Text>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.accept} onPress={onAccept}>
          <Text style={styles.text}>Accept</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reject} onPress={onReject}>
          <Text style={styles.text}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IncomingCallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    marginBottom: 40,
  },
  buttons: {
    flexDirection: "row",
    gap: 30,
  },
  accept: {
    backgroundColor: "green",
    padding: 16,
    borderRadius: 50,
  },
  reject: {
    backgroundColor: "red",
    padding: 16,
    borderRadius: 50,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});
