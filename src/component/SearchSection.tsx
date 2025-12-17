import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Images } from '../common/Images'
import { AntDesign, MaterialCommunityIcons } from '../common/Vector';
import { useNavigation } from '@react-navigation/native';

const SearchSection = (voice: any) => {
    
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');

    const handleTextChange = (text: string) => {
        setSearchText(text);
        navigation.navigate('ProductSearch');

    };


    return (
        <TouchableOpacity style={styles.searchContainer}>

            {/* <TouchableOpacity style={styles.searchIconContainer}>
                <Image source={Images.searchIcon} style={styles.iconstyle} />
            </TouchableOpacity> */}

            <TextInput
                style={styles.textInput}
                placeholder={'Search for products'}
                placeholderTextColor="#999"
                value={searchText}
                onChangeText={handleTextChange}
                // onSubmitEditing={handleSearch}
                returnKeyType="search"
            />

            <Image source={Images.linemark} style={[styles.iconstyle, { width: 1, height: 25 }]} />



            {voice ? <TouchableOpacity style={styles.voiceIconContainer}>
                <Image source={Images.micIcon} style={styles.iconstyle} />
            </TouchableOpacity> :
            

                <TouchableOpacity style={styles.voiceIconContainer}>
                    <MaterialCommunityIcons name="arrow-right" size={20} color="#010101ff" />
                </TouchableOpacity>
            }
            
        </TouchableOpacity>
    )
}

export default SearchSection

const styles = StyleSheet.create({
    searchContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        // marginLeft: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    searchIconContainer: {
        marginRight: 12,
    },
    iconstyle: {
        height: 17,
        width: 17,
    },
    voiceIconContainer: {
        marginLeft: 12,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingVertical: 0,
    },

    backIcon: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
        flex: 1,
    },
    rightSpace: {
        width: 40,
    },
})