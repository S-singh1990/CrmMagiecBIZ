import React from "react";
import { StyleSheet, Text, View, } from "react-native";
import { moderateVerticalScale } from 'react-native-size-matters'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ScrollView } from "react-native-gesture-handler";
import LeadSourceGraph from "./LeadSourceGraph";
import CallReportsGraph from "./CallReportsGraph";
import ProductServicesReportGraph from "./ProductServicesReportGraph";
import EmployeeIncomeReportGraph from "./EmployeeIncomeReportGraph";
import BottomNav from "../Components/BottomNav";

const Reports = () => {

    return (
        <>
            <ScrollView>
                <View style={styles.mainContainer}>

                    <View style={styles.graphWraper}>
                        <View style={styles.graphWraperInn}>
                            <View style={styles.taskhead}>
                                <View style={styles.cardLeftView}>
                                    <Text style={styles.cardLeftViewHead}>Employees Income Report's</Text>
                                    <Text style={styles.cardLeftTxt}>Yearly Earnings</Text>
                                </View>
                                <View style={styles.cardRightView}>
                                    <Text style={styles.cardRightViewHead}>
                                        <Ionicons name="ellipsis-vertical" size={22} />
                                    </Text>
                                </View>
                            </View>
                            <EmployeeIncomeReportGraph />
                        </View>
                    </View>

                    <View style={styles.graphWraper}>
                        <View style={styles.graphWraperInn}>
                            <View style={styles.taskhead}>
                                <View style={styles.cardLeftView}>
                                    <Text style={styles.cardLeftViewHead}>Product Service Report's</Text>
                                    <Text style={styles.cardLeftTxt}>Yearly Earnings</Text>
                                </View>
                                <View style={styles.cardRightView}>
                                    <Text style={styles.cardRightViewHead}>
                                        <Ionicons name="ellipsis-vertical" size={22} />
                                    </Text>
                                </View>
                            </View>
                            <ProductServicesReportGraph />
                        </View>
                    </View>

                    <View style={styles.graphWraper}>
                        <View style={styles.graphWraperInn}>
                            <View style={styles.taskhead}>
                                <View style={styles.cardLeftView}>
                                    <Text style={styles.cardLeftViewHead}>Call Report's</Text>
                                    <Text style={styles.cardLeftTxt}>Yearly Earnings</Text>
                                </View>
                                <View style={styles.cardRightView}>
                                    <Text style={styles.cardRightViewHead}>
                                        <Ionicons name="ellipsis-vertical" size={22} />
                                    </Text>
                                </View>
                            </View>
                            <CallReportsGraph />
                        </View>
                    </View>

                    <View style={styles.graphWraper}>
                        <View style={styles.graphWraperInn}>
                            <View style={styles.taskhead}>
                                <View style={styles.cardLeftView}>
                                    <Text style={styles.cardLeftViewHead}>Lead Source Report's</Text>
                                    <Text style={styles.cardLeftTxt}>Yearly Earnings</Text>
                                </View>
                                <View style={styles.cardRightView}>
                                    <Text style={styles.cardRightViewHead}>
                                        <Ionicons name="ellipsis-vertical" size={22} />
                                    </Text>
                                </View>
                            </View>
                            <LeadSourceGraph />
                        </View>
                    </View>

                </View>
            </ScrollView>
            <BottomNav />
        </>
    )
};

export default Reports;

const styles = StyleSheet.create({
    mainContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: '#f5f9fd',
        paddingHorizontal: 15,
        paddingVertical: 20,
    },
    graphWraper: {
        width: '100%',
        borderRadius: 5,
        alignItems: 'center',
        marginTop: moderateVerticalScale(10),
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        elevation: 20,
        borderWidth: 1,
        borderColor: '#e8e8e8',
        padding: 20,
        marginBottom: 15,
    },
    graphWraperInn: {
        width: '100%',
    },
    taskhead: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        fontFamily: 'Poppins-Regular',
        marginBottom: 25,
    },
    cardLeftViewHead: {
        fontSize: 17,
        fontWeight: '600',
        color: '#5d596c',
        fontFamily: 'Poppins-Regular',
    },
    cardLeftTxt: {
        fontSize: 13,
        fontWeight: '500',
        color: '#5d596c',
        fontFamily: 'Poppins-Regular',
        marginTop: 2,
    },
    cardRightViewHead: {
        color: '#a5a3ae',
        marginTop: 7,
    },
    cardLeftView: {

    },
    cardRightView: {
        alignItems: 'center',
    },
})