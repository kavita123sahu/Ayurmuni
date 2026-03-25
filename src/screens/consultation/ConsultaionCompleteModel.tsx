
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '../../common/Vector';

interface Doctor {
  name: string;
  specialty: string;
}

interface ConsultationCompletedModalProps {
  visible: boolean;
  doctor?: Doctor;
  onClose: () => void;
  navigation: any;
  onRateNow: () => void;
}

export const ConsultationCompletedModal: React.FC<ConsultationCompletedModalProps> = ({
  visible,
  doctor,
  navigation,
  onClose,
  onRateNow,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={60} color="#10B981" />
          </View>

          <Text style={styles.modalTitle}>Consultation Completed</Text>
          <Text style={styles.modalMessage}>
            Your consultation with {doctor?.name || 'the doctor'} has ended
            successfully.
          </Text>

          <TouchableOpacity
            style={styles.modalPrimaryButton}
            onPress={onRateNow}
            activeOpacity={0.7}

          >
            <Text style={styles.modalPrimaryButtonText}>
              Rate Your Experience
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalSecondaryButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.modalSecondaryButtonText}>Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 24,
  },
  modalPrimaryButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalPrimaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  modalSecondaryButton: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalSecondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
});