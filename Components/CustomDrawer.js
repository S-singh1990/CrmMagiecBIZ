import { View, Text, ImageBackground, Image, TouchableOpacity, StyleSheet, } from 'react-native'
import React, { useState, useEffect } from 'react'
import {
    DrawerContentScrollView,
    DrawerItemList
} from '@react-navigation/drawer'
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native'
import axios from "axios";
import { PROCESS_KEY } from "@env";

const Stack = createNativeStackNavigator();

const CustomDrawer = (props) => {

    const navigation = useNavigation()
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [role, setRole] = useState('');
    const [userName, setuser] = useState('');

    // console.log('userName', userName)
    // console.log('role', role)
    // const userName = users.find(user => user.role === role)?.name || 'Unknown';

    const removeTokenFromStorage = async () => {
        try {
            await Promise.all([
                AsyncStorage.removeItem('token'),
                AsyncStorage.removeItem('user_id'),
                AsyncStorage.removeItem('role'),
                AsyncStorage.removeItem('tokenExpiry'),
            ]);
            console.log('Local data cleared successfully');
            setRole('');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Error clearing local data:', error);
        }
    };

    const setRoleFromStorage = async () => {
        try {
            const userRole = await AsyncStorage.getItem('role');
            const userName = await AsyncStorage.getItem('name');
            if (userRole) {
                setRole(userRole);
            } else {
                setRole('');
            }
            if (userName) {
                setuser(userName);
            }
        } catch (error) {
            console.error('Error getting user role:', error);
        }
    };

    useEffect(() => {
        setRoleFromStorage();
    }, []);

    const navigateToScreen = async (screenName) => {
        await setRoleFromStorage(); // Update role and userName before navigation
        navigation.navigate(screenName);
        setRefreshFlag((prevFlag) => !prevFlag);
    };

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
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#c02221' }}>
                <ImageBackground
                    source={require('../assets/images/headbg.jpg')}
                    style={{ padding: 15, flexDirection: 'row', }}>
                    <Image
                        source={require('../assets/images/avatar5.png')}
                        style={{ height: 40, width: 40, borderRadius: 40 }}
                    />
                    <View style={{ alignContent: 'center', paddingTop: 1, paddingLeft: 10, }}>
                        <Text style={{ color: '#fff', fontSize: 15, fontWeight: 700, }}>Welcome</Text>
                        {role === 'admin' ? (
                            <Text style={{ color: '#fff', fontSize: 13 }}>{userName ? userName : 'Admin'} (Admin)</Text>

                        ) : role === 'TeamLeader' ? (
                            <Text style={{ color: '#fff', fontSize: 13 }}>{userName ? userName : 'TeamLeader'} (TL)</Text>

                        ) : (
                            <Text style={{ color: '#fff', fontSize: 13 }}>{userName ? userName : 'Agent'} (Agent)</Text>
                        )}
                    </View>
                </ImageBackground>
                <View style={{ flex: 1, backgroundColor: '#fff', }}>
                    <TouchableOpacity onPress={() => navigateToScreen('Home')}>
                        <View style={styles.drawerTab}>
                            <Ionicons name="home-outline" size={20} style={styles.drawerTabIcon} />
                            <Text style={styles.drawerTabTxt}>Dashboard</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigateToScreen('AddLead')}>
                        <View style={styles.drawerTab}>
                            <Ionicons name="person-add-outline" size={20} style={styles.drawerTabIcon} />
                            <Text style={styles.drawerTabTxt}>Add Lead</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigateToScreen('NewLeads')}>
                        <View style={styles.drawerTab}>
                            <Ionicons name="people-outline" size={20} style={styles.drawerTabIcon} />
                            <Text style={styles.drawerTabTxt}>New Lead's</Text>
                            <Image source={require('../assets/images/new-icon.gif')} style={styles.IconNew} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigateToScreen('AllLeads')}>
                        <View style={styles.drawerTab}>
                            <Ionicons name="people-outline" size={20} style={styles.drawerTabIcon} />
                            <Text style={styles.drawerTabTxt}>All Lead's</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigateToScreen('FollowupLead')}>
                        <View style={styles.drawerTab}>
                            <Ionicons name="layers-outline" size={20} style={styles.drawerTabIcon} />
                            <Text style={styles.drawerTabTxt}>Followup Lead's</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigateToScreen('ImportedLead')}>
                        <View style={styles.drawerTab}>
                            <Ionicons name="layers-outline" size={20} style={styles.drawerTabIcon} />
                            <Text style={styles.drawerTabTxt}>Imported Lead's</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigateToScreen('CallLog')}>
                        <View style={styles.drawerTab}>
                            <Ionicons name="call-outline" size={20} style={styles.drawerTabIcon} />
                            <Text style={styles.drawerTabTxt}>Call History</Text>
                        </View>
                    </TouchableOpacity>
                    {(role === 'admin' || role === 'TeamLeader') ? (
                        <TouchableOpacity onPress={() => navigateToScreen('AnalyticReport')}>
                            <View style={styles.drawerTab}>
                                <Ionicons name="bar-chart-outline" size={20} style={styles.drawerTabIcon} />
                                <Text style={styles.drawerTabTxt}>Analytic Report</Text>
                            </View>
                        </TouchableOpacity>
                    ) : null}
                    {/* (
                        <TouchableOpacity onPress={() => navigateToScreen('Analytics')}>
                            <View style={styles.drawerTab}>
                                <Ionicons name="bar-chart-outline" size={20} style={styles.drawerTabIcon} />
                                <Text style={styles.drawerTabTxt}>Analytic's</Text>
                            </View>
                        </TouchableOpacity>
                    )} */}
                    <TouchableOpacity onPress={() => navigateToScreen('WaInbox')}>
                        <View style={styles.drawerTab}>
                            <Ionicons name="logo-whatsapp" size={20} style={styles.drawerTabIcon} />
                            <Text style={styles.drawerTabTxt}>WA Inbox</Text>
                            {detail?.length ? (
                                <Text style={styles.waCounter}>{detail.length}</Text>
                            ) : null}
                        </View>
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={() => navigateToScreen('Reports')}>
                        <View style={styles.drawerTab}>
                            <Ionicons name="person-add-outline" size={20} style={styles.drawerTabIcon} />
                            <Text style={styles.drawerTabTxt}>Report's</Text>
                        </View>
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity onPress={() => navigateToScreen('Setting')}>
                        <View style={styles.drawerTab}>
                            <Ionicons name="settings-outline" size={20} style={styles.drawerTabIcon} />
                            <Text style={styles.drawerTabTxt}>Setting</Text>
                        </View>
                    </TouchableOpacity> */}
                </View>
            </DrawerContentScrollView>
            <View style={{ padding: 10, borderTopWidth: 1, borderTopColor: '#ccc' }}>
                <TouchableOpacity onPress={removeTokenFromStorage} style={{ paddingVertical: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="exit-outline" size={20} style={styles.drawerTabIcon} />
                        <Text style={styles.drawerTabTxt}>
                            Sign Out
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CustomDrawer;

const styles = StyleSheet.create({
    drawerTab: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#dedede',
        paddingHorizontal: 15,
        paddingVertical: 13,
    },
    drawerTabIcon: {
        color: '#c02221'
    },
    drawerTabTxt: {
        color: '#393939',
        fontSize: 14,
        marginLeft: 7,
    },
    IconNew: {
        width: 40,
        height: 25,
        marginLeft: 35,
    },
    waCounter: {
        width: 25,
        height: 18,
        marginLeft: 10,
        backgroundColor: '#22c55e',
        color: '#fff',
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 5,
        fontSize: 12,
    },
})