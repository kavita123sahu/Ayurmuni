import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Image,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Fonts } from '../../common/Fonts';
import { Ionicons } from '../../common/Vector';
import TopCurve from '../../component/TopCurve';

const { width } = Dimensions.get('window');
const STATUS_BAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

const Assesment = (props: any) => {
  const assessmentItems = [
    { id: 1, title: 'Aahar', subtitle: 'Your food and eating habits' },
    { id: 2, title: 'Vihar', subtitle: 'Your lifestyle and daily routine habits' },
    { id: 3, title: 'Chikitsa', subtitle: 'Your medical and treatment history' },
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#6E7F2E" />

      {/* ================= GRADIENT HEADER ================= */}
      <LinearGradient
        colors={['#6E7F2E', '#3C3F20']}
        style={[styles.gradient, { paddingTop: STATUS_BAR_HEIGHT + 12 }]}
      >
        {/* Header row */}
        <View style={styles.headerRow}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Health assessment</Text>

          <View style={{ width: 22 }} />
        </View>

        {/* Header content */}
        <View style={styles.headerContent}>
          <View style={styles.beforeRow}>
            <Text style={styles.beforeText}>Before you begin</Text>
            <Image
              source={require('../../assets/images/leaf-circle.png')}
              style={styles.beforeIcon}
            />
          </View>

          <Text style={styles.headerDesc}>
            Ayurveda treats you, not just your symptoms.
          </Text>

          <Text style={styles.headerSub}>
            This questionnaire helps us to assess
          </Text>

          <Text style={styles.bullet}>• understand your body type and digestion</Text>
          <Text style={styles.bullet}>
            • recommend personalised treatment, not generic advice
          </Text>
          <Text style={styles.bullet}>
            • avoid medicines or routines that may not suit you
          </Text>
        </View>

        {/* SVG CURVE */}
        <TopCurve />
      </LinearGradient>

      {/* ================= WHITE CONTENT ================= */}
      <View style={styles.curvedContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {assessmentItems.map((item, index) => (
            <View key={item.id} style={styles.cardRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.id}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSub}>{item.subtitle}</Text>
              </View>

              <View>
                <Text style={styles.timeLabel}>Estimated time</Text>
                <Text style={styles.time}>⏱ 8–12 min</Text>
              </View>

              {index !== assessmentItems.length - 1 && (
                <View style={styles.dashed} />
              )}
            </View>
          ))}
        </ScrollView>

        {/* Bottom buttons */}
        <View style={styles.bottom}>
          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => props.navigation.navigate('HealthAssessment')}
          >
            <Text style={styles.startText}>Start</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('HomeStack', { screen: 'Onboarding' })
            }
          >
            <Text style={styles.skip}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Assesment;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#6E7F2E',
  },

  gradient: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: Fonts.PoppinsSemiBold,
  },

  headerContent: {},

  beforeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },

  beforeText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.PoppinsSemiBold,
  },

  beforeIcon: {
    width: 18,
    height: 18,
  },

  headerDesc: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 6,
  },

  headerSub: {
    color: '#E5E7EB',
    fontSize: 12,
    marginBottom: 10,
  },

  bullet: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 18,
  },

  curvedContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -20, 
    paddingTop: 40,
    paddingHorizontal: 20,
    
  },

  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 36,
  },

  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6E7F2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  badgeText: {
    color: '#fff',
    fontFamily: Fonts.PoppinsSemiBold,
  },

  cardTitle: {
    fontSize: 15,
    fontFamily: Fonts.PoppinsSemiBold,
    color: '#111827',
  },

  cardSub: {
    fontSize: 12,
    color: '#6B7280',
  },

  timeLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'right',
  },

  time: {
    fontSize: 12,
    color: '#111827',
  },

  dashed: {
    position: 'absolute',
    left: 13,
    bottom: 0,
    height: 30,
    borderLeftWidth: 1,
    borderLeftColor: '#D1D5DB',
    borderStyle: 'dashed',
  },

  bottom: {
    paddingTop: 20,
    paddingBottom: 20,
  },

  startBtn: {
    backgroundColor: '#4B5A1D',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  startText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.PoppinsSemiBold,
  },

  skip: {
    marginTop: 12,
    textAlign: 'center',
    color: '#6E7F2E',
    fontFamily: Fonts.PoppinsMedium,
    marginBottom:10,
  },
});
