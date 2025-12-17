import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    FlatList,
    Alert,
    ToastAndroid,
} from 'react-native';
import { Ionicons } from '../../common/Vector';
import Header from '../../component/Header';
import { Colors } from '../../common/Colors';
import { Fonts } from '../../common/Fonts';
import GradientButton from '../../component/GradientButton';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import * as _CONSULT_SERVICE from '../../services/ConsultServce';
import { showSuccessToast } from '../../config/Key';

// Types
interface NavigationProp {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
}

interface Specialty {
    id: string;
    name: string;
    isSelected: boolean;
}

interface SelectSpecialtyProps {
    navigation: NavigationProp;
    route?: {
        params?: {
            currentSelectedSpecialties?: Specialty[];
        }
    };
}

const AllSpecialty: React.FC<SelectSpecialtyProps> = ({ navigation, route }) => {
    
    const [specialties, setSpecialties] = useState<Specialty[]>([ ]);

    const [apiDataLoaded, setApiDataLoaded] = useState(false);
    const isFocused = useIsFocused();


    useFocusEffect(
        React.useCallback(() => {
            if (route?.params?.currentSelectedSpecialties && route.params.currentSelectedSpecialties.length > 0) {

                setSpecialties(prevSpecialties => {
                    const updatedSpecialties = prevSpecialties.map(specialty => {
                        const foundSelected = route.params?.currentSelectedSpecialties?.find(
                            selected => selected.id === specialty.id
                        );

                        return {
                            ...specialty,
                            isSelected: foundSelected ? foundSelected.isSelected : false
                        };
                    });

                    return updatedSpecialties;
                });
            }

            getSpecialtyAPI();
        }, [route?.params?.currentSelectedSpecialties])
    );

    const getSpecialtyAPI = async () => {
        try {
            let response: any = await _CONSULT_SERVICE.getSpecialty();

            const JSONResponse = await response.json();

            if (JSONResponse && JSONResponse.length > 0) {
                // Agar route params mein selected specialties hain to unhe merge kar rahe hain
                if (route?.params?.currentSelectedSpecialties && route.params.currentSelectedSpecialties.length > 0) {
                    const mergedSpecialties = JSONResponse.map((apiSpecialty: Specialty) => {
                        const foundSelected = route.params?.currentSelectedSpecialties?.find(
                            (selected: Specialty) => selected.id === apiSpecialty.id
                        );

                        return {
                            ...apiSpecialty,
                            isSelected: foundSelected ? foundSelected.isSelected : false
                        };
                    });



                    setSpecialties(mergedSpecialties);
                } else {
                    // Agar koi selected specialties nahi hain to sirf API data set kar rahe hain
                    setSpecialties(JSONResponse);
                }
            }

            setApiDataLoaded(true);
        } catch (error) {
            console.log("CATEGORY DATA ERROR:", error);
            setApiDataLoaded(true);
        }
    }


    const handleSpecialtySelect = (specialtyId: string) => {
        setSpecialties(prevSpecialties => {
           
            const updatedSpecialties = prevSpecialties.map(specialty =>
                specialty.id === specialtyId
                    ? { ...specialty, isSelected: !specialty.isSelected }
                    : specialty
            );

            const sortedSpecialties = [
                ...updatedSpecialties.filter(s => s.isSelected),
                ...updatedSpecialties.filter(s => !s.isSelected),
            ];

            return sortedSpecialties;
        });
    };


    const currentSelectedSpecialties = specialties.filter(spec => spec.isSelected);

    const handleProceed = () => {
        if (currentSelectedSpecialties.length === 0) {
            showSuccessToast('Please select at least one specialty', 'error');
            return;
        }


        navigation.navigate('SelectSpecialty', {
            currentSelectedSpecialties: specialties, 
        });
    };

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
            <Header title='Select Specialty' navigation={navigation} Is_Tab={false} />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>All Specialties :</Text>
                    <FlatList
                        data={specialties}
                        renderItem={renderSpecialtyItem}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        extraData={specialties}
                    />
                </View>

                {currentSelectedSpecialties.length > 0 && (
                    <GradientButton
                        onPress={handleProceed}
                        text={`Done (${currentSelectedSpecialties.length})`}
                    />
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        backgroundColor: Colors.primaryColor,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
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
        fontWeight: '600',
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
    notSureSection: {
        backgroundColor: '#FFF3CD',
        borderRadius: 16,
        padding: 20,
        marginVertical: 20,
        position: 'relative',
        overflow: 'hidden',
    },
    notSureTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#856404',
        marginBottom: 8,
    },
    notSureSubtitle: {
        fontSize: 14,
        color: '#856404',
        marginBottom: 15,
        opacity: 0.8,
    },
    consultButton: {
        backgroundColor: '#007BFF',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignSelf: 'flex-start',
    },
    consultButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    doctorImageContainer: {
        position: 'absolute',
        right: 10,
        top: 10,
        bottom: 10,
        width: 80,
        justifyContent: 'center',
    },
    doctorImage: {
        width: 80,
        height: 80,
    },
    treatmentGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    treatmentGridItem: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },

    treatmentGridItemSelected: {
        borderColor: Colors.primaryColor,
        backgroundColor: '#F8FFF8',
    },
    treatmentItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    treatmentItemSelected: {
        borderColor: Colors.primaryColor,
        backgroundColor: '#F8FFF8',
    },
    treatmentText: {
        fontSize: 14,
        color: '#333333',
        flex: 1,
    },
    treatmentTextSelected: {
        color: Colors.primaryColor,
        fontWeight: '500',
    },
    treatmentGridText: {
        fontSize: 14,
        color: '#333333',
        flex: 1,
    },
    treatmentGridTextSelected: {
        color: Colors.primaryColor,
        fontWeight: '500',
    },
    footer: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    proceedButton: {
        backgroundColor: Colors.primaryColor,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    proceedButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AllSpecialty;