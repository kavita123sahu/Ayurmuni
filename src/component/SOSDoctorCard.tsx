import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";


interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  image: string;
}
interface Props {
  doctor: Doctor;
  selected?: boolean;
  onPress?: () => void;
}

const SOSDoctorCard: React.FC<Props> = ({ doctor, selected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selected]}
      onPress={onPress}
    >
      <Image source={{ uri: doctor.image }} style={styles.image} />

      <Text style={styles.name}>{doctor.name}</Text>
      <Text style={styles.specialty}>{doctor.specialty}</Text>

      <View style={styles.ratingBox}>
        <Text style={styles.rating}>⭐ {doctor.rating}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SOSDoctorCard;

const styles = StyleSheet.create({
  card: {
    width: 140,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    marginRight: 12,
  },
  selected: {
    borderWidth: 2,
    borderColor: "#2e7d6d",
    backgroundColor: "#E8F5F2",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  name: {
    fontWeight: "600",
    fontSize: 14,
  },
  specialty: {
    fontSize: 12,
    color: "#777",
  },
  ratingBox: {
    marginTop: 6,
  },
  rating: {
    fontSize: 12,
  },
});