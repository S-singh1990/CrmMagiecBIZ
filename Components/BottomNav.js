import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { scale, verticalScale } from 'react-native-size-matters'
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const BottomNav = () => {
  const navigation = useNavigation()
  return (

    <View style={styles.container}>

      <View style={styles.bottomNav}>
        <View style={styles.bottomNavInn}>
          <TouchableOpacity
            style={styles.bottomTab}
            onPress={() => {
              navigation.navigate("Home");
            }}
          >
            <View
              style={[
                styles.tabIconBg,
                { backgroundColor: '#c02221' }
              ]}>
              <Image
                source={require('../assets/images/home.png')}
                style={[styles.tabIcon, { tintColor: 'white' }]}
              />
            </View>
            <Text
              style={[
                styles.Icontext, { color: '#222' }
              ]}>
              Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomTab}
            onPress={() => {
              navigation.navigate("AddLead");
            }}
          >
            <View
              style={[
                styles.tabIconBg, { backgroundColor: '#c02221' }
              ]}>
              <Image
                source={require('../assets/images/all-leads.png')}
                style={[styles.tabIcon, { tintColor: 'white' }]}
              />
            </View>
            <Text
              style={[
                styles.Icontext, { color: '#222' }
              ]}>
              Add Lead
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomTab}
            onPress={() => {
              navigation.navigate("FollowupLead");
            }}
          >
            <View
              style={[
                styles.tabIconBg, { backgroundColor: '#c02221' }
              ]}>
              <Image
                source={require('../assets/images/layers.png')}
                style={[styles.tabIcon, { tintColor: 'white' }]}
              />
            </View>
            <Text
              style={[
                styles.Icontext, { color: '#222' }
              ]}>
              Followup's
            </Text>
          </TouchableOpacity>


        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  bottomNav: {
    width: '100%',
    height: verticalScale(45),
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    shadowColor: '#000',
    elevation: 12,

  },
  bottomNavInn: {
    width: '100%',
    height: verticalScale(45),
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#b2b2b2',
    borderTopWidth: 1,
  },
  bottomTab: {
    width: '33%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconBg: {
    width: scale(20),
    height: scale(20),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabIcon: {
    width: scale(12),
    height: scale(12),
    tintColor: 'white'
  },
  Icontext: {
    fontWeight: '700',
    fontSize: 10,
  },

})

export default BottomNav
