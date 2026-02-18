
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppointmentsScreen } from './AppointmentScreen';

export default function RatingSubmit() {
    return (
        <View style={styles.container}>
            <AppointmentsScreen />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});