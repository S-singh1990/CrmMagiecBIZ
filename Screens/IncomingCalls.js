import React, { useEffect, useState } from 'react';
import { SafeAreaView, Platform, StyleSheet, PermissionsAndroid, FlatList, Text, View, Image } from 'react-native';
import { scale, verticalScale, moderateScale, moderateVerticalScale } from 'react-native-size-matters';
import CallLogs from 'react-native-call-log';
import BottomNav from '../Components/BottomNav';

const IncomingCalls = () => {
    const [listData, setListData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            if (Platform.OS !== 'ios') {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
                        {
                            title: 'Call Log Example',
                            message: 'Access your call logs',
                            buttonNeutral: 'Ask Me Later',
                            buttonNegative: 'Cancel',
                            buttonPositive: 'OK',
                        }
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        const callLogData = await CallLogs.load(250);
                        const incomingCalls = callLogData.filter(call => call.rawType == 1);
                        setListData(incomingCalls);
                        // ==============call log function use here=========================
                        // use api here to store all call log data
                        const callLog = callLogData
                        console.log(callLog)
                        handleCallLog(callLog)
                        // ===========================================
                    } else {
                        console.log('Call Log permission denied');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred: ' + error);
                }
            } else {
                alert('Sorry, access is not granted for security reasons.');
            }
        }
        fetchData();
    }, []);


    const handleCallLog = (data) => {
        console.log(data)
        // ==== use this function as per ur requirement
    }

    const ItemView = ({ item }) => {

        const inputDateString = item.dateTime;
        const splitArray = inputDateString.split(' ');

        return (
            <View style={styles.callItem}>
                <View style={styles.callDetails}>
                    <View style={styles.leftSection}>
                        {item.rawType == 1 ? (<View style={styles.callIconBgA}><Image
                            source={require('../assets/images/incoming.png')}
                            style={[styles.callIcon, { tintColor: 'white' }]}
                        /></View>) : item.rawType == 2 ? (<View style={styles.callIconBgO}><Image
                            source={require('../assets/images/outgoing.png')}
                            style={[styles.callIcon, { tintColor: 'white' }]}
                        /></View>) : item.rawType == 3 ? (<View style={styles.callIconBgM}><Image
                            source={require('../assets/images/missed.png')}
                            style={[styles.callIcon, { tintColor: 'white' }]}
                        /></View>) : (<View style={styles.callIconBgR}><Image
                            source={require('../assets/images/rejected.png')}
                            style={[styles.callIcon, { tintColor: 'white' }]}
                        /></View>)}
                    </View>
                    <View style={styles.rightSection}>
                        <Text style={styles.name}>{item.name ? item.name : 'Unknown'}</Text>
                        <View style={styles.rightDetail}>
                            <Text style={styles.number}>{item.phoneNumber}</Text>
                            <Text style={styles.time}>{splitArray['1']} {splitArray['2']}</Text>
                            <Text style={styles.duration}>{item.duration}s</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <>
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={listData}
                    renderItem={ItemView}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.flatList}
                />
            </SafeAreaView>
            {/* <BottomNav /> */}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // marginTop: moderateScale(60)
    },
    mainContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 5,
    },
    flatList: {
        marginBottom: 60,
    },
    mainHeading: {
        fontSize: 18,
        color: "#c02221",
        paddingTop: 20,
        paddingBottom: 3,
        textAlign: "center",
        fontWeight: "bold",
        textTransform: 'uppercase'
    },
    innerContainer: {
        backgroundColor: "#fff",
        borderRadius: 5,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 10,
        shadowColor: '#000',
        elevation: 3,
    },
    subHeading: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        color: "#344055",
        paddingBottom: 10,
        textTransform: "capitalize",
    },
    callItem: {
        width: '94%',
        backgroundColor: '#ffffff',
        alignSelf: 'center',
        marginTop: moderateVerticalScale(15),
        padding: moderateScale(10),
        borderRadius: 10,
        shadowColor: '#000',
        elevation: 5,
    },
    callDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    callIconBgA: {
        width: scale(25),
        height: scale(25),
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#74c904',
        padding: 15,
    },
    callIconBgO: {
        width: scale(25),
        height: scale(25),
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e69900',
        padding: 15,
    },
    callIconBgM: {
        width: scale(25),
        height: scale(25),
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f93937',
        padding: 15,
    },
    callIconBgR: {
        width: scale(25),
        height: scale(25),
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#990000',
        padding: 15,
    },
    callIcon: {
        width: scale(14),
        height: scale(14),
        tintColor: 'white',
    },
    rightSection: {
        marginLeft: moderateScale(10),
    },
    name: {
        fontSize: 13,
        fontWeight: "600",
        color: '#000',
    },
    rightDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateVerticalScale(5),
    },
    number: {
        color: '#000',
        marginTop: moderateScale(3),
        fontSize: 13,
    },
    time: {
        color: '#000',
        marginTop: moderateScale(3),
        marginLeft: moderateScale(20),
        fontSize: 13,
    },
    duration: {
        color: '#000',
        marginTop: moderateScale(3),
        marginLeft: moderateScale(20),
        fontSize: 13,
    },

    callyzer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    callyzerNav: {
        width: '100%',
        height: verticalScale(55),
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        shadowColor: '#000',
        elevation: 20,
    },
    callyzerNavInn: {
        width: '100%',
        height: verticalScale(55),
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
    },
    callyzerTab: {
        width: '20%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    callyzerIconBg: {
        width: scale(25),
        height: scale(25),
        borderRadius: 20,
        justifyContent: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    callyzerIcon: {
        width: scale(14),
        height: scale(14),
        tintColor: 'white'
    },

});


export default IncomingCalls