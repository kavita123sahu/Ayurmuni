import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  ViewStyle,
  TextStyle,
} from 'react-native';
import YesNoScreen from '../../component/YesNoScreen';
import TimeSelector from '../../component/TimSelector';
import { Ionicons } from '../../common/Vector';
import { Fonts } from '../../common/Fonts';
import { Colors } from '../../common/Colors';
import GradientButton from '../../component/GradientButton';
import DynamicTimePicker from './DynamicTimePicker';


interface ProgressBarProps {
  progress?: number;
}

interface BackButtonProps {
  onPress: () => void;
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
  times: string[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

interface ScreenConfig {
  type: 'timePicker' | 'yesNo';
  question: string;
  times?: string[];
  progress: number;
  key: string;
}

interface Answers {
  [key: string]: string;
}


const ProgressBar: React.FC<ProgressBarProps> = ({ progress = 0.5 }) => {
  return (
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
    </View>
  );
};



const ProceedButton: React.FC<ProceedButtonProps> = ({ onPress, disabled = false }) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={[
          styles.proceedButton,
          disabled && styles.proceedButtonDisabled
        ]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={styles.proceedButtonText}>Proceed</Text>
      </TouchableOpacity>
    </View>
  );
};


const YesNoScreen1: React.FC<YesNoScreen1Props> = ({
  question,
  progress,
  selected,
  onSelect,
  onNext,
  onBack
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* <BackButton onPress={onBack} /> */}
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <ProgressBar progress={progress} />

          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{question}</Text>
            <YesNoScreen selected={selected} onSelect={onSelect} />
          </View>
        </View>
      </ScrollView>

      <ProceedButton onPress={onNext} disabled={!selected} />
    </SafeAreaView>
  );
};




const TimePickerScreen: React.FC<TimePickerScreenProps> = ({
  question,
  progress,
  times,
  selectedTime,
  onSelect,
  onNext,
  onBack
}) => {

   const parseTime = (timeStr: string | null) => {
    if (!timeStr) return { hour: 5, minute: 13, second: 26 };
    
    const match = timeStr.match(/(\d+)\s*H\s*(\d+)\s*M\s*(\d+)\s*S/);
    if (match) {
      return {
        hour: parseInt(match[1]),
        minute: parseInt(match[2]),
        second: parseInt(match[3]),
      };
    }
    return { hour: 5, minute: 13, second: 26 };
  };

  const initialTime = parseTime(selectedTime);
  const [currentTime, setCurrentTime] = useState(initialTime);

  const handleTimeChange = (hour: number, minute: number, second: number) => {
    setCurrentTime({ hour, minute, second });
    const timeString = `${hour} H ${minute} M ${second} S`;
    onSelect(timeString);
  };

  
  return (
    <View  style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* <BackButton onPress={onBack} /> */}

          {/* <View style={styles.rowcontainer}> */}
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <ProgressBar progress={progress} />
          {/* </View> */}

          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{question}</Text>
            {/* <TimeSelector
              times={times}
              selectedTime={selectedTime}
              onSelect={onSelect}
            /> */}
            <DynamicTimePicker
              onTimeChange={handleTimeChange}
              initialHour={initialTime.hour}
              initialMinute={initialTime.minute}
              initialSecond={initialTime.second}
            />
          </View>
        </View>
      </ScrollView>

      <ProceedButton onPress={onNext} disabled={!selectedTime} />
    </View>
  );
};


const HealthAssessment: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<number>(1);
  const [answers, setAnswers] = useState<Answers>({});

  const screenConfig: Record<number, ScreenConfig> = {
    1: {
      type: 'timePicker',
      question: 'At what time do you eat breakfast?',
      times: ['5 H', '13 M', '26 S'],
      progress: 0 / 6,  
      key: 'breakfastTime'
    },
    2: {
      type: 'timePicker',
      question: 'At what time do you eat lunch?',
      times: ['5 H', '13 M', '26 S'],
      progress: 1 / 6,  
      key: 'lunchTime'
    },
    3: {
      type: 'yesNo',
      question: 'Do you have evening snacks?',
      progress: 2 / 6,
      key: 'hasEveningSnacks'
    },
    4: {
      type: 'timePicker',
      question: 'At what time do you eat evening lunch?',
      times: ['5 H', '13 M', '26 S'],
      progress: 3 / 6,
      key: 'eveningLunchTime'
    },
    5: {
      type: 'timePicker',
      question: 'At what time do you sleep?',
      times: ['9 PM', '10 PM', '11 PM'],
      progress: 4 / 6,
      key: 'sleepTime'
    },
    6: {
      type: 'yesNo',
      question: 'Is your nighttime sleep before or after?',
      progress: 5 / 6,  
      key: 'nighttimeSleep'
    }
  };

  const config = screenConfig[currentScreen];

  const handleNext = (value: string): void => {
    setAnswers({ ...answers, [config.key]: value });

    if (currentScreen < 6) {
      setCurrentScreen(currentScreen + 1);
    } else {
      console.log('✅ All answers collected:', { ...answers, [config.key]: value });
    
    }
  };

  const handleBack = (): void => {
    if (currentScreen > 1) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleSelect = (value: string): void => {
    setAnswers({ ...answers, [config.key]: value });
  };

  
  if (config.type === 'yesNo') {
    return (
      <YesNoScreen1
        question={config.question}
        progress={config.progress}
        selected={answers[config.key] || null}
        onSelect={handleSelect}
        onNext={() => handleNext(answers[config.key])}
        onBack={handleBack}
      />
    );
  }

  return (
    <TimePickerScreen
      question={config.question}
      progress={config.progress}
      times={config.times || []}
      selectedTime={answers[config.key] || null}
      onSelect={handleSelect}
      onNext={() => handleNext(answers[config.key])}
      onBack={handleBack}
    />
  );
};

// ============ STYLES - React Native StyleSheet ============

interface Styles {
  container: ViewStyle;
  scrollContent: ViewStyle;
  content: ViewStyle;
  rowcontainer: ViewStyle;
  backButton: ViewStyle;
  progressContainer: ViewStyle;
  progressBar: ViewStyle;
  questionContainer: ViewStyle;
  questionText: TextStyle;
  optionButton: ViewStyle;
  optionButtonSelected: ViewStyle;
  optionButtonText: TextStyle;
  optionButtonTextSelected: TextStyle;
  timeSelectorContainer: ViewStyle;
  timeButton: ViewStyle;
  timeButtonSelected: ViewStyle;
  timeButtonText: TextStyle;
  timeButtonTextSelected: TextStyle;
  footer: ViewStyle;
  proceedButton: ViewStyle;
  proceedButtonDisabled: ViewStyle;
  proceedButtonText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  rowcontainer: {

    flexDirection: 'row',
    alignItems: 'center',      // vertically center
    paddingHorizontal: 24,
    marginTop: 20,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 16,
    marginTop: 15
    // marginRight: 12,           // gap between back icon & progress bar

  },

  progressContainer: {
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    marginBottom: 40,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primaryColor,
    borderRadius: 3,
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 120,
  },
  questionText: {
    fontSize: 20,
    fontFamily: Fonts.PoppinsMedium,
    color: Colors.textColor,
    marginBottom: 32,
    textAlign: 'center',

    lineHeight: 32,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonSelected: {
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.secondaryColor,
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  optionButtonTextSelected: {
    color: '#FFFFFF',
  },
  timeSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeButtonSelected: {
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.secondaryColor,
  },
  timeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  timeButtonTextSelected: {
    color: '#FFFFFF',
  },
  footer: {
    paddingHorizontal: 24,
    // paddingVertical: 16,
    paddingBottom: 50,
    // backgroundColor: '#FFFFFF',
    // borderTopWidth: 1,
    // borderTopColor: '#F3F4F6',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: -2 },
    // shadowOpacity: 0.05,
    shadowRadius: 8,
    // elevation: 5,
  },
  proceedButton: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.secondaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  proceedButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },
  proceedButtonText: {
    fontSize: 16,
    fontFamily: Fonts.PoppinsMedium,
    color: '#FFFFFF',
  },
});

export default HealthAssessment;