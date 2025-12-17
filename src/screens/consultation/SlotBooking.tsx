import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    StatusBar,
} from 'react-native';
import *as _CONSULT_SERVICE from '../../services/ConsultServce';
import { showSuccessToast } from '../../config/Key';
import { Colors } from '../../common/Colors';
import Header from '../../component/Header';
import { Fonts } from '../../common/Fonts';
import { Utils } from '../../common/Utils';
import { logger } from 'react-native-logs';
import { Entypo, EvilIcons, Feather, FontAwesome, FontAwesome5 } from '../../common/Vector';

// TypeScript interfaces
interface BookedSlot {
    date: string;
    time: string;
    status: string;
}

interface SlotButtonProps {
    time: string;
    isBooked: boolean;
    isSelected: boolean;
    onSelect: (time: string) => void;
}

const TimeSlotBooking: React.FC = (props: any) => {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [customerID, setcustomerID] = useState<string>('');
    const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([
        { date: '2025-01-02', time: '10:30 AM', status: 'Booked' },
        { date: '2025-01-15', time: '10:30 AM', status: 'Booked' }
    ]);
    const [isBooking, setIsBooking] = useState<boolean>(false);


    useEffect(() => {
        getUser()
    }, [])


    const { doctorData, patientData } = props?.route?.params;

    console.log('Doctor Data in SlotBooking:', doctorData);
    const timeSlots: string[] = [
        '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
        '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM',
        '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
        '4:00 PM', '4:30 PM'
    ];

    // Generate date options for picker (next 30 days)
    const generateDateOptions = (): { label: string; value: string }[] => {
        const dates = [];
        const today = new Date();

        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            // ✅ Format as YYYY-MM-DD
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based month
            const day = String(date.getDate()).padStart(2, '0');
            const value = `${year}-${month}-${day}`;
            const label = `${year}-${month}-${day}`;

            // ✅ Label (Readable)
            // const label = date.toLocaleDateString('en-US', {
            //   weekday: 'short',
            //   month: 'short',
            //   day: 'numeric',
            //   year: 'numeric',
            // });

            dates.push({ label, value });
        }

        return dates;
    };


    const dateOptions = generateDateOptions();

    const isSlotBooked = (time: string): boolean => {
        return bookedSlots.some(slot =>
            slot.date === selectedDate && slot.time === time
        );
    };


    const isSlotSelected = (time: string): boolean => {
        return selectedTimeSlot === time;
    };

    const handleSlotSelect = (time: string): void => {
        if (isSlotBooked(time)) return;


        setSelectedTimeSlot(time);
    };

    const handleDateSelect = (date: string): void => {
        setSelectedDate(date);
        setSelectedTimeSlot('');
    };


    function parseTime12h(timeStr: string) {
        const [time, modifier] = timeStr.split(" "); // ["10:00", "AM"]
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier === "PM" && hours !== 12) {

            hours += 12;
        }
        if (modifier === "AM" && hours === 12) {
            hours = 0;
        }

        return {
            hours,
            minutes,
            seconds: 0, // agar string me second nahi hai to 0 le lo
        };
    }


    const getUser = async () => {
        const _USER_INFO = await Utils.getData('_USER_INFO');
        const CUSTOMER_ID = await Utils.getData('_CUSTOMER_ID');

        setcustomerID(_USER_INFO?.id || CUSTOMER_ID);

    };

    const log = logger.createLogger();


    const bookAppointment = async (): Promise<void> => {
        if (!selectedTimeSlot) {
            Alert.alert('Error', 'Please select a time slot to book your appointment');
            return;
        }

        setIsBooking(true);

        try {
            console.log('📅 Booking started...');
            const timeObj = parseTime12h(selectedTimeSlot);

            const newBooking = {
                doctor: doctorData?.id,
                date: selectedDate,
                time: `${timeObj.hours}:${timeObj.minutes}:${timeObj.seconds}`,
                // is_booked: ,true
            };

            console.log('🆕 New Booking Payload:', newBooking);

            const response: any = await _CONSULT_SERVICE.BookSlot(newBooking);

            // Handle non-OK HTTP responses
            if (!response || !response.ok) {
                console.log('⚠️ API Request Failed:', response?.status, response?.statusText);
                throw new Error(`Please Send Unbooked Date and time: ${response?.status}`);
            }

            const responseData = await response.json().catch((e: any) => {
                console.log('❌ JSON parse error:', e);
                throw new Error('Invalid JSON response from API');
            });

            console.log('✅ Book Slot Response Data:', responseData);

            if (responseData.status_code === 201) {
                setIsBooking(false);
                Alert.alert(
                    'Please Confirmed Slot',
                    `Your appointment has been booking on ${selectedDate} at ${selectedTimeSlot}`,
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                console.log('✅ OK pressed — running handleBookconsult');
                                handleBookconsult(responseData?.data);
                            },
                        },
                    ]
                )
            } else {
                setIsBooking(false);
                const errorMsg =
                    responseData?.errors?.non_field_errors?.[0] ||
                    responseData?.message ||
                    'Unknown booking error occurred';
                console.log('⚠️ Booking Error:', errorMsg);
                showSuccessToast(errorMsg, 'error');
            }
        } catch (error: any) {
            console.log('🚨 Booking Exception:', error?.message || error);
            Alert.alert('Error', error?.message || 'Failed to book appointment. Please try again.');
            showSuccessToast(error?.message || 'Something went wrong while booking.', 'error');
        } finally {
            setIsBooking(false);
            console.log('📦 Booking process finished.');
        }
    };
    const handleBookconsult = async (slot_data: any) => {
        try {
            setIsBooking(true);

            // 🧾 Debug alert for IDs


            const send_data = {
                customer: customerID,
                patient_id: patientData?.id,
                doctor: slot_data?.doctor,
                slot: slot_data?.id,
                symptoms: "",
                health_goals: "",
            };


            const response: any = await _CONSULT_SERVICE.BookConsultation(send_data)
            const responseData = await response.json();

            setBookedSlots(prev => [...prev, {
                date: selectedDate, time: selectedTimeSlot, status: 'Booked',
            }]);
const msg =
                    responseData?.error ||
                    responseData?.message ||
                    JSON.stringify(responseData);
            Alert.alert(
                
                "Success 🎉",
                `${msg}Your consultation is booked!\nDate: ${selectedDate}\nTime: ${selectedTimeSlot}`,
                [
                    {
                        text: "OK",
                        onPress: () => {

                            props.navigation.navigate("ConsultationPayment", {
                                productData: responseData
                            });
                        },

                    },
                ]
            );
            //     .catch((err: any) => {
            //         console.error("❌ API Call Failed:", err);
            //         throw new Error("Network error while booking consultation");
            //     });

            // Alert.alert("Response Status", `${response}`);
            // return ;
            // let responseData;
            // try {
            //     responseData = await response.json();
            // } catch (jsonErr) {
            //     console.error("❌ JSON Parse Error:", jsonErr);
            //     Alert.alert("Error", "Invalid response from server");
            //     return;
            // }

            // if (response?.status_code === 201) {
            //     setIsBooking(false);



            // } else {

            //     const msg =
            //         responseData?.error ||
            //         responseData?.message ||
            //         JSON.stringify(responseData);
            //     console.error(" Booking Failed:", msg);
            //     Alert.alert("Booking Failed", msg);
            //     setIsBooking(false);
            // }
        } catch (error: any) {
            console.error("handleBookconsult ERROR:", error);
            Alert.alert("Error", error?.message || "Unexpected error occurred");
            setIsBooking(false);
        } finally {
            setIsBooking(false);
        }
    };



    const SlotButton: React.FC<SlotButtonProps> = ({ time, isBooked, isSelected, onSelect }) => (
        <TouchableOpacity
            style={[
                styles.slotButton,
                isBooked && styles.bookedSlot,
                isSelected && styles.selectedSlot,
                !isBooked && !isSelected && styles.availableSlot
            ]}
            onPress={() => onSelect(time)}
            disabled={isBooked}
            activeOpacity={0.7}
        >
            <Text style={[
                styles.slotText,
                isBooked && styles.bookedText,
                isSelected && styles.selectedText,
                !isBooked && !isSelected && styles.availableText
            ]}>
                {time}
                {isBooked && ' (Booked)'}
                {isSelected && ' ✓'}
            </Text>
        </TouchableOpacity>
    );

    const DateSelector = () => (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateScrollContainer}
        >
            {dateOptions.map((dateOption) => (
                <TouchableOpacity
                    key={dateOption.value}
                    style={[
                        styles.dateOption,
                        selectedDate === dateOption.value && styles.selectedDateOption
                    ]}
                    onPress={() => handleDateSelect(dateOption.value)}
                >
                    <Text style={[
                        styles.dateOptionText,
                        selectedDate === dateOption.value && styles.selectedDateText
                    ]}>
                        {dateOption.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    const renderBookedSlot = (slot: BookedSlot, index: number) => (
        <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{slot.date}</Text>
            <Text style={styles.tableCell}>{slot.time}</Text>
            <Text style={styles.statusCell}>{slot.status}</Text>
        </View>
    );

    // Filter booked slots for current date
    const currentDateBookedSlots = bookedSlots.filter(slot => slot.date === selectedDate);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#466425" barStyle="light-content" />

            <Header title='Book Appointment' navigation={props.navigation} Is_Tab={false} />

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >


                <View style={styles.card}>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Book Your Appointment
                        </Text>
                        <Text style={styles.subtitle}>
                            Select your preferred date and time
                        </Text>
                    </View>

                    {/* Date Selector */}
                    <View style={styles.dateSection}>
                        <Text style={styles.label}>
                            Select Date:
                        </Text>
                        <DateSelector />
                    </View>

                    {/* Selected Appointment Info */}
                    {selectedTimeSlot && (
                        <View style={styles.selectedInfo}>
                            <Text style={styles.selectedInfoTitle}>Selected Appointment:</Text>
                            <Text style={styles.selectedInfoText}>
                                <Entypo name='calendar' color={'grey'} />  {selectedDate}
                            </Text>
                            <Text style={styles.selectedInfoText}>
                                <Feather name='clock' color={'grey'} />  {selectedTimeSlot}
                            </Text>
                        </View>
                    )}

                    {/* Time Slots Grid */}
                    <View style={styles.slotsSection}>
                        <Text style={styles.sectionTitle}>Available Time Slots</Text>
                        <View style={styles.slotsGrid}>
                            {timeSlots.map((time: string, index: number) => (
                                <SlotButton
                                    key={`${time}-${index}`}
                                    time={time}
                                    isBooked={isSlotBooked(time)}
                                    isSelected={isSlotSelected(time)}
                                    onSelect={handleSlotSelect}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Book Appointment Button */}
                    <TouchableOpacity
                        style={[
                            styles.bookButton,
                            !selectedTimeSlot && styles.bookButtonDisabled
                        ]}
                        onPress={isBooking ? undefined : bookAppointment}
                        disabled={!selectedTimeSlot || isBooking}
                    >

                        <Text style={styles.bookButtonText}>
                            {isBooking ? 'Booking Appointment...' : 'Book This Appointment'}
                        </Text>
                    </TouchableOpacity>

                    {/* Booked Appointments Table */}
                    <View style={styles.tableSection}>
                        <Text style={styles.tableTitle}>
                            Your Appointments ({currentDateBookedSlots.length})
                        </Text>

                        <View style={styles.table}>
                            {/* Table Header */}
                            <View style={styles.tableHeader}>
                                <Text style={styles.tableHeaderText}>Date</Text>
                                <Text style={styles.tableHeaderText}>Time</Text>
                                <Text style={styles.tableHeaderText}>Status</Text>
                            </View>

                            {/* Table Body */}
                            {currentDateBookedSlots.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyText}>
                                        No appointments on {selectedDate}
                                    </Text>
                                </View>
                            ) : (
                                currentDateBookedSlots.map(renderBookedSlot)
                            )}
                        </View>
                    </View>

                    {/* Legend */}
                    <View style={styles.legend}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, styles.availableColor]} />
                            <Text style={styles.legendText}>Available</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, styles.selectedColor]} />
                            <Text style={styles.legendText}>Selected</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, styles.bookedColor]} />
                            <Text style={styles.legendText}>Booked</Text>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    scrollContainer: {
        flexGrow: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // paddingVertical: 20,
        // paddingHorizontal: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',

        padding: 32,
        maxWidth: 400,
        width: '100%',
        // shadowColor: '#000000',
        // shadowOffset: {
        //     width: 0,
        //     height: 12,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 16,
        // elevation: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 20,
        fontFamily: Fonts.PoppinsSemiBold,
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: Fonts.PoppinsMedium,
        textAlign: 'center',
    },
    dateSection: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: Fonts.PoppinsMedium,
        marginBottom: 12,
    },
    dateScrollContainer: {
        paddingHorizontal: 4,
    },
    dateOption: {
        backgroundColor: '#F3F4F6',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    selectedDateOption: {
        backgroundColor: Colors.secondaryColor,
        borderColor: Colors.secondaryColor,
    },
    dateOptionText: {
        fontSize: 12,
        color: '#6B7280',
        fontFamily: Fonts.PoppinsMedium,
        textAlign: 'center',
        minWidth: 60,
    },
    selectedDateText: {
        color: '#FFFFFF',
        fontFamily: Fonts.PoppinsMedium,
    },
    selectedInfo: {
        backgroundColor: '#F0FDF4',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#BBF7D0',
    },
    selectedInfoTitle: {
        fontSize: 14,
        fontFamily: Fonts.PoppinsSemiBold,
        color: Colors.primaryColor,
        marginBottom: 8,
    },
    selectedInfoText: {
        fontSize: 14,
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.secondaryColor,
        marginBottom: 4,
    },
    slotsSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: Fonts.PoppinsSemiBold,
        color: '#1F2937',
        marginBottom: 12,
    },
    slotsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    slotButton: {
        width: '48%',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginVertical: 4,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    availableSlot: {
        backgroundColor: Colors.tabinactive,
        borderWidth: 1,
        borderColor: Colors.tabinactive,
    },
    selectedSlot: {
        backgroundColor: Colors.secondaryColor,
        borderWidth: 1,
        borderColor: Colors.secondaryColor,
    },
    bookedSlot: {
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FECACA',
        opacity: 0.7,
    },
    slotText: {
        fontSize: 14,
        fontFamily: Fonts.PoppinsMedium,
        textAlign: 'center',
    },
    availableText: {
        color: Colors.primaryColor,
        fontFamily: Fonts.PoppinsMedium,
    },
    selectedText: {
        color: '#FFFFFF',
        fontFamily: Fonts.PoppinsSemiBold,
    },
    bookedText: {
        color: '#DC2626',
    },
    bookButton: {
        backgroundColor: Colors.secondaryColor,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 32,
        shadowColor: Colors.secondaryColor,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    bookButtonDisabled: {
        backgroundColor: '#9CA3AF',
        shadowOpacity: 0,
        elevation: 0,
    },
    bookButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: Fonts.PoppinsSemiBold,
    },
    tableSection: {
        marginTop: 8,
    },
    tableTitle: {
        fontSize: 18,
        fontFamily: Fonts.PoppinsSemiBold,
        color: '#1F2937',
        marginBottom: 16,
    },
    table: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    tableHeader: {
        backgroundColor: Colors.secondaryColor,
        flexDirection: 'row',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    tableHeaderText: {
        flex: 1,
        color: '#FFFFFF',
        fontFamily: Fonts.PoppinsSemiBold,
        fontSize: 14,
        textAlign: 'center',
    },

    tableRow: {
        flexDirection: 'row',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },

    tableCell: {
        flex: 1,
        color: '#4B5563',
        fontSize: 14,
        textAlign: 'center',
    },
    statusCell: {
        flex: 1,
        color: '#059669',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    emptyState: {
        paddingVertical: 24,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    emptyText: {
        color: '#6B7280',
        fontSize: 14,
        fontFamily: Fonts.PoppinsMedium,
        textAlign: 'center',
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
        flexWrap: 'wrap',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
        marginVertical: 4,
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 4,
        marginRight: 6,
        borderWidth: 1,
    },
    availableColor: {
        backgroundColor: '#DBEAFE',
        borderColor: '#BFDBFE',
    },
    selectedColor: {
        backgroundColor: Colors.secondaryColor,
        borderColor: Colors.secondaryColor,
    },
    bookedColor: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FECACA',
    },
    legendText: {
        fontSize: 11,
        fontFamily: Fonts.PoppinsMedium,
        color: '#6B7280',
    },
});

export default TimeSlotBooking;