import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import { scale, moderateScale, moderateVerticalScale } from 'react-native-size-matters';
import axios from "axios";
import BottomNav from '../Components/BottomNav';
import { PROCESS_KEY } from "@env";

const WaInbox = () => {
    const [detail, setDetail] = useState([]);

    useEffect(() => {
        getAllMsg();
    }, []);

    const getAllMsg = async () => {
        try {
            const response = await axios.get(`${PROCESS_KEY}/Businesswtspmessage/`, { headers: { "Content-Type": "application/json" } });
            setDetail(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.mainContainer}>
                <ScrollView>
                    <View style={styles.cardWraper}>
                        <View style={styles.cardWraperInn}>
                            {detail?.length ? (
                                detail.map((message, index) => (
                                    <View style={styles.cardWrap} key={index}>
                                        <TouchableOpacity style={styles.card}>
                                            <View style={styles.cardRow}>
                                                <View style={styles.cardLeft}>
                                                    <Image source={require('../assets/images/avatar5.png')} style={styles.icon} />
                                                </View>
                                                <View style={styles.cardRight}>
                                                    <Text style={styles.cardHead}>
                                                        {message.fromname}
                                                        {message.fromphone}
                                                    </Text>
                                                    <Text style={styles.cardTxt}>{message.message}</Text>
                                                    <Text style={styles.cardTxt}>{message.createdAt}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                ))
                            ) : (
                                <View style={styles.notData}>
                                    <Text style={styles.notDataTxt}>No messages to display</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </View>
            <BottomNav />
        </View>
    );

};

export default WaInbox

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor: '#fff',
    },
    mainContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: '#fff',
    },
    notData: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notDataTxt: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardWraper: {
        width: '100%',
        flexDirection: 'row',
        marginBottom: moderateVerticalScale(50),
        paddingHorizontal: 5,
    },
    cardWraperInn: {
        width: '100%',
    },
    cardWrap: {
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#e2eefa',
        flexDirection: 'row',
        borderRadius: 5,
    },
    card: {
        width: '92%',
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardLeft: {
        marginRight: 5,
    },
    cardRight: {
        marginLeft: 5,
    },
    icon: {
        width: scale(35),
        height: scale(35),
        borderRadius: 5,
    },
    cardHead: {
        color: '#111111',
        fontWeight: '700',
        fontSize: moderateScale(13),
        textTransform: 'capitalize'
    },
    cardTxt: {
        color: '#414141',
        fontWeight: '600',
        fontSize: moderateScale(11),
    },
    loadMoreContainer: {
        backgroundColor: "#fff",
        borderRadius: 5,
        paddingHorizontal: 15,
    },
    loadMoreButton: {
        fontSize: 14,
        fontWeight: "500",
        textAlign: "center",
        color: "#fff",
        backgroundColor: '#22c55e',
        textTransform: "capitalize",
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderRadius: 5,
    },
    loadMoreText: {
        fontSize: 14,
        fontWeight: "500",
        textAlign: "center",
        color: "#fff",
    },
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
});