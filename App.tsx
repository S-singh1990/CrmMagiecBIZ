import { View, Text, Alert, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer, useNavigation, DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { scale } from 'react-native-size-matters';
import axios from "axios";
import { PROCESS_KEY } from "@env";

import CustomDrawer from './Components/CustomDrawer'
import Login from './Screens/Login'
import Splash from './Screens/Splash'
import Home from './Screens/Home';
import Intro from './Screens/Intro';
import AddLead from './Screens/AddLead';
import NewLeads from './Screens/NewLeads';
import AllLeads from './Screens/AllLeads';
import FollowupLead from './Screens/FollowupLead';
import UnAssignedLeads from './Screens/UnAssignedLeads';
import EditFollowup from './Screens/EditFollowup';
import CallLog from './Screens/CallLog';
import AnalyticReport from './Screens/AnalyticReport';
import Analytics from './Screens/Analytics';
import ScheduleEv from './Screens/ScheduleEv';
import Notification from './Screens/Notification';
import WaInbox from './Screens/WaInbox';
import ImportedLead from './Screens/ImportedLead';

const Tab = createBottomTabNavigator();

const StackNav = () => {

  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();
  const [data, setdata] = useState([]);
  const [search, setSearch] = useState([]);
  const [searchtext, setsearchtext] = useState('');

  const onSearch = (text) => {
    setsearchtext(text)
    if (!text == '') {
      setdata(search);
    }
    // else {
    let tempList = data.filter(Item => {
      //  return Item.full_name.toLowerCase().indexOf(text.toLowerCase()) > -1;
      return (
        Item.full_name.toLowerCase().match(text.toLowerCase()) ||
        Item?.agent_details[0]?.agent_name
          .toLowerCase()
          .match(text.toLowerCase()) ||
        Item?.service_details[0]?.product_service_name
          .toLowerCase()
          .match(text.toLowerCase()) ||
        Item?.lead_source_details[0]?.lead_source_name
          .toLowerCase()
          .match(text.toLowerCase()) ||
        Item?.status_details[0]?.status_name
          .toLowerCase()
          .match(text.toLowerCase())
      );
    });
    setdata(tempList)
    // }
  }

  const ClearText = async () => {
    setsearchtext('')
    setdata(search)
  }

  const removeTokenFromStorage = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('token'),
        AsyncStorage.removeItem('user_id'),
        AsyncStorage.removeItem('role'),
      ]);
      console.log('Local data cleared successfully');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error clearing local data:', error);
    }
  };

  const navigateToScreen = async (screenName) => {
    navigation.navigate(screenName);
  };

  const [detail, setDetail] = useState([]);
  const [notify, setNotify] = useState([]);

  useEffect(() => {
    getAllMsg();
    getAllNotifications();
  }, []);
  const getAllMsg = async () => {
    try {
      const response = await axios.get(`${PROCESS_KEY}/Businesswtspmessage/`, { headers: { "Content-Type": "application/json" } });
      setDetail(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getAllNotifications = async () => {
    try {
      const response = await axios.get(`${PROCESS_KEY}/Appnotification/`, { headers: { "Content-Type": "application/json" } });
      setNotify(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        statusBarColor: '#c02221',
        headerTintColor: '#ffffff',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#c02221',
        },
        headerLeft: () => {
          if (route.name === 'Home') {
            return (
              <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
              >
                <Image
                  source={require('./assets/images/menu.png')}
                  style={{ tintColor: '#fff', height: 20, width: 25, }}
                />
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
              >
                <Image
                  source={require('./assets/images/menu.png')}
                  style={{ tintColor: '#fff', height: 20, width: 25, }}
                />
              </TouchableOpacity>
            );
          }
        },
        headerRight: () => {
          return (
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={() => navigateToScreen('WaInbox')}
                style={styles.headerRightItem}
              >
                {detail?.length ? (
                  <Text style={styles.waCountIcon}>{detail.length}</Text>
                ) : null}
                <Image
                  source={require('./assets/images/whatsapp.png')}
                  style={{ tintColor: '#fff', height: 25, width: 25, }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigateToScreen('Notification')}
                style={styles.headerRightItem}
              >
                {detail?.length ? (
                  <Text style={styles.countIcon}>{notify.length}</Text>
                ) : null}
                <Image
                  source={require('./assets/images/notifications.png')}
                  style={{ tintColor: '#fff', height: 25, width: 25, }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={removeTokenFromStorage} style={styles.headerRightItem}>
                <Image
                  source={require('./assets/images/exit-outline.png')}
                  style={{ tintColor: '#fff', height: 25, width: 25, }}
                />
              </TouchableOpacity>
            </View>
          );
        }
      })}
    >
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Intro"
        component={Intro}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: () => (
            <View>
              <View style={styles.headTitle}>
                <Text style={styles.headTitleTxt}>Dashboard</Text>
              </View>
            </View>
          )
        }}
      />
      <Stack.Screen
        name="AddLead"
        component={AddLead}
        options={{
          headerTitle: () => (
            <View>
              <View style={styles.headTitle}>
                <Text style={styles.headTitleTxt}>Add New Lead</Text>
              </View>
            </View>
          )
        }}
      />
      <Stack.Screen
        name="NewLeads"
        component={NewLeads}
        options={{
          headerTitle: () => (
            <View>
              <View style={styles.headTitle}>
                <Text style={styles.headTitleTxt}>New Lead's</Text>
              </View>
            </View>
          )
        }}
      />
      <Stack.Screen
        name="AllLeads"
        component={AllLeads}
        options={{
          headerTitle: () => (
            <View>
              <View style={styles.headTitle}>
                <Text style={styles.headTitleTxt}>All Lead's</Text>
              </View>
            </View>
          )
        }}
      />
      <Stack.Screen
        name="FollowupLead"
        component={FollowupLead}
        options={{
          headerTitle: () => (
            <View>
              <View style={styles.headTitle}>
                <Text style={styles.headTitleTxt}>All Followup's</Text>
              </View>
            </View>
          )
        }}
      />
      <Stack.Screen
        name="ImportedLead"
        component={ImportedLead}
        options={{
          headerTitle: () => (
            <View>
              <View style={styles.headTitle}>
                <Text style={styles.headTitleTxt}>Imported Lead's</Text>
              </View>
            </View>
          )
        }}
      />
      <Stack.Screen
        name="UnAssignedLeads"
        component={UnAssignedLeads}
        options={{
          headerTitle: () => (
            <View>
              <View style={styles.headTitle}>
                <Text style={styles.headTitleTxt}>UnAssigned Lead's</Text>
              </View>
            </View>
          )
        }}
      />
      <Stack.Screen
        name="EditFollowup"
        component={EditFollowup}
        options={{
          headerTitle: () => (
            <View>
              <View style={styles.headTitle}>
                <Text style={styles.headTitleTxt}>Edit Followup</Text>
              </View>
            </View>
          )
        }}
      />
      <Stack.Screen
        name="ScheduleEv"
        component={ScheduleEv}
        options={{
          headerTitle: () => (
            <View>
              <View style={styles.headTitle}>
                <Text style={styles.headTitleTxt}>Schedule Event's</Text>
              </View>
            </View>
          )
        }}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{
          headerTitle: () => (
            <View>
              <View style={styles.headTitle}>
                <Text style={styles.headTitleTxt}>Notification</Text>
              </View>
            </View>
          )
        }}
      />
      <Stack.Screen
        name="CallLog"
        component={CallLog}
        options={{
          headerTitle: () => (
            <View>
              <View style={styles.headTitle}>
                <Text style={styles.headTitleTxt}>Call History</Text>
              </View>
            </View>
          )
        }}
      />
      <Stack.Screen
        name="WaInbox"
        component={WaInbox}
        options={{
          headerTitle: () => (
            <View>
              <View style={styles.headTitle}>
                <Text style={styles.headTitleTxt}>WA Inbox</Text>
              </View>
            </View>
          )
        }}
      />
      <Stack.Screen
        name="AnalyticReport"
        component={AnalyticReport}
        options={{
          headerTitle: () => (
            <View>
              <View style={styles.headTitle}>
                <Text style={styles.headTitleTxt}>Analytic Report's</Text>
              </View>
            </View>
          )
        }}
      />
      <Stack.Screen
        name="Analytics"
        component={Analytics}
        options={{
          headerTitle: () => (
            <View>
              <View style={styles.headTitle}>
                <Text style={styles.headTitleTxt}>Analytic's</Text>
              </View>
            </View>
          )
        }}
      />
    </Stack.Navigator>
  )
};

const Drawer = createDrawerNavigator();

const DrawerNav = ({ isAuthenticated }) => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        drawerActiveBackgroundColor: '#c02221',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
        headerTintColor: '#ffffff',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#c02221',
        },
        drawerLabelStyle: {
          marginLeft: -25,
          fontSize: 13,
        },
        drawerStyle: {
          width: 240,
          backgroundColor: '#ffffff',
        },
      }}>
      <Drawer.Screen
        name="Home"
        component={StackNav}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <Ionicons
              name='home'
              size={20}
            />
          )
        }}
      />
    </Drawer.Navigator>
  )
}

const App = () => {

  const [isAuthenticated, setAuthenticated] = useState('');

  useEffect(() => {
    const getToken = async () => {
      const userToken = await AsyncStorage.getItem('role');
      setAuthenticated(userToken || '');
    }
    getToken();
  }, [])

  // useEffect(() => {
  //   getDeviceToken();
  // }, []);
  // const getDeviceToken = async () => {
  //   let token = await messaging().getToken();
  //   console.log('tokendddd', token);
  // };
  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     Alert.alert('A new FCM message arrived in forground mode', JSON.stringify(remoteMessage));
  //   });
  //   return unsubscribe;
  // }, []);

  return (
    <NavigationContainer>
      <DrawerNav isAuthenticated={isAuthenticated} />
    </NavigationContainer>
  )
};

export default App;

const styles = StyleSheet.create({
  headerRight: {
    alignSelf: "center",
    flexDirection: 'row',
  },
  headerRightItem: {
    marginLeft: 11,
  },
  headerCenter: {

  },
  searchInput: {
    width: '75%',
    height: 30,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 15,
  },
  searchInputIcon: {
    width: 18,
    height: 18,
    marginRight: 5,
    opacity: 0.5,
  },
  headTitle: {
    width: '100%',
    height: 30,
    alignItems: 'center',
    flexDirection: 'row',
  },
  headTitleTxt: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  countIcon: {
    width: scale(14),
    height: scale(14),
    backgroundColor: '#FFDE00',
    position: 'absolute',
    left: 14,
    top: -2,
    zIndex: 1,
    borderRadius: 50,
    textAlign: 'center',
    fontSize: 8,
    fontWeight: '700',
  },
  waCountIcon: {
    width: scale(14),
    height: scale(14),
    backgroundColor: '#22c55e',
    color: '#fff',
    position: 'absolute',
    left: 14,
    top: -2,
    zIndex: 1,
    borderRadius: 50,
    textAlign: 'center',
    fontSize: 8,
    fontWeight: '700',
  },
});