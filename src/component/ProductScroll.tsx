import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
} from 'react-native';

const { width } = Dimensions.get('window');

const ProductScroll = (props: any) => {

    const productImages = [
        "https://ayurmuni.s3.ap-south-1.amazonaws.com/products/cocountoil.jpeg",
        "https://ayurmuni.s3.ap-south-1.amazonaws.com/products/cocountoil.jpeg",
        "https://ayurmuni.s3.ap-south-1.amazonaws.com/products/cocountoil.jpeg",
        "https://ayurmuni.s3.ap-south-1.amazonaws.com/products/cocountoil.jpeg"
    ];


    // const productImages = props.Productdata;

    // console.log("Product Images ===>", productImages)

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const thumbnailScrollRef = useRef<ScrollView>(null);

    const scrollToThumbnail = (index: number) => {
        if (thumbnailScrollRef.current) {
            const thumbnailWidth = 70;
            const scrollPosition = index * thumbnailWidth - (width / 2) + (thumbnailWidth / 2);
            thumbnailScrollRef.current.scrollTo({
                x: Math.max(0, scrollPosition),
                animated: true,
            });
        }
    };


    const handleThumbnailPress = (index: any) => {
        setSelectedImageIndex(index);
        scrollToThumbnail(index);
    };

    const handlePreviousImage = () => {
        if (selectedImageIndex > 0) {
            const newIndex = selectedImageIndex - 1;
            setSelectedImageIndex(newIndex);
            scrollToThumbnail(newIndex);
        }
    };

    const handleNextImage = () => {
        if (selectedImageIndex < productImages.length - 1) {
            const newIndex = selectedImageIndex + 1;
            setSelectedImageIndex(newIndex);
            scrollToThumbnail(newIndex);
        }
    };

    useEffect(() => {
        scrollToThumbnail(selectedImageIndex);
    }, [selectedImageIndex]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.productContainer}>


                    <View style={styles.mainImageContainer}>
                        {/* <Image
                            source={{ uri: productImages[selectedImageIndex] }}
                            // source={productImages[selectedImageIndex]}
                            style={styles.mainImage}
                            resizeMode="cover"
                        /> */}

                        {selectedImageIndex > 0 && (
                            <TouchableOpacity
                                style={[styles.navButton, styles.prevButton]}
                                onPress={handlePreviousImage}
                            >
                                <Text style={styles.navButtonText}>‹</Text>
                            </TouchableOpacity>
                        )}


                        {selectedImageIndex < productImages.length - 1 && (
                            <TouchableOpacity
                                style={[styles.navButton, styles.nextButton]}
                                onPress={handleNextImage}
                            >
                                <Text style={styles.navButtonText}>›</Text>
                            </TouchableOpacity>
                        )}

                        {/* <View style={styles.imageCounter}>
                            <Text style={styles.counterText}>
                                {selectedImageIndex + 1} / {productImages.length}
                            </Text>
                        </View> */}
                    </View>



                </View>

                {/* Thumbnail Scroll Section */}
                <View style={styles.thumbnailContainer}>
                    <ScrollView
                        ref={thumbnailScrollRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.thumbnailScroll}
                        contentContainerStyle={styles.thumbnailContent}
                        decelerationRate="fast"  >

                        {productImages.map((image: any, index: any) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.thumbnail,
                                    selectedImageIndex === index && styles.activeThumbnail
                                ]}
                                onPress={() => handleThumbnailPress(index)} >
                                {/* <Image
                                    source={{ uri: image }}
                                    // source={image}
                                    style={styles.thumbnailImage}
                                    resizeMode="cover"
                                /> */}

                                {selectedImageIndex === index && (
                                    <View style={styles.activeOverlay} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    productContainer: {
        backgroundColor: '#fff',
        // margin: 16,
        borderRadius: 12,
        padding: 16,
        paddingHorizontal: 15,
        // shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // elevation: 3,
    },
    imageSection: {
        marginBottom: 20,
        backgroundColor: '#fff'
    },
    mainImageContainer: {
        width: '100%',
        height: 320,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        position: 'relative',
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    navButton: {
        position: 'absolute',
        top: '50%',
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ translateY: -22 }],
        zIndex: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    prevButton: {
        left: 12,
    },
    nextButton: {
        right: 12,
    },
    navButtonText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        lineHeight: 28,
    },
    imageCounter: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 15,
    },
    counterText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    thumbnailContainer: {
        marginTop: 16,
        // backgroundColor: '#fff',
        padding: 5,

    },
    thumbnailScroll: {
        flexGrow: 0,

    },
    thumbnailContent: {
        paddingHorizontal: 8,
        alignItems: 'center',
    },
    thumbnail: {
        width: 90,
        height: 90,
        borderRadius: 8,
        marginHorizontal: 5,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        overflow: 'hidden',
        backgroundColor: '#f9f9f9',
        position: 'relative',
    },
    activeThumbnail: {
        borderColor: '#4CAF50',
        borderWidth: 2,
        shadowColor: '#4CAF50',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 6,
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
    },
    activeOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
    },
    productInfo: {
        paddingTop: 10,
    },
    productTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    productSubtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    productDescription: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
        marginBottom: 15,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    stars: {
        fontSize: 18,
        color: '#FFA500',
        marginRight: 8,
    },
    ratingText: {
        fontSize: 14,
        color: '#666',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    currentPrice: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginRight: 10,
    },
    originalPrice: {
        fontSize: 18,
        color: '#999',
        textDecorationLine: 'line-through',
        marginRight: 10,
    },
    discount: {
        fontSize: 14,
        color: '#FF5722',
        backgroundColor: '#FFE0DB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        fontWeight: 'bold',
    },
    deliveryInfo: {
        backgroundColor: '#E8F5E8',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    deliveryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 8,
    },
    deliveryText: {
        fontSize: 14,
        color: '#2E7D32',
        marginBottom: 3,
    },
    featuresContainer: {
        marginBottom: 25,
    },
    featuresTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    featureItem: {
        fontSize: 15,
        color: '#666',
        marginBottom: 6,
        lineHeight: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    addToCartButton: {
        flex: 1,
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    addToCartText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buyNowButton: {
        flex: 1,
        backgroundColor: '#FF5722',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buyNowText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProductScroll;