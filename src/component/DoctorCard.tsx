import React from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../common/Colors';
import { Fonts } from '../common/Fonts';

interface Doctor {
    id: number;
    name: string;
    specialization: string;
    experience: string;
    rating: number;
    image: any;
    isAvailable: boolean;
}

interface Props {
    title: string;
    navigation: any;
    data?: Doctor[];
}

const DoctorListCard = ({ title, navigation, data = [] }: Props) => {

    const renderDoctor = ({ item }: { item: Doctor }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('DoctorDetail', { doctor: item })}
            activeOpacity={0.8}
        >
            {/* Top Row */}
            <View style={styles.row}>
                
                {/* Image */}
                <Image
                    source={
                        item?.image
                            ? { uri: item.image }
                            : require('../assets/images/doctor.png')
                    }
                    style={styles.image}
                />

                {/* Info */}
                <View style={styles.info}>
                    
                    {/* Name */}
                    <Text style={styles.name}>{item.name}</Text>

                    {/* Specialization */}
                    <Text style={styles.specialization}>
                        {item.specialization}
                    </Text>

                    {/* Experience + Rating */}
                    <View style={styles.metaRow}>
                        <Text style={styles.metaText}>
                            ⏱ {item.experience}
                        </Text>

                        <Text style={styles.metaText}>
                            ⭐ {item.rating}
                        </Text>
                    </View>
                </View>

                {/* Call Button */}
                <TouchableOpacity style={styles.callBtn}>
                    <Text style={{ color: '#fff' }}>📞</Text>
                </TouchableOpacity>
            </View>

            {/* Available Badge */}
            {item.isAvailable && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>Available Now</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>

                <TouchableOpacity onPress={() => navigation.navigate('AllDoctors')}>
                    <Text style={styles.viewAll}>View all</Text>
                </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
                data={data}
                renderItem={renderDoctor}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

export default DoctorListCard;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginTop: 10,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    title: {
        fontSize: 18,
        fontFamily: Fonts.PoppinsSemiBold,
        color: '#222',
    },

    viewAll: {
        color: Colors.primaryColor,
        fontFamily: Fonts.PoppinsMedium,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,

        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    image: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginRight: 12,
    },

    info: {
        flex: 1,
    },

    name: {
        fontSize: 14,
        fontFamily: Fonts.PoppinsSemiBold,
        color: '#111',
    },

    specialization: {
        fontSize: 12,
        color: Colors.primaryColor,
        marginVertical: 2,
        fontFamily: Fonts.PoppinsMedium,
    },

    metaRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 4,
    },

    metaText: {
        fontSize: 11,
        color: '#666',
        fontFamily: Fonts.PoppinsRegular,
    },

    callBtn: {
        backgroundColor: Colors.primaryColor,
        height: 40,
        width: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    badge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#E6F4EA',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },

    badgeText: {
        fontSize: 10,
        color: '#2E7D32',
        fontFamily: Fonts.PoppinsMedium,
    },
});