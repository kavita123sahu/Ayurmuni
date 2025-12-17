import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    
    FlatList,
    Alert,
} from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { Ionicons } from '../../common/Vector';
import ConsultDoctor from '../../component/ConsultDoctor';
import Header from '../../component/Header';
import { Colors } from '../../common/Colors';
import { Fonts } from '../../common/Fonts';
import GradientButton from '../../component/GradientButton';
import * as _CONSULT_SERVICE from '../../services/ConsultServce';


interface NavigationProp {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
}

interface Specialty {
    id: string;
    name: string;
    isSelected: boolean;
}

interface TreatmentType {
    id: string;
    name: string;
    treatment_type: string
    isSelected: boolean;
}

interface SelectSpecialtyProps {
    navigation: NavigationProp;
    route?: {
        params?: {
            currentSelectedSpecialties?: Specialty[];
            selectedTreatments?: TreatmentType[];
            patient?: any;
        }
    };
}

const SelectSpecialty: React.FC<SelectSpecialtyProps> = ({ navigation, route }) => {
    const SpecialtyImage = require('../../assets/images/consultnow.png');


    const patientData = route?.params?.patient|| {};


    const [specialties, setSpecialties] = useState<Specialty[]>([]);

    const [treatmentTypes, setTreatmentTypes] = useState<TreatmentType[]>([ ]);

    const [apiSpecialties, setApiSpecialties] = useState<Specialty[]>([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        getSpecialityAPI();
        getTreatmentAPI();
    }, [isFocused]);

    const getSpecialityAPI = async () => {
        try {
            let response: any = await _CONSULT_SERVICE.getSpecialty();

            const JSONResponse = await response.json();
            console.log('Specialty API Response:', JSONResponse);
            setApiSpecialties(JSONResponse);
            if (route?.params?.currentSelectedSpecialties) {
                mergeSelectedSpecialties(JSONResponse, route.params.currentSelectedSpecialties);
            } else {
                setSpecialties(JSONResponse);
            }
        } catch (error) {
            console.log("SPECIALITY DATA ERROR:", error);
        }
    }


    const getTreatmentAPI = async () => {
        try {

            let response: any = await _CONSULT_SERVICE.getTreatment();
            const JSONResponse = await response.json();
            console.log('Treatment API Response:', JSONResponse);
            setTreatmentTypes(Array.isArray(JSONResponse) ? JSONResponse : []);
        } catch (error) {
            console.log("CATEGORY DATA ERROR:", error);
        }
    }

    const mergeSelectedSpecialties = (apiData: Specialty[], selectedSpecialties: Specialty[]) => {
        const updatedSpecialties = apiData.map(specialty => {
            const foundSelected = selectedSpecialties.find(
                selected => selected.id === specialty.id && selected.isSelected
            );
            return {
                ...specialty,

                isSelected: foundSelected ? true : false
            };
        });
        setSpecialties(updatedSpecialties);
    }

    useFocusEffect(
        React.useCallback(() => {
            if (route?.params?.currentSelectedSpecialties && apiSpecialties.length > 0) {

                mergeSelectedSpecialties(apiSpecialties, route.params.currentSelectedSpecialties);
            }

            if (route?.params?.selectedTreatments) {
                const updatedTreatments = treatmentTypes?.map(treatment => {
                    const isSelected = route.params?.selectedTreatments?.some(
                        selected => selected.id === treatment.id && selected.isSelected
                    );
                    return { ...treatment, isSelected: isSelected || false };
                });
                setTreatmentTypes(updatedTreatments);
            }
        }, [route?.params, apiSpecialties])
    );




    // Handle specialty selection
    const handleSpecialtySelect = (specialtyId: string) => {
        setSpecialties(prevSpecialties =>
            prevSpecialties.map(specialty =>
                specialty.id === specialtyId
                    ? { ...specialty, isSelected: !specialty.isSelected }
                    : specialty
            )
        );
    };

    // Handle treatment type selection
    const handleTreatmentSelect = (treatmentId: string) => {
        setTreatmentTypes(prevTreatments =>
            prevTreatments.map(treatment =>
                treatment.id === treatmentId
                    ? { ...treatment, isSelected: !treatment.isSelected }
                    : treatment
            )
        );
    };

    const handleProceed = () => {
        console.log('Proceed button clicked', specialties, treatmentTypes)
        const selectedSpecialties = specialties.filter(spec => spec.isSelected).map(t => t.id);;
        const selectedTreatments = treatmentTypes?.filter(treat => treat.isSelected).map(t => t.id);;


        console.log('Selected Specialties:', selectedSpecialties, selectedTreatments);


        if (selectedSpecialties.length === 0 || selectedTreatments.length === 0) {
            Alert.alert('Selection Required', 'Please select at least one specialty or treatment type.');
            return;
        }


        

        navigation.navigate('DoctorSelect', {
            selectedSpecialties,
            selectedTreatments,
            patientData
        });
        
    // navigation.navigate('TimeSlotBooking', {
    //   doctorData: doctorData,
    //   patientData: patientData
    // });

    };

    // Handle see all specialties navigation
    const handleSeeAllSpecialties = () => {
        navigation.navigate('AllSpecialty', {
            currentSelectedSpecialties: specialties,
        });
    };

    // Render specialty item
    const renderSpecialtyItem = ({ item }: { item: Specialty }) => (
        <TouchableOpacity
            style={[
                styles.specialtyItem,
                item.isSelected && styles.specialtyItemSelected
            ]}
            onPress={() => handleSpecialtySelect(item.id)}
        >
            <View style={styles.checkboxContainer}>
                <View style={[
                    styles.checkbox,
                    item.isSelected && styles.checkboxSelected
                ]}>
                    {item.isSelected && (
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    )}
                </View>
                <Text style={[
                    styles.specialtyText,
                    item.isSelected && styles.specialtyTextSelected
                ]}>
                    {item.name}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Header title='Select Specialty' Is_Tab={false} navigation={navigation} />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Top 3 Specialist :</Text>
                    <FlatList
                        data={specialties.slice(0, 3)}
                        renderItem={renderSpecialtyItem}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                    />
                </View>

                <TouchableOpacity
                    style={styles.seeAllButton}
                    onPress={handleSeeAllSpecialties}
                >
                    <Text style={styles.seeAllText}>See all specialities</Text>
                </TouchableOpacity>

                <ConsultDoctor
                    title="Not Sure about Speciality?"
                    subTitle="Get a consultation from our general physician"
                    buttonText="Consult With General Physician"
                    navigation={navigation}
                    image={SpecialtyImage}
                />

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select treatment type :</Text>
                    <View style={styles.treatmentGrid}>
                        {treatmentTypes?.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.treatmentGridItem,
                                    item.isSelected && styles.treatmentGridItemSelected
                                ]}
                                onPress={() => handleTreatmentSelect(item.id)}>

                                <View style={styles.checkboxContainer}>
                                    <View style={[
                                        styles.checkbox,
                                        item.isSelected && styles.checkboxSelected
                                    ]}>
                                        {item.isSelected && (
                                            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                                        )}
                                    </View>
                                    <Text style={[
                                        styles.treatmentGridText,
                                        item.isSelected && styles.treatmentGridTextSelected
                                    ]}>
                                        {item.treatment_type}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <GradientButton text='Proceed' onPress={handleProceed} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    section: {
        marginVertical: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: Fonts.PoppinsSemiBold,
        color: '#333333',
        marginBottom: 15,
    },
    specialtyItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 6,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    specialtyItemSelected: {
        borderColor: Colors.primaryColor,
        backgroundColor: '#F8FFF8',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#CCCCCC',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxSelected: {
        backgroundColor: Colors.primaryColor,
        borderColor: Colors.primaryColor,
    },
    specialtyText: {
        fontSize: 16,
        color: Colors.textColor,
        fontFamily: Fonts.PoppinsMedium,
        flex: 1,
    },
    specialtyTextSelected: {
        color: Colors.primaryColor,
        fontSize: 16,
        fontFamily: Fonts.PoppinsMedium,
    },
    seeAllButton: {
        borderWidth: 1,
        borderColor: Colors.secondaryColor,
        borderRadius: 6,
        padding: 15,
        alignItems: 'center',
        marginVertical: 10,
        marginBottom: 20
    },
    seeAllText: {
        color: Colors.primaryColor,
        fontSize: 14,
        fontFamily: Fonts.PoppinsMedium,
    },
    treatmentGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    treatmentGridItem: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 6,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    treatmentGridItemSelected: {
        borderColor: Colors.primaryColor,
        backgroundColor: '#F8FFF8',
    },
    treatmentGridText: {
        fontSize: 16,
        color: Colors.textColor,
        fontFamily: Fonts.PoppinsMedium,
        flex: 1,
    },
    treatmentGridTextSelected: {
        color: Colors.primaryColor,
        fontSize: 16,
        fontFamily: Fonts.PoppinsMedium,
    },
});

export default SelectSpecialty;