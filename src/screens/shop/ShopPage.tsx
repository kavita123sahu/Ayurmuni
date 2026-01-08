import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, StatusBar, RefreshControl, } from 'react-native';
import SearchBar from '../../component/SearchBar';
import LinearGradient from 'react-native-linear-gradient';
import { Images } from '../../common/Images';
import { Colors } from '../../common/Colors';
import CategoryPage from '../home/CategoryPage';
import ProductCard from '../../component/ProductCard';
import { NavigationProp, useIsFocused, } from '@react-navigation/native';
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

    const [loadingVendor, setLoadingVendor] = useState(true);
    const [loadingBest, setLoadingBest] = useState(true);
    const [loadingHealth, setLoadingHealth] = useState(true);
    const [loadingCategory, setLoadingCategory] = useState(true)


    const fetchAllData = useCallback(async () => {
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
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <Image source={Images.homebanner} style={styles.banner} resizeMode='contain' />

            <Prescription />

            {loadingCategory ?
                <CategorySkeleton />
                : categorieData?.length > 0 ?

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
                            flag='search'
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
                <ProductCard title="Best Selling Products:" flag='search' navigation={navigation} PropsData={SellingProduct} /> : null
            }

            {loadingVendor ? <ProductSkeleton /> : TopNutrician?.length > 0 ?
                <ProductCard title="Top Nutrition Products:" flag='search' navigation={navigation} PropsData={TopNutrician} /> : null
            }
        </View>
    );




    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#466425" barStyle="light-content" />

            <LinearGradient colors={['#466425', '#71A33F']} style={styles.header}>
                <SearchBar
                    placeholder="Search for products"
                    value={searchQuery}
                    showVoiceIcon={false}
                />
            </LinearGradient>

            <ScrollView  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} showsVerticalScrollIndicator={false}
            
             style={{ flex: 1, backgroundColor: '#FFFFFF' }}
  contentContainerStyle={{
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  }}
             >

                <MainContent />

            </ScrollView>

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    body: {
        backgroundColor: '#ffffff',
        marginTop: 2,
        marginBottom: 10,
        paddingHorizontal: 5

    },

    header: {
        backgroundColor: '#71A33F',
        paddingHorizontal: 20,
        paddingBottom: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
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


})

export default ShopPage