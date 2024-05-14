import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { TextInput } from 'react-native'
import { moderateScale, moderateVerticalScale, scale, verticalScale } from 'react-native-size-matters'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PieChart } from 'react-native-chart-kit';
import { ScrollView } from "react-native-gesture-handler";
import BottomNav from "../Components/BottomNav";
import { PROCESS_KEY } from "@env";

const Analytics = () => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedDate1, setSelectedDate1] = useState('');
    const [inputDate, setInputDate] = useState('');
    const [inputDate1, setInputDate1] = useState('');
    useEffect(() => {
    }, []);

    const [data1, setData] = useState();

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const showDatePicker1 = () => {
        setDatePickerVisibility1(true);
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const hideDatePicker1 = () => {
        setDatePickerVisibility1(false);
    };

    const handleConfirm = (date) => {

        hideDatePicker();
        const formattedDate = date.toISOString();
        setSelectedDate(formattedDate.split('T')['0']);
        setInputDate(formattedDate.split('T')['0']);
        // handleInputChange('start_date', formattedDate.split('T')['0']);
        setData({
            ...data1, 'start_date': formattedDate?.split('T')['0'],
        });


    };

    const handleConfirm1 = (date) => {
        hideDatePicker1();
        const formattedDate = date.toISOString();
        setSelectedDate1(formattedDate.split('T')['0']);
        setInputDate1(formattedDate.split('T')['0']);
        setData({
            ...data1, 'end_date': formattedDate?.split('T')['0'],
        });


    };
    const [isAuthenticated, setAuthenticated] = useState('');
    const [alldata, setalldata] = useState();
    const getuser = async () => {
        const userToken = await AsyncStorage.getItem('user_id');
        if (userToken) {
            setAuthenticated(userToken);
        } else {
            setAuthenticated('');
        }
    }


    useEffect(() => {
        const checkAuthentication = async () => {
            await getuser();
        };
        checkAuthentication();
    }, [getuser]);


    console.log(isAuthenticated, 'isAuthenticated')
    const submitLead1 = async () => {

        const ddddd = ({ ...data1, 'user_id': isAuthenticated })
        console.log(ddddd)
        const apiUrl = `${PROCESS_KEY}/get_call_log_by_id_date`;
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ddddd),
            });
            if (!response.ok) {
                showAlert('Something Wrong')
            }
            const data = await response.json();

            setalldata(data?.details);

        } catch (error) {
            console.error('Error:', error);
        }
    };
    useEffect(() => {

        const checkAuthentication1 = async () => {

            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1; // Note: Months are zero-based
            const day = currentDate.getDate();

            const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

            setData({
                ...data1, 'start_date': formattedDate, 'end_date': formattedDate
            })

            await submitLead1();
        };
        checkAuthentication1();
    }, [isAuthenticated,]);
    const submitLead = async () => {

        const ddddd = ({ ...data1, 'user_id': isAuthenticated })

        const apiUrl = `${PROCESS_KEY}/get_call_log_by_id_date`;
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ddddd),
            });
            if (!response.ok) {
                showAlert('Something Wrong')
            }
            const data = await response.json();

            setalldata(data?.details);

        } catch (error) {
            console.error('Error:', error);
        }
    };


    const data22 = [
        {
            name: 'Incoming Calls',
            population: alldata ? alldata['0'].totalIncommingCall : 0,
            color: 'rgba(131, 167, 234, 1)',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
        },
        {
            name: 'Outgoing Calls',
            population: alldata ? alldata['0'].totalOutgoingCall : 0,
            color: 'rgba(0, 170, 255, 1)',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
        },
        {
            name: 'Misses Calls',
            population: alldata ? alldata['0'].totalMissCall : 0,
            color: 'rgba(0, 255, 0, 1)',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
        },
        {
            name: 'Rejected Calls',
            population: alldata ? alldata['0'].totalRejectedCall : 0,
            color: 'rgba(255, 0, 0, 1)',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
        },

    ];

    return (
        <>
            <View style={styles.mainContainer}>
                <ScrollView>
                    {/* date code start */}
                    <View style={[styles.inputContainer, { marginTop: 25, marginBottom: 10 }]}>
                        {/* <Text style={styles.inputHeader}>Reports</Text> */}
                        <View style={styles.inputFrame}>
                            <View style={styles.inputFrameInn}>
                                <View style={styles.FrameDtime}>
                                    <View style={styles.btnCalender}>
                                        <TouchableOpacity onPress={showDatePicker} style={styles.btnDate}>
                                            <TextInput
                                                placeholderTextColor="#9e9e9e"
                                                style={{ color: '#000' }}
                                                placeholder="Select From Date"
                                                value={inputDate}
                                                editable={false}
                                            />
                                            <DateTimePickerModal
                                                isVisible={isDatePickerVisible}
                                                onConfirm={handleConfirm}
                                                onCancel={hideDatePicker}
                                                mode={'date'}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.btnCalender}>
                                        <TouchableOpacity onPress={showDatePicker1} style={styles.btnDate}>
                                            <TextInput
                                                placeholderTextColor="#9e9e9e"
                                                style={{ color: '#000' }}
                                                placeholder="Select To Date"
                                                value={inputDate1}
                                                editable={false}
                                            />
                                            <DateTimePickerModal
                                                isVisible={isDatePickerVisible1}
                                                onConfirm={handleConfirm1}
                                                onCancel={hideDatePicker1}
                                                mode={'date'}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View>
                            <TouchableOpacity
                                style={styles.btnLog}
                                onPress={submitLead}
                            >
                                <Text style={styles.btnLogtx}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* date code end */}

                    <View style={styles.secHead}>
                        <Text style={styles.secHeadTxt}>Summary</Text>
                    </View>
                    <View>
                        {/* graph */}
                        <TouchableOpacity style={styles.graph}>
                            <View style={styles.graphInn}>

                                <PieChart
                                    data={data22}
                                    width={350}
                                    height={200}
                                    chartConfig={{
                                        backgroundGradientFrom: '#1E2923',
                                        backgroundGradientFromOpacity: 0,
                                        backgroundGradientTo: '#08130D',
                                        backgroundGradientToOpacity: 0.5,
                                        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                                        strokeWidth: 2, // optional, default 3
                                        barPercentage: 0.5,
                                    }}
                                    accessor="population"
                                    backgroundColor="transparent"
                                    paddingLeft="-5"
                                    absolute
                                />

                            </View>
                        </TouchableOpacity>
                        {/* graph */}
                    </View>

                    <View style={styles.cardWraper}>
                        <View style={styles.cardWraperInn}>

                            <TouchableOpacity style={styles.card}>
                                <View style={styles.cardInn}>
                                    <View style={styles.cardRowF}>
                                        <Image source={require('../assets/images/a1.png')} style={styles.iconF} />
                                        <Text style={styles.cardTxtF}>
                                            Total Phone Calls
                                        </Text>
                                    </View>
                                    <View style={styles.cardRowS}>
                                        <Image source={require('../assets/images/call.png')} style={styles.iconS} />
                                        <Text style={styles.cardTxtS}>
                                            {alldata ? alldata['0'].totalCall : 'N/A'}
                                        </Text>
                                    </View>
                                    <View style={styles.cardRowT}>
                                        <Image source={require('../assets/images/alarm.png')} style={styles.iconT} />
                                        <Text style={styles.cardTxtT}>
                                            {alldata ? alldata['0'].totalDuration : 'N/A'}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.card}>
                                <View style={styles.cardInn}>
                                    <View style={styles.cardRowF}>
                                        <Image source={require('../assets/images/a2.png')} style={styles.iconF} />
                                        <Text style={styles.cardTxtF}>
                                            Incoming Calls
                                        </Text>
                                    </View>
                                    <View style={styles.cardRowS}>
                                        <Image source={require('../assets/images/call.png')} style={styles.iconS} />
                                        <Text style={styles.cardTxtS}>

                                            {alldata ? alldata['0'].totalIncommingCall : 'N/A'}
                                        </Text>
                                    </View>
                                    <View style={styles.cardRowT}>
                                        <Image source={require('../assets/images/alarm.png')} style={styles.iconT} />
                                        <Text style={styles.cardTxtT}>

                                            {alldata ? alldata['0'].totalIncommingDuration : 'N/A'}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.cardWraper}>
                        <View style={styles.cardWraperInn}>
                            <TouchableOpacity style={styles.card}>
                                <View style={styles.cardInn}>
                                    <View style={styles.cardRowF}>
                                        <Image source={require('../assets/images/a3.png')} style={styles.iconF} />
                                        <Text style={styles.cardTxtF}>
                                            Outgoing Calls
                                        </Text>
                                    </View>
                                    <View style={styles.cardRowS}>
                                        <Image source={require('../assets/images/call.png')} style={styles.iconS} />
                                        <Text style={styles.cardTxtS}>
                                            {/* { alldata['0']?.totalOutgoingCall  } */}
                                            {alldata ? alldata['0'].totalOutgoingCall : 'N/A'}
                                        </Text>
                                    </View>
                                    <View style={styles.cardRowT}>
                                        <Image source={require('../assets/images/alarm.png')} style={styles.iconT} />
                                        <Text style={styles.cardTxtT}>
                                            {/* { alldata['0']?.totalOutgoingDuration  } */}
                                            {alldata ? alldata['0'].totalOutgoingDuration : 'N/A'}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.card}>
                                <View style={styles.cardInn}>
                                    <View style={styles.cardRowF}>
                                        <Image source={require('../assets/images/a4.png')} style={styles.iconF} />
                                        <Text style={styles.cardTxtF}>
                                            Missed Calls
                                        </Text>
                                    </View>
                                    <View style={styles.cardRowS}>
                                        <Image source={require('../assets/images/call.png')} style={styles.iconS} />
                                        <Text style={styles.cardTxtS}>
                                            {/* { alldata['0']?.totalMissCall  } */}
                                            {alldata ? alldata['0'].totalMissCall : 'N/A'}
                                        </Text>
                                    </View>
                                    <View style={styles.cardRowT}>
                                        <Image source={require('../assets/images/alarm.png')} style={styles.iconT} />
                                        <Text style={styles.cardTxtT}>
                                            0m 0s
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.cardWraper, { marginBottom: 100 }]}>
                        <View style={styles.cardWraperInn}>
                            <TouchableOpacity style={styles.card}>
                                <View style={styles.cardInn}>
                                    <View style={styles.cardRowF}>
                                        <Image source={require('../assets/images/a5.png')} style={styles.iconF} />
                                        <Text style={styles.cardTxtF}>
                                            Rejected Calls
                                        </Text>
                                    </View>
                                    <View style={styles.cardRowS}>
                                        <Image source={require('../assets/images/call.png')} style={styles.iconS} />
                                        <Text style={styles.cardTxtS}>
                                            {/* { alldata['0']?.totalRejectedCall  } */}
                                            {alldata ? alldata['0'].totalRejectedCall : 'N/A'}
                                        </Text>
                                    </View>
                                    <View style={styles.cardRowT}>
                                        <Image source={require('../assets/images/alarm.png')} style={styles.iconT} />
                                        <Text style={styles.cardTxtT}>
                                            0m 0s
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
            <BottomNav />
        </>
    )
};

