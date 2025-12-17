import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationProp } from '@react-navigation/native';

interface CenterData {
    rating: number;
    name: string;
    location: string;
    checkIn: string;
    checkOut: string;
    dateRange: string;
    guests: string;
}

interface CenterCardProps {
    centerData: CenterData;
    navigation : NavigationProp<any>
}

const CenterCard: React.FC<CenterCardProps> = ({ centerData, navigation }) => {
   
    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Icon
                    key={i}
                    name="star"
                    size={16}
                    color={i <= rating ? '#FFD700' : '#E0E0E0'}
                />
            );
        }
        return stars;
    };

    if (!centerData) {
        return (
            <View style={styles.heroOverlay}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <TouchableOpacity style={styles.heroOverlay} onPress={() => navigation.navigate('PackageSelect')}>
            <View style={styles.centerInfoSection}>
                <View style={styles.ratingContainer}>
                    <View style={styles.starsContainer}>
                        {renderStars(centerData.rating || 0)}
                    </View>
                </View>

                <Text style={styles.centerName}>{centerData.name || 'N/A'}</Text>

                <TouchableOpacity style={styles.locationContainer}>
                    <Icon name="location-on" size={20} color="#4CAF50" />
                    <Text style={styles.locationText}>{centerData.location || 'N/A'}</Text>
                    <Text style={styles.viewOnMapText}>View On Map</Text>
                    <Icon name="chevron-right" size={20} color="#666666" />
                </TouchableOpacity>
            </View>

            <View style={styles.datesGuestsSection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Dates & Guests</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewCalendarText}>View Calendar</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.checkInOutContainer}>
                    <Text style={styles.checkInOutText}>
                        Check-In: {centerData.checkIn || 'N/A'} • Check-Out: {centerData.checkOut || 'N/A'}
                    </Text>
                </View>

                <View style={styles.dateGuestRow}>
                    <View style={styles.dateContainer}>
                        <Icon name="calendar-today" size={16} color="#4CAF50" />
                        <Text style={styles.dateText}>{centerData.dateRange || 'N/A'}</Text>
                    </View>

                    <View style={styles.guestContainer}>
                        <Icon name="people" size={16} color="#4CAF50" />
                        <Text style={styles.guestText}>{centerData.guests || 'N/A'}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default CenterCard

const styles = StyleSheet.create({
    heroOverlay: {
        justifyContent: 'center',
        gap: 8,
        elevation: 3,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginTop: -50,
        zIndex: 10,
    },
    centerInfoSection: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    ratingContainer: {
        marginBottom: 8,
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 2,
    },
    centerName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 12,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    locationText: {
        fontSize: 16,
        color: '#333333',
        flex: 1,
    },
    viewOnMapText: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '500',
    },
    datesGuestsSection: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    viewCalendarText: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '500',
    },
    checkInOutContainer: {
        marginBottom: 12,
    },
    checkInOutText: {
        fontSize: 14,
        color: '#666666',
    },
    dateGuestRow: {
        flexDirection: 'row',
        gap: 16,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E8',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 8,
    },
    dateText: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '500',
    },
    guestContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E8',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 8,
    },
    guestText: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '500',
    },
})