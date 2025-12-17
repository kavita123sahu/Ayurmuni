import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native';
import Header from '../../component/Header';

const RatingScreen = (props: any) => {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<any[]>([]);

    const categories = [
        '😊 Easy to Use',
        '⚡ Fast Delivery',
        '💰 Good Value',
        '📦 Quality Products',
        '🛡️ Safe & Secure',
        '🎯 As Described'
    ];
    
    console.log('propsprops', props)
    const handleCategoryToggle = (category: any) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const handleSubmitReview = () => {
        if (rating === 0) {
            Alert.alert('Error', 'Please select a rating');
            return;
        }

        // Yaha tu apna API call kar sakta hai
        Alert.alert(
            'Success',
            'Thank you for your feedback!',
            [{
                text: 'OK', onPress: () => {
                    // Reset form or navigate back
                    setRating(0);
                    setReviewText('');
                    setSelectedCategories([]);
                }
            }]
        );
    };

    const getRatingText = () => {
        switch (rating) {
            case 1: return 'Poor';
            case 2: return 'Below Average';
            case 3: return 'Average';
            case 4: return 'Good';
            case 5: return 'Excellent';
            default: return 'Tap to rate';
        }
    };

    const getRatingEmoji = () => {
        switch (rating) {
            case 1: return '😞';
            case 2: return '😕';
            case 3: return '😐';
            case 4: return '😊';
            case 5: return '🤩';
            default: return '⭐';
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Header title='Rating US' navigation={props.navigation} Is_Tab={false} />

            <View style={styles.header}>

                <Text style={styles.headerSubtitle}>
                    Your feedback helps us improve
                </Text>
            </View>

            {/* Rating Section */}
            <View style={styles.ratingSection}>
                <View style={styles.emojiContainer}>
                    <Text style={styles.emoji}>{getRatingEmoji()}</Text>
                </View>

                <Text style={styles.ratingLabel}>{getRatingText()}</Text>

                <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                            key={star}
                            onPress={() => setRating(star)}
                            style={styles.starButton}
                        >
                            <Text style={[
                                styles.star,
                                star <= rating && styles.starFilled
                            ]}>
                                ★
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {rating > 0 && (
                    <Text style={styles.ratingCount}>
                        {rating} out of 5
                    </Text>
                )}
            </View>

            {/* Categories Section */}
            {rating > 0 && (
                <View style={styles.categoriesSection}>
                    <Text style={styles.sectionTitle}>
                        What did you like? (Optional)
                    </Text>
                    <View style={styles.categoriesGrid}>
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={[
                                    styles.categoryChip,
                                    selectedCategories?.includes(category) && styles.categoryChipActive
                                ]}
                                onPress={() => handleCategoryToggle(category)}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    selectedCategories?.includes(category) && styles.categoryTextActive
                                ]}>
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {/* Review Text Section */}
            {rating > 0 && (
                <View style={styles.reviewSection}>
                    <Text style={styles.sectionTitle}>
                        Write your review (Optional)
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Share your experience with us..."
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                        value={reviewText}
                        onChangeText={setReviewText}
                        maxLength={500}
                    />
                    <Text style={styles.charCount}>
                        {reviewText.length}/500 characters
                    </Text>
                </View>
            )}

            {/* Benefits Section */}
            {rating === 0 && (
                <View style={styles.benefitsSection}>
                    <Text style={styles.benefitsTitle}>Why rate us?</Text>

                    <View style={styles.benefitItem}>
                        <Text style={styles.benefitIcon}>💬</Text>
                        <View style={styles.benefitText}>
                            <Text style={styles.benefitTitle}>Help Others</Text>
                            <Text style={styles.benefitDesc}>
                                Your review helps other customers
                            </Text>
                        </View>
                    </View>

                    <View style={styles.benefitItem}>
                        <Text style={styles.benefitIcon}>🎁</Text>
                        <View style={styles.benefitText}>
                            <Text style={styles.benefitTitle}>Get Rewards</Text>
                            <Text style={styles.benefitDesc}>
                                Earn loyalty points for reviews
                            </Text>
                        </View>
                    </View>

                    <View style={styles.benefitItem}>
                        <Text style={styles.benefitIcon}>📈</Text>
                        <View style={styles.benefitText}>
                            <Text style={styles.benefitTitle}>Improve Service</Text>
                            <Text style={styles.benefitDesc}>
                                Help us serve you better
                            </Text>
                        </View>
                    </View>
                </View>
            )}

            {/* Submit Button */}
            {rating > 0 && (
                <View style={styles.submitSection}>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmitReview}
                    >
                        <Text style={styles.submitButtonText}>Submit Review</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={() => {
                            setRating(0);
                            setReviewText('');
                            setSelectedCategories([]);
                        }}
                    >
                        <Text style={styles.skipButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Privacy Note */}
            <View style={styles.privacyNote}>
                <Text style={styles.privacyText}>
                    🔒 Your review will be public and visible to other users
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: '#fff',
        padding: 24,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#212529',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 15,
        color: '#6c757d',
    },
    ratingSection: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 32,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    emojiContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emoji: {
        fontSize: 56,
    },
    ratingLabel: {
        fontSize: 22,
        fontWeight: '600',
        color: '#212529',
        marginBottom: 16,
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    starButton: {
        padding: 4,
    },
    star: {
        fontSize: 48,
        color: '#dee2e6',
        marginHorizontal: 4,
    },
    starFilled: {
        color: '#ffc107',
    },
    ratingCount: {
        fontSize: 16,
        color: '#6c757d',
        marginTop: 8,
    },
    categoriesSection: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#212529',
        marginBottom: 16,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        borderWidth: 1.5,
        borderColor: '#dee2e6',
        marginBottom: 10,
    },
    categoryChipActive: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    categoryText: {
        fontSize: 14,
        color: '#495057',
        fontWeight: '500',
    },
    categoryTextActive: {
        color: '#fff',
    },
    reviewSection: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    textInput: {
        borderWidth: 1.5,
        borderColor: '#dee2e6',
        borderRadius: 12,
        padding: 16,
        fontSize: 15,
        color: '#212529',
        minHeight: 140,
        backgroundColor: '#f8f9fa',
    },
    charCount: {
        textAlign: 'right',
        marginTop: 8,
        fontSize: 13,
        color: '#6c757d',
    },
    benefitsSection: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    benefitsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#212529',
        marginBottom: 20,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    benefitIcon: {
        fontSize: 36,
        marginRight: 16,
    },
    benefitText: {
        flex: 1,
    },
    benefitTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212529',
        marginBottom: 4,
    },
    benefitDesc: {
        fontSize: 14,
        color: '#6c757d',
        lineHeight: 20,
    },
    submitSection: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    submitButton: {
        backgroundColor: '#007bff',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#007bff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    submitButtonText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#fff',
    },
    skipButton: {
        padding: 16,
        alignItems: 'center',
    },
    skipButtonText: {
        fontSize: 16,
        color: '#6c757d',
        fontWeight: '500',
    },
    privacyNote: {
        marginHorizontal: 16,
        marginBottom: 32,
        padding: 16,
        backgroundColor: '#e7f3ff',
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#007bff',
    },
    privacyText: {
        fontSize: 13,
        color: '#495057',
        lineHeight: 20,
    },
});

export default RatingScreen;