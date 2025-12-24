import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, ScrollView, TextInput } from 'react-native';
import { Colors } from '../../common/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDebouncedValue } from '../../hooks/useDebaunce';
import { Fonts } from '../../common/Fonts';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import *as _HOME_SERVICE from '../../services/HomeServices';
import ProductCard from '../../component/ProductCard';
import { ProductSkeleton } from '../../Skeleton/CardSkeleton';

const ProductSearch = (props: any) => {
    const [searchText, setSearchText] = useState<string>('');
    const [searchData, setSearchData] = useState([]);
    const [BestSeller, setBestSeller] = useState([]);
    const [TopNutrition, setTopNutrition] = useState([]);


    const [originalSearchData, setOriginalSearchData] = useState([]);
    const [originalBestSeller, setOriginalBestSeller] = useState([]);
    const [originalTopNutrition, setOriginalTopNutrition] = useState([]);

    const [loader, setLoader] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const debouncedSearchText = useDebouncedValue(searchText, 300);
    const { categoryId } = props.route.params || {};

    const [categoryLoading, setCategoryLoading] = useState(true);
    const [bestSellerLoading, setBestSellerLoading] = useState(true);
    const [nutritionLoading, setNutritionLoading] = useState(true);

    useEffect(() => {
        loadAllData();
    }, [categoryId]);




    const loadAllData = async () => {
        setLoader(true);
        try {
            await Promise.all([
                getVendorProduct(),
                getBestSeller(),
                getTopNutrition()
            ]);
        } catch (error) {
            console.log("Error loading all data:", error);
        } finally {
            setLoader(false);
        }
    };


    useEffect(() => {
        if (debouncedSearchText.trim()) {
            performLocalSearch(debouncedSearchText);
        } else {
            resetToOriginalData();
        }
    }, [debouncedSearchText]);



    const getVendorProduct = async () => {
        setCategoryLoading(true);
        try {
            const response: any = await _HOME_SERVICE.getVendorProduct();
            const json = await response?.json();

            if (response?.ok) {
                setSearchData(json?.data ?? []);
                setOriginalSearchData(json?.data ?? []);
            } else {
                setSearchData([]);
                setOriginalSearchData([]);
            }
        } catch (error) {
            console.log('CATEGORY ERROR:', error);
            setSearchData([]);

            setOriginalSearchData([]);
        } finally {
            setCategoryLoading(false);
        }
    };


    const getBestSeller = async () => {
        setBestSellerLoading(true);
        try {
            const response: any = await _HOME_SERVICE.getBestSellerProduct();
            setBestSeller(response ?? []);
            setOriginalBestSeller(response ?? []);
        } catch (error) {
            console.log('BEST SELLER ERROR:', error);
            setBestSeller([]);
            setOriginalBestSeller([]);
        } finally {
            setBestSellerLoading(false);
        }
    };


    const getTopNutrition = async () => {
        setNutritionLoading(true);
        try {
            const response: any = await _HOME_SERVICE.getVendorProduct();
            const json = await response?.json();

            if (response?.ok) {
                setTopNutrition(json?.data ?? []);
                setOriginalTopNutrition(json?.data ?? []);
            } else {
                setTopNutrition([]);
                setOriginalTopNutrition([]);
            }
        } catch (error) {
            console.log('TOP NUTRITION ERROR:', error);
            setTopNutrition([]);
            setOriginalTopNutrition([]);
        } finally {
            setNutritionLoading(false);
        }
    };



    const performLocalSearch = (query: string) => {
        setIsSearching(true);

        const searchQuery = query.toLowerCase().trim();
        const filteredSearchData = originalSearchData.filter((item: any) =>
            item.title?.toLowerCase().includes(searchQuery)
            // item.description?.toLowerCase().includes(searchQuery) ||
            // item.category?.toLowerCase().includes(searchQuery) ||
            // item.brand?.toLowerCase().includes(searchQuery)
        );

        // Search in Best Seller Products
        const filteredBestSeller = originalBestSeller.filter((item: any) =>
            item.title?.toLowerCase().includes(searchQuery) ||
            // item.description?.toLowerCase().includes(searchQuery) ||
            item.category?.name?.toLowerCase().includes(searchQuery)
            // item.brand?.toLowerCase().includes(searchQuery)
        );

        // Search in Top Nutrition Products
        const filteredTopNutrition = originalTopNutrition.filter((item: any) =>
            item.title?.toLowerCase().includes(searchQuery) ||
            // item.description?.toLowerCase().includes(searchQuery) ||
            item.category?.name?.toLowerCase().includes(searchQuery)
            // item.brand?.toLowerCase().includes(searchQuery)
        );

        // Update filtered data
        setSearchData(filteredSearchData);
        setBestSeller(filteredBestSeller);
        setTopNutrition(filteredTopNutrition);
        setIsSearching(false);

    };

    const resetToOriginalData = () => {
        setSearchData(originalSearchData);
        setBestSeller(originalBestSeller);
        setTopNutrition(originalTopNutrition);
    };


    const handleSearchTextChange = (text: string) => {
        setSearchText(text);
    };

    const shouldShowNoResults = () => {
        const totalProducts = searchData.length + BestSeller.length + TopNutrition.length;
        return (searchText.trim() && totalProducts === 0) || (!searchText.trim() && totalProducts === 0 && !loader);
    };


    const getNoResultsMessage = () => {
        if (searchText.trim()) {
            return {
                title: `No products found for "${searchText}"`,
                subtitle: "Try different keywords or check spelling"
            };
        } else {
            return {
                title: "No products available",
                subtitle: "Please check back later or try refreshing"
            };
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <StatusBar backgroundColor={Colors.primaryColor} barStyle={'light-content'} />

            <LinearGradient style={styles.searchRow} colors={[Colors.primaryColor, Colors.secondaryColor]}>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => props.navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                <TextInput
                    style={styles.textInput}
                    placeholder={"Search for Product"}
                    placeholderTextColor="#999"
                    value={searchText}
                    onChangeText={handleSearchTextChange}
                    returnKeyType="search"
                />
            </LinearGradient>

            {/* {loader ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size={'large'} color={Colors.primaryColor} />
                    <Text style={styles.loadingText}>Loading products...</Text>
                </View>
            ) : ( */}

            <ScrollView style={{ flex: 1, backgroundColor: '#FFFFFF' }}
                contentContainerStyle={{ padding: 5, paddingBottom: 20 }}>
                <>
                    {isSearching && (
                        <View style={styles.searchingContainer}>
                            <ActivityIndicator size="small" color={Colors.primaryColor} />
                            <Text style={styles.searchingText}>Searching...</Text>
                        </View>
                    )}

                    {searchText.trim() && (searchData.length > 0 || BestSeller.length > 0 || TopNutrition.length > 0) && (
                        <View style={styles.resultCountContainer}>
                            <Text style={styles.resultCountText}>
                                Search results for "{searchText}"
                            </Text>
                            <Text style={styles.totalResultsText}>
                                Total: {searchData.length + BestSeller.length + TopNutrition.length} products
                            </Text>
                        </View>
                    )}

                    {categoryLoading ? (
                        <View style={{ backgroundColor: '#FFFFFF' }}>
                            <ProductSkeleton />
                        </View>
                    ) : (
                        searchData.length > 0) ? (
                        <ProductCard
                            title={searchText ? 'Healthcare Products Results:' : 'Healthcare Essential Products:'}
                            navigation={props.navigation}
                            PropsData={searchData}
                            flag='search'
                        />) : null
                    }


                    {bestSellerLoading ? (
                        <View style={{ backgroundColor: '#FFFFFF' }}>
                            <ProductSkeleton /> </View>) : (
                                BestSeller?.length > 0) ? (
                        <ProductCard
                            title={searchText ? 'Best Seller Results:' : 'Best Selling Products:'}
                            navigation={props.navigation}
                            PropsData={BestSeller}
                            flag='search'
                        />) : null
                    }

                    {nutritionLoading ? (
                        <View style={{ backgroundColor: '#FFFFFF' }}>
                            <ProductSkeleton />  </View>) : (
                                TopNutrition.length > 0) ? (
                        <ProductCard
                            title={searchText ? 'Top Nutrition Results:' : 'Top Nutrition Products:'}
                            navigation={props.navigation}
                            PropsData={TopNutrition}
                            flag='search'
                        />) : null
                    }

                    {shouldShowNoResults() && (
                        <View style={styles.noResultsContainer}>
                            <MaterialIcons
                                name={searchText.trim() ? "search-off" : "inventory-2"}
                                size={50}
                                color={Colors.primaryColor}
                            />
                            <Text style={styles.noResultsText}>
                                {getNoResultsMessage().title}
                            </Text>
                            <Text style={styles.noResultsSubText}>
                                {getNoResultsMessage().subtitle}
                            </Text>
                        </View>
                    )}
                </>
            </ScrollView>
            
            {/* )} */}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({


    searchRow: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 10,
        alignItems: 'center',
        gap: 10,
    },
    backButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: Colors.bgcolor,
        // paddingVertical: 0,
    },

    container: {
        padding: 5,
        backgroundColor: '#FFFFFF',
        // marginTop: 2,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: Colors.black,
        fontFamily: Fonts.PoppinsMedium,
    },
    searchingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    searchingText: {
        marginLeft: 10,
        fontSize: 14,
        color: Colors.primaryColor,
        fontFamily: Fonts.PoppinsMedium,
    },
    resultCountContainer: {
        padding: 15,
        backgroundColor: 'white',
        marginHorizontal: 5,
        marginBottom: 10,
        borderRadius: 8,
        elevation: 2,
    },
    resultCountText: {
        fontSize: 16,
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.textColor,
        marginBottom: 5,
    },
    totalResultsText: {
        fontSize: 14,
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.primaryColor,
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    noResultsText: {
        fontSize: 18,
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.textColor,
        marginTop: 15,
        textAlign: 'center',
    },
    noResultsSubText: {
        fontSize: 14,
        fontFamily: Fonts.PoppinsRegular,
        color: Colors.greyBorder,
        marginTop: 5,
        textAlign: 'center',
    },
});

export default ProductSearch;