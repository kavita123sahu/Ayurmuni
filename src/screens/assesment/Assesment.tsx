import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Dimensions,
    StatusBar,
} from 'react-native';
import { Fonts } from '../../common/Fonts';
import { Ionicons } from '../../common/Vector';

const { width, height } = Dimensions.get('window');

interface AssessmentItem {
    id: number;
    title: string;
    subtitle: string;
    estimatedTime: string;
    icon: string;
}

const Assesment = (props: any) => {
    const [currentScreen, setCurrentScreen] = useState<'intro' | 'questions'>('intro');

    const assessmentItems: AssessmentItem[] = [
        {
            id: 1,
            title: 'Aahar',
            subtitle: 'Your food and eating habits',
            estimatedTime: '8-12 min',
            icon: '🍽️'
        },
        {
            id: 2,
            title: 'Vihar',
            subtitle: 'Your lifestyle and daily routine habits',
            estimatedTime: '8-12 min',
            icon: '🚶'
        },
        {
            id: 3,
            title: 'Chikitsa',
            subtitle: 'Your medical and treatment history',
            estimatedTime: '8-12 min',
            icon: '💊'
        }
    ];

    const IntroScreen = () => (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#6B8E23" />

            <View style={styles.headerContainer}>

                {/* <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity> */}

                <TouchableOpacity onPress={() => ("")} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Health assesment</Text>

                <View style={styles.headerContent}>
                    {/* <View style={styles.iconContainer}>
                        <Text style={styles.iconText}>❓</Text>
                    </View> */}

                    <Text style={styles.beforeYouBegin}>Before you begin</Text>

                    <Text style={styles.description}>
                        Ayurveda treats you, not just your symptoms.
                    </Text>

                    <Text style={styles.subDescription}>
                        This questionnaire helps us to assess
                    </Text>

                    <View style={styles.bulletPoints}>
                        <View style={styles.bulletItem}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.bulletText}>
                                understand your body type and digestion
                            </Text>
                        </View>

                        <View style={styles.bulletItem}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.bulletText}>
                                recommend personalised treatment, not generic advice
                            </Text>
                        </View>

                        <View style={styles.bulletItem}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.bulletText}>
                                avoid medicines or routines that may not suit you
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Curved bottom */}
                {/* <View style={styles.curvedBottom} /> */}
            </View>

            <ScrollView
                style={styles.cardsContainer}
                showsVerticalScrollIndicator={false}
            >
                {assessmentItems.map((item, index) => (
                    <View key={item.id} style={styles.assessmentCard}>
                        <View style={styles.cardHeader}>
                            <View style={styles.numberBadge}>
                                <Text style={styles.numberText}>{item.id}</Text>
                            </View>

                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                            </View>
                            <View>
                                <Text style={styles.estimatedLabel}>Estimated time</Text>

                                <View style={styles.timeRow}>
                                    <Text style={styles.timeIcon}>⏱️</Text>
                                    <Text style={styles.timeText}>{item.estimatedTime}</Text>
                                </View>
                            </View>

                        </View>

                        {/* <View style={styles.timeContainer}> */}



                        {/* </View> */}

                        {index < assessmentItems.length - 1 && (
                            <View style={styles.dashedLine} />
                        )}
                    </View>
                ))}
            </ScrollView>

            {/* Bottom Buttons */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => props.navigation.navigate('HealthAssessment')}
                >
                    <Text style={styles.startButtonText}>Start</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.skipButton} onPress={() => props.navigation.navigate('HomeStack', { screen: 'Onboarding' })}>
                    <Text style={styles.skipButtonText}>Skip for now</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );

    const QuestionScreen = () => (
        <SafeAreaView style={styles.questionContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.questionHeader}>
                <TouchableOpacity
                    style={styles.questionBackButton}
                    onPress={() => props.navigation.goBack()}
                >
                    <Text style={styles.questionBackText}>←</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.questionContent}>
                <Text style={styles.questionText}>
                    At what time do you eat breakfast?
                </Text>

                <View style={styles.timePickerContainer}>
                    <View style={styles.timeOption}>
                        <Text style={styles.timeValue}>5 H</Text>
                    </View>
                    <View style={styles.timeOption}>
                        <Text style={styles.timeValue}>13 M</Text>
                    </View>
                    <View style={styles.timeOption}>
                        <Text style={styles.timeValue}>26 S</Text>
                    </View>
                </View>
            </View>

            <View style={styles.questionBottomContainer}>
                <TouchableOpacity style={styles.proceedButton}>
                    <Text style={styles.proceedButtonText}>Proceed</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );

    return <IntroScreen />
    //  currentScreen === 'intro' ?

    //  : <QuestionScreen />;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },


    headerContainer: {
        backgroundColor: '#6B8E23',
        // paddingTop: 10,
        position: 'relative',
        zIndex: 1,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },


    backButton: {
        paddingLeft: 20,
        marginTop: 30,
        justifyContent: 'center',
        paddingBottom: 10,
        textAlign: 'center',
        // marginTop: -35,
    },

    backButtonText: {
        color: '#FFFFFF',
        fontSize: 28,
        fontFamily: Fonts.PoppinsRegular,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontFamily: Fonts.PoppinsSemiBold,
        textAlign: 'center',
        marginTop: -35,
    },
    headerContent: {
        paddingHorizontal: 30,
        paddingTop: 30,
        paddingBottom: 30,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    iconText: {
        fontSize: 24,
    },
    beforeYouBegin: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: Fonts.PoppinsSemiBold,
        marginBottom: 12,
    },
    description: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: Fonts.PoppinsRegular,
        marginBottom: 8,
    },
    subDescription: {
        color: '#FFFFFF',
        fontSize: 13,
        fontFamily: Fonts.PoppinsRegular,
        marginBottom: 15,
    },
    bulletPoints: {
        marginTop: 5,
    },
    bulletItem: {
        flexDirection: 'row',
        marginBottom: 8,
        paddingRight: 10,
    },
    bullet: {
        color: '#FFFFFF',
        fontSize: 16,
        marginRight: 8,
        fontFamily: Fonts.PoppinsMedium,
    },
    bulletText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontFamily: Fonts.PoppinsRegular,
        flex: 1,
        lineHeight: 18,
    },
    curvedBottom: {
        width: width,
        height: 40,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -20,
    },

    // Cards Styles
    cardsContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        marginTop: 20,

    },
    assessmentCard: {
        // backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 18,
        marginBottom: 20,
        // borderWidth: 1,
        // borderColor: '#E5E7EB',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.05,
        // shadowRadius: 8,
        // elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    numberBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#6B8E23',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    numberText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: Fonts.PoppinsSemiBold,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontFamily: Fonts.PoppinsSemiBold,
        color: '#1F2937',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 13,
        fontFamily: Fonts.PoppinsRegular,
        color: '#6B7280',
        lineHeight: 18,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    estimatedLabel: {
        fontSize: 12,
        fontFamily: Fonts.PoppinsRegular,
        color: '#9CA3AF',
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeIcon: {
        fontSize: 14,
        marginRight: 4,
    },
    timeText: {
        fontSize: 12,
        fontFamily: Fonts.PoppinsMedium,
        color: '#1F2937',
    },
    dashedLine: {
        position: 'absolute',
        left: 35,
        top: 70,
        width: 2,
        height: 50,
        borderLeftWidth: 2,
        borderLeftColor: '#D1D5DB',
        borderStyle: 'dashed',
    },

    // Bottom Buttons
    bottomContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
    },
    startButton: {
        backgroundColor: '#6B8E23',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    startButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: Fonts.PoppinsSemiBold,
    },
    skipButton: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    skipButtonText: {
        color: '#6B8E23',
        fontSize: 14,
        fontFamily: Fonts.PoppinsMedium,
    },

    // Question Screen Styles
    questionContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    questionHeader: {
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    questionBackButton: {
        width: 40,
        height: 40,
    },
    questionBackText: {
        fontSize: 24,
        color: '#1F2937',
        fontFamily: Fonts.PoppinsRegular,
    },
    questionContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    questionText: {
        fontSize: 22,
        fontFamily: Fonts.PoppinsSemiBold,
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 60,
    },
    timePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    timeOption: {
        width: 90,
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    timeValue: {
        fontSize: 16,
        fontFamily: Fonts.PoppinsMedium,
        color: '#6B7280',
    },
    questionBottomContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    proceedButton: {
        backgroundColor: '#6B8E23',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    proceedButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: Fonts.PoppinsSemiBold,
    },
});

export default Assesment;