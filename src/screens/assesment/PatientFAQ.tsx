import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    Image
} from 'react-native';

import { Colors } from '../../common/Colors';
import { Fonts } from '../../common/Fonts';
import { SafeAreaView } from 'react-native-safe-area-context';

import SingleSelectQuestion from '../../component/SingleSelectQuestion';

import LottieView from 'lottie-react-native';

const IMAGES = {
    QnAMain: require('../../assets/images/QnAMain.png'),
    NextArrow: require('../../assets/images/NextAroow.png'),
    BackButton: require('../../assets/images/BackButoon.png'),
    PlusBag: require('../../assets/images/PlusBag.png')
};

type StepType = 'intro' | 'single' | 'thankyou';

interface StepConfig {
    type: StepType;
    question: string;
    key?: string;
    options?: string[];
    conditional?: (answers: any) => boolean;
}

const steps: StepConfig[] = [

    { type: 'intro', question: '' },

    {
        type: 'single',
        question: 'Do you know your Prakriti?',
        key: 'knowPrakriti',
        options: ['Yes', 'No']
    },

    {
        type: 'single',
        question: 'How will you describe your body physique?',
        key: 'bodyType',
        conditional: (a) => a.knowPrakriti === 'No',
        options: [
            'Lean & thin with bony prominences',
            'Medium Built',
            'Heavy Built',
            'Muscular or obese with broad stature'
        ]
    },

    {
        type: 'single',
        question: 'How will you describe your scalp hair?',
        key: 'scalpHair',
        conditional: (a) => a.knowPrakriti === 'No',
        options: [
            'Dry', 'Frizzy', 'Scanty', 'Soft', 'Less dense', 'Thick', 'Lustrous', 'Long', 'Prone to greying and hairfall'
        ]
    },

    {
        type: 'single',
        question: 'How will you describe your body hair?',
        key: 'bodyHair',
        conditional: (a) => a.knowPrakriti === 'No',
        options: [
            'Scanty', 'Almost absent', 'Scarcely present', 'Brown', 'Soft', 'Dense', 'Thick often dark'
        ]
    },

    {
        type: 'single',
        question: 'How will you describe your forehead?',
        key: 'forehead',
        conditional: (a) => a.knowPrakriti === 'No',
        options: [
            'Low hairline, short forehead',
            'Medium forehead',
            'Broad forehead'
        ]
    },

    {
        type: 'single',
        question: 'How will you describe your skin texture?',
        key: 'skin',
        conditional: (a) => a.knowPrakriti === 'No',
        options: [
            'Dry & cracked skin',
            'Soft',
            'Combination skin with reddish tinge',
            'Smooth & acne prone',
            'Oily',
            'Glossy'
        ]
    },

    {
        type: 'single',
        question: 'How would you describe your appetite and dietary habits?',
        key: 'appetite',
        conditional: (a) => a.knowPrakriti === 'No',
        options: [
            'Irregular: No fixed pattern of food intake',
            'Tend to eat meals at regular intervals',
            'Low appetite, feel full quickly'
        ]
    },

    {
        type: 'single',
        question: 'How would you describe your bowel movements?',
        key: 'bowel',
        conditional: (a) => a.knowPrakriti === 'No',
        options: [
            'Usually hard stools cccccccccccccccccccccc sadfasf ds foubsa asofboas coausbfoae eoausb',
            'Soft stools twice a day',
            'Well formed stools'
        ]
    },

    {
        type: 'thankyou',
        question: ''
    }

];

const PatientFAQ = (props: any) => {

    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<any>({});

    const visibleSteps = steps.filter(
        (s) => !s.conditional || s.conditional(answers)
    );

    const current = visibleSteps[step];
    const progress = step / (visibleSteps.length - 1);

    const handleNext = () => {

        if (current.key === 'knowPrakriti' && answers.knowPrakriti === 'Yes') {
            setStep(visibleSteps.length - 1);
            return;
        }

        if (current.type === 'thankyou') {
            props.navigation.replace('HomeStack', { screen: 'Home' });
            return;
        }
        setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleSkip = () => {
        setStep(step + 1);
    };

    const handleSkipHome = () => {
        props.navigation.replace('HomeStack', { screen: 'Home' });
    };

    const isDisabled =
        step === 0
            ? false
            : current.type === 'single'
                ? !answers[current.key!]
                : false

    return (

        <SafeAreaView style={styles.container} edges={['top']}>

            <StatusBar barStyle="dark-content" />

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                <View style={styles.content}>

                    {current.type !== 'intro' && (

                        <View style={styles.header}>

                            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                                <Image source={IMAGES.BackButton} style={styles.backIcon} />
                            </TouchableOpacity>

                            <Text style={styles.headerTitle}>Onboarding</Text>

                            {/* Skip icon only on OTHER questions */}
                            {current.key !== 'knowPrakriti' && step > 0 && (
                                <TouchableOpacity style={styles.skipHeaderBtn} onPress={handleSkip}>
                                    <Text style={styles.skipHeaderText}>Skip</Text>
                                </TouchableOpacity>
                            )}

                        </View>
                    )}

                    {step > 0 && (

                        <>
                            <Text style={styles.stepText}>
                                Step {step} of {visibleSteps.length - 1}
                            </Text>

                            <View style={styles.progressContainer}>
                                <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
                            </View>
                        </>

                    )}

                    {step === 0 && (

                        <View style={styles.introContainer}>

                            <Image
                                source={IMAGES.QnAMain}
                                style={styles.qnaImage}
                            />

                            <Text style={styles.title}>
                                Your Health, <Text style={styles.green}>Simplified</Text>
                            </Text>

                            <Text style={styles.subtitle}>
                                Discover top-rated doctors and authentic medicines delivered right to your doorstep.
                            </Text>

                        </View>

                    )}

                    {current.key === 'knowPrakriti' && (

                        <>

                            <Text style={styles.questionText}>{current.question}</Text>

                            <Text style={styles.prakritiDesc}>
                                Prakriti is your unique, lifelong Ayurvedic blueprint—the birth-given balance of Vata, Pitta, and Kapha that defines your nature.
                            </Text>

                            <View style={styles.prakritiRow}>

                                <TouchableOpacity
                                    style={[
                                        styles.prakritiBtn,
                                        answers.knowPrakriti === 'No' && styles.prakritiBtnActive
                                    ]}
                                    onPress={() => setAnswers({ ...answers, knowPrakriti: 'No' })}
                                >
                                    <Text style={[
                                        styles.prakritiText,
                                        answers.knowPrakriti === 'No' && styles.prakritiTextActive
                                    ]}>
                                        No
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.prakritiBtn,
                                        answers.knowPrakriti === 'Yes' && styles.prakritiBtnActive
                                    ]}
                                    onPress={() => setAnswers({ ...answers, knowPrakriti: 'Yes' })}
                                >
                                    <Text style={[
                                        styles.prakritiText,
                                        answers.knowPrakriti === 'Yes' && styles.prakritiTextActive
                                    ]}>
                                        Yes
                                    </Text>
                                </TouchableOpacity>

                            </View>

                            <Image source={IMAGES.PlusBag} style={styles.prakritiImage} />

                        </>

                    )}

                    {current.type === 'single' && current.key !== 'knowPrakriti' && (

                        <>

                            <Text style={styles.questionText}>{current.question}</Text>

                            <SingleSelectQuestion
                                options={current.options}
                                selected={answers[current.key!]}
                                onSelect={(value: any) => setAnswers({ ...answers, [current.key!]: value })}
                            />

                        </>

                    )}

                    {current.type === 'thankyou' && (

                        <View style={styles.thankYouContainer}>

                            <LottieView
                                source={require('../../assets/animations/thankyou.json')}
                                autoPlay
                                loop
                                style={{ width: 280, height: 280 }}
                            />

                            <Text style={styles.thankYouTitle}>Thank You 🙏</Text>

                        </View>

                    )}

                </View>

            </ScrollView>

            {current.type !== 'thankyou' && (

                <View style={styles.footer}>

                    <TouchableOpacity
                        style={[styles.proceedButton, isDisabled && styles.proceedButtonDisabled]}
                        disabled={isDisabled}
                        onPress={handleNext}
                    >

                        <View style={styles.nextRow}>
                            <Text style={styles.proceedButtonText}>
                                {step === 0 ? 'Continue' : 'Next'}
                            </Text>

                            <Image source={IMAGES.NextArrow} style={styles.nextArrow} />
                        </View>

                    </TouchableOpacity>

                    {/* Bottom skip ONLY for Prakriti screen */}
                    {current.key === 'knowPrakriti' && (
                        <TouchableOpacity style={styles.bottomSkipBtn} onPress={handleSkipHome}>
                            <Text style={styles.bottomSkipText}>Skip</Text>
                        </TouchableOpacity>
                    )}

                    {step > 0 && (
                        <Text style={styles.secureText}>
                            Your data is encrypted and secure.
                        </Text>
                    )}

                </View>

            )}

        </SafeAreaView>

    );

};

export default PatientFAQ;

const styles = StyleSheet.create({

    container: { flex: 1, backgroundColor: '#fff' },

    content: { flex: 1, paddingHorizontal: 24 },

    introContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },

    qnaImage: { width: 400, height: 400, resizeMode: 'contain', marginBottom: 40 },

    title: { fontSize: 30, fontFamily: Fonts.PoppinsSemiBold, color: '#111827' },

    green: { color: Colors.questionGreen },

    subtitle: { fontSize: 19, color: '#6B7280', textAlign: 'center', marginTop: 10, paddingHorizontal: 30 },

    questionText: { fontSize: 30, fontFamily: Fonts.PoppinsSemiBold, marginVertical: 20 },

    header: { height: 70, justifyContent: 'center', alignItems: 'center' },

    backButton: { position: 'absolute', left: 0 },

    backIcon: { width: 60, height: 60, resizeMode: 'contain' },

    headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A1A' },

    skipHeaderBtn: { position: 'absolute', right: 0 },

    skipHeaderText: { color: Colors.questionGreen, fontSize: 16 },

    stepText: { marginTop: 10, color: '#6B7280', fontSize: 17 },

    progressContainer: {
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 50,
        marginVertical: 10,
        overflow: 'hidden'
    },

    progressBar: {
        height: '100%',
        backgroundColor: Colors.questionGreen,
        borderRadius: 50
    },

    footer: { padding: 24 },

    proceedButton: { backgroundColor: Colors.questionGreen, padding: 16, borderRadius: 16, marginBottom: 10 },

    proceedButtonDisabled: { backgroundColor: '#D1D5DB' },

    proceedButtonText: { color: '#fff', fontFamily: Fonts.PoppinsMedium },

    nextRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },

    nextArrow: { width: 18, height: 18, marginLeft: 5 },

    bottomSkipBtn: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        marginTop: 10
    },

    bottomSkipText: {
        color: Colors.questionGreen,
        fontFamily: Fonts.PoppinsMedium
    },

    secureText: {
        textAlign: 'center',
        color: '#94A3B8',
        marginTop: 10,
        fontSize: 14
    },

    prakritiDesc: { fontSize: 16, color: '#64748B', marginBottom: 20 },

    prakritiRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },

    prakritiBtn: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginHorizontal: 5
    },

    prakritiBtnActive: { backgroundColor: Colors.questionGreen },

    prakritiText: { color: '#111827' },

    prakritiTextActive: { color: '#fff' },

    prakritiImage: {
        width: 120,
        height: 120,
        alignSelf: 'center',
        opacity: 0.2,
        marginTop: 60
    },

    thankYouContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },

    thankYouTitle: { fontSize: 26, fontFamily: Fonts.PoppinsSemiBold }

});