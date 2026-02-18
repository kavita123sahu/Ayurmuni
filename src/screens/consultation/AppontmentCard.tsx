
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '../../common/Vector';
import { Fonts } from '../../common/Fonts';
import { Colors } from '../../common/Colors';


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

interface AppointmentCardProps {
    appointment: Appointment;
    type: 'upcoming' | 'past';
    onRatePress?: () => void;
    onJoinPress?: () => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
    appointment,
    type,
    onRatePress,
    onJoinPress,
}) => {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        <Text> {appointment.doctorName.replace(/^dr\.?\s*/i, "").trim().charAt(0).toUpperCase()} </Text>

                    </Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.doctorName}>{appointment.doctorName}</Text>
                    <Text style={styles.specialty}>{appointment.specialty}</Text>
                </View>
                <View
                    style={[
                        styles.statusBadge,
                        type === 'upcoming' && styles.statusBadgeConfirmed,
                    ]}
                >
                    <Text
                        style={[
                            styles.statusText,
                            type === 'upcoming' && styles.statusTextConfirmed,
                        ]}
                    >
                        {appointment.status}
                    </Text>
                </View>
            </View>

            <View style={styles.details}>
                <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{appointment.date}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{appointment.time}</Text>
                </View>
            </View>

            {type === 'upcoming' ? (
                <TouchableOpacity
                    style={styles.joinButton}
                    onPress={onJoinPress}
                    activeOpacity={0.7}
                >
                    <Ionicons name="videocam" size={20} color="#fff" />
                    <Text style={styles.joinButtonText}>Join Call</Text>
                </TouchableOpacity>
            ) : appointment.rated ? (
                <TouchableOpacity onPress={onRatePress}
                    activeOpacity={0.7} style={styles.ratedContainer}>
                    <View style={styles.ratedStars}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Ionicons
                                key={star}
                                name={star <= (appointment.rating || 0) ? 'star' : 'star-outline'}
                                size={18}
                                color="#FFB800"
                            />
                        ))}
                    </View>
                    <Text style={styles.ratedText}>You rated this consultation</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={styles.rateButton}
                    onPress={onRatePress}
                    activeOpacity={0.7}
                >
                    <Ionicons name="star-outline" size={20} color={Colors.primaryColor} />
                    <Text style={styles.rateButtonText}>Rate Doctor</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 18,
        fontFamily: Fonts.PoppinsMedium,
        color: '#fff',
    },
    info: {
        flex: 1,
    },
    doctorName: {
        fontSize: 16,
        fontFamily: Fonts.PoppinsSemiBold,
        color: Colors.textColor,
        marginBottom: 2,
    },
    specialty: {
        fontSize: 14,
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.subTextColor,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#E8EDE3',
    },
    statusBadgeConfirmed: {
        backgroundColor: "#E8EDE3",
    },
    statusText: {
        fontSize: 12,
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.textColor,
    },
    statusTextConfirmed: {
        // color: Colors.white,
    },
    details: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 12,
    },

    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        fontSize: 14,
        fontFamily: Fonts.PoppinsMedium,
        color: '#6B7280',
    },
    rateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: Colors.primaryColor,
        backgroundColor: '#E8EDE3',
        gap: 8,
    },
    rateButtonText: {
        fontSize: 14,
        fontFamily: Fonts.PoppinsSemiBold,
        color: Colors.primaryColor,
    },
    joinButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: Colors.primaryColor,
        gap: 8,
    },
    joinButtonText: {
        fontSize: 14,
        fontFamily: Fonts.PoppinsSemiBold,
        color: '#fff',
    },
    ratedContainer: {
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: '#FFFBEB',
        borderRadius: 10,
    },
    ratedStars: {
        flexDirection: 'row',
        gap: 4,
        marginBottom: 6,
    },
    ratedText: {
        fontSize: 13,
        fontFamily: Fonts.PoppinsMedium,
        color: '#92400E',
    },
});