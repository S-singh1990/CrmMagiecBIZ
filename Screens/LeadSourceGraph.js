import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PROCESS_KEY } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LeadSourceGraph = () => {
  const [leadsource, setLeadSource] = useState([]);
  const [leadsourcedata, setLeadSourceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState('');
  const [refreshFlag, setRefreshFlag] = useState(false);
  const navigation = useNavigation();
  const [role, setRole] = useState('');

  const setUserIdAndRole = async () => {
    try {
      const userToken = await AsyncStorage.getItem('user_id');
      const userRole = await AsyncStorage.getItem('role');
      // console.log('userRole:', userRole);
      if (userToken) {
        setAuthenticated(userToken);
      }
      if (userRole) {
        setRole(userRole);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await setUserIdAndRole();
    };
    fetchData();
    const onFocus = navigation.addListener('focus', () => {
      setRefreshFlag((prevFlag) => !prevFlag);
    });
    return () => {
      onFocus();
    };
  }, [navigation, refreshFlag]);

  const getAllLeadSourceOverview = async () => {
    try {
      const response = await axios.get(
        `${PROCESS_KEY}/lead_source_overview_api`
      );
      setLeadSourceData(response?.data?.Lead_source_count || []);
      setLeadSource(response?.data?.Lead_source_name || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const LeadSourceOverviewApiForTeamLeader = async () => {
    try {
      const responce = await axios.post(
        `${PROCESS_KEY}/LeadSourceOverviewApiForTeamLeader`, { role: role, user_id: isAuthenticated },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      setLeadSourceData(responce?.data?.Lead_source_count);
      setLeadSource(responce?.data?.Lead_source_name);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const LeadSourceOverviewApiForUser = async () => {
    try {
      const responce = await axios.post(
        `${PROCESS_KEY}/LeadSourceOverviewApiForUser`, { role: role, user_id: isAuthenticated },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      setLeadSourceData(responce?.data?.Lead_source_count);
      setLeadSource(responce?.data?.Lead_source_name);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (role === "admin") {
      getAllLeadSourceOverview();
    } else if (role === "TeamLeader") {
      LeadSourceOverviewApiForTeamLeader();
    } else {
      LeadSourceOverviewApiForUser();
    }
  }, [role, isAuthenticated, refreshFlag]);

  const data = leadsource.map((source, index) => ({
    name: source,
    Lead_source_count: leadsourcedata[index] || 0,
    color: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`,
  }));


  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <PieChart
          data={data}
          width={360}
          height={250}
          chartConfig={{
            backgroundGradientFrom: '#1E2923',
            backgroundGradientTo: '#08130D',
            color: (opacity = 1) => `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${opacity})`,
          }}
          accessor="Lead_source_count"
          backgroundColor="transparent"
          paddingLeft="25"
          absolute
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LeadSourceGraph;
