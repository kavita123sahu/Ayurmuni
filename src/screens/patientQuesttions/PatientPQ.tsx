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
} from 'react-native';

import YesNoScreen from '../../component/YesNoScreen';
import { Ionicons } from '../../common/Vector';
import { Colors } from '../../common/Colors';
import { Fonts } from '../../common/Fonts';

/* ================= TYPES ================= */

type StepType = 'input' | 'single' | 'done';

interface StepConfig {
  type: StepType;
  question: string;
  key?: keyof Answers;
  options?: string[];
  conditional?: (answers: Answers) => boolean;
}

interface Answers {
  name: string;
  phone: string;
  email: string;
  age: string;
  gender?: string;
  knowPrakriti?: string;
  prakriti?: string;
  bodyType?: string;
  appetite?: string;
  sleep?: string;
  temperament?: string;
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

const PatientPersonalization: React.FC = () => {
  const [step, setStep] = useState(0);

  const [answers, setAnswers] = useState<Answers>({
    name: '',
    phone: '',
    email: '',
    age: '',
  });

  const steps: StepConfig[] = [
    { type: 'input', question: 'What is your name?', key: 'name' },
    { type: 'input', question: 'Contact number', key: 'phone' },
    { type: 'input', question: 'Email (Optional)', key: 'email' },
    { type: 'input', question: 'Age / DOB', key: 'age' },

    {
      type: 'single',
      question: 'Gender',
      key: 'gender',
      options: ['Male', 'Female', 'Other'],
    },

    {
      type: 'single',
      question: 'Do you know your Prakriti?',
      key: 'knowPrakriti',
      options: ['Yes', 'No'],
    },

    {
      type: 'single',
      question: 'Select your Prakriti',
      key: 'prakriti',
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
      type: 'single',
      question: 'How will you describe your body physique?',
      key: 'bodyType',
      options: [
        'Lean and thin with bony prominences',
        'Medium built',
        'Heavy built, muscular or obese',
      ],
    },

    {
      type: 'single',
      question: 'How will you describe your appetite?',
      key: 'appetite',
      options: [
        'Irregular appetite',
        'Strong appetite',
        'Low appetite',
      ],
    },

    {
      type: 'single',
      question: 'How would you describe your sleep?',
      key: 'sleep',
      options: [
        'Light and disturbed sleep',
        'Sound sleep',
        'Deep and prolonged sleep',
      ],
    },

    {
      type: 'single',
      question: 'How will you describe your temperament?',
      key: 'temperament',
      options: [
        'Anxious and restless',
        'Aggressive and bold',
        'Calm and composed',
      ],
    },

    { type: 'done', question: '' },
  ];

  const visibleSteps = steps.filter(
    (s) => !s.conditional || s.conditional(answers)
  );

  const current = visibleSteps[step];
  const progress = step / (visibleSteps.length - 1);

  const handleNext = () => {
    if (step < visibleSteps.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  /* ================= VALIDATION ================= */

  const getInputError = (): string | null => {
    if (!current.key || current.type !== 'input') return null;

    const value = answers[current.key] ?? '';

    if (current.key === 'name' && value.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }

    if (current.key === 'phone' && !isValidPhone(value)) {
      return 'Enter valid 10-digit mobile number';
    }

    if (
      current.key === 'email' &&
      value !== '' &&
      !isValidEmail(value)
    ) {
      return 'Enter valid email address';
    }

    if (current.key === 'age' && !isValidAgeOrDob(value)) {
      return 'Enter Age (1–120) or DOB (YYYY-MM-DD)';
    }

    if (value.trim() === '' && current.key !== 'email') {
      return 'This field is required';
    }

    return null;
  };

  const isDisabled =
    current.type === 'single'
      ? !answers[current.key as keyof Answers]
      : Boolean(getInputError());

  /* ================= DONE ================= */

  if (current.type === 'done') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.doneContainer}>
          <Text style={styles.doneText}>Personalization Completed!</Text>
        </View>
      </SafeAreaView>
    );
  }

  /* ================= UI ================= */

  const error = getInputError();

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
            <Text style={styles.questionText}>{current.question}</Text>

            {current.type === 'input' && current.key && (
              <>
                <TextInput
                  style={[
                    styles.input,
                    error && styles.inputError,
                  ]}
                  value={answers[current.key] ?? ''}
                  onChangeText={(text) =>
                    setAnswers({ ...answers, [current.key!]: text })
                  }
                  placeholder="Type here"
                />

                {error && (
                  <Text style={styles.errorText}>{error}</Text>
                )}
              </>
            )}

            {current.type === 'single' && current.key && (
              <YesNoScreen
                options={current.options!}
                selected={answers[current.key] ?? null}
                onSelect={(value) =>
                  setAnswers({ ...answers, [current.key!]: value })
                }
              />
            )}
          </View>
        </View>
      </ScrollView>

      <ProceedButton onPress={handleNext} disabled={isDisabled} />
    </SafeAreaView>
  );
};

export default PatientPersonalization;

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

  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  questionText: {
    fontSize: 20,
    fontFamily: Fonts.PoppinsMedium,
    textAlign: 'center',
    marginBottom: 24,
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
});
