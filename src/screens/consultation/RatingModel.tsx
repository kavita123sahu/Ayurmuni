
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Modal,
    Alert,
} from 'react-native';
import { Ionicons } from '../../common/Vector';
import Header from '../../component/Header';
import { Colors } from '../../common/Colors';
import { Fonts } from '../../common/Fonts';

interface Doctor {
    name: string;
    specialty: string;
}

interface RatingData {
    rating: number;
    feedback: string;
    tags: string[];
}

interface RatingModalProps {
    visible: boolean;
    doctor: Doctor;
    appointmentId: number;
    navigation: any;
    onClose: () => void;
    onSubmit: (ratingData: RatingData) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
    visible,
    doctor,
    onClose,
    navigation,
    onSubmit,
}) => {
    const [rating, setRating] = useState<number>(0);
    const [feedback, setFeedback] = useState<string>('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const tags: string[] = ['Helpful', 'Polite', 'On Time', 'Explained Well'];

    const toggleTag = (tag: string): void => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const resetForm = () => {
        setRating(0);
        setFeedback('');
        setSelectedTags([]);
    };

    const handleSubmit = (): void => {
        if (rating === 0) {
            Alert.alert('Required', 'Please provide a star rating');
            return;
        }

        const ratingData: RatingData = {
            rating,
            feedback,
            tags: selectedTags,
        };

        onSubmit(ratingData);
        resetForm();
    };

    const handleSkip = (): void => {
        Alert.alert(
            'Skip Rating?',
            'You can rate this doctor later from your past appointments.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Skip',
                    onPress: () => {
                        resetForm();
                        onClose();
                    },
                },
            ]
        );
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const getRatingText = (rating: number): string => {
        const ratingTexts: { [key: number]: string } = {
            5: 'Excellent!',
            4: 'Great!',
            3: 'Good',
            2: 'Okay',
            1: 'Poor',
        };
        return ratingTexts[rating] || '';
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleClose} style={styles.iconWrapper}>
                        <Ionicons name="close" size={26} color="#ffff" />
                    </TouchableOpacity>

                    <Text style={styles.title}>Rate Your Experience</Text>

                    <View style={styles.iconWrapper} />
                </View>


                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.doctorCard}>
                        <View style={styles.doctorAvatar}>
                            <Text style={styles.avatarText}>
                                <Text>
                                    {doctor.name
                                        .replace(/^dr\.?\s*/i, "")
                                        .trim()
                                        .charAt(0)
                                        .toUpperCase()  || 'D'}
                                </Text>

                                {/* {doctor?.name?.charAt(3) || 'D'} */}
                            </Text>
                        </View>
                        <Text style={styles.doctorName}>{doctor?.name || 'Doctor'}</Text>
                        <Text style={styles.doctorSpecialty}>
                            {doctor?.specialty || 'Specialist'}
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>How was your consultation?</Text>
                        <View style={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity
                                    key={star}
                                    onPress={() => setRating(star)}
                                    style={styles.starButton}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name={star <= rating ? 'star' : 'star-outline'}
                                        size={44}
                                        color={star <= rating ? '#FFB800' : '#D1D5DB'}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                        {rating > 0 && (
                            <Text style={styles.ratingText}>{getRatingText(rating)}</Text>
                        )}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>What did you like?</Text>
                        <View style={styles.tagsContainer}>
                            {tags.map((tag) => (
                                <TouchableOpacity
                                    key={tag}
                                    onPress={() => toggleTag(tag)}
                                    style={[
                                        styles.tag,
                                        selectedTags.includes(tag) && styles.tagSelected,
                                    ]}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name={
                                            selectedTags.includes(tag)
                                                ? 'checkmark-circle'
                                                : 'add-circle-outline'
                                        }
                                        size={20}
                                        color={selectedTags.includes(tag) ? '#fff' : Colors.primaryColor}
                                        style={styles.tagIcon}
                                    />
                                    <Text
                                        style={[
                                            styles.tagText,
                                            selectedTags.includes(tag) && styles.tagTextSelected,
                                        ]}>
                                        {tag}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Additional Feedback{' '}
                            <Text style={styles.optional}>(Optional)</Text>
                        </Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Share more about your experience..."
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={5}
                            textAlignVertical="top"
                            value={feedback}
                            onChangeText={setFeedback}
                        />
                    </View>
                </ScrollView>

                <View style={styles.bottomContainer}>
                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={handleSkip}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.skipButtonText}>Skip for Now</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            rating === 0 && styles.submitButtonDisabled,
                        ]}
                        onPress={handleSubmit}
                        activeOpacity={0.7}
                        disabled={rating === 0}
                    >
                        <Text style={styles.submitButtonText}>Submit Rating</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 30,

        paddingVertical: 25,
        borderBottomEndRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.primaryColor,
        backgroundColor: Colors.secondaryColor,
    },
    iconWrapper: {
        width: 40, // important for center alignment
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        alignItems: "center",
        fontFamily: Fonts.PoppinsSemiBold,
        color: "#fff",
    },
    closeButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    doctorCard: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    doctorAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 30,
        fontFamily: Fonts.PoppinsMedium,
        color: '#fff',
    },
    doctorName: {
        fontSize: 22,
        fontFamily : Fonts.PoppinsSemiBold,
        color: Colors.textColor,
        marginBottom: 4,
    },
    doctorSpecialty: {
        fontSize: 16,
        fontFamily : Fonts.PoppinsMedium,
        color: '#6B7280',
    },
    section: {
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily : Fonts.PoppinsMedium,
        color : Colors.textColor,
        marginBottom: 16,
    },
    optional: {
        fontSize: 14,
        fontWeight: '400',
        color: '#9CA3AF',
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 12,
    },
    starButton: {
        padding: 4,
    },
    ratingText: {
        fontSize: 18,
        fontFamily : Fonts.PoppinsSemiBold,
        color: Colors.primaryColor,
        textAlign: 'center',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: Colors.primaryColor,
        backgroundColor: '#fff',
    },
    tagSelected: {
        backgroundColor: Colors.primaryColor,
        borderColor: Colors.primaryColor,
    },
    tagIcon: {
        marginRight: 6,
    },
    tagText: {
        fontSize: 14,
        fontFamily : Fonts.PoppinsMedium,
        color: Colors.primaryColor,
    },
    tagTextSelected: {
        color: '#fff',
    },
    textInput: {
        backgroundColor: '#fff',
        borderRadius: 12,
        fontFamily : Fonts.PoppinsMedium,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 16,
        fontSize: 14,
        color: '#111827',
        minHeight: 120,
    },
    bottomContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        gap: 12,
    },
    skipButton: {
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#D1D5DB',
        alignItems: 'center',
    },
    skipButtonText: {
        fontSize: 16,
        fontFamily : Fonts.PoppinsMedium,
        color: '#6B7280',
    },
    submitButton: {
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#D1D5DB',
    },
    submitButtonText: {
        fontSize: 16,
        fontFamily : Fonts.PoppinsMedium,
        color: '#fff',
    },
});