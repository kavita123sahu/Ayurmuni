import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Modal, Animated, Easing } from 'react-native';
import { Images } from '../common/Images';

const Loader = (props: any) => {
    const { loading, ...attributes } = props;
    const spinValue = useRef(new Animated.Value(0)).current;

    
    useEffect(() => {
        if (loading) {
            const spinAnimation = Animated.loop(
                Animated.timing(spinValue, {
                    toValue: 1,
                    duration: 1000, 
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            );
            spinAnimation.start();

            return () => {
                spinAnimation.stop();
            };
        } else {
            spinValue.setValue(0);
        }
    }, [loading]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });


    return (
        // <Modal
        //     transparent={true}
        //     animationType={'fade'}
        //     visible={loading}
        //     onRequestClose={() => {}}
        // >
        <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
                <Animated.Image
                    source={Images.spinner}
                    style={[
                        styles.spinnerImage,
                        { transform: [{ rotate: spin }] }
                    ]}
                />
            </View>
        </View>
        // </Modal>
    );
};

export default Loader;

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    activityIndicatorWrapper: {
        // backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        // elevation: 5,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
    },
    spinnerImage: {
        height: 50,
        width: 50,
    },
});