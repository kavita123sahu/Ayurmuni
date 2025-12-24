import React, { useRef } from 'react';
import {Animated,Dimensions,FlatList,Image,StyleSheet,Text,TouchableOpacity,View,} from 'react-native';
import { Colors } from '../common/Colors';
import { Fonts } from '../common/Fonts';
import CustomStarRating from './CustomStarRating';

const { width: screenWidth } = Dimensions.get('window');

interface Variant {
    mrp: number;
    weight: string;
    selling_price: number;
    discount_percentage: string;
}

interface Product {
    id: number;
    title: string;
    average_rating: number;
    reviews_count: string;
    stock: string;
    variant_details: Variant;
    product_quantity: string;
    category: any;
    name: string;
    selling_price: number;
    price: number;
    discount_percentage: string;
    image: any;
}

interface Props {
    title: string;
    navigation: any;
    flag?: string;
    PropsData?: Product[];
}

const ProductCard = ({ title, navigation, PropsData = [], flag}: Props) => {

   
    const renderProduct = ({ item }: { item: Product }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigation.navigate('ProductDetail', { PropsData: item })}
        >
            <View style={styles.productImage}>
                { <Image
                    source={
                        typeof item?.image === 'string'
                            ?   
                            { uri: item.image }
                            : item?.image || require('../assets/images/productimage.png')
                    }
                    style={styles.productImage}
                    resizeMode="contain"
                /> }
            </View>

            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                    {item.title}
                </Text>

                <View style={styles.ratingContainer}>
                    <CustomStarRating rating={item.average_rating} maxRating={5} starSize={15} />
                </View>

                <Text style={styles.productDetails}>
                    Quantity: {item?.variant_details?.weight ?? ''}
                </Text>
                <Text style={styles.productDetails}>
                    Category: {item?.category?.name ?? 'NA'}
                </Text>

                <View style={styles.priceContainer}>
                    <View style={styles.priceRow}>
                        <Text style={styles.currentPrice}>₹{item?.selling_price}</Text>
                        <Text style={styles.originalPrice}>₹{item?.variant_details?.mrp ?? '0'}</Text>
                    </View>

                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{item.discount_percentage ?? 0}% OFF</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

  
    
    return (
        <View style={styles.categoriesSection}>
            <Text style={styles.sectionTitle}>{title}</Text>

            {flag === "search" && (
                <FlatList

                    data={PropsData}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    scrollEnabled={false}
                    columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }}
                    contentContainerStyle={styles.gridContainer}
                    ListEmptyComponent={
                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                            <Text style={{ fontFamily: Fonts.PoppinsRegular }}>No Product Found</Text>
                        </View>
                    }
                />
            ) 
            // : (
            //     <>

            //         <Animated.FlatList
            //             horizontal
            //             data={PropsData}
            //             renderItem={renderProduct}
            //             keyExtractor={(item) => item.id.toString()}
            //             showsHorizontalScrollIndicator={false}
            //             ItemSeparatorComponent={ItemSeparator}
            //             contentContainerStyle={styles.flatListContainer}
            //             snapToInterval={cardWidth + 12}
            //             decelerationRate="fast"
            //             onScroll={Animated.event(
            //                 [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            //                 { useNativeDriver: false }
            //             )}
            //         />

            //         {/* DOTS — same UI — now animated */}
            //         {PropsData.length > 1 && (
            //             <View style={styles.paginationContainer}>
            //                 {PropsData.map((_, i) => {
            //                     const inputRange = [
            //                         (i - 1) * (cardWidth + 12),
            //                         i * (cardWidth + 12),
            //                         (i + 1) * (cardWidth + 12),
            //                     ];

            //                     const opacity = scrollX.interpolate({
            //                         inputRange,
            //                         outputRange: [0.3, 1, 0.3],
            //                         extrapolate: "clamp",
            //                     });

            //                     const scale = scrollX.interpolate({
            //                         inputRange,
            //                         outputRange: [0.7, 1.25, 0.7],
            //                         extrapolate: "clamp",
            //                     });

            //                     return (
            //                         <Animated.View
            //                             key={i}
            //                             style={[
            //                                 styles.dot,
            //                                 { opacity, transform: [{ scale }] },
            //                             ]}
            //                         />
            //                     );
            //                 })}
            //             </View>
            //         )}
            //     </>
            // )
            }
        </View>
    );
};

export default ProductCard;

const cardWidth = (screenWidth - 44) / 2;

const styles = StyleSheet.create({
    categoriesSection: {
        paddingHorizontal: 8,
        marginTop: 10,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 16,
    },
   
    flatListContainer: {
        paddingHorizontal: 5,
    },
    separator: {
        width: 12,
    },
    
    productCard: {   
        width: cardWidth,
        borderRadius: 12,
        padding: 12,
        gap: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        borderColor: Colors.fieldTextColor,
        borderWidth: 0.3,
        // backgroundColor: Colors.white
        // elevation: 2,
    },

    productImage: {
        width: '100%',
        height: 120,
        alignContent: 'flex-start',
        borderRadius: 10,
        resizeMode: 'contain',
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 14,
        fontFamily: Fonts.PoppinsMedium,
        color: '#1F2937',
        marginBottom: 8,
        lineHeight: 18,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
 
    productDetails: {
        fontSize: 12,
        fontFamily: Fonts.PoppinsRegular,
        color: '#6B7280',
        marginBottom: 4,
    },
   
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        paddingVertical: 6,

    },
    currentPrice: {
        fontSize: 16,
        fontFamily: Fonts.PoppinsSemiBold,
        color: '#1F2937',
        marginRight: 4,
    },
    originalPrice: {
        fontSize: 12,
        color: '#9CA3AF',
        fontFamily: Fonts.PoppinsMedium,
        textDecorationLine: 'line-through',
        marginRight: 5,
    },
    discountBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        width: 70,
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        borderColor: Colors.borderColor,
        borderWidth: 0.4,
        borderRadius: 4,
        gap: 2,

    },

    discountText: {
        fontSize: 10,
        color: '#4CAF50',
        fontFamily: Fonts.PoppinsMedium,
    },

    gridContainer: {
        paddingBottom: 20,
        padding: 5
    },

    columnWrapper: {
        justifyContent: 'space-between',
    },

    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        marginTop: 10,
        gap: 8,
        height: 14,
    },

    dot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: Colors.primaryColor,
        opacity: 0.4,
    },

})