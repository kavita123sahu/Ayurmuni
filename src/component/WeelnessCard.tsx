import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';

// Define interface for centerData
interface CenterData {
    id: number;
    name: string;
    location: string;
    price: string;
    rating: number;
    image: string;
    featured?: boolean;
}

// Define props interface
interface WellnessCardProps {
    center: CenterData;
}

// Method 1: Destructure props with proper types
const WellnessCard: React.FC<WellnessCardProps> = ({
    center
}) => (
    <TouchableOpacity
        style={[
            styles.centerCard,
            // featured && styles.featuredCard
        ]}
        // onPress={() => handleCenterSelect(center)}
        activeOpacity={0.8}
    >
        <View style={[styles.imageContainer,]}>
            <Image source={{ uri: center.image }} style={styles.centerImage} />
            <TouchableOpacity style={styles.heartButton}>
                <Text style={styles.heartIcon}>♡</Text>
            </TouchableOpacity>
            {/* {featured && (
                <View style={styles.featuredBadge}>
                    <Text style={styles.featuredText}>Featured</Text>
                </View>
            )} */}
        </View>
        <View style={styles.cardContent}>
            <Text style={styles.centerName}>{center.name}</Text>
            <View style={styles.locationRow}>
                <Text style={styles.locationIcon}>📍</Text>
                <Text style={styles.locationText}>{center.location}</Text>
            </View>
            <View style={styles.ratingPriceRow}>
                <View style={styles.ratingContainer}>
                    <Text style={styles.starIcon}>⭐</Text>
                    <Text style={styles.ratingText}>{center.rating}</Text>
                </View>
                <Text style={styles.priceText}>{center.price}</Text>
            </View>
        </View>
    </TouchableOpacity>
);

export default WellnessCard

const styles = StyleSheet.create({
    centerCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
        marginBottom: 16,
    },
    featuredCard: {
        flex: 1,
        marginRight: 12,
    },
    imageContainer: {
        height: 120,
        position: 'relative',
    },
    featuredImageContainer: {
        height: 180,
    },
    centerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    heartButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(255,255,255,0.9)',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heartIcon: {
        fontSize: 16,
        color: '#6B7280',
    },
    featuredBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#10B981',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    featuredText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '600',
    },
    cardContent: {
        padding: 16,
    },
    centerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    locationIcon: {
        fontSize: 12,
        marginRight: 4,
    },
    locationText: {
        fontSize: 14,
        color: '#6B7280',
    },
    ratingPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starIcon: {
        fontSize: 14,
        marginRight: 4,
    },
    ratingText: {
        fontSize: 14,
        color: '#6B7280',
    },
    priceText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#059669',
    },
    // Grids
    topCentersGrid: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    rightColumn: {
        flex: 1,
    },
    centersGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    // Physical Therapy Card
    therapyCard: {
        backgroundColor: '#F3E8FF',
        borderRadius: 12,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    therapyContent: {
        flex: 1,
    },
    therapyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    therapySubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
    },
    therapyButton: {
        backgroundColor: '#7C3AED',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    therapyButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    therapyIcon: {
        width: 60,
        height: 60,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
    },
    therapyIconText: {
        fontSize: 30,
    },
    // All Centers Card
    allCentersCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
    },
    allCentersImage: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
    },
    allCentersContent: {
        padding: 16,
    },
    allCentersTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    allCentersSubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
})