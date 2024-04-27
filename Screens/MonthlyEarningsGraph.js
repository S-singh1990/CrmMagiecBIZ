import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

import { PROCESS_KEY } from "@env";

const MonthlyEarningsGraph = () => {
  const [data133, setdata] = useState([]);

  const Income_Graph_Overview = async () => {
    try {
      const responce = await axios.get(
        `${PROCESS_KEY}/Income_Graph_Overview`
      );
      setdata(responce?.data?.monthlyIncom);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const get = async () => {
      await Income_Graph_Overview();
    };
    get();
  }, [Income_Graph_Overview]);

  const data = [
    { name: 'Jan-Mar', income: data133['0'] ? data133['0'] : 0, color: '#50C878' },
    { name: 'Apr-Jun', income: data133['1'] ? data133['1'] : 0, color: '#E0115F' },
    { name: 'July-Sep', income: data133['2'] ? data133['2'] : 0, color: '#007FFF' },
    { name: 'Oct-Dec', income: data133['3'] ? data133['3'] : 0, color: '#FF7F00' },
    // { name: 'May', income: data133['4'] ? data133['4'] : 0, color: '#00CC00' },
    // { name: 'June', income: data133['5'] ? data133['5'] : 0, color: '#FFD800' },
    // { name: 'July', income: data133['6'] ? data133['6'] : 0, color: '#000099' },
    // { name: 'August', income: data133['7'] ? data133['7'] : 0, color: '#228B22' },
    // { name: 'September', income: data133['8'] ? data133['8'] : 0, color: '#EE82EE' },
    // { name: 'October', income: data133['9'] ? data133['9'] : 0, color: '#8B008B' },
    // { name: 'November', income: data133['10'] ? data133['10'] : 0, color: '#FF1744' },
    // { name: 'December', income: data133['11'] ? data133['11'] : 0, color: '#507642' },
  ];

  return (
    <View style={styles.container}>
      <BarChart
        data={{
          labels: data.map((entry) => entry.name),
          datasets: [
            {
              data: data.map((entry) => entry.income),
            },
          ],
        }}
        width={335}
        height={200}
        chartConfig={{
          backgroundGradientFrom: '#ffedd5',
          backgroundGradientTo: '#ffedd5',
          color: (opacity = 1) => `rgba(124, 45, 18, ${opacity})`,
        }}
        style={{ marginVertical: 1, borderRadius: 5 }}
      />
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

export default MonthlyEarningsGraph;
