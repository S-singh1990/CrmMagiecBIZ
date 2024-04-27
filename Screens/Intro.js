import { StyleSheet, View, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SimpleAnimation } from 'react-native-simple-animations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomLoader = () => (
    <View style={styles.loaderContainer}>
        <View style={styles.loaderImageContainer}>
            <Image source={require('../assets/images/mobile-loader.gif')} style={styles.loaderImage} />
        </View>
    </View>
);

const Intro = ({ navigation }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const navigateToHome = async () => {
            await AsyncStorage.getItem('isFirstTime', async (error, result) => {
                if (!error && result !== 'false') {
                    await AsyncStorage.setItem('isFirstTime', 'false');
                    navigation.navigate('Home');
                } else {
                    await AsyncStorage.setItem('isFirstTime', 'true');
                    navigation.navigate('Home');
                }
                setLoading(false);
            });
        };
        navigateToHome();
    }, [navigation]);

    const navigateToScreen = (screenName) => {
        navigation.navigate(screenName);
    };

    return (
        <View style={styles.container}>
            <View>
                <Image source={require('../assets/images/biz_logo_bgr.png')} style={styles.logo} />
            </View>
            <TouchableOpacity onPress={() => navigateToScreen('Home')}>
                <View style={styles.goTab}>
                    <Ionicons name="home-outline" size={20} style={styles.drawerTabIcon} />
                    <Text style={styles.drawerTabTxt}>Dashboard</Text>
                </View>
            </TouchableOpacity>
            {
                loading && <CustomLoader />
            }
        </View>
    );
}

export default Intro;

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 85,
        height: 85,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    loaderImage: {
        width: 80,
        height: 80,
        shadowColor: '#000',
        elevation: 5,
        borderRadius: 5,
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignItems: 'center',
    },
    goTab: {
        borderRadius: 5,
        backgroundColor: '#22c55e',
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 8
    },
    drawerTabIcon: {
        color: '#fff',
        marginRight: 5,
    },
    drawerTabTxt: {
        color: '#fff',
        fontSize: 16,
    },
    logo: {
        height: 200,
        width: 200,
        resizeMode: 'contain'
    },
    loader: {
        position: 'absolute',
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
}); 
