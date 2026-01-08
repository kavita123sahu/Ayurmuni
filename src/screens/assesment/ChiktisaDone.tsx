import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
  Platform,
} from 'react-native';

import YesNoScreen from '../../component/YesNoScreen';
import MultiSelectOptions from '../../component/MultiSelectOptions';
import { Ionicons } from '../../common/Vector';
import { Colors } from '../../common/Colors';
import { Fonts } from '../../common/Fonts';

/* ================= TYPES ================= */

type StepType = 'multi' | 'single' | 'done';

interface StepConfig {
  type: StepType;
  question: string;
  options?: string[];
}

/* ================= COMMON COMPONENTS ================= */

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

const Chikitsa: React.FC = () => {
  const [step, setStep] = useState(0);

  // 🔥 API ready answer structure
  const [answers, setAnswers] = useState<{
    problems: string[];
    duration?: string;
    frequency?: string;
  }>({
    problems: [],
  });

  const steps: StepConfig[] = [
    {
      type: 'multi',
      question: 'What problems are you currently facing?',
      options: [
        'Mind, sleep and nervous balance',
        'Heart, blood and circulation',
        'Breathing, chest & immunity',
        'Digestion, appetite and gut health',
        'Kidneys & urinary health',
        'Bones, joint & muscles',
        'Hormones & reproductive system',
        'Skin, hair & external health',
        'Eyes, ears, nose and throat',
      ],
    },
    {
      type: 'single',
      question: 'Since when did these problems start?',
      options: [
        '1 month',
        '3 months',
        'More than 3 months',
        '6 months',
        'Within a year',
        'More than a year',
      ],
    },
    {
      type: 'single',
      question: 'What is the frequency of these problems?',
      options: ['Continuous', 'Occasional', 'Worsening with time'],
    },
    {
      type: 'done',
      question: '',
    },
  ];

  const current = steps[step];
  const progress = step / (steps.length - 1);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  /* ================= DONE ================= */

  if (current.type === 'done') {
    // 🔥 Here you can call API later
    // submitChikitsaAnswers(answers)

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.doneContainer}>
          <Image
            source={require('../../assets/images/flower-poppy.png')}
            style={styles.doneImage}
          />
          <Text style={styles.doneText}>Chikitsa Done!</Text>
        </View>
      </SafeAreaView>
    );
  }

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* BACK */}
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          {/* PROGRESS */}
          <ProgressBar progress={progress} />

          {/* QUESTION */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{current.question}</Text>

            {/* MULTI SELECT */}
            {current.type === 'multi' && (
              <MultiSelectOptions
                options={current.options!}
                selected={answers.problems}
                onChange={(values) =>
                  setAnswers({ ...answers, problems: values })
                }
              />
            )}

            {/* SINGLE SELECT */}
            {current.type === 'single' && (
              <YesNoScreen
                options={current.options!}
                selected={
                  current.question.includes('Since')
                    ? answers.duration ?? null
                    : answers.frequency ?? null
                }
                onSelect={(value) => {
                  if (current.question.includes('Since')) {
                    setAnswers({ ...answers, duration: value });
                  } else {
                    setAnswers({ ...answers, frequency: value });
                  }
                }}
              />
            )}
          </View>
        </View>
      </ScrollView>

      <ProceedButton
        onPress={handleNext}
        disabled={
          (current.type === 'multi' && answers.problems.length === 0) ||
          (current.type === 'single' &&
            !answers.duration &&
            !answers.frequency)
        }
      />
    </SafeAreaView>
  );
};

export default Chikitsa;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  scrollContent: {
    flexGrow: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
  },

  backButton: {
    marginTop: 16,
    marginBottom: 16,
  },

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

  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  questionText: {
    fontSize: 20,
    fontFamily: Fonts.PoppinsMedium,
    textAlign: 'center',
    marginBottom: 32,
  },

  footer: {
    padding: 24,
  },

  proceedButton: {
    backgroundColor: Colors.primaryColor,
    padding: 16,
    borderRadius: 28,
  },

  proceedButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },

  proceedButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: Fonts.PoppinsMedium,
  },

  doneContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  doneImage: {
    width: 300,
    height: 300,
    marginBottom: 24,
  },

  doneText: {
    fontSize: 30,
    fontFamily: Fonts.PoppinsSemiBold,
  },
});
