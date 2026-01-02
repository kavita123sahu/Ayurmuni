import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { AntDesign, Entypo } from '../common/Vector';

export default function AllCategories() {
    const [selectedCategory, setSelectedCategory] = useState(undefined);

    const categories = [
        {
            id: 1,
            name: 'Electronics',
            icon: '📱',
            subcategories: ['Mobiles', 'Laptops', 'Tablets', 'Cameras', 'TVs', 'Accessories']
        },
        
        {
            id: 2,
            name: 'Fashion',
            icon: '👕',
            subcategories: ['Men', 'Women', 'Kids', 'Shoes', 'Watches', 'Bags']
        },
        {
            id: 3,
            name: 'Home & Kitchen',
            icon: '🏠',
            subcategories: ['Furniture', 'Decor', 'Kitchen', 'Bedding', 'Storage', 'Lighting']
        },
        {
            id: 4,
            name: 'Beauty',
            icon: '💄',
            subcategories: ['Makeup', 'Skincare', 'Haircare', 'Fragrance', 'Tools', 'Men\'s Grooming']
        },
        {
            id: 5,
            name: 'Sports',
            icon: '⚽',
            subcategories: ['Fitness', 'Outdoor', 'Cycling', 'Swimming', 'Team Sports', 'Yoga']
        },
        {
            id: 6,
            name: 'Books',
            icon: '📚',
            subcategories: ['Fiction', 'Non-Fiction', 'Educational', 'Comics', 'eBooks', 'Audiobooks']
        },
        {
            id: 7,
            name: 'Toys & Games',
            icon: '🎮',
            subcategories: ['Action Figures', 'Board Games', 'Puzzles', 'Dolls', 'Video Games', 'Outdoor Play']
        },
        {
            id: 8,
            name: 'Grocery',
            icon: '🛒',
            subcategories: ['Fresh Produce', 'Snacks', 'Beverages', 'Dairy', 'Bakery', 'Organic']
        },
        {
            id: 9,
            name: 'Pet Supplies',
            icon: '🐕',
            subcategories: ['Dog', 'Cat', 'Fish', 'Bird', 'Small Pets', 'Pet Care']
        },
        {
            id: 10,
            name: 'Automotive',
            icon: '🚗',
            subcategories: ['Car Parts', 'Accessories', 'Tools', 'Oils', 'Tires', 'Electronics']
        },
        {
            id: 11,
            name: 'Baby Products',
            icon: '👶',
            subcategories: ['Diapers', 'Feeding', 'Clothing', 'Toys', 'Safety', 'Nursery']
        },
        {
            id: 12,
            name: 'Health',
            icon: '⚕️',
            subcategories: ['Vitamins', 'Medicine', 'Personal Care', 'Medical Supplies', 'Fitness', 'Wellness']
        }
    ];


    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Header */}
            <View style={{
                backgroundColor: '#131921',
                paddingTop: 40,
                paddingBottom: 10,
                paddingHorizontal: 15
            }}>
                {/* Top Bar */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <AntDesign name='menu' color="#fff" size={24} />
                    {/* <Image
                        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' }}
                        style={{ width: 80, height: 25, marginLeft: 15 }}
                        resizeMode="contain"
                    /> */}
                    <View style={{ flex: 1 }} />
                    <AntDesign name='cart' color="#fff" size={24} style={{ marginRight: 15 }} />
                    <AntDesign name='user' color="#fff" size={24} />
                </View>

                {/* Search Bar */}
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: '#fff',
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    alignItems: 'center'
                }}>
                    <AntDesign name='search' color="#666" size={20} />
                    <TextInput
                        placeholder="Search Amazon.in"
                        style={{
                            flex: 1,
                            marginLeft: 10,
                            fontSize: 16,
                            color: '#000'
                        }}
                        placeholderTextColor="#666"
                    />
                </View>

                {/* Deliver to */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>Deliver to Rohtak 124001</Text>
                    <Entypo name='location' color="#fff" size={16} />
                </View>
            </View>

            {/* Categories Title */}
            <View style={{
                padding: 15,
                backgroundColor: '#f7f7f7',
                borderBottomWidth: 1,
                borderBottomColor: '#ddd'
            }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#000' }}>
                    Shop by Category
                </Text>
            </View>

            <ScrollView style={{ flex: 1 }}>
                <View style={{ padding: 10 }}>
                    {categories.map((category : any, idx : any) => (
                        <View key={category.id}>
                            <TouchableOpacity
                                // onPress={() => setSelectedCategory(
                                //     selectedCategory === category.id ? null : category.id
                                // )}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: 15,
                                    backgroundColor: '#fff',
                                    borderRadius: 8,
                                    marginBottom: 1,
                                    borderWidth: 1,
                                    borderColor: '#e3e6e6',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.05,
                                    shadowRadius: 2,
                                    elevation: 1
                                }}>
                                <Text style={{ fontSize: 32, marginRight: 15 }}>
                                    {category.icon}
                                </Text>
                                <Text style={{
                                    flex: 1,
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: '#0F1111'
                                }}>
                                    {category.name}
                                </Text>
                                <Entypo name='location'
                                    color="#565959"
                                    size={20}
                                    style={{
                                        transform: [{
                                            rotate: selectedCategory === category.id ? '90deg' : '0deg'
                                        }]
                                    }}
                                />
                            </TouchableOpacity>

                            {/* Subcategories */}
                            {selectedCategory === category.id && (
                                <View style={{
                                    backgroundColor: '#f7f7f7',
                                    paddingHorizontal: 15,
                                    paddingVertical: 10,
                                    marginBottom: 10,
                                    borderRadius: 8,
                                    borderWidth: 1,
                                    borderColor: '#e3e6e6'
                                }}>
                                    {category.subcategories.map((sub  : any, subIdx : any) => (
                                        <TouchableOpacity
                                            key={subIdx}
                                            style={{
                                                paddingVertical: 12,
                                                paddingLeft: 25,
                                                borderBottomWidth: subIdx < category.subcategories.length - 1 ? 1 : 0,
                                                borderBottomColor: '#e3e6e6'
                                            }}
                                        >
                                            <Text style={{
                                                fontSize: 15,
                                                color: '#007185',
                                                fontWeight: '400'
                                            }}>
                                                {sub}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                {/* Bottom Spacing */}
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}