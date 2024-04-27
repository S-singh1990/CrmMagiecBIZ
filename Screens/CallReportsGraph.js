import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { ActivityIndicator } from 'react-native';
import { PROCESS_KEY } from "@env";

const CallReportsGraph = () => {
  const [leadsource, setLeadSource] = useState([]);
  const [leadsourcedata, setLeadSourceData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    getAllLeadSourceOverview();
  }, []);

  const data = leadsource.map((source, index) => ({
    name: source,
    Lead_source_count: leadsourcedata[index] || 0,
    color: `rgba(190, 18, 60, ${index / leadsource.length})`,
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
            color: (opacity = 1) => `rgba(190, 18, 60, ${opacity})`,
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

export default CallReportsGraph