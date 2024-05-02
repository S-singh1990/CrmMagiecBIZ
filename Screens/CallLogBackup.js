import React, { useState } from 'react'
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView } from 'react-native'

import { scale, verticalScale } from 'react-native-size-matters'

import IncomingCalls from './IncomingCalls';
import OutgoingCalls from './OutgoingCalls';
import AllCalls from './AllCalls';
import MissedCall from './MissedCall';
import RejectedCall from './RejectedCall';

const CallLog = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.mainContainer}>

                    <View style={styles.callyzer}>
                        {selectedTab == 0 ? <AllCalls /> : selectedTab == 1 ? <IncomingCalls /> : selectedTab == 2 ? <OutgoingCalls /> : selectedTab == 3 ? <MissedCall /> : <RejectedCall />}
                        <View style={styles.callyzerNav}>
                            <View style={styles.callyzerNavInn}>
                                <TouchableOpacity
                                    style={styles.callyzerTab}
                                    onPress={() => {
                                        setSelectedTab(0);
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.callyzerIconBg, { backgroundColor: selectedTab == 0 ? '#c02221' : '#000' }
                                        ]}
                                    >
                                        <Image
                                            source={require('../assets/images/call.png')}
                                            style={[styles.callyzerIcon, { tintColor: 'white' }]}
                                        />
                                    </View>
                                    <Text style={[styles.Icontext, { color: selectedTab == 0 ? '#c02221' : '#000' }]}>
                                        AllCalls
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.callyzerTab}
                                    onPress={() => {
                                        setSelectedTab(1);
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.callyzerIconBg, { backgroundColor: selectedTab == 1 ? '#c02221' : '#000' }
                                        ]}
                                    >
                                        <Image
                                            source={require('../assets/images/incoming.png')}
                                            style={[styles.callyzerIcon, { tintColor: 'white' }]}
                                        />
                                    </View>
                                    <Text style={[styles.Icontext, { color: selectedTab == 1 ? '#c02221' : '#000' }]}>
                                        Incoming
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.callyzerTab}
                                    onPress={() => {
                                        setSelectedTab(2);
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.callyzerIconBg, { backgroundColor: selectedTab == 2 ? '#c02221' : '#000' }
                                        ]}
                                    >
                                        <Image
                                            source={require('../assets/images/outgoing.png')}
                                            style={[styles.callyzerIcon, { tintColor: 'white' }]}
                                        />
                                    </View>
                                    <Text style={[styles.Icontext, { color: selectedTab == 2 ? '#c02221' : '#000' }]}>
                                        Outgoing
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.callyzerTab}
                                    onPress={() => {
                                        setSelectedTab(3);
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.callyzerIconBg, { backgroundColor: selectedTab == 3 ? '#c02221' : '#000' }
                                        ]}
                                    >
                                        <Image
                                            source={require('../assets/images/missed.png')}
                                            style={[styles.callyzerIcon, { tintColor: 'white' }]}
                                        />
                                    </View>
                                    <Text style={[styles.Icontext, { color: selectedTab == 3 ? '#c02221' : '#000' }]}>
                                        Missed
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.callyzerTab}
                                    onPress={() => {
                                        setSelectedTab(4);
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.callyzerIconBg, { backgroundColor: selectedTab == 4 ? '#c02221' : '#000' }
                                        ]}
                                    >
                                        <Image
                                            source={require('../assets/images/rejected.png')}
                                            style={[styles.callyzerIcon, { tintColor: 'white' }]}
                                        />
                                    </View>
                                    <Text style={[styles.Icontext, { color: selectedTab == 4 ? '#c02221' : '#000' }]}>
                                        Rejected
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </View>
            </ScrollView>
            {/* <BottomNav /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor: '#fff',
        paddingBottom: 30,
    },
    mainContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 5,
    },

    mainHeading: {
        fontSize: 16,
        color: "#000",
        paddingTop: 10,
        paddingBottom: 5,
        textAlign: "center",
        fontWeight: "800",
        textTransform: 'uppercase'
    },
    callyzer: {
        position: 'relative',
        position: 'fixed',
        top: 25,
    },
    callyzerNav: {
        width: '100%',
        height: verticalScale(45),
        position: 'absolute',
    },
    callyzerNavInn: {
        width: '100%',
        height: verticalScale(70),
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
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    callyzerIcon: {
        width: scale(14),
        height: scale(14),
        tintColor: 'white'
    },
    Icontext: {
        fontWeight: '400',
        fontSize: 12,
    },
});

export default CallLog