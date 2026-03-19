import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    Image
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../common/Colors';
import { Fonts } from '../../common/Fonts';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as _ASSESS_SERVICE from '../../services/AssesmentService';
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
    options?: any[];
    conditional?: (answers: any) => boolean;
}

const PatientFAQ = (props: any) => {

    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<any>({});
    const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});
    const [dynamicSteps, setDynamicSteps] = useState<StepConfig[]>([]);

    useEffect(() => {
        getQuestionList();
    }, []);

    const getQuestionList = async () => {
        try {
            let response: any = await _ASSESS_SERVICE.GetQuestionOptions();

            const apiSteps: StepConfig[] = response.map((q: any) => ({
                type: 'single',
                question: q.text,
                key: q.id,
                conditional: (a: any) => a.knowPrakriti === 'No',
                options: q.choices
            }));

            setDynamicSteps(apiSteps);

        } catch (error) {
            console.log("CATEGORY DATA ERROR:", error);
        }
    };

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
            question: 'Select your Prakriti',
            key: 'prakritiType',
            conditional: (a: any) => a.knowPrakriti === 'Yes',
            options: [
                { id: 'Vata', text: 'Vata' },
                { id: 'Pitta', text: 'Pitta' },
                { id: 'Kapha', text: 'Kapha' },
                { id: 'Vata-Pitta', text: 'Vata-Pitta' },
                { id: 'Pitta-Vata', text: 'Pitta-Vata' },
                { id: 'Pitta-Kapha', text: 'Pitta-Kapha' },
                { id: 'Kapha-Pitta', text: 'Kapha-Pitta' },
                { id: 'Vata-Kapha', text: 'Vata-Kapha' },
                { id: 'Kapha-Vata', text: 'Kapha-Vata' },
                { id: 'Tri-Dosha', text: 'Trihoshaja (Vata Pitta Kapha)' },
            ]
        },

        ...dynamicSteps,

        { type: 'thankyou', question: '' }
    ];

    const visibleSteps = steps.filter(
        (s) => !s.conditional || s.conditional(answers)
    );

    const current = visibleSteps[step];
    const progress = step / (visibleSteps.length - 1);

    // ✅ helper (convert ID → lowercase single dosha)
    const getSingleDosha = (value: string) => {
        return value.toLowerCase().split(/[-\s]+/)[0];
    };

    const handleNext = async () => {

        // ✅ YES FLOW API
        if (current.key === 'prakritiType') {

            const selectedId = selectedChoices['prakritiType'];
            console.log("=========>  id",selectedId)
            

            if (selectedId) {
                const payload = {
                    customer: "8d5ffa87-7aed-4a36-a907-1aba89eccfbc",
                    dominant_dosha: getSingleDosha(selectedId)
                };
                console.log("========payload",payload)
                try {
                    await _ASSESS_SERVICE.AssesmentYesSubmit(payload);
                    console.log("YES API:", payload);
                } catch (e) {
                    console.log("YES API ERROR:", e);
                }
            }
        }

        // EXISTING NO FLOW
        if (
            current.key !== 'knowPrakriti' &&
            current.key !== 'prakritiType' &&
            current.type === 'single'
        ) {
            const choice_id = selectedChoices[current.key!];

            if (choice_id) {
                const payload = {
                    customer_id: "8d5ffa87-7aed-4a36-a907-1aba89eccfbc",
                    answers: [
                        {
                            question_id: current.key,
                            choice_id: choice_id
                        }
                    ]
                };

                try {
                    await _ASSESS_SERVICE.AssesmentNoSubmit(payload);
                } catch (error) {
                    console.log("POST ERROR:", error);
                }
            }
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

    const handleSkip = () => setStep(step + 1);

    const handleSkipHome = () => {
        props.navigation.replace('HomeStack', { screen: 'Home' });
    };

    const isDisabled =
        step === 0
            ? false
            : current.type === 'single'
                ? !answers[current.key!]
                : false;

    return (

        <SafeAreaView style={styles.container} edges={['top']}>

            <StatusBar barStyle="dark-content" />

            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                scrollEnabled={current.key === 'knowPrakriti'}
            >
                <View style={styles.content}>

                    {/* HEADER */}
                    {current.type !== 'intro' && (
                        <View style={styles.header}>
                            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                                <Image source={IMAGES.BackButton} style={styles.backIcon} />
                            </TouchableOpacity>

                            <Text style={styles.headerTitle}>Onboarding</Text>

                            {current.key !== 'knowPrakriti' && step > 0 && (
                                <TouchableOpacity style={styles.skipHeaderBtn} onPress={handleSkip}>
                                    <Text style={styles.skipHeaderText}>Skip</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {/* PROGRESS */}
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

                    {/* INTRO */}
                    {step === 0 && (
                        <View style={styles.introContainer}>
                            <Image source={IMAGES.QnAMain} style={styles.qnaImage} />
                            <Text style={styles.title}>
                                Your Health, <Text style={styles.green}>Simplified</Text>
                            </Text>
                            <Text style={styles.subtitle}>
                                Discover top-rated doctors and
                                authentic medicines delivered right
                                to your doorstep
                            </Text>
                        </View>
                    )}

                    {/* KNOW PRAKRITI */}
                    {current.key === 'knowPrakriti' && (
                        <>
                            <Text style={styles.questionText}>{current.question}</Text>

                            <Text style={styles.prakritiDesc}>
                                Prakriti is your unique, lifelong Ayurvedic blueprint—the birth-given balance of Vata, Pitta, and Kapha that defines your nature.
                            </Text>

                            <View style={styles.prakritiRow}>
                                {['No', 'Yes'].map((item) => {
                                    const active = answers.knowPrakriti === item;

                                    return (
                                        <TouchableOpacity
                                            key={item}
                                            style={[styles.prakritiBtn, active && styles.prakritiBtnActive]}
                                            onPress={() => setAnswers({ ...answers, knowPrakriti: item })}
                                        >
                                            <Text style={[styles.prakritiText, active && styles.prakritiTextActive]}>
                                                {item}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            <Image source={IMAGES.PlusBag} style={styles.prakritiImage} />
                        </>
                    )}

                    {/* OPTIONS */}
                    {current.type === 'single' && current.key !== 'knowPrakriti' && (
                        <>
                            <Text style={styles.questionText}>{current.question}</Text>

                            <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
                                {(current.options as any[])?.map((item: any, index: number) => {

                                    const text = item.text || item;
                                    const active = answers[current.key!] === text;

                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            style={[styles.card, active && styles.active]}
                                            onPress={() => {
                                                setAnswers({ ...answers, [current.key!]: text });

                                                if (item.id) {
                                                    setSelectedChoices((prev) => ({
                                                        ...prev,
                                                        [current.key!]: item.id
                                                    }));
                                                }
                                            }}
                                        >
                                            <Text style={[styles.text, active && styles.activeText]}>
                                                {text}
                                            </Text>

                                            {active && (
                                                <View style={styles.iconContainer}>
                                                    <View style={styles.tickCircle}>
                                                        <Icon name="checkmark" size={13} color={Colors.questionGreen} />
                                                    </View>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </>
                    )}

                    {/* THANK YOU */}
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

            {/* FOOTER */}
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

                    {current.key === 'knowPrakriti' && (
                        <TouchableOpacity style={styles.bottomSkipBtn} onPress={handleSkipHome}>
                            <Text style={styles.bottomSkipText}>Skip</Text>
                        </TouchableOpacity>
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

    thankYouTitle: { fontSize: 26, fontFamily: Fonts.PoppinsSemiBold },

    card: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 14,
        paddingVertical: 16,
        paddingHorizontal: 18,
        paddingRight: 48,
        marginBottom: 12,
        backgroundColor: '#fff',
        minHeight: 60
    },

    active: {
        backgroundColor: Colors.questionGreen,
        borderColor: Colors.questionGreen
    },

    text: {
        fontSize: 15,
        color: '#111827',
        lineHeight: 20
    },

    activeText: {
        color: '#fff'
    },

    iconContainer: {
        position: 'absolute',
        right: 16,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },

    tickCircle: {
        width: 20,
        height: 20,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center'
    }

});