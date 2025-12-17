import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Text,
    Dimensions,
    Image,
} from 'react-native';
import SearchSection from './SearchSection';

interface HeaderProps {
    title?: string;
    navigation?: any
}


const HeaderSearch: React.FC<HeaderProps> = ({ navigation }) => {
    const [searchText, setSearchText] = useState('');

    const handleTextChange = (text: string) => {
        setSearchText(text);

    };

    return (
       
        <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                {/* <Image source={require('../assets/images/backButton.png')} style={{ height: 20, width: 22, paddingRight: 5 }} /> */}
            </TouchableOpacity>

            <View style={{ width: '90%' }}>
                
                <SearchSection  voice ="true" placeholder ="search for product"  onChangeText={()=> console.log()}  />

            </View>
        </View>
    );
};

const styles = StyleSheet.create({

    header: {
        backgroundColor: '#71A33F',
        paddingHorizontal: 15,
        paddingTop: 10,

        paddingBottom: 10,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        // justifyContent: 'center',
        padding: 15,
        paddingHorizontal: 10,
    },
    backButton: {
        width: '10%',
        borderRadius: 20,
    },
    searchContainer: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
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
});

export default HeaderSearch;