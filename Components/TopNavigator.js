import { Image, StyleSheet } from 'react-native';
import React from 'react';
import { scale } from 'react-native-size-matters';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AllCalls from '../Screens/AllCalls';
import IncomingCalls from '../Screens/IncomingCalls';
import OutgoingCalls from '../Screens/OutgoingCalls';
import MissedCall from '../Screens/MissedCall';
import RejectedCall from '../Screens/RejectedCall';

const Tab = createMaterialTopTabNavigator();

const TopNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#c02221',
                tabBarInactiveTintColor: '#000',
                tabBarLabelStyle: { fontSize: 8 },
                tabBarStyle: { backgroundColor: '#fff' },
                tabBarIndicatorStyle: { backgroundColor: '#c02221' },
                tabBarPressColor: { color: '#c02221' },
            }}
        >
            <Tab.Screen
                name="AllCalls"
                component={AllCalls}
                options={{
                    tabBarLabel: 'AllCalls',
                    tabBarIcon: ({ focused, color }) => (
                        <Image
                            source={focused ? require('../assets/images/call-focused.png') : require('../assets/images/call.png')}
                            style={styles.callyzerIcon}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="IncomingCalls"
                component={IncomingCalls}
                options={{
                    tabBarLabel: 'Incoming',
                    tabBarIcon: ({ focused, color }) => (
                        <Image
                            source={focused ? require('../assets/images/incoming-focused.png') : require('../assets/images/incoming.png')}
                            style={styles.callyzerIcon}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="OutgoingCalls"
                component={OutgoingCalls}
                options={{
                    tabBarLabel: 'Outgoing',
                    tabBarIcon: ({ focused, color }) => (
                        <Image
                            source={focused ? require('../assets/images/outgoing-focused.png') : require('../assets/images/outgoing.png')}
                            style={styles.callyzerIcon}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="MissedCall"
                component={MissedCall}
                options={{
                    tabBarLabel: 'Missed',
                    tabBarIcon: ({ focused, color }) => (
                        <Image
                            source={focused ? require('../assets/images/missed-focused.png') : require('../assets/images/missed.png')}
                            style={styles.callyzerIcon}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="RejectedCall"
                component={RejectedCall}
                options={{
                    tabBarLabel: 'Rejected',
                    tabBarIcon: ({ focused, color }) => (
                        <Image
                            source={focused ? require('../assets/images/rejected-focused.png') : require('../assets/images/rejected.png')}
                            style={styles.callyzerIcon}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default TopNavigator;

const styles = StyleSheet.create({
    callyzerIcon: {
        width: scale(16),
        height: scale(16),
    },
    Icontext: {
        fontWeight: '400',
        fontSize: 12,
    },
});
