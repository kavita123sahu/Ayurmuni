
import React, { useRef } from 'react';
import {Animated,Image,ListRenderItem,StyleSheet,Text,TouchableOpacity,View,Dimensions} from 'react-native';
import { Colors } from '../../common/Colors';
import { Fonts } from '../../common/Fonts';


interface Category {
    id: number;
    name: string;
    image: any;
}

interface Props {
    title: string;
    categories?: Category[];
    navigation: any;
    onCategoryPress?: (category: Category) => void;
}

const SCREEN_WIDTH = Dimensions.get("window").width;



const CategoryPage = ({ title, categories = [], navigation }: Props) => {

        const visibleItems = categories.slice(0, 5);
        const scrollX = useRef(new Animated.Value(0)).current;

        const handleCategoryPress = (category: any) => {
            navigation.navigate('Search', { category });
        };

        const handleViewAll = () => {
            navigation.navigate("AllCategories");
        }

        
        const renderCategory: ListRenderItem<Category> = ({ item }) => (
            <TouchableOpacity
                style={[styles.categoryItem, {}]} 
                onPress={() => handleCategoryPress(item)}
            >
                <View style={styles.cardstyle}>
                    <Image
                        source={item.image || require('../../assets/images/Frame1.png')}
                        style={styles.itemImage}
                        resizeMode="contain"
                    />
                </View>
                <Text style={styles.categoryText}>{item?.name ?? 'NA'}</Text>
            </TouchableOpacity>
        );


        return (
            <View style={styles.categoriesSection}>
                <View style={styles.titleRow}>
                    <Text style={styles.sectionTitle}>{title}</Text>
                    <TouchableOpacity onPress={handleViewAll}>
                        <Text style={styles.viewAll}>View All</Text>
                    </TouchableOpacity>
                </View>


                <Animated.FlatList
                    data={visibleItems}
                    renderItem={renderCategory}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    snapToInterval={SCREEN_WIDTH / 3}
                    decelerationRate="fast"
                />

                {visibleItems.length > 1 && (
                    <View style={styles.paginationContainer}>
                        {visibleItems.map((_, i) => {
                            const inputRange = [
                                (i - 1) * (SCREEN_WIDTH / 3),
                                i * (SCREEN_WIDTH / 3),
                                (i + 1) * (SCREEN_WIDTH / 3)
                            ];

                            const opacity = scrollX.interpolate({
                                inputRange,
                                outputRange: [0.3, 1, 0.3],
                                extrapolate: "clamp",
                            });

                            const scale = scrollX.interpolate({
                                inputRange,
                                outputRange: [0.6, 1.3, 0.6],
                                extrapolate: "clamp",
                            });

                            return (
                                <Animated.View
                                    key={i}
                                    style={[
                                        styles.dot,
                                        { opacity, transform: [{ scale }] },
                                    ]}
                                />
                            );
                        })}
                    </View>
                )}
            </View>
        );

    };

export default CategoryPage;


const styles = StyleSheet.create({
    categoriesSection: {
        padding: 12,
        marginTop: 10,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: Fonts.PoppinsSemiBold,
        color: '#333'
    },
    viewAll: {
        fontSize: 14,
        fontFamily: Fonts.PoppinsSemiBold,
        color: Colors.primaryColor,
    },
    categoryItem: {
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    cardstyle: {
        height: 75,
        width: 75,
        borderRadius: 50,
        backgroundColor: '#F4F4F4',
        justifyContent: "center",
        alignItems: "center",
    },
    itemImage: {
        height: 70,
        width: 70,
    },
    categoryText: {
        marginTop: 6,
        fontSize: 12,
        color: Colors.textColor,
        fontFamily: Fonts.PoppinsSemiBold,
        textAlign: "center"
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        gap: 6,
    },
    dot: {
        height: 9,
        width: 9,
        backgroundColor: Colors.primaryColor,
        borderRadius: 100,
    },
});
