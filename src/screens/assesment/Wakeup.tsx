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
import DynamicTimePicker from './DynamicTimePicker';
import { Ionicons } from '../../common/Vector';
import { Colors } from '../../common/Colors';
import { Fonts } from '../../common/Fonts';

/* ================= TYPES ================= */

type StepType = 'time' | 'yesno' | 'multi' | 'done';

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

const WakeUp: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const steps: StepConfig[] = [
    {
      type: 'time',
      question: 'At what time do you wake up?',
    },
    {
      type: 'yesno',
      question: 'Is your night time sleep before or after 11 PM?',
      options: ['Before', 'After'],
    },
    {
      type: 'multi',
      question: 'How do you feel after waking up?',
      options: ['Refreshed', 'Tired', 'Heavy-headed'],
    },
    {
      type: 'done',
      question: '',
    },
  ];

  const current = steps[step];
  const progress = step / (steps.length - 1);

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  /* ================= DONE ================= */

  if (current.type === 'done') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.doneContainer}>
          <Image
            source={require('../../assets/images/flower-poppy.png')}
            style={styles.doneImage}
          />
          <Text style={styles.doneText}>Vihaar Done!</Text>
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

            {/* TIME */}
            {current.type === 'time' && (
              <DynamicTimePicker
                onTimeChange={(h, m, s) =>
                  setAnswers({ ...answers, wakeup: `${h}:${m}:${s}` })
                }
              />
            )}

            {/* YES / NO / MULTI */}
            {(current.type === 'yesno' || current.type === 'multi') && (
              <YesNoScreen
                options={current.options!}
                selected={answers[current.question] ?? null}
                onSelect={(value) =>
                  setAnswers({ ...answers, [current.question]: value })
                }
              />
            )}
          </View>
        </View>
      </ScrollView>

      <ProceedButton
        onPress={handleNext}
        disabled={current.type !== 'time' && !answers[current.question]}
      />
    </SafeAreaView>
  );
};

export default WakeUp;

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
