import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Images } from '../common/Images'
import { useNavigation } from '@react-navigation/native';

interface ServiceCardProps {
    title: string;
    subtitle: string;
    icon: any;
    color: string;
    navigation?: any; // Optional prop
    screenName?: string;
}

const ServiceCard2: React.FC<ServiceCardProps> = ({
    title,
    subtitle,
    icon,
    color,
    navigation,
    screenName

}) => {

    return (

        <TouchableOpacity style={[styles.serviceCard, { backgroundColor: color }]} onPress={()=>navigation.navigate('Shop')} >

            <View>
                <Text style={styles.serviceTitle}>{title}</Text>
                <Text style={styles.serviceSubtitle}>{subtitle}</Text>
            </View>
            <View style={styles.serviceIcon}>
                <Image source={icon} style={{ height: 100, width: 100 }} />
            </View>
        </TouchableOpacity>
    )
}


const Servicecard = (props: any) => {
    return (
        <View style={styles.servicesContainer}>
            <View style={styles.servicesRow}>

                <ServiceCard2
                    title="Organic Products"
                    subtitle="Nature's Best Superfood Health"
                    icon={Images.organicIcon}
                    color="#fff"
                    navigation={props.navigation}
                    screenName="shop"
                />

                <ServiceCard2
                    title="Medicines"
                    subtitle="One Remedies, Real Results"
                    icon={Images.medicines}
                    color="#fff"
                    navigation={props.navigation}
                    screenName="shop"
                />
            </View>


            <View style={styles.servicesRow}>

                <TouchableOpacity style={[styles.consultCard]} onPress={() => props.navigation.navigate('Consultation')}>
                    <View>
                        <View style={{ flex: 1, }}>
                            <Text style={styles.serviceTitle}>Consult with Doctor</Text>
                            <Text style={styles.serviceSubtitle}>Get Prescription</Text>
                        </View>

                        <View style={styles.serviceIcon}>
                            <Image source={Images.consultant} style={{ height: 53, width: 55 }} />
                        </View>
                    </View>

                </TouchableOpacity>


                <View style={styles.columnServices}>

                    {/* <TouchableOpacity style={[styles.service2Card]} onPress={() => props.navigation.navigate('Centers')}>
                        <View style={styles.service2Content}>
                            <View style={styles.service2TextContainer}>
                                <Text style={styles.service2Title}>Wellness Center</Text>
                                <Text style={styles.service2Subtitle}>Get detox in wellness centers</Text>
                            </View>
                            <Image source={Images.wellness} style={{ height: 28, width: 33 }} />
                        </View>
                    </TouchableOpacity> */}

                    {/* <TouchableOpacity style={[styles.service2Card]}>
                        <View style={styles.service2Content}>
                            <View style={styles.service2TextContainer}>
                                <Text style={styles.service2Title}>Ask Muni</Text>
                                <Text style={styles.service2Subtitle}>Get detox in wellness centers</Text>
                            </View>
                            <Image source={Images.askmuniIcon} style={{ height: 28, width: 33 }} />
                        </View>
                    </TouchableOpacity> */}

                </View>
            </View>
        </View>
    )
}

export default Servicecard

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    servicesContainer: {
        padding: 16,
        marginTop: 5,
    },
    servicesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        gap: 10
    },
    columnServices: {
        flex: 1,
        gap: 8,
    },
    service2Card: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        shadowRadius: 4,
        elevation: 1,
        minHeight: 56,
    },
    service2Content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    },
    service2TextContainer: {
        flex: 1,
        paddingRight: 8,
    },

    service2Title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    service2Subtitle: {
        fontSize: 12,
        color: '#666',
        lineHeight: 16,
    },

    serviceCard: {
        width: (width - 40) / 2,
        borderRadius: 15,
        padding: 15,
        backgroundColor: '#fff',
        alignItems: 'center',
        elevation: 1,
    },
    consultCard: {
        width: (width - 40) / 2,
        borderRadius: 15,
        height: 150,
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#fff',
        // alignItems: 'center',
        elevation: 1,
    },
    serviceIcon: {
        borderRadius: 30,
        backgroundColor: '#FFFFFF',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    serviceTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    serviceSubtitle: {
        fontSize: 12,
        color: '#666',
        lineHeight: 15,

    },
})