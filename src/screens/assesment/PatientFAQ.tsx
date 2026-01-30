import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Platform,
    TextInput,
    Image,
    Dimensions,
} from 'react-native';

import YesNoScreen from '../../component/YesNoScreen';
import { Ionicons } from '../../common/Vector';
import { Colors } from '../../common/Colors';
import { Fonts } from '../../common/Fonts';
import LottieView from 'lottie-react-native';
import { QUESTION_IMAGES } from '../../common/Images';

/* ================= TYPES ================= */


type StepType = 'single' | 'thankyou';

interface StepConfig {
    type: StepType;
    question: string;
    key?: keyof Answers;
    image?: any;
    options?: string[];
    conditional?: (answers: Answers) => boolean;
}




interface Answers {
    knowPrakriti?: string;
    prakriti?: string;
    bodyType?: string;
    scalpHair?: string;
    bodyHair?: string;
    skin?: string;
    appetite?: string;
    bowel?: string;
    sweating?: string;
    sleep?: string;
    learning?: string;
    temperament?: string;
    personality?: string;
}
/* ================= VALIDATION HELPERS ================= */

const isOnlyNumber = (value: string) => /^[0-9]+$/.test(value);


const isValidPhone = (value: string) =>
    /^[6-9][0-9]{9}$/.test(value);


const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidAgeOrDob = (value: string) => {
    if (isOnlyNumber(value)) {
        const age = Number(value);
        return age > 0 && age <= 120;
    }
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
};

const THANK_YOU_STEP: StepConfig = {
    type: 'thankyou',
    question: '',
};
/* ================= COMMON ================= */


const ProgressBar = ({ progress }: { progress: number }) => (
    <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
    </View>
);

const ProceedButton = ({
    onPress,
    disabled,
}: {
    onPress: () => void;
    disabled?: boolean;
}) => (
    <View style={styles.footer}>
        <TouchableOpacity
            style={[styles.proceedButton, disabled && styles.proceedButtonDisabled]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.85}
        >
            <Text style={styles.proceedButtonText}>Proceed</Text>
        </TouchableOpacity>
    </View>
);

/* ================= MAIN ================= */

const PatientFAQ: React.FC = (props: any) => {

    console.log("PatientFAQProps ", props);

    const [step, setStep] = useState(0);
    const { width: screenWidth } = Dimensions.get('window');
    const [answers, setAnswers] = useState<Answers>({});

    const steps: StepConfig[] = [

        {
            type: 'single',
            question: 'Do you know your Prakriti?',
            key: 'knowPrakriti',
            image: QUESTION_IMAGES.knowPrakriti,
            options: ['Yes', 'No'],
        },

        /* YES FLOW */
        {
            type: 'single',
            question: 'Select your Prakriti',
            key: 'prakriti',
            image: QUESTION_IMAGES.prakriti,
            conditional: (a) => a.knowPrakriti === 'Yes',
            options: [
                'Vata',
                'Pitta',
                'Kapha',
                'Vata Pitta',
                'Pitta Kapha',
                'Vata Kapha',
                'Tridoshaja',
            ],
        },

        {
            ...THANK_YOU_STEP,
            conditional: (a) => a.knowPrakriti === 'Yes',
        },

        /* NO FLOW */
        {
            type: 'single',
            question: 'How will you describe your body physique?',
            key: 'bodyType',
            image: QUESTION_IMAGES.bodyType,
            conditional: (a) => a.knowPrakriti === 'No',
            options: ['Lean', 'Medium', 'Heavy'],
        },

        {
            type: 'single',
            question: 'How will you describe your scalp hair?',
            key: 'scalpHair',
            image: QUESTION_IMAGES.scalpHair,
            conditional: (a) => a.knowPrakriti === 'No',
            options: [
                'Dry, frizzy, scanty',
                'Soft, less dense, prone to greying',
                'Thick, lustrous, long',
            ],
        },

        {
            type: 'single',
            question: 'How will you describe your body hair?',
            key: 'bodyHair',
            image: QUESTION_IMAGES.bodyHair,
            conditional: (a) => a.knowPrakriti === 'No',
            options: [
                'Scanty, almost absent',
                'Scarcely present, brown, soft',
                'Dense, thick often dark',
            ],
        },

        {
            type: 'single',
            question: 'How will you describe your skin texture?',
            key: 'skin',
            image: QUESTION_IMAGES.skin,
            conditional: (a) => a.knowPrakriti === 'No',
            options: [
                'Dry and cracked skin',
                'Soft, combination skin',
                'Oily, glossy, acne prone',
            ],
        },

        {
            type: 'single',
            question: 'How will you describe your appetite?',
            key: 'appetite',
            image: QUESTION_IMAGES.appetite,
            conditional: (a) => a.knowPrakriti === 'No',
            options: ['Low', 'Strong', 'Irregular'],
        },
        {
            type: 'single',
            question: 'How would you describe your bowel movements?',
            key: 'bowel',
            image: QUESTION_IMAGES.bowel,
            conditional: (a) => a.knowPrakriti === 'No',
            options: [
                'Hard stools / constipation',
                'Loose stools / diarrhoea',
                'Well formed stools',
            ],
        },

        {
            type: 'single',
            question: 'How would you describe your sweating?',
            key: 'sweating',
            image: QUESTION_IMAGES.sweating,
            conditional: (a) => a.knowPrakriti === 'No',
            options: [
                'Irregular or seasonal',
                'Profuse sweating',
                'Less sweating',
            ],
        },

        {
            type: 'single',
            question: 'How would you describe your sleep?',
            key: 'sleep',
            image: QUESTION_IMAGES.sleep,
            conditional: (a) => a.knowPrakriti === 'No',
            options: ['Light', 'Sound', 'Heavy'],
        },

        {
            type: 'single',
            question: 'How would you describe your learning potential?',
            key: 'learning',
            image: QUESTION_IMAGES.learning,
            conditional: (a) => a.knowPrakriti === 'No',
            options: [
                'Quick learner, forget easily',
                'Sharp and intelligent',
                'Slow learner, strong memory',
            ],
        },

        {
            type: 'single',
            question: 'How will you describe your temperament?',
            key: 'temperament',
            image: QUESTION_IMAGES.temperament,
            conditional: (a) => a.knowPrakriti === 'No',
            options: [
                'Anxious and restless',
                'Aggressive and bold',
                'Calm and composed',
            ],
        },

        {
            type: 'single',
            question: 'How will you describe your personality?',
            key: 'personality',
            image: QUESTION_IMAGES.personality,
            options: [
                'Outgoing and talkative',
                'Ambivert',
                'Introvert',
            ],
            
        },

        THANK_YOU_STEP,

        // { type: 'done', question: '' },


    ];
    
    const visibleSteps = steps.filter(
        (s) => !s.conditional || s.conditional(answers)
    );

    const current = visibleSteps[step];

    const getProgress = () => {
        // YES flow → Thank you = full progress
        if (answers.knowPrakriti === 'Yes') {
            if (current.type === 'thankyou') return 1;
            return step / 2; // Q1 + Prakriti (2 steps)
        }

        // NO flow → normal progress
        return step / (visibleSteps.length - 1);
    };

    const progress = getProgress();
    // const progress = step / (visibleSteps.length - 1);


    const handleNext = () => {
        if (current.type === 'thankyou') {
            props.navigation.navigate('Onboarding'); // or Dashboard
            return;
        }

        if (step < visibleSteps.length - 1) setStep(step + 1);
    };



    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    /* ================= VALIDATION ================= */
    const isDisabled =
        current.type === 'single'
            ? !answers[current.key as keyof Answers]
            : false;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>

                    <ProgressBar progress={progress} />

                    <View style={styles.questionContainer}>
                        {current.image && (
                            <View style={styles.imageWrapper}>
                                <Image
                                    source={current.image}
                                    style={styles.questionImage}
                                    resizeMode="contain"
                                />
                            </View>
                        )}

                        <Text style={styles.questionText}>{current.question}</Text>

                        {current.type === 'single' && current.key && (
                            <YesNoScreen
                                options={current.options!}
                                selected={answers[current.key] ?? null}
                                onSelect={(value: any) =>
                                    setAnswers({ ...answers, [current.key!]: value })
                                }
                            />
                        )}

                        {current.type === 'thankyou' && (

                            <View style={styles.thankYouContainer}>
                                {/* <Image
                                    source={require('../assets/thankyou.png')}
                                    style={styles.thankYouImage}
                                /> */}

                                <LottieView
                                    source={require('../../assets/animations/thankyou.json')}
                                    autoPlay
                                    loop
                                    style={{ width: screenWidth <= 360 ? 200 : 400, height: screenWidth <= 360 ? 200 : 400 }}
                                />

                                <Text style={styles.thankYouTitle}>Thank You 🙏</Text>
                                <Text style={styles.thankYouText}>
                                    Your Prakriti has been saved successfully
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>

            <ProceedButton onPress={handleNext} disabled={isDisabled} />
        </SafeAreaView>

    );
};

export default PatientFAQ;

const { width } = Dimensions.get('window');
const isSmallDevice = width < 360;
/* ================= STYLES ================= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },

    scrollContent: { flexGrow: 1 },

    content: { flex: 1, paddingHorizontal: 24 },

    backButton: { marginVertical: 16 },

    progressContainer: {
        height: 6,
        backgroundColor: '#E5E5E5',
        borderRadius: 3,
    },

    progressBar: {
        height: '100%',
        backgroundColor: Colors.primaryColor,
        borderRadius: 3,
    },

    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        padding: 14,
        fontFamily: Fonts.PoppinsMedium,
    },

    inputError: {
        borderColor: 'red',
    },

    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 8,
        fontFamily: Fonts.PoppinsMedium,
    },

    footer: { padding: 24 },

    proceedButton: {
        backgroundColor: Colors.primaryColor,
        padding: 16,
        borderRadius: 28,
    },

    proceedButtonDisabled: {
        backgroundColor: '#D1D5DB',
    },

    proceedButtonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontFamily: Fonts.PoppinsMedium,
    },

    doneContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    doneText: {
        fontSize: 28,
        fontFamily: Fonts.PoppinsSemiBold,
    },
    thankYouContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },

    questionContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 16,
    },

    imageWrapper: {
        width: '100%',
        height: isSmallDevice ? 100 : 140, // 🔥 FIXED HEIGHT
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },

    questionImage: {
        width: '100%',
        height: '100%', // 🔒 FIXED SIZE
    },

    questionText: {
        fontSize: isSmallDevice ? 18 : 20,
        fontFamily: Fonts.PoppinsMedium,
        textAlign: 'center',
        marginBottom: 20,
    },


    thankYouImage: {
        width: 180,
        height: 180,
        resizeMode: 'contain',
        marginBottom: 24,
    },

    thankYouTitle: {
        fontSize: 26,
        fontFamily: Fonts.PoppinsSemiBold,
        color: Colors.primaryColor,
        marginBottom: 12,
        textAlign: 'center',
    },

    thankYouText: {
        fontSize: 15,
        fontFamily: Fonts.PoppinsMedium,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
    },

});