export default Analytics

const styles = StyleSheet.create({

    btnCalender: {
        width: '48%',
        marginRight: 10,
    },

    btnDate: {
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        height: 45,
        borderRadius: 5,
        fontFamily: "regular",
        marginTop: moderateScale(3),
        marginBottom: moderateScale(5),
        fontSize: 13,
    },
    btnSelectDate: {
        Color: "#999999",
        textAlign: "center",
        fontSize: 13,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 20,
    },

    inputContainer: {
        backgroundColor: "#fff",
        borderRadius: 5,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        shadowColor: '#000',
        elevation: 5,
    },
    inputHeader: {
        fontSize: 15,
        fontWeight: "500",
        textAlign: "center",
        color: "#344055",
        paddingBottom: 10,
        textTransform: "capitalize",
    },
    inputFrame: {
        width: '100%',
    },
    inputFrameInn: {
        textAlign: 'center',
        backgroundColor: '#fff',
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%',
    },
    FrameInput: {
        width: '100%',
    },
    FrameDtime: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputStyle: {
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        paddingLeft: 15,
        height: 45,
        borderRadius: 5,
        fontFamily: "regular",
        marginTop: moderateScale(3),
        marginBottom: moderateScale(5),
        fontSize: 13,
    },
    checkbox: {

    },
    btnLog: {
        backgroundColor: "#22c55e",
        Color: "#ffffff",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        textAlign: "center",
    },
    btnLogtx: {
        color: "#fff",
        textAlign: "center",
        fontSize: 16,
    },
    btnBtxt: {
        Color: "#ffffff",
        marginTop: 15,
        textAlign: "center"

    },

    mainContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: '#f5f9fd',
        paddingHorizontal: 10,
    },
    commonHead: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        fontFamily: 'Poppins-Regular',
        marginTop: 30,
        marginBottom: 10,
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
    graphWraper: {
        width: '100%',
        // height: verticalScale(130),
        borderRadius: 5,
        alignItems: 'center',
        marginTop: moderateVerticalScale(10),
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        elevation: 20,
    },
    graphWraperInn: {
        width: '100%',
    },
    cardWraper: {
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
    },
    cardWraperInn: {
        width: '100%',
        flexDirection: 'row',
    },
    card: {
        width: '48%',
        height: verticalScale(105),
        borderRadius: 5,
        alignItems: 'center',
        marginTop: moderateVerticalScale(13),
        marginRight: moderateVerticalScale(13),
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        elevation: 5,
    },
    graph: {
        width: '100%',
        height: verticalScale(205),
        borderRadius: 5,
        alignItems: 'center',
        marginTop: moderateVerticalScale(13),
        marginRight: moderateVerticalScale(13),
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        elevation: 5,
    },
    cardInn: {
        width: '100%',
    },
    graphInn: {
        width: '100%',
    },
    cardHead: {
        fontSize: moderateScale(10),
        fontWeight: '700',
        alignItems: 'center',
        color: '#000',
        justifyContent: 'center',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    cardSubHead: {
        fontSize: moderateScale(12),
        fontWeight: '500',
        alignItems: 'center',
        color: '#000',
        justifyContent: 'center',
        textAlign: 'center',
        paddingTop: 5,
    },
    cardIcons: {
        fontSize: moderateScale(30),
        alignItems: 'center',
        color: '#000',
        justifyContent: 'center',
        textAlign: 'center',
        paddingBottom: 5,
    },
    cardRowF: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconF: {
        width: scale(25),
        height: scale(25),
        marginRight: 7,
    },
    cardTxtF: {
        color: '#000',
        fontWeight: '400',
        fontSize: moderateScale(12),
    },
    cardRowS: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateVerticalScale(8),
    },
    iconS: {
        width: scale(18),
        height: scale(18),
        marginRight: 7,
    },
    cardTxtS: {
        color: '#000',
        fontWeight: '500',
        fontSize: moderateScale(15),
    },
    cardRowT: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateVerticalScale(8),
    },
    iconT: {
        width: scale(18),
        height: scale(18),
        marginRight: 7,
    },
    cardTxtT: {
        color: '#000',
        fontWeight: '500',
        fontSize: moderateScale(15),
    },
    secHead: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center'
    },
    secHeadTxt: {
        fontSize: moderateScale(15),
        marginTop: moderateVerticalScale(20),
        fontWeight: '500',
        color: '#000',
        justifyContent: 'center',
        textAlign: "center"
    },

})
