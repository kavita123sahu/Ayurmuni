import React from 'react';
import {
    Image,
    ListRenderItem,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
} from 'react-native';
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
}

const CategoryPage = ({ title, categories = [], navigation }: Props) => {

    const visibleItems = Array.isArray(categories)
        ? categories.slice(0, 4) // 👈 same like figma (4 items)
        : [];

    const handleCategoryPress = (category: Category) => {
        navigation.navigate('Search', { category });
    };

    const handleViewAll = () => {
        navigation.navigate("AllCategories");
    };

    const renderCategory: ListRenderItem<Category> = ({ item }) => (
        <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => handleCategoryPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.iconContainer}>
                <Image
                    source={
                        item?.image
                            ? { uri: item.image } // ✅ API image support
                            : require('../../assets/images/Frame1.png')
                    }
                    style={styles.icon}
                    resizeMode="contain"
                />
            </View>

            <Text style={styles.categoryText}>
                {item?.name ?? 'NA'}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.categoriesSection}>
            
            {/* Header */}
            <View style={styles.titleRow}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <TouchableOpacity onPress={handleViewAll}>
                    <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
            </View>

            {/* Categories Row */}
            <FlatList
                data={visibleItems}
                renderItem={renderCategory}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 4 }}
            />
        </View>
    );
};

export default CategoryPage;

const styles = StyleSheet.create({
    categoriesSection: {
        paddingHorizontal: 16,
        marginTop: 10,
    },

    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },

    sectionTitle: {
        fontSize: 18,
        fontFamily: Fonts.PoppinsSemiBold,
        color: '#333',
    },

    viewAll: {
        fontSize: 14,
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.primaryColor,
    },

    categoryItem: {
        alignItems: 'center',
        marginRight: 18,
    },

    iconContainer: {
        height: 72,
        width: 72,
        borderRadius: 40,
        backgroundColor: '#E9ECEF', // 👈 exact figma grey
        justifyContent: 'center',
        alignItems: 'center',
    },

    icon: {
        height: 32,
        width: 32,
        tintColor: Colors.primaryColor, // 👈 green icon
    },

    categoryText: {
        marginTop: 8,
        fontSize: 13,
        color: '#333',
        fontFamily: Fonts.PoppinsMedium,
        textAlign: "center",
    },
});