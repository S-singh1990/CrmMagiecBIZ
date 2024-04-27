import { StyleSheet, View, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SimpleAnimation } from 'react-native-simple-animations';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = ({ navigation }) => {

    const user_id = AsyncStorage.getItem('user_id');
    const [isAuthenticated, setAuthenticated] = useState('');

    useEffect(() => {
        const getToken = async () => {
            const userToken = await AsyncStorage.getItem('role');
            if (userToken) {
                setAuthenticated(userToken);
                setTimeout(() => {
                    navigation.replace('Intro')
                }, 2000);
            } else {
                setAuthenticated('');
                setTimeout(() => {
                    navigation.replace('Login')
                }, 2000);
            }
        }
        getToken();
    }, [setAuthenticated])

    setTimeout(() => {
    }, 2000);

    return (
        <View style={styles.Container}>
            <SimpleAnimation delay={500} duration={2000} fade staticType="zoom">
                <Image
                    source={require('../assets/images/biz_logo_bgr.png')}
                    style={styles.logo}></Image>
            </SimpleAnimation>
        </View>
    )
}

export default Splash

const styles = StyleSheet.create({

    Container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: { height: 300, width: 300, resizeMode: 'contain' },
});