import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Animated,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { Colors } from '../common/Colors';
import { MaterialIcons } from '../common/Vector';
import { Fonts } from '../common/Fonts';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQItem {
    id: number;
    question: string;
    answer: string;
}

interface ExpandedItems {
    [key: number]: boolean;
}

const FAQComponent: React.FC = () => {
    const [expandedItems, setExpandedItems] = useState<ExpandedItems>({});
    const [showAll, setShowAll] = useState<boolean>(false);


    const faqData: FAQItem[] = [
        {
            id: 1,
            question: 'Frequently asked question 1',
            answer: 'This is the answer to the first frequently asked question. It provides detailed information about the topic and helps users understand better.'
        },
        {
            id: 2,
            question: 'Frequently asked question 2',
            answer: 'This is the answer to the second frequently asked question. It contains relevant information that addresses common user concerns.'
        },
        {
            id: 3,
            question: 'Frequently asked question 3',
            answer: 'This is the answer to the third frequently asked question. It explains important details that users often need to know.'
        },
        {
            id: 4,
            question: 'Frequently asked question 4',
            answer: 'This is the answer to the fourth frequently asked question. It provides comprehensive information on this specific topic.'
        },
        {
            id: 5,
            question: 'Frequently asked question 5',
            answer: 'This is the answer to the fifth frequently asked question. It covers all the essential points users typically ask about.'
        },
        {
            id: 6,
            question: 'Frequently asked question 6',
            answer: 'This is the answer to the sixth frequently asked question. It includes detailed explanations and helpful guidance.'
        },
    ];

    const toggleExpanded = (id: number): void => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedItems((prev: ExpandedItems) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const toggleShowAll = (): void => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShowAll(!showAll);
    };

    const displayedFAQs: FAQItem[] = showAll ? faqData : faqData.slice(0, 3);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.faqContainer}>
                <Text style={styles.title}>FAQs</Text>

                {displayedFAQs.map((item: FAQItem, index: number) => (
                    <View key={item.id} style={styles.faqItem}>
                        <TouchableOpacity
                            style={styles.questionContainer}
                            onPress={() => toggleExpanded(item.id)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.questionText}>{item.question}</Text>
                            <MaterialIcons
                                name={expandedItems[item.id] ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                                size={24}
                                color="#666"
                                style={styles.chevronIcon}
                            />
                        </TouchableOpacity>

                        {expandedItems[item.id] && (
                            <View style={styles.answerContainer}>
                                <Text style={styles.answerText}>{item.answer}</Text>
                            </View>
                        )}
                    </View>
                ))}

                {!showAll && faqData.length > 3 && (
                    <TouchableOpacity
                        style={styles.viewMoreButton}
                        onPress={toggleShowAll}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.viewMoreText}>View More</Text>
                        <MaterialIcons name="keyboard-arrow-down" size={20} color={Colors.secondaryColor} />
                    </TouchableOpacity>
                )}

                {showAll && (
                    <TouchableOpacity
                        style={styles.viewMoreButton}
                        onPress={toggleShowAll}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.viewMoreText}>View Less</Text>
                        <MaterialIcons name="keyboard-arrow-up" size={20} color={Colors.secondaryColor} />
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    faqContainer: {
        margin: 16,
        borderRadius: 10,
        paddingHorizontal:10
   
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    faqItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        marginBottom: 8,
        paddingHorizontal: 10,
        paddingVertical:12,
        borderRadius: 10,
        backgroundColor: '#71A33F1A',
    },

    questionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        
    },
    questionText: {
        fontSize: 14,
       fontFamily : Fonts.PoppinsSemiBold,
        color: '#000000',
        flex: 1,
        marginRight: 12,
        lineHeight: 22,
    },
    chevronIcon: {
        marginLeft: 8,
    },
    answerContainer: {
        paddingHorizontal: 4,
        paddingBottom: 16,
        paddingTop: 0,
    },
    answerText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        textAlign: 'left',
    },
    viewMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        marginTop: 8,
    },
    viewMoreText: {
        fontSize: 16,
        color: Colors.secondaryColor,
        fontWeight: '500',
        marginRight: 4,
    },
});

export default FAQComponent;