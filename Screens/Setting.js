import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import BottomNav from '../Components/BottomNav';

const Setting = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>

        <View style={styles.commonHead}>
          <View style={styles.commonHeadLeft}>
            <Text style={styles.commonHeadLeftTxt}>Setting</Text>
          </View>
          {/* <View style={styles.commonHeadRight}>
                <Text style={styles.commonHeadRightTxt}
                  onPress={() => {
                    navigation.openDrawer();
                  }}
                >
                  <Ionicons name="arrow-back" size={20} />
                </Text>
              </View> */}
          <View style={styles.commonHeadRight}>
            <Text style={styles.commonHeadRightTxt}>
              <Ionicons name="ellipsis-vertical" size={20} />
            </Text>
          </View>
        </View>

        <View style={styles.cardWraper}>
          <View style={styles.cardWraperInn}>

          </View>
        </View>

      </View>
      <BottomNav />
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#f5f9fd',
  },
  mainContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: '#f5f9fd',
    paddingHorizontal: 15,
  },
  commonHead: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    fontFamily: 'Poppins-Regular',
    marginTop: 20,
    marginBottom: 20,
  },
  commonHeadLeft: {
    marginTop: 5,
  },
  commonHeadLeftTxt: {
    fontSize: 18,
    fontWeight: '700',
    color: '#c02221',
    fontFamily: 'Poppins-Regular',
  },
  cardLeftTxt: {
    fontSize: 13,
    fontWeight: '500',
    color: '#5d596c',
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
  commonHeadRight: {
    alignItems: 'center',
  },
  commonHeadRightTxt: {
    color: '#c02221',
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    elevation: 5,
    borderRadius: 5,
  },

});

export default Setting;
