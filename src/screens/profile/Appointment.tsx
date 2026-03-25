import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';

type Appointment = {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'CONFIRMED' | 'PENDING';
  image: string;
};

const dummyData: Appointment[] = [
  {
    id: '1',
    doctorName: 'Dr. Sarah Jenkins',
    specialty: 'Cardiologist - Heart Care Center',
    date: 'Oct 24, 2023',
    time: '10:30 AM',
    status: 'CONFIRMED',
    image: 'https://i.pravatar.cc/100?img=1',
  },
  {
    id: '2',
    doctorName: 'Dr. Michael Chen',
    specialty: 'Dermatologist - Skin Clinic',
    date: 'Oct 28, 2023',
    time: '02:15 PM',
    status: 'PENDING',
    image: 'https://i.pravatar.cc/100?img=2',
  },
];

const AppointmentScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const renderItem = ({ item }: { item: Appointment }) => (
    <View style={styles.card}>
      {/* Doctor Info */}
      <View style={styles.row}>
        <Image source={{ uri: item.image }} style={styles.avatar} />

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.doctorName}</Text>
          <Text style={styles.specialty}>{item.specialty}</Text>
        </View>

        <View
          style={[
            styles.status,
            item.status === 'CONFIRMED'
              ? styles.confirmed
              : styles.pending,
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      {/* Date & Time */}
      <View style={styles.infoRow}>
        <Text style={styles.info}>📅 {item.date}</Text>
        <Text style={styles.info}>⏰ {item.time}</Text>
      </View>

      {/* Buttons */}
      {item.status === 'CONFIRMED' ? (
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.outlineBtn}>
            <Text style={styles.outlineText}>Reschedule</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryBtn}>
            <Text style={styles.primaryText}>Join Call</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel Appointment</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <Text style={styles.header}>My Appointments</Text>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity onPress={() => setActiveTab('upcoming')}>
          <Text
            style={[
              styles.tab,
              activeTab === 'upcoming' && styles.activeTab,
            ]} >
            Upcoming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('past')}>
          <Text
            style={[
              styles.tab,
              activeTab === 'past' && styles.activeTab,
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={dummyData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Bottom Button */}
      <TouchableOpacity style={styles.bookBtn}>
        <Text style={styles.bookText}>+ Book New Appointment</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

export default AppointmentScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },

  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },

  tab: {
    marginHorizontal: 20,
    fontSize: 14,
    color: '#888',
  },

  activeTab: {
    color: '#0A8F5A',
    borderBottomWidth: 2,
    borderColor: '#0A8F5A',
    paddingBottom: 4,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    elevation: 3,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },

  name: {
    fontWeight: '600',
  },

  specialty: {
    fontSize: 12,
    color: '#666',
  },

  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  confirmed: {
    backgroundColor: '#D4F5E9',
  },

  pending: {
    backgroundColor: '#FFE5E5',
  },

  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  info: {
    fontSize: 12,
    color: '#444',
  },

  btnRow: {
    flexDirection: 'row',
    marginTop: 12,
  },

  outlineBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#0A8F5A',
    borderRadius: 10,
    padding: 10,
    marginRight: 6,
    alignItems: 'center',
  },

  outlineText: {
    color: '#0A8F5A',
  },

  primaryBtn: {
    flex: 1,
    backgroundColor: '#0A8F5A',
    borderRadius: 10,
    padding: 10,
    marginLeft: 6,
    alignItems: 'center',
  },

  primaryText: {
    color: '#fff',
  },

  cancelBtn: {
    marginTop: 12,
    backgroundColor: '#FFE5E5',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  cancelText: {
    color: 'red',
  },

  bookBtn: {
    backgroundColor: '#0A8F5A',
    margin: 16,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  bookText: {
    color: '#fff',
    fontWeight: '600',
  },
});