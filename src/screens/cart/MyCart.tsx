import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Dimensions, StatusBar } from 'react-native';
import { Colors } from '../../common/Colors';
import { useIsFocused } from '@react-navigation/native';
import { BaseUrl } from '../../config/Key';
import { Utils } from '../../common/Utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Fonts } from '../../common/Fonts';
import { useDispatch, useSelector } from 'react-redux';
import LottieView from 'lottie-react-native';
import *as _CART_SERVICE from '../../services/CartService';
import Toast from 'react-native-toast-message';
import Header from '../../component/Header';

const MyCart = (props: any) => {
    const screenWidth = Dimensions.get('window').width;
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const { navigation } = props;
    const [CartlistData, setCartlistData] = useState<any>([]);
    const [loader, setLoader] = useState(true);
    const [isRemoved, setIsRemoved] = useState(false);
    const [itemId, setItemId] = useState(Number);
    const [isToken, setIsToken] = useState(true);

    const [btnLoader, setBtnLoader] = useState(false);
    const [removeLoader, setRemoveLoader] = useState(false);


    const cart_Data = useSelector((state: any) => {
        return state.CartAddedReducer?.isAddedToCart;
    })


    useEffect(() => {
       
        if (cart_Data === true) {
           getUserDetail()
        }
    }, [isFocused, cart_Data])




    const getUserDetail = async () => {

        try {
            const _USER_INFO = await Utils.getData('_USER_INFO');
            const CUSTOMER_ID = await Utils.getData('_CUSTOMER_ID');

            console.log('_USER_INFO', _USER_INFO, 'CUSTOMER_ID', CUSTOMER_ID);

            getCartList(_USER_INFO?.id || CUSTOMER_ID)
            // setcustomerID(_USER_INFO?.id || CUSTOMER_ID);

        } catch (error) {
            console.log(error);
        }
    }

    
    const onCardPress = (id: any) => {
        props.navigation.navigate('ProductDetails', { productID: id })
    }


    const onClickRegister = () => {
        props.navigation.replace('AuthStack', { screen: 'Login' })
    }

    // Add your missing functions here
    const getCartList = async (customerID: string) => {
        setLoader(true);
        try {
            const token = await Utils.getData('_TOKEN');

            if (token) {
                setIsToken(true);
                const result: any = await _CART_SERVICE.get_cart_list(customerID);
                const JSONCart = await result.json();
                const { status } = result;
                if (status === 200) {
                    setCartlistData(JSONCart);
                    setLoader(false);
                } else {
                    setLoader(false);
                }
            } else {
                setLoader(false);
                setIsToken(false);
            }
        }
        catch (error) {
            console.log(error);
            setLoader(false);
        }
    }

    const removeWhishlist = (productId: any) => {
        // Your remove wishlist logic
    }

    const addToCart = (productId: any) => {
        // Your add to cart logic
    }


    const renderCartItem = ({ item }: { item: any }) => {
        let { product, product_id, id } = item;

        return (
            <TouchableOpacity onPress={() => onCardPress(product_id)} style={styles.wishlistItem}>
                <Image source={{ uri: BaseUrl.base + 'public/' + product?.thumbnail_img }} style={styles.coverImage} />
                <View style={styles.itemInfo}>
                    <Text numberOfLines={1} style={styles.bookTitle}>{product?.name}</Text>
                    <Text style={styles.bookAuthor}>{product?.author}</Text>
                    {/* Price Container - Converted from Tailwind */}
                    <View style={styles.priceContainer}>
                        <Text style={styles.discountedPrice}>₹{product?.discounted_price?.toFixed(2)}</Text>
                        <Text style={styles.originalPrice}>₹{product?.unit_price}</Text>
                        <Text style={styles.discountPercentage}>{product?.discount}%</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => removeWhishlist(product_id)} style={styles.removeButton}>
                            <Text style={styles.removeButtonText}>
                                {removeLoader && (itemId === item.id) ? 'Removing...' : 'Remove'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => addToCart(product_id)} style={styles.addToCartButton}>
                            <Text style={styles.addToCartButtonText}>
                                {btnLoader && (itemId === item.product_id) ? 'Adding...' : 'Add to Cart'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const emptyList = () => {
        return (
            <View>
                <Text>No book in your whishlist as of now</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>

            <StatusBar backgroundColor="#466425" barStyle="light-content" />
            <Header title='My Cart' navigation={navigation} Is_Tab={false} />
            {/* <CommonHeader title='My Wishlist' navigation={navigation} isCartIcon={true} /> */}

            {!isToken ? (
                <View style={styles.loginRequiredContainer}>
                    <Text style={styles.loginRequiredText}>
                        Please login to see your Cart
                    </Text>
                    <LottieView
                        source={require('../../assets/animations/Errorfound.json')}
                        autoPlay
                        loop
                        style={{ width: screenWidth <= 180 ? 100 : 200, height: screenWidth <= 180 ? 100 : 200 }}
                    />
                    <Text onPress={onClickRegister} style={styles.loginLinkText}>
                        Click here to login
                    </Text>
                </View>
            ) :
                // loader ? (
                //     <View style={styles.loadingContainer}>
                //         <ActivityIndicator size={'large'} color={Colors.primaryColor} />
                //     </View>
                // ) :

                CartlistData.length > 0 ? (
                    <FlatList
                        data={CartlistData}
                        renderItem={renderCartItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.cartlistContainer}
                    />
                ) : (
                    <View style={[styles.emptyWishlist, { marginBottom: '20%' }]}>
                        {/* Add your LottieView component */}
                        <LottieView
                            source={require('../../assets/animations/emptycart.json')}
                            autoPlay
                            loop
                            style={{ width: screenWidth <= 360 ? 200 : 400, height: screenWidth <= 360 ? 200 : 400 }}
                        />
                        <Text style={styles.emptyWishlistText}>Your cart is empty</Text>
                        <TouchableOpacity
                            onPress={() => navigation.replace('TabStack', { screen: 'Shop' })}
                            style={styles.browseButton}
                        >
                            <Text style={styles.browseButtonText}>Browse Products</Text>
                        </TouchableOpacity>

                    </View>
                )}


        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    cartlistContainer: {
        padding: 16,
    },
    wishlistItem: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.borderColor
    },
    coverImage: {
        width: 80,
        height: 120,
        borderRadius: 4,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 16,
    },
    bookTitle: {
        fontSize: 18,
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.newTextColor,
        marginBottom: 4,
    },
    bookAuthor: {
        fontSize: 14,
        fontFamily: Fonts.PoppinsRegular,
        color: Colors.placeholderColor,
        marginBottom: 4,
    },
    // ✅ New styles for price container (converted from Tailwind)
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    discountedPrice: {
        fontFamily: Fonts.PoppinsRegular,
        fontSize: 14,
        color: Colors.newTextColor,
    },
    originalPrice: {
        fontFamily: Fonts.PoppinsRegular,
        fontSize: 12,
        color: '#9CA3AF', // gray-400
        marginLeft: 4,
        textDecorationLine: 'line-through',
    },
    discountPercentage: {
        fontFamily: Fonts.PoppinsRegular,
        fontSize: 12,
        color: '#10B981', // green-500
        marginLeft: 4,
    },
    bookPrice: {
        fontSize: 16,
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.black,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 8,
        marginTop: 10
    },
    removeButton: {
        backgroundColor: Colors.errorColor,
        padding: 8,
        borderRadius: 4,
        alignItems: 'center',
    },
    removeButtonText: {
        color: 'white',
        fontFamily: Fonts.PoppinsMedium,
        fontSize: 12,
    },
    addToCartButton: {
        backgroundColor: Colors.primaryColor,
        padding: 8,
        borderRadius: 4,
        alignItems: 'center',
    },
    addToCartButtonText: {
        color: 'white',
        fontFamily: Fonts.PoppinsMedium,
        fontSize: 12,
    },
    // ✅ New styles for login required section (converted from Tailwind)
    loginRequiredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginRequiredText: {
        fontSize: 16,
        textAlign: 'left',
        color: Colors.newTextColor,
        fontFamily: Fonts.PoppinsRegular,
        marginBottom: 8,
    },
    loginLinkText: {
        color: '#93C5FD', // blue-300
        textAlign: 'center',
        fontFamily: Fonts.PoppinsMedium,
        fontSize: 16,
    },
    // ✅ New styles for loading container (converted from Tailwind)  
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyWishlist: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyWishlistText: {
        fontSize: 18,
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.placeholderColor,
        marginBottom: 16,
    },
    browseButton: {
        backgroundColor: Colors.primaryColor,
        padding: 12,
        borderRadius: 4,
    },
    browseButtonText: {
        color: 'white',
        fontFamily: Fonts.PoppinsMedium,
        fontSize: 16,
    }});


export default MyCart;