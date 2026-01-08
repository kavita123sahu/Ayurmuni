import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import YesNoScreen from '../../component/YesNoScreen';
import { Ionicons } from '../../common/Vector';
import { Fonts } from '../../common/Fonts';
import { Colors } from '../../common/Colors';
import DynamicTimePicker from './DynamicTimePicker';
import { Image } from 'react-native';

/* ================= TYPES ================= */

interface ProgressBarProps {
  progress?: number;
}

interface ProceedButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

interface YesNoScreen1Props {
  question: string;
  progress: number;
  selected: string | null;
  onSelect: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

interface TimePickerScreenProps {
  question: string;
  progress: number;
  selectedTime: string | null;
  onSelect: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

interface ScreenConfig {
  type: 'timePicker' | 'yesNo' | 'done';
  question: string;
  progress: number;
  key: string;
}

interface Answers {
  [key: string]: string;
}

/* ================= COMMON ================= */

const ProgressBar: React.FC<ProgressBarProps> = ({ progress = 0 }) => (
  <View style={styles.progressContainer}>
    <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
  </View>
);

const ProceedButton: React.FC<ProceedButtonProps> = ({ onPress, disabled }) => (
  <View style={styles.footer}>
    <TouchableOpacity
      style={[styles.proceedButton, disabled && styles.proceedButtonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.proceedButtonText}>Proceed</Text>
    </TouchableOpacity>
  </View>
);

/* ================= YES / NO SCREEN ================= */

const YesNoScreen1: React.FC<YesNoScreen1Props> = ({
  question,
  progress,
  selected,
  onSelect,
  onNext,
  onBack,
}) => (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="dark-content" />
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <ProgressBar progress={progress} />

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{question}</Text>

          {/* ✅ FIXED */}
          <YesNoScreen
            selected={selected}
            onSelect={onSelect}
            options={['Yes', 'No']}
          />
        </View>
      </View>
    </ScrollView>

    <ProceedButton onPress={onNext} disabled={!selected} />
  </SafeAreaView>
);

/* ================= TIME PICKER ================= */

const TimePickerScreen: React.FC<TimePickerScreenProps> = ({
  question,
  progress,
  selectedTime,
  onSelect,
  onNext,
  onBack,
}) => {
  const parseTime = (time: string | null) => {
    if (!time) return { h: 5, m: 13, s: 26 };
    const m = time.match(/(\d+)\sH\s(\d+)\sM\s(\d+)\sS/);
    return m
      ? { h: +m[1], m: +m[2], s: +m[3] }
      : { h: 5, m: 13, s: 26 };
  };

  const t = parseTime(selectedTime);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <ProgressBar progress={progress} />

          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{question}</Text>
            <DynamicTimePicker
              initialHour={t.h}
              initialMinute={t.m}
              initialSecond={t.s}
              onTimeChange={(h, m, s) =>
                onSelect(`${h} H ${m} M ${s} S`)
              }
            />
          </View>
        </View>
      </ScrollView>

      <ProceedButton onPress={onNext} disabled={!selectedTime} />
    </SafeAreaView>
  );
};

/* ================= DONE SCREEN ================= */

const DoneScreen = () => (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="dark-content" />
    <View style={styles.doneContainer}>
      <Image
        source={require('../../assets/images/flower-poppy.png')}
        style={styles.doneImage}
      />
      <Text style={styles.doneText}>Ahaar Done!</Text>
    </View>
  </SafeAreaView>
);

/* ================= MAIN ================= */

const HealthAssessment: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [answers, setAnswers] = useState<Answers>({});

  const screenConfig: Record<number, ScreenConfig> = {
    1: { type: 'timePicker', question: 'At what time do you eat breakfast?', progress: 0 / 5, key: 'breakfast' },
    2: { type: 'timePicker', question: 'At what time do you eat lunch?', progress: 1 / 5, key: 'lunch' },
    3: { type: 'yesNo', question: 'Do you have evening snacks?', progress: 2 / 5, key: 'snacks' },
    4: { type: 'timePicker', question: 'At what time do you eat evening lunch?', progress: 3 / 5, key: 'evening' },
    5: { type: 'timePicker', question: 'At what time do you sleep?', progress: 4 / 5, key: 'sleep' },
    6: { type: 'done', question: '', progress: 1, key: 'done' },
  };

  const config = screenConfig[currentScreen];

  const handleNext = (value: string) => {
    setAnswers({ ...answers, [config.key]: value });
    if (currentScreen < 6) setCurrentScreen(currentScreen + 1);
  };

  const handleBack = () => {
    if (currentScreen > 1) setCurrentScreen(currentScreen - 1);
  };

  if (currentScreen === 6) return <DoneScreen />;

  if (config.type === 'yesNo') {
    return (
      <YesNoScreen1
        question={config.question}
        progress={config.progress}
        selected={answers[config.key] || null}
        onSelect={(v) => setAnswers({ ...answers, [config.key]: v })}
        onNext={() => handleNext(answers[config.key] ?? '')}
        onBack={handleBack}
      />
    );
  }

  return (
    <TimePickerScreen
      question={config.question}
      progress={config.progress}
      selectedTime={answers[config.key] || null}
      onSelect={(v) => setAnswers({ ...answers, [config.key]: v })}
      onNext={() => handleNext(answers[config.key] ?? '')}
      onBack={handleBack}
    />
  );
};

export default HealthAssessment;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1, paddingHorizontal: 24 },
  backButton: { marginTop: 16, marginBottom: 16 },
  progressContainer: { height: 6, backgroundColor: '#E5E5E5', borderRadius: 3 },
  progressBar: { height: '100%', backgroundColor: Colors.primaryColor },
  questionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  questionText: { fontSize: 20, fontFamily: Fonts.PoppinsMedium, textAlign: 'center', marginBottom: 32 },
  footer: { padding: 24 },
  proceedButton: { backgroundColor: Colors.primaryColor, padding: 16, borderRadius: 28 },
  proceedButtonDisabled: { backgroundColor: '#D1D5DB' },
  proceedButtonText: { color: '#fff', textAlign: 'center', fontFamily: Fonts.PoppinsMedium },
  doneContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  doneImage: { width: 300, height: 300, marginBottom: 24 },
  doneText: { fontSize: 30, fontFamily: Fonts.PoppinsSemiBold },
});
