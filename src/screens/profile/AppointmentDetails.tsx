import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

type AppointmentDetails = {
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  patientName: string;
  age: string;
  gender: string;
  reason: string;
  image: string;
};

const data: AppointmentDetails = {
  doctorName: 'Dr. Arjun R Nair',
  specialty: 'Cardiology Specialist',
  date: 'Tuesday, Oct 24, 2023',
  time: '09:30 AM - 10:00 AM',
  patientName: 'Alex Johnson',
  age: '28 Years',
  gender: 'Male',
  reason:
    'I have been experiencing mild chest tightness during morning jogs over the last two weeks. Looking for a routine check-up and professional advice.',
  image: 'https://i.pravatar.cc/100?img=3',
};

const AppointmentDetailsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Doctor Card */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Image source={{ uri: data.image }} style={styles.avatar} />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{data.doctorName}</Text>
              <Text style={styles.specialty}>{data.specialty}</Text>
            </View>
          </View>

          {/* Date & Time */}
          <View style={styles.infoBox}>
            <Text style={styles.info}>📅 {data.date}</Text>
            <Text style={styles.info}>⏰ {data.time}</Text>
          </View>

          {/* Buttons */}
          <TouchableOpacity style={styles.primaryBtn}>
            <Text style={styles.primaryText}>Join Video Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn}>
            <Text style={styles.secondaryText}>Chat with Doctor</Text>
          </TouchableOpacity>

          <Text style={styles.techText}>
            ✔ Technical Check: Test Audio & Video
          </Text>
        </View>

        {/* Patient Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Patient Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{data.patientName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Age</Text>
            <Text style={styles.value}>{data.age}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Gender</Text>
            <Text style={styles.value}>{data.gender}</Text>
          </View>
        </View>

        {/* Reason */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Reason for Visit</Text>
          <Text style={styles.reason}>{data.reason}</Text>
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.outlineBtn}>
          <Text style={styles.outlineText}>Reschedule</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel Appointment</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};


export default AppointmentDetailsScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 30,
    marginRight: 12,
  },

  name: {
    fontWeight: '600',
    fontSize: 16,
  },

  specialty: {
    fontSize: 12,
    color: '#666',
  },

  infoBox: {
    marginTop: 12,
  },

  info: {
    fontSize: 13,
    marginTop: 4,
    color: '#444',
  },

  primaryBtn: {
    backgroundColor: '#0A8F5A',
    marginTop: 14,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  primaryText: {
    color: '#fff',
    fontWeight: '600',
  },

  secondaryBtn: {
    backgroundColor: '#E8F5EF',
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  secondaryText: {
    color: '#0A8F5A',
    fontWeight: '500',
  },

  techText: {
    marginTop: 10,
    fontSize: 12,
    color: '#0A8F5A',
    textAlign: 'center',
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },

  label: {
    color: '#666',
  },

  value: {
    fontWeight: '500',
  },

  reason: {
    fontSize: 13,
    color: '#444',
    lineHeight: 20,
  },

  outlineBtn: {
    marginHorizontal: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#0A8F5A',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  outlineText: {
    color: '#0A8F5A',
    fontWeight: '500',
  },

  cancelBtn: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 30,
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  cancelText: {
    color: 'red',
    fontWeight: '500',
  },
});