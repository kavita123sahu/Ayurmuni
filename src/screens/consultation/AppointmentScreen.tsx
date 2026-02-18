
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Alert,
    StatusBar,
} from 'react-native';
import { AppointmentCard } from './AppontmentCard';
import { ConsultationCompletedModal } from './ConsultaionCompleteModel';
import { RatingModal } from './RatingModel';
import { Fonts } from '../../common/Fonts';
import { Colors } from '../../common/Colors';
import Header from '../../component/Header';
interface Doctor {
    name: string;
    specialty: string;
}

interface RatingData {
    rating: number;
    feedback: string;
    tags: string[];
}

interface Appointment {
    id: number;
    doctorName: string;
    specialty: string;
    date: string;
    time: string;
    status: string;
    rated?: boolean;
    rating?: number;
}

const UPCOMING_APPOINTMENTS: Appointment[] = [
    {
        id: 1,
        doctorName: 'Dr. Anil Verma',
        specialty: 'Orthopedic',
        date: '5 Feb 2026',
        time: '3:00 PM',
        status: 'Confirmed',
    },
    {
        id: 2,
        doctorName: 'Dr. Meera Reddy',
        specialty: 'Dermatologist',
        date: '6 Feb 2026',
        time: '11:00 AM',
        status: 'Confirmed',
    },
];

const PAST_APPOINTMENTS: Appointment[] = [
    {
        id: 3,
        doctorName: 'Dr. Sharma',
        specialty: 'Cardiologist',
        date: '28 Jan 2026',
        time: '10:30 AM',
        status: 'Completed',
        rated: false,
    },
    {
        id: 4,
        doctorName: 'Dr. Priya Singh',
        specialty: 'Dermatologist',
        date: '22 Jan 2026',
        time: '2:00 PM',
        status: 'Completed',
        rated: true,
        rating: 5,
    },
    {
        id: 5,
        doctorName: 'Dr. Rajesh Kumar',
        specialty: 'General Physician',
        date: '15 Jan 2026',
        time: '11:00 AM',
        status: 'Completed',
        rated: false,
    },
];

export const AppointmentsScreen: React.FC = (props: any) => {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [showCompletedModal, setShowCompletedModal] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<number>(0);
    const [pastAppointments, setPastAppointments] = useState<Appointment[]>(PAST_APPOINTMENTS);

    const handleJoinCall = (appointment: Appointment) => {
        Alert.alert(
            'Join Call',
            `Starting video consultation with ${appointment.doctorName}...`,
            [
                {
                    text: 'End Call (Demo)',
                    onPress: () => handleCallComplete(appointment),
                },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const handleCallComplete = (appointment: Appointment) => {
        setSelectedDoctor({
            name: appointment.doctorName,
            specialty: appointment.specialty,
        });
        setSelectedAppointmentId(appointment.id);
        setShowCompletedModal(true);
    };

    const handleRateNow = () => {
        setShowCompletedModal(false);
        setTimeout(() => {
            setShowRatingModal(true);
        }, 300);
    };

    const handleRateDoctor = (appointment: Appointment) => {
        setSelectedDoctor({
            name: appointment.doctorName,
            specialty: appointment.specialty,
        });
        setSelectedAppointmentId(appointment.id);
        setShowRatingModal(true);
    };

    const handleRatingSubmit = (ratingData: RatingData) => {
        console.log('Rating Submitted:', {
            appointmentId: selectedAppointmentId,
            doctor: selectedDoctor,
            ...ratingData,
        });

        setPastAppointments((prev) =>
            prev.map((apt) =>
                apt.id === selectedAppointmentId
                    ? { ...apt, rated: true, rating: ratingData.rating }
                    : apt
            )
        );

        setShowRatingModal(false);
        setSelectedDoctor(null);
        setSelectedAppointmentId(0);
    };

    const handleCloseCompletedModal = () => {
        setShowCompletedModal(false);

    };

    const handleCloseRatingModal = () => {
        setShowRatingModal(false);
        setSelectedDoctor(null);
        setSelectedAppointmentId(0);
    };


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.primaryColor} />

            <Header title='Appointments' navigation={props.navigation} Is_Tab={false} />
            <View style={styles.tabsContainer}>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
                    onPress={() => setActiveTab('upcoming')}
                    activeOpacity={0.7}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'upcoming' && styles.tabTextActive,
                        ]}
                    >
                        Upcoming
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'past' && styles.tabActive]}
                    onPress={() => setActiveTab('past')}
                    activeOpacity={0.7}
                >
                    <Text
                        style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}
                    >
                        Past
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {activeTab === 'upcoming' ? (
                    <>
                        {UPCOMING_APPOINTMENTS.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                type="upcoming"
                                onJoinPress={() => handleJoinCall(appointment)}
                            />
                        ))}
                    </>
                ) : (
                    <>
                        {pastAppointments.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                type="past"
                                onRatePress={() => handleRateDoctor(appointment)}
                            />
                        ))}
                    </>
                )}
            </ScrollView>

            <ConsultationCompletedModal
                visible={showCompletedModal}
                doctor={selectedDoctor || undefined}
                onClose={handleCloseCompletedModal}
                onRateNow={handleRateNow}
                navigation={props.navigation}

            />

            {selectedDoctor && (
                <RatingModal
                    visible={showRatingModal}
                    doctor={selectedDoctor}
                    appointmentId={selectedAppointmentId}
                    onClose={handleCloseRatingModal}
                    onSubmit={handleRatingSubmit}
                    navigation={props.navigation}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: Fonts.PoppinsMedium,
        color: '#111827',
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: Colors.primaryColor,
    },
    tabText: {
        fontSize: 16,
        fontFamily: Fonts.PoppinsSemiBold,
        color: Colors.subTextColor,
    },

    tabTextActive: {
        color: Colors.primaryColor,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
});