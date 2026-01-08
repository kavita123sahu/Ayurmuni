import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, ScrollView, Modal } from 'react-native';
import { Colors } from '../../common/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Fonts } from '../../common/Fonts';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import HeaderSearch from '../../component/HeaderSearch';
import * as _HOME_SERVICE from '../../services/HomeServices';
import ProductCard from '../../component/ProductCard';

const Search = (props: any) => {

    const [searchData, setSearchData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loader, setLoader] = useState(true);

    const [showFilters, setShowFilters] = useState(false);
    const [selectedPriceRange, setSelectedPriceRange] = useState('');
    const [selectedRating, setSelectedRating] = useState('');
    const [selectedSortBy, setSelectedSortBy] = useState('');
    const [activeFiltersCount, setActiveFiltersCount] = useState(0);

    const { category } = props.route.params || {};

    const priceRanges = [
        { label: 'Under ₹500', value: '0-500' },
        { label: '₹500 - ₹1000', value: '500-1000' },
        { label: '₹1000 - ₹2000', value: '1000-2000' },
        { label: 'Above ₹2000', value: '2000+' }
    ];

    const ratingOptions = [
        { label: '4+ Stars', value: '4+' },
        { label: '3+ Stars', value: '3+' },
        { label: '2+ Stars', value: '2+' },
        { label: 'All Ratings', value: 'all' }
    ];

    const sortOptions = [
        { label: 'Price: Low to High', value: 'price_asc' },
        { label: 'Price: High to Low', value: 'price_desc' },
        { label: 'Rating: High to Low', value: 'rating_desc' },
        { label: 'Newest First', value: 'newest' },
        { label: 'Popular', value: 'popular' }
    ];

    useEffect(() => {
        if (category?.id) {
            getProductsbyCategory(category.id);
        }
    }, [category]);


    useEffect(() => {
        if (searchData.length > 0) {
            applyFilters();
        }
    }, [searchData, selectedPriceRange, selectedRating, selectedSortBy]);


    useEffect(() => {
        let count = 0;
        if (selectedPriceRange) count++;
        if (selectedRating && selectedRating !== 'all') count++;
        if (selectedSortBy) count++;
        setActiveFiltersCount(count);
    }, [selectedPriceRange, selectedRating, selectedSortBy]);
    

    const getProductsbyCategory = async (categoryId: string) => {
        setLoader(true);
        try {
            let response: any = await _HOME_SERVICE.get_product_category(categoryId);
            console.log(response, 'productttttttttttttresponse');
            const JSONcategory = await response.json();
            console.log(JSONcategory, 'JSONcategory');
            if (response.status == 200) {
                setSearchData(JSONcategory);
                setLoader(false);
            }
            else {
                setLoader(false);
                console.log("Error to fetch ", JSONcategory.status);
            }
        } catch (error) {
            setLoader(false);
            console.log("VENDOR PRODUCT BY CATEGORY DATA ERROR:", error);
        }
    };

    const applyFilters = () => {
        if (!searchData || searchData.length === 0) {
            setFilteredData([]);
            return;
        }

        let filtered = [...searchData];
        console.log('Original Data:', filtered.length);

        if (selectedPriceRange) {
            filtered = filtered.filter((item: any) => {
                const price = parseFloat(item?.variant_details?.price || item.selling_price || item?.variant_details?.mrp || 0);

                console.log(`Item price: ${price} for range: ${selectedPriceRange}`);

                switch (selectedPriceRange) {
                    case '0-500':
                        return price < 500;
                    case '500-1000':
                        return price >= 500 && price <= 1000;
                    case '1000-2000':
                        return price >= 1000 && price <= 2000;
                    case '2000+':
                        return price > 2000;
                    default:
                        return true;
                }
            });
            console.log('After price filter:', filtered.length);
        }

        if (selectedRating && selectedRating !== 'all') {
            const minRating = parseFloat(selectedRating.replace('+', ''));

            filtered = filtered.filter((item: any) => {
                const rating = parseFloat(item.rating || item.average_rating || item.star_rating || 0);
                console.log(`Item rating: ${rating} for min rating: ${minRating}`);
                return rating >= minRating;
            });
            console.log('After rating filter:', filtered.length);
        }

        if (selectedSortBy) {
            filtered.sort((a: any, b: any) => {
                switch (selectedSortBy) {
                    case 'price_asc':
                        const priceA = parseFloat(a?.variant_details?.price || a.selling_price || a?.variant_details?.mrp || 0);
                        const priceB = parseFloat(b?.variant_details?.price || b.selling_price || b?.variant_details?.mrp || 0);
                        return priceA - priceB;
                    case 'price_desc':
                        const priceA_desc = parseFloat(a?.variant_details?.price || a.selling_price || a?.variant_details?.mrp || 0);
                        const priceB_desc = parseFloat(b?.variant_details?.price || b.selling_price || b?.variant_details?.mrp || 0);
                        return priceB_desc - priceA_desc;
                    case 'rating_desc':
                        const ratingA = parseFloat(a.rating || a.average_rating || a.star_rating || 0);
                        const ratingB = parseFloat(b.rating || b.average_rating || b.star_rating || 0);
                        return ratingB - ratingA;
                    case 'newest':
                        const dateA = new Date(a.created_at || a.date_added || a.createdAt || 0).getTime();
                        const dateB = new Date(b.created_at || b.date_added || b.createdAt || 0).getTime();
                        return dateB - dateA;
                    case 'popular':
                        const popA = parseFloat(a.popularity || a.view_count || a.order_count || 0);
                        const popB = parseFloat(b.popularity || b.view_count || b.order_count || 0);
                        return popB - popA;
                    default:
                        return 0;
                }
            });
            console.log('After sorting:', selectedSortBy);
        }

        console.log('Final filtered data:', filtered.length);
        setFilteredData(filtered);
    };

    const clearAllFilters = () => {
        setSelectedPriceRange('');
        setSelectedRating('');
        setSelectedSortBy('');
    };

    const renderFilterSection = () => (
        <View style={styles.filterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setShowFilters(true)}
                >
                    <MaterialIcons name="filter-list" size={18} color={Colors.primaryColor} />
                    <Text style={styles.filterButtonText}>
                        Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                    </Text>
                </TouchableOpacity>

                {selectedPriceRange && (
                    <TouchableOpacity
                        style={styles.activeFilterChip}
                        onPress={() => setSelectedPriceRange('')}
                    >
                        <Text style={styles.activeFilterText}>
                            {priceRanges.find(p => p.value === selectedPriceRange)?.label}
                        </Text>
                        <MaterialIcons name="close" size={16} color={Colors.white} />
                    </TouchableOpacity>
                )}

                {selectedRating && selectedRating !== 'all' && (
                    <TouchableOpacity
                        style={styles.activeFilterChip}
                        onPress={() => setSelectedRating('')}
                    >
                        <Text style={styles.activeFilterText}>
                            {ratingOptions.find(r => r.value === selectedRating)?.label}
                        </Text>
                        <MaterialIcons name="close" size={16} color={Colors.white} />
                    </TouchableOpacity>
                )}

                {selectedSortBy && (
                    <TouchableOpacity
                        style={styles.activeFilterChip}
                        onPress={() => setSelectedSortBy('')}
                    >
                        <Text style={styles.activeFilterText}>
                            {sortOptions.find(s => s.value === selectedSortBy)?.label}
                        </Text>
                        <MaterialIcons name="close" size={16} color={Colors.white} />
                    </TouchableOpacity>
                )}

                {activeFiltersCount > 0 && (
                    <TouchableOpacity
                        style={styles.clearAllButton}
                        onPress={clearAllFilters}
                    >
                        <Text style={styles.clearAllText}>Clear All</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );

    const renderFilterModal = () => (
        <Modal
            visible={showFilters}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowFilters(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Filters</Text>
                        <TouchableOpacity onPress={() => setShowFilters(false)}>
                            <MaterialIcons name="close" size={24} color={Colors.black} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalBody}>
                        {/* Price Range */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterSectionTitle}>Price Range</Text>
                            {priceRanges.map((range) => (
                                <TouchableOpacity
                                    key={range.value}
                                    style={[
                                        styles.filterOption,
                                        selectedPriceRange === range.value && styles.selectedFilterOption
                                    ]}
                                    onPress={() => setSelectedPriceRange(
                                        selectedPriceRange === range.value ? '' : range.value
                                    )}
                                >
                                    <Text style={[
                                        styles.filterOptionText,
                                        selectedPriceRange === range.value && styles.selectedFilterOptionText
                                    ]}>
                                        {range.label}
                                    </Text>
                                    {selectedPriceRange === range.value && (
                                        <MaterialIcons name="check" size={20} color={Colors.primaryColor} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.filterSection}>
                            <Text style={styles.filterSectionTitle}>Customer Rating</Text>
                            {ratingOptions.map((rating) => (
                                <TouchableOpacity
                                    key={rating.value}
                                    style={[
                                        styles.filterOption,
                                        selectedRating === rating.value && styles.selectedFilterOption
                                    ]}
                                    onPress={() => setSelectedRating(
                                        selectedRating === rating.value ? '' : rating.value
                                    )}
                                >
                                    <Text style={[
                                        styles.filterOptionText,
                                        selectedRating === rating.value && styles.selectedFilterOptionText
                                    ]}>
                                        {rating.label}
                                    </Text>
                                    {selectedRating === rating.value && (
                                        <MaterialIcons name="check" size={20} color={Colors.primaryColor} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.filterSection}>
                            <Text style={styles.filterSectionTitle}>Sort By</Text>
                            {sortOptions.map((sort) => (
                                <TouchableOpacity
                                    key={sort.value}
                                    style={[
                                        styles.filterOption,
                                        selectedSortBy === sort.value && styles.selectedFilterOption
                                    ]}
                                    onPress={() => setSelectedSortBy(
                                        selectedSortBy === sort.value ? '' : sort.value
                                    )}
                                >
                                    <Text style={[
                                        styles.filterOptionText,
                                        selectedSortBy === sort.value && styles.selectedFilterOptionText
                                    ]}>
                                        {sort.label}
                                    </Text>
                                    {selectedSortBy === sort.value && (
                                        <MaterialIcons name="check" size={20} color={Colors.primaryColor} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={clearAllFilters}
                        >
                            <Text style={styles.clearButtonText}>Clear All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.applyButton}
                            onPress={() => setShowFilters(false)}
                        >
                            <Text style={styles.applyButtonText}>Apply Filters</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgGrayColor }}>
            <StatusBar backgroundColor={Colors.primaryColor} barStyle={'light-content'} />

            <LinearGradient
                colors={['#466425', '#71A33F']}
                style={styles.header}>
                <HeaderSearch title='Product Detail' navigation={props.navigation} />
            </LinearGradient>

            {renderFilterSection()}

            <ScrollView style={styles.container}>
                {loader ? (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size={'large'} color={Colors.primaryColor} />
                    </View>
                ) : (
                    <>

                        <View style={styles.resultsHeader}>
                            <Text style={styles.resultsText}>
                                {filteredData.length > 0 ? filteredData.length : searchData.length} Products Found
                                {activeFiltersCount > 0 && ` (${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} applied)`}
                            </Text>
                        </View>

                        <ProductCard
                            title={category?.name}
                            navigation={props.navigation}
                            PropsData={filteredData.length > 0 || activeFiltersCount > 0 ? filteredData : searchData}
                            flag={"search"}
                        />
                    </>
                )}
            </ScrollView>

            {renderFilterModal()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#71A33F',
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 10
    },
    container: {
        padding: 5,
        marginTop: 2,
        marginBottom: 10,
        flex: 1
    },


    resultsHeader: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: Colors.white,
        borderRadius: 8,
        marginBottom: 10,
    },
    resultsText: {
        fontSize: 14,
        color: Colors.black,
        fontFamily: Fonts.PoppinsMedium,
    },


    filterContainer: {
        backgroundColor: Colors.white,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.bgGrayColor,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.bgGrayColor,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    filterButtonText: {
        marginLeft: 5,
        fontSize: 14,
        color: Colors.primaryColor,
        fontFamily: Fonts.PoppinsMedium,
    },
    activeFilterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primaryColor,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    activeFilterText: {
        color: Colors.white,
        fontSize: 12,
        marginRight: 5,
        fontFamily: Fonts.PoppinsMedium,
    },
    clearAllButton: {
        backgroundColor: Colors.errorColor,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    clearAllText: {
        color: Colors.white,
        fontSize: 12,
        fontFamily: Fonts.PoppinsMedium,
    },


    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '80%'
    },

    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.bgGrayColor,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: Fonts.PoppinsBlack,
        color: Colors.black,
    },
    modalBody: {
        flex: 1,
        padding: 20,
    },
    filterSection: {
        marginBottom: 25,
    },
    filterSectionTitle: {
        fontSize: 16,
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.black,
        marginBottom: 15,
    },
    filterOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginBottom: 8,
        borderRadius: 8,
        backgroundColor: Colors.bgGrayColor,
    },
    selectedFilterOption: {
        backgroundColor: Colors.primaryColor + '20',
        borderWidth: 1,
        borderColor: Colors.primaryColor,
    },
    filterOptionText: {
        fontSize: 14,
        color: Colors.black,
        fontFamily: Fonts.PoppinsRegular,
    },
    selectedFilterOptionText: {
        color: Colors.primaryColor,
        fontFamily: Fonts.PoppinsMedium,
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.bgGrayColor,
    },
    clearButton: {
        flex: 1,
        backgroundColor: Colors.bgGrayColor,
        paddingVertical: 12,
        borderRadius: 8,
        marginRight: 10,
        alignItems: 'center',
    },
    clearButtonText: {
        color: Colors.black,
        fontSize: 14,
        fontFamily: Fonts.PoppinsMedium,
    },
    applyButton: {
        flex: 1,
        backgroundColor: Colors.primaryColor,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    applyButtonText: {
        color: Colors.white,
        fontSize: 14,
        fontFamily: Fonts.PoppinsMedium,
    },

});

export default Search;