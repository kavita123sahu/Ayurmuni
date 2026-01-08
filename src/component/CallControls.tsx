import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
  onEndCall: () => void;
};

const CallControls: React.FC<Props> = ({ onEndCall }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.endButton} onPress={onEndCall}>
        <Text style={styles.text}>End</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CallControls;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
  endButton: {
    backgroundColor: "red",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 50,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
