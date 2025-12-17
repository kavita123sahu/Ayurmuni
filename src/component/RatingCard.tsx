import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";


interface RatingProps {

    title: string;
}

const RatingCard: React.FC<RatingProps> = ({ title }) => {

    const renderStars = (rating: any, size = 16) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Text key={i} style={[styles.star, { fontSize: size }]}>
                {i < rating ? '★' : '☆'}
            </Text>
        ));
    };
    
    const ratingData = [
        { stars: 5, count: 3500, percentage: 70 },
        { stars: 4, count: 1000, percentage: 20 },
        { stars: 3, count: 300, percentage: 6 },
        { stars: 2, count: 150, percentage: 3 },
        { stars: 1, count: 50, percentage: 1 },
    ];

    return (
        <View style={styles.reviewsCard}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.ratingOverview}>
                <View style={styles.ratingScore}>
                    <Text style={styles.scoreNumber}>4.9</Text>
                    <View style={styles.starsContainer}>
                        {renderStars(5, 16)}
                    </View>
                    <Text style={styles.reviewCount}>(5056)</Text>
                </View>

                <View style={styles.ratingBars}>
                    {ratingData.map((item) => (
                        <View key={item.stars} style={styles.ratingBarRow}>
                            <Text style={styles.ratingNumber}>{item.stars}</Text>
                            <View style={styles.progressBarContainer}>
                                <View style={styles.progressBarBg}>
                                    <View style={[styles.progressBarFill, { width: `${item.percentage}%` }]} />
                                </View>
                            </View>
                            <Text style={styles.ratingCount}>{item.count}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.rateSection}>
                <Text style={styles.subsectionTitle}>Rate & Review:</Text>
                <View style={styles.rateRow}>
                    <View style={styles.userAvatar}>
                        <Image source={require('../assets/images/profile.png')} style={{ height: 30, width: 30 }} />
                    </View>
                    <View style={styles.starsContainer}>
                        {Array.from({ length: 5 }, (_, i) => (
                            <TouchableOpacity key={i}>
                                <Image source={require('../assets/images/star.png')} style={styles.ratingStar} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>


            <View style={styles.topReviewsSection}>
                <Text style={styles.subsectionTitle}>Top Reviews:</Text>
                <View style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                        <View style={[styles.reviewerAvatar, { backgroundColor: '#FEE2E2' }]}>
                            <Text style={[styles.reviewerInitials, { color: '#DC2626' }]}>CN</Text>
                        </View>
                        <View style={styles.reviewContent}>
                            <View style={styles.reviewerInfo}>
                                <Text style={styles.reviewerName}>Customer Name</Text>
                                <View style={styles.starsContainer}>
                                    {renderStars(14)}
                                </View>
                                <View style={styles.verifiedBadge}>
                                    <Text style={styles.verifiedText}>Verified Customer</Text>
                                </View>
                            </View>
                            <Text style={styles.reviewTitle}>Good</Text>
                            <Text style={styles.reviewDate}>Date - DD Month YYY</Text>
                            <Text style={styles.reviewText}>
                                Lorem ipsum dolor sit amet consectetur. Metus in dolor nibh lectus. Non tortor tellus amet enim
                                tincidunt maecenas ipsum donec gravida. Arcu augue orci morbi egestas duis massa dui non. Aliquam
                                sem. Est donec non.
                            </Text>
                            <View style={styles.reviewActions}>
                                <TouchableOpacity style={styles.helpfulButton}>
                                    <Text style={styles.helpfulText}>Helpful</Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text style={styles.reportText}>Report</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

        </View>
    )
}

export default RatingCard;

const styles = StyleSheet.create({
    reviewsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        shadowRadius: 4,
        // elevation: 1,
    },
    ratingOverview: {
        flexDirection: 'row',
        marginBottom: 24,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    ratingScore: {
        alignItems: 'center',
        marginRight: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 16,
    },
    scoreNumber: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },

    ratingBars: {
        flex: 1,
    },
    ratingBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    ratingNumber: {
        fontSize: 14,
        color: '#6B7280',
        width: 16,
        marginRight: 12,
    },
    progressBarContainer: {
        flex: 1,
        marginRight: 12,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
    },
    progressBarFill: {
        height: 8,
        backgroundColor: '#FBBF24',
        borderRadius: 4,
    },
    ratingCount: {
        fontSize: 12,
        color: '#6B7280',
    },

    // Rate Section Styles
    rateSection: {
        marginBottom: 24,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    subsectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
    },
    rateRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userAvatar: {

        // backgroundColor: '#E5E7EB',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 18,
    },
    ratingStar: {
        height: 20,
        width: 20,
        color: '#D1D5DB',
        marginRight: 4,
    },

    // Top Reviews Styles
    topReviewsSection: {
        marginBottom: 24,
    },
    reviewItem: {
        marginBottom: 24,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    reviewerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    reviewerInitials: {
        fontSize: 14,
        fontWeight: '600',
    },
    reviewContent: {
        flex: 1,
    },
    reviewerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        flexWrap: 'wrap',
    },
    reviewerName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
        marginRight: 8,
    },
    starsContainer: {
        flexDirection: 'row',
        marginRight: 8,
    },
    reviewCount: {
        color: '#000',
        fontSize: 14,
        fontWeight: '600'
    },
    star: {
        color: '#FFC107',
        fontSize: 16,
    },
    verifiedBadge: {
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 8,
    },
    verifiedText: {
        fontSize: 11,
        color: '#166534',
    },
    reviewTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1F2937',
        marginBottom: 8,
    },
    reviewDate: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 8,
    },
    reviewText: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
        marginBottom: 12,
    },
    reviewActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    helpfulButton: {
        marginRight: 16,
        borderRadius: 8,
        borderWidth: 1,
    },
    helpfulText: {
        fontSize: 14,
        color: '#6B7280',
        padding: 5,
    },
    reportText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#EF4444',
    },

})
