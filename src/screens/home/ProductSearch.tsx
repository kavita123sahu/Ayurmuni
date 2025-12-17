import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image, StatusBar, ScrollView, TextInput } from 'react-native';
import { Colors } from '../../common/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDebouncedValue } from '../../hooks/useDebaunce';
import { Fonts } from '../../common/Fonts';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import *as _HOME_SERVICE from '../../services/HomeServices';
import ProductCard from '../../component/ProductCard';

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

    
    useEffect(() => {
        loadAllData();
    }, [categoryId]);


    useEffect(() => {
        if (debouncedSearchText.trim()) {
            performLocalSearch(debouncedSearchText);
        } else {
            resetToOriginalData();
        }
    }, [debouncedSearchText]);



    const loadAllData = async () => {
        setLoader(true);
        try {
            await Promise.all([
                getProductsbyCategory(),
                getBestSeller(),
                getTopNutrition() 
            ]);
        } catch (error) {
            console.log("Error loading all data:", error);
        } finally {
            setLoader(false);
        }
    };

    const getProductsbyCategory = async () => {
        try {

            let response: any = await _HOME_SERVICE.getVendorProduct();
            console.log(response, 'productttttttttttttresponse');
            const JSONcategory = await response?.json();
            console.log(JSONcategory, 'JSONcategory');
            if (response.ok === true) {
                setLoader(false)
                setSearchData(JSONcategory.data || []);
                setOriginalSearchData(JSONcategory.data || []); // Backup original data
            } else {
                console.log("Error to fetch ", JSONcategory.status);
                setSearchData([]);
                setLoader(false)
                setOriginalSearchData([]);
            }
        } catch (error) {
            console.log("VENDOR PRODUCT BY CATEGORY DATA ERROR:", error);
            setSearchData([]);
            setLoader(false)
            setOriginalSearchData([]);
        }
    };

    const getBestSeller = async () => {
        try {
            let response: any = await _HOME_SERVICE.getBestSellerProduct();
            console.log(response, 'bestseller');
            setLoader(false)
            setBestSeller(response || []);

            setOriginalBestSeller(response || []);
        } catch (error) {

            setLoader(false)
            console.log("BEST SELLER DATA ERROR:", error);
            setBestSeller([]);
            setOriginalBestSeller([]);
        }
    };

    const getTopNutrition = async () => {
        try {

            let response: any = await _HOME_SERVICE.getVendorProduct(); 
            const JSONdata = await response?.json();
            console.log(JSONdata, 'topnutrition');
            if (response.ok === true) {
                setLoader(false)
                setTopNutrition(JSONdata.data || []);
                setOriginalTopNutrition(JSONdata.data || []);
            } else {
                setTopNutrition([]);
                setLoader(false)
                setOriginalTopNutrition([]);
            }
        } catch (error) {
            console.log("TOP NUTRITION DATA ERROR:", error);
            setTopNutrition([]);
            setLoader(false)
            setOriginalTopNutrition([]);
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
        <SafeAreaView style={{ flex: 1, }}>
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

            {loader ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size={'large'} color={Colors.primaryColor} />
                    <Text style={styles.loadingText}>Loading products...</Text>
                </View>
            ) : (
                <ScrollView style={styles.container}>
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

                    {/* Healthcare Essential Products */}
                    {searchData.length > 0 && (
                        <ProductCard
                            title={searchText ? 'Healthcare Products Results:' : 'Healthcare Essential Products:'}
                            navigation={props.navigation}
                            PropsData={searchData}
                            flag='search'
                        />
                    )}

                    {/* Best Selling Products */}
                    {BestSeller?.length > 0 && (
                        <ProductCard
                            title={searchText ? 'Best Seller Results:' : 'Best Selling Products:'}
                            navigation={props.navigation}
                            PropsData={BestSeller}
                            flag='search'
                        />
                    )}

                    {/* Top Nutrition Products */}
                    {TopNutrition.length > 0 && (
                        <ProductCard
                            title={searchText ? 'Top Nutrition Results:' : 'Top Nutrition Products:'}
                            navigation={props.navigation}
                            PropsData={TopNutrition}
                            flag='search'
                        />
                    )}

                    {/* Show No Results Message */}
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

            )}
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
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: Colors.primaryColor,
    },
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
    searchBar: {
        backgroundColor: 'white',
        borderRadius: 25,
        paddingHorizontal: 20,
    },
    textStroke: {
        textShadowColor: 'black',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 1,
        color: 'white'
    },
    imageContainer: {
        width: '100%',
        height: 180,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        backgroundColor: 'white',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    container: {
        padding: 5,
        marginTop: 2,
        marginBottom: 10
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