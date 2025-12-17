import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Image,
    StatusBar,
    RefreshControl,
} from 'react-native';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import SearchBar from '../../component/SearchBar';
import LinearGradient from 'react-native-linear-gradient';
import { Images } from '../../common/Images';
import { Colors } from '../../common/Colors';
import CategoryPage from '../home/CategoryPage';
import ProductCard from '../../component/ProductCard';
import { NavigationProp, useIsFocused, useNavigation } from '@react-navigation/native';
import *as _HOME_SERVICE from '../../services/HomeServices';
import { CategorySkeleton, ProductSkeleton } from '../../Skeleton/CardSkeleton';



interface ShopPageProps {
    navigation: NavigationProp<any>;
}

const ShopPage: React.FC<ShopPageProps> = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const isFocused = useIsFocused();

    const [refreshing, setRefreshing] = useState(false);

    const [categorieData, setCategoryData] = useState([]);
    const [EssentialsData, setEssentialsData] = useState([])
    const [SellingProduct, setSellingProduct] = useState([])
    const [TopNutrician, setTopNutrician] = useState([])
    const [HealthConcern, setHealthConcern] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const [loadingVendor, setLoadingVendor] = useState(true);
    const [loadingBest, setLoadingBest] = useState(true);
    const [loadingHealth, setLoadingHealth] = useState(true);
    const [loadingCategory, setLoadingCategory] = useState(true)

    // const fetchAllData = useCallback(async () => {
    //     setIsLoading(true);
    //     try {
    //         const [
    //             vendor,
    //             bestSelling,
    //             healthCategory,
    //             productCategory
    //         ] = await Promise.all([
    //             _HOME_SERVICE.getVendorProduct(),
    //             _HOME_SERVICE.getBestSellerProduct(),
    //             _HOME_SERVICE.get_health_category(),
    //             _HOME_SERVICE.get_shop_category()
    //         ]) as [
    //                 Response,
    //                 Response,
    //                 Response,
    //                 Response
    //             ];;

    //         const vendorJson = await vendor.json();
    //         setEssentialsData(vendorJson.data);
    //         setTopNutrician(vendorJson.data);
    //         setHealthConcern(await healthCategory?.json());
    //         setCategoryData(await productCategory.json());
    //         setSellingProduct(await bestSelling?.json());

    //     } catch (err) {
    //         console.log("🔥 FETCH ERROR: ", err);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }, []);




    const fetchAllData = useCallback(async () => {
        // setIsLoading(true);

        _HOME_SERVICE.getVendorProduct()
            .then((res: any) => res.json())
            .then(json => {
                setEssentialsData(json.data);
                setTopNutrician(json.data);
            })
            .catch(err => console.log("Vendor Error", err))
            .finally(() => setLoadingVendor(false));

        _HOME_SERVICE.get_shop_category()
            .then((res: any) => res.json())
            .then(json => setCategoryData(json))
            .catch(err => console.log("Category Error", err))
            .finally(() => setLoadingCategory(false));

        _HOME_SERVICE.get_health_category()
            .then((res: any) => res.json())
            .then(json => setHealthConcern(json))
            .catch(err => console.log("Health Error", err))
            .finally(() => setLoadingHealth(false));

        _HOME_SERVICE.getBestSellerProduct()
            .then((res: any) => res.json())
            // .then(json =>  console.log("Best Selling JSON", json))
            .then(json => setSellingProduct(json))
            .catch(err => console.log("Best Selling Error", err))
            .finally(() => setLoadingBest(false));

        setIsLoading(false);
    }, []);



    useEffect(() => {
        if (isFocused) {
            fetchAllData();
        }
    }, [isFocused, fetchAllData]);


    const onRefresh = async () => {
        setRefreshing(true);
        await fetchAllData();
        setRefreshing(false);
    };


    // const searchProducts = async (query: string) => {
    //     if (!query.trim()) {
    //         setShowSearchResults(false);
    //         return;
    //     }

    //     setIsSearching(true);

    //     try {

    //         let response: any = await _HOME_SERVICE.getProductsSearch(query);
    //         if (response.status_code == 200) {
    //             setSearchResults(response.products || []);
    //             setShowSearchResults(true);
    //         } else {
    //             setSearchResults([]);
    //             setShowSearchResults(true);
    //         }
    //     } catch (error) {
    //         console.log("SEARCH ERROR:", error);
    //         setSearchResults([]);
    //         setShowSearchResults(true);
    //     } finally {
    //         setIsSearching(false);
    //     }
    // };

    // const handleSearch = (text: string) => {
    //     setSearchQuery(text);
    //     if (text.trim()) {
    //         setTimeout(() => {
    //             if (text === searchQuery) {
    //                 searchProducts(text);
    //             }
    //         }, 500);
    //     } else {
    //         setShowSearchResults(false);
    //         setSearchResults([]);
    //     }
    // };



    const clearSearch = () => {
        setSearchQuery('');
        setShowSearchResults(false);
        setSearchResults([]);
    };

    const Prescription = () => (
        <View style={styles.prescriptionButton}>
            <Image source={Images.prescription} style={styles.presIcon} />
            <Text style={styles.presText}>Order with Prescription</Text>

            <LinearGradient
                colors={[Colors.secondaryColor, Colors.primaryColor]}
                style={styles.orderNow}>
                <TouchableOpacity onPress={() => navigation.navigate('CartScreen')}>
                    <Text style={styles.orderNowText}>Order now</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );


    const MainContent = () => (
        <>
            <Image source={Images.homebanner} style={styles.banner} resizeMode='contain' />

            <Prescription />

            {loadingCategory ?
                <CategorySkeleton /> : categorieData?.length > 0 ?

                    <CategoryPage
                        title="Shop by Categories:"
                        categories={categorieData}
                        navigation={navigation}
                    /> : null
            }

            {
                loadingVendor
                    ? <ProductSkeleton />
                    : EssentialsData?.length > 0
                        ? <ProductCard
                            title="Healthcare Essentials:"
                            navigation={navigation}
                            PropsData={EssentialsData}
                        />
                        : null
            }


            <Image source={Images.homebanner} style={styles.banner} resizeMode='contain' />


            {loadingHealth ?
                <CategorySkeleton /> :

                HealthConcern?.length > 0 ?
                    <CategoryPage
                        title="Shop by health concern:"
                        categories={HealthConcern}
                        navigation={navigation}
                    /> : null
            }

            {loadingBest ? <ProductSkeleton /> : SellingProduct?.length > 0 ?
                <ProductCard title="Best Selling Products:" navigation={navigation} PropsData={SellingProduct} /> : null
            }

            {loadingVendor ? <ProductSkeleton /> : TopNutrician?.length > 0 ?
                <ProductCard title="Top Nutrition Products:" navigation={navigation} PropsData={TopNutrician} /> : null
            }
        </>
    );

    const SearchResults = () => (
        <View style={styles.searchContainer}>
            <View style={styles.searchHeader}>
                <Text style={styles.searchHeaderText}>
                    Search Results for "{searchQuery}" ({searchResults.length} found)
                </Text>
                <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                    <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
            </View>

            {searchResults.length > 0 ? (
                <ProductCard
                    title=''
                    navigation={navigation}
                    PropsData={searchResults}
                />
            ) : (
                <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>No products found</Text>
                    <Text style={styles.noResultsSubText}>Try searching with different keywords</Text>
                </View>
            )}
        </View>
    );



    return (

        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#466425" barStyle="light-content" />

            <LinearGradient colors={['#466425', '#71A33F']} style={styles.header}>
                <SearchBar
                    placeholder="Search for products"
                    // onSearch={handleSearch}
                    // onChangeText={handleSearch}
                    value={searchQuery}
                    showVoiceIcon={false}
                />
            </LinearGradient>
            {/* 
            {isLoading ? (
                //   <Loader />
                <ScrollView style={styles.body}>
                    <MainSkeleton />
                </ScrollView>
            ) : ( */}
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            } showsVerticalScrollIndicator={false} style={styles.body}>
                {showSearchResults ? <SearchResults /> :
                    <MainContent />
                }
            </ScrollView>
            {/* )} */}
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    body: { paddingHorizontal: 10 },

    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 15,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },


    header: {
        backgroundColor: '#71A33F',
        paddingHorizontal: 20,
        paddingBottom: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },

    section: { marginBottom: 20 },
    // header:{ width:160, height:18, marginBottom:12 },
    row: { flexDirection: "row" },
    item: { alignItems: "center", marginRight: 14 },
    circle: { width: 70, height: 70, borderRadius: 50 },
    label: { width: 50, height: 10, marginTop: 6, borderRadius: 5 },
    bannerContainer: {
        marginBottom: 10,
        marginTop: 10,
    },

    prescriptionButton: {
        backgroundColor: '#71A33F26',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    presIcon: { width: 18, height: 24 },
    presText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
    },
    orderNow: {
        paddingHorizontal: 14,
        height: 36,
        justifyContent: 'center',
        borderRadius: 10,
    },
    orderNowText: {
        color: '#FFF',
        fontWeight: '600',
    },
    banner: {
        height: 200,
        width: '100%',
        borderRadius: 16,
        marginVertical: 12,
    },
    prescriptionText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginLeft: 12,
    },
    orderNowButton: {
        borderRadius: 10,
        height: 35,
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingVertical: 5,
    },


    searchContainer: {
        flex: 1,
        marginTop: 10,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingVertical: 0,
    },
    iconstyle: {
        height: 17,
        width: 17,
    },
    voiceIconContainer: {
        marginLeft: 12,
    },
    searchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingHorizontal: 5,
    },
    searchHeaderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    clearButton: {
        backgroundColor: '#71A33F',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
    },
    clearButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    noResultsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
    },
    noResultsText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    noResultsSubText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },

})

export default ShopPage