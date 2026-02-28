// import React, { useEffect, useState } from 'react';
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     ScrollView,
//     StyleSheet,
//     Alert,
//     StatusBar,
// } from 'react-native';
// import * as _CONSULT_SERVICE from '../../services/ConsultServce';
// import { Colors } from '../../common/Colors';
// import Header from '../../component/Header';
// import { Fonts } from '../../common/Fonts';
// import { Entypo, Feather } from '../../common/Vector';

// const TimeSlotBooking: React.FC = (props: any) => {

//     const { doctorData, patientData } = props?.route?.params;

//     const [selectedDate, setSelectedDate] = useState(
//         new Date().toISOString().split('T')[0]
//     );
//     const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
//     const [selectedSlotObj, setSelectedSlotObj] = useState<any>(null);
//     const [availableSlots, setAvailableSlots] = useState<any[]>([]);
//     const [isBooking, setIsBooking] = useState(false);

//     // const timeSlots = [
//     //     '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
//     //     '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
//     //     '1:00 PM', '2:30 PM', '3:00 PM', '4:30 PM',
//     //     '5:00 PM', '6:30 PM', '7:08 PM', '8:30 PM'
//     // ];


//     const timeSlots = [
//   "09:00", "09:30", "10:00", "10:30",
//   "11:00", "11:30", "12:00", "12:30",
//   "13:00", "14:30", "15:00", "16:30",
//   "17:00", "18:07", "19:08", "20:30",
//   "21:02", "22:00", "23:00", "24:00"
// ];

//     useEffect(() => {
//         getSlotAvailable();
//     }, []);

//     const getSlotAvailable = async () => {
//         try {
//             const response: any = await _CONSULT_SERVICE.getSlotAvailable(doctorData?.id);
//             const data = await response.json();
//             console.log("date---slottingavialbel ", data);
//             setAvailableSlots(data?.slots || []);
//         } catch (error) {
//             console.log("Slot Fetch Error:", error);
//         }
//     };

//     // const convertTo12Hour = (time24: string) => {
//     //     const [hour, minute] = time24.split(":");
//     //     let h = parseInt(hour);
//     //     const ampm = h >= 12 ? "PM" : "AM";
//     //     h = h % 12;
//     //     h = h ? h : 12;
//     //     return `${h}:${minute} ${ampm}`;
//     // };


//     const convertTo24Hour = (time24: string) => {
//   const [hour, minute] = time24.split(":");
//   return `${hour}:${minute}`;
// };
//     const slotsForSelectedDate = availableSlots.filter(
//         slot => slot.date === selectedDate
//     );

//     const getSlotStatus = (time: string) => {
//         const slot = slotsForSelectedDate.find(s => {
//             const converted = convertTo24Hour(s.time);
//             return converted === time;
//         });

//         if (!slot) return { status: "not_exist", slot: null };
//         if (slot.is_booked) return { status: "booked", slot };
//         return { status: "available", slot };
//     };

//     const handleSlotSelect = (time: string) => {
//         const { status, slot } = getSlotStatus(time);
//         if (status !== "available") return;

//         setSelectedTimeSlot(time);
//         setSelectedSlotObj(slot);
//     };

//     const bookAppointment = async () => {

//         console.log("selctedslotttttttt--->", selectedDate, selectedSlotObj);

//         if (!selectedSlotObj) {
//             Alert.alert("Error", "Please select slot");
//             return;
//         }

//         setIsBooking(true);

//         try {
//             const payload = {
//                 slot_id: selectedSlotObj.id,
//                 doctor_id: doctorData?.id,
//                 patient_id: patientData?.id,
//                 symptoms: "Migraine and acidity",
//                 health_goals: "Better digestion"
//                 // date: selectedSlotObj.date,
//                 // time: selectedSlotObj.time
//             };

//             console.log("payloadconsulation --->", payload);

//             const response: any = await _CONSULT_SERVICE.BookConsultation(payload);
//             console.log("resnseconsulation-->", response);
//             const data = await response.json();

//               console.log("jsonResponseee-->", data);

//             if (response.ok) {
//                 Alert.alert(
//                     "Success 🎉",
//                     `Appointment booked\nDate: ${selectedDate}\nTime: ${selectedTimeSlot}`,
//                     [{
//                         text: "OK",
//                         onPress: () => {
//                             props.navigation.navigate("ConsultationPayment", {
//                                 productData: data
//                             });
//                         }
//                     }]
//                 );
//             } else {
//                 Alert.alert("Error", data?.message || "Booking failed");
//             }

//         } catch (error) {
//             Alert.alert("Error", "Booking failed");
//         } finally {
//             setIsBooking(false);
//         }
//     };

//     const SlotButton = ( {time}
//         ) => {

//         const { status } = getSlotStatus(time);
//         const isSelected = selectedTimeSlot === time;
//         const isDisabled = status !== "available";

//         return (
//             <TouchableOpacity
//                 style={[
//                     styles.slotButton,
//                     status === "not_exist" && styles.disabledSlot,
//                     status === "booked" && styles.bookedSlot,
//                     status === "available" && !isSelected && styles.availableSlot,
//                     isSelected && styles.selectedSlot
//                 ]}
//                 onPress={() => handleSlotSelect(time)}
//                 disabled={isDisabled}
//             >
//                 <Text style={[
//                     styles.slotText,
//                     status === "not_exist" && styles.disabledText,
//                     status === "booked" && styles.bookedText,
//                     status === "available" && !isSelected && styles.availableText,
//                     isSelected && styles.selectedText
//                 ]}>
//                     {time} {isSelected && "✓"}
//                 </Text>
//             </TouchableOpacity>
//         );
//     };

//     const generateDateOptions = () => {
//         const dates = [];
//         const today = new Date();

//         for (let i = 0; i < 30; i++) {
//             const date = new Date(today);
//             date.setDate(today.getDate() + i);

//             const year = date.getFullYear();
//             const month = String(date.getMonth() + 1).padStart(2, '0');
//             const day = String(date.getDate()).padStart(2, '0');
//             const value = `${year}-${month}-${day}`;

//             dates.push({ label: value, value });
//         }

//         return dates;
//     };

//     const dateOptions = generateDateOptions();

//     return (
//         <View style={styles.container}>
//             <StatusBar backgroundColor="#466425" barStyle="light-content" />
//             <Header title='Book Appointment' navigation={props.navigation} Is_Tab={false} />

//             <ScrollView contentContainerStyle={styles.scrollContainer}>
//                 <View style={styles.card}>

//                     <Text style={styles.title}>Book Your Appointment</Text>

//                     <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                         {dateOptions.map(date => (
//                             <TouchableOpacity
//                                 key={date.value}
//                                 style={[
//                                     styles.dateOption,
//                                     selectedDate === date.value && styles.selectedDateOption
//                                 ]}
//                                 onPress={() => {
//                                     setSelectedDate(date.value);
//                                     setSelectedTimeSlot('');
//                                     setSelectedSlotObj(null);
//                                 }}
//                             >
//                                 <Text style={[
//                                     styles.dateText,
//                                     selectedDate === date.value && styles.selectedDateText
//                                 ]}>
//                                     {date.label}
//                                 </Text>
//                             </TouchableOpacity>
//                         ))}
//                     </ScrollView>

//                     <View style={styles.slotsGrid}>
//                         {timeSlots.map((time, index) => (
//                             <SlotButton key={index} time={time} />
//                         ))}
//                     </View>

//                     <TouchableOpacity
//                         style={[
//                             styles.bookButton,
//                             !selectedSlotObj && styles.bookButtonDisabled
//                         ]}
//                         disabled={!selectedSlotObj || isBooking}
//                         onPress={bookAppointment}
//                     >
//                         <Text style={styles.bookButtonText}>
//                             {isBooking ? "Booking..." : "Book This Appointment"}
//                         </Text>
//                     </TouchableOpacity>

//                 </View>
//             </ScrollView>
//         </View>
//     );
// };

// export default TimeSlotBooking;


// const styles = StyleSheet.create({

//     container: {
//         flex: 1,
//         backgroundColor: "#FFFFFF",
//     },

//     scrollContainer: {
//         flexGrow: 1,
//         padding: 16,
//     },

//     card: {
//         backgroundColor: "#FFFFFF",
//         padding: 20,
//     },

//     title: {
//         fontSize: 20,
//         fontFamily: Fonts.PoppinsSemiBold,
//         color: "#1F2937",
//         textAlign: "center",
//         marginBottom: 20,
//     },

//     /* ---------------- DATE SELECTOR ---------------- */

//     dateOption: {
//         backgroundColor: "#F3F4F6",
//         paddingVertical: 10,
//         paddingHorizontal: 14,
//         borderRadius: 10,
//         marginRight: 8,
//         borderWidth: 1,
//         borderColor: "#E5E7EB",
//     },

//     selectedDateOption: {
//         backgroundColor: Colors.secondaryColor,
//         borderColor: Colors.secondaryColor,
//     },

//     dateText: {
//         fontSize: 12,
//         fontFamily: Fonts.PoppinsMedium,
//         color: "#6B7280",
//     },

//     selectedDateText: {
//         color: "#FFFFFF",
//         fontFamily: Fonts.PoppinsSemiBold,
//     },

//     /* ---------------- SLOT GRID ---------------- */

//     slotsGrid: {
//         flexDirection: "row",
//         flexWrap: "wrap",
//         justifyContent: "space-between",
//         marginTop: 20,
//     },

//     slotButton: {
//         width: "48%",
//         paddingVertical: 12,
//         paddingHorizontal: 12,
//         marginVertical: 6,
//         borderRadius: 12,
//         alignItems: "center",
//         justifyContent: "center",
//         borderWidth: 1,
//     },

//     /* 🟢 AVAILABLE */
//     availableSlot: {
//         backgroundColor: "#DCFCE7",
//         borderColor: "#22C55E",
//     },

//     availableText: {
//         color: "#15803D",
//         fontFamily: Fonts.PoppinsMedium,
//         fontSize: 14,
//     },

//     /* 🔵 SELECTED */
//     selectedSlot: {
//         backgroundColor: Colors.secondaryColor,
//         borderColor: Colors.secondaryColor,
//     },

//     selectedText: {
//         color: "#FFFFFF",
//         fontFamily: Fonts.PoppinsSemiBold,
//         fontSize: 14,
//     },

//     /* 🔴 BOOKED */
//     bookedSlot: {
//         backgroundColor: "#FEE2E2",
//         borderColor: "#DC2626",
//     },

//     bookedText: {
//         color: "#DC2626",
//         fontFamily: Fonts.PoppinsSemiBold,
//         fontSize: 14,
//     },

//     /* ⚪ NOT EXIST (Disabled) */
//     disabledSlot: {
//         backgroundColor: "#E5E7EB",
//         borderColor: "#D1D5DB",
//     },

//     disabledText: {
//         color: "#9CA3AF",
//         fontFamily: Fonts.PoppinsMedium,
//         fontSize: 14,
//     },

//     slotText: {
//         fontSize: 14,
//         textAlign: "center",
//     },

//     /* ---------------- BOOK BUTTON ---------------- */

//     bookButton: {
//         backgroundColor: Colors.secondaryColor,
//         paddingVertical: 14,
//         borderRadius: 14,
//         alignItems: "center",
//         marginTop: 30,
//     },

//     bookButtonDisabled: {
//         backgroundColor: "#9CA3AF",
//     },

//     bookButtonText: {
//         color: "#FFFFFF",
//         fontSize: 16,
//         fontFamily: Fonts.PoppinsSemiBold,
//     },

// });


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
import * as _CONSULT_SERVICE from '../../services/ConsultServce';
import { Colors } from '../../common/Colors';
import Header from '../../component/Header';
import { Fonts } from '../../common/Fonts';

const TimeSlotBooking: React.FC = (props: any) => {

    const { doctorData, patientData } = props?.route?.params;

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );
    const [selectedSlotObj, setSelectedSlotObj] = useState<any>(null);
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        getSlotAvailable();
    }, []);

    const getSlotAvailable = async () => {
        try {
            const response: any = await _CONSULT_SERVICE.getSlotAvailable(doctorData?.id);
            const data = await response.json();
            console.log("slot api response --->", data);
            setAvailableSlots(data?.slots || []);
        } catch (error) {
            console.log("Slot Fetch Error:", error);
        }
    };

    // Filter slots by selected date
    const slotsForSelectedDate = availableSlots?.filter(
        slot => slot.date === selectedDate
    );

    const bookAppointment = async () => {

        if (!selectedSlotObj) {
            Alert.alert("Error", "Please select slot");
            return;
        }

        setIsBooking(true);

        try {
            const payload = {
                slot_id: selectedSlotObj.id,
                doctor_id: doctorData?.id,
                patient_id: patientData?.id,
                symptoms: "Migraine and acidity",
                health_goals: "Better digestion"
            };

            const response: any = await _CONSULT_SERVICE.BookConsultation(payload);
            const data = await response.json();
            console.log("bookeddd------>", data);

            if (response.ok) {
                Alert.alert(
                    "Success 🎉",
                    `Appointment booked\nDate: ${selectedDate}\nTime: ${selectedSlotObj.start_time}`,
                    [{
                        text: "OK",
                        onPress: () => {
                            props.navigation.navigate("ConsultationPayment", {
                                productData: data
                            });
                        }
                    }]
                );
            } else {
                Alert.alert("Error", data?.message || "Booking failed");
            }

        } catch (error) {
            Alert.alert("Error", "Booking failed");
        } finally {
            setIsBooking(false);
        }
    };

    const generateDateOptions = () => {
        const dates = [];
        const today = new Date();

        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const value = `${year}-${month}-${day}`;

            dates.push({ label: value, value });
        }

        return dates;
    };

    const dateOptions = generateDateOptions();

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#466425" barStyle="light-content" />
            <Header title='Book Appointment' navigation={props.navigation} Is_Tab={false} />

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.card}>

                    <Text style={styles.title}>Book Your Appointment</Text>

                    {/* Date Selector */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {dateOptions.map(date => (
                            <TouchableOpacity
                                key={date.value}
                                style={[
                                    styles.dateOption,
                                    selectedDate === date.value && styles.selectedDateOption
                                ]}
                                onPress={() => {
                                    setSelectedDate(date.value);
                                    setSelectedSlotObj(null);
                                }}
                            >
                                <Text style={[
                                    styles.dateText,
                                    selectedDate === date.value && styles.selectedDateText
                                ]}>
                                    {date.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Dynamic Slots */}
                    <View style={styles.slotsGrid}>
                        {slotsForSelectedDate.length === 0 ? (
                            <Text style={{ textAlign: "center", marginTop: 20, fontFamily: Fonts.PoppinsMedium }}>
                                No slots available
                            </Text>
                        ) : (
                            slotsForSelectedDate.map((slot) => {

                                const isSelected = selectedSlotObj?.id === slot.id;

                                return (
                                    <TouchableOpacity
                                        key={slot.id}
                                        style={[
                                            styles.slotButton,
                                            slot.is_booked
                                                ? styles.bookedSlot
                                                : styles.availableSlot,
                                            isSelected && styles.selectedSlot
                                        ]}
                                        onPress={() => {
                                            if (!slot.is_booked) {
                                                setSelectedSlotObj(slot);
                                            }
                                        }}
                                        disabled={slot.is_booked}
                                    >
                                        <Text
                                            style={[
                                                styles.slotText,
                                                slot.is_booked
                                                    ? styles.bookedText
                                                    : styles.availableText,
                                                isSelected && styles.selectedText
                                            ]}
                                        >
                                            {slot.start_time} {isSelected && "✓"}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })
                        )}
                    </View>

                    {/* Book Button */}
                    <TouchableOpacity
                        style={[
                            styles.bookButton,
                            !selectedSlotObj && styles.bookButtonDisabled
                        ]}
                        disabled={!selectedSlotObj || isBooking}
                        onPress={bookAppointment}
                    >
                        <Text style={styles.bookButtonText}>
                            {isBooking ? "Booking..." : "Book This Appointment"}
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </View>
    );
};

export default TimeSlotBooking;


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    scrollContainer: {
        flexGrow: 1,
        padding: 16,
    },

    card: {
        backgroundColor: "#FFFFFF",
        padding: 20,
        borderRadius: 16,
    },

    title: {
        fontSize: 20,
        fontFamily: Fonts.PoppinsSemiBold,
        color: "#1F2937",
        textAlign: "center",
        marginBottom: 20,
    },

    /* ---------------- DATE SELECTOR ---------------- */

    dateOption: {
        backgroundColor: "#F3F4F6",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        marginRight: 8,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },

    selectedDateOption: {
        backgroundColor: Colors.secondaryColor,
        borderColor: Colors.secondaryColor,
    },

    dateText: {
        fontSize: 12,
        fontFamily: Fonts.PoppinsMedium,
        color: "#6B7280",
    },

    selectedDateText: {
        color: "#FFFFFF",
        fontFamily: Fonts.PoppinsSemiBold,
    },

    /* ---------------- SLOT GRID ---------------- */

    slotsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 20,
    },

    slotButton: {
        width: "48%",
        paddingVertical: 14,
        marginVertical: 6,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
    },

    /* 🟢 AVAILABLE */

    availableSlot: {
        backgroundColor: "#DCFCE7",
        borderColor: "#22C55E",
    },

    availableText: {
        color: "#15803D",
        fontFamily: Fonts.PoppinsMedium,
        fontSize: 14,
    },

    /* 🔵 SELECTED */

    selectedSlot: {
        backgroundColor: Colors.secondaryColor,
        borderColor: Colors.secondaryColor,
    },

    selectedText: {
        color: "#FFFFFF",
        fontFamily: Fonts.PoppinsSemiBold,
        fontSize: 14,
    },

    /* 🔴 BOOKED */

    bookedSlot: {
        backgroundColor: "#FEE2E2",
        borderColor: "#DC2626",
        opacity: 0.8,
    },

    bookedText: {
        color: "#DC2626",
        fontFamily: Fonts.PoppinsSemiBold,
        fontSize: 14,
    },

    slotText: {
        fontSize: 14,
        color : Colors.textColor,
        fontFamily: Fonts.PoppinsMedium,
        textAlign: "center",
    },

    /* ---------------- BOOK BUTTON ---------------- */

    bookButton: {
        backgroundColor: Colors.secondaryColor,
        paddingVertical: 15,
        borderRadius: 16,
        alignItems: "center",
        marginTop: 30,
    },

    bookButtonDisabled: {
        backgroundColor: "#9CA3AF",
    },

    bookButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontFamily: Fonts.PoppinsSemiBold,
    },

});