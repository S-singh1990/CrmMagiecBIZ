import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { scale, moderateScale, moderateVerticalScale } from 'react-native-size-matters';
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import BottomNav from '../Components/BottomNav';
import { PROCESS_KEY } from "@env";

const CustomLoader = () => (
    <View style={styles.loaderContainer}>
        <View style={styles.loaderImageContainer}>
            <Image source={require('../assets/images/mobile-loader.gif')} style={styles.loaderImage} />
        </View>
    </View>
);

const ScheduleEv = () => {
    const [isLoading, setLoading] = useState(true);
    const navigation = useNavigation()
    const [data, setdata] = useState([]);
    const [isAuthenticated, setAuthenticated] = useState('');
    const [role, setrole] = useState('');
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [search, setSearch] = useState([]);
    const [searchtext, setsearchtext] = useState('');
    const [visibleDataCount, setVisibleDataCount] = useState(10);

    const route = useRoute();
    const { leadId } = route.params;

    const onSearch = (text) => {
        setsearchtext(text)
        if (!text == '') {
            setdata(search);
        }
        // else {
        let tempList = data.filter(Item => {
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

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const userToken = await AsyncStorage.getItem('user_id');
                const userrole = await AsyncStorage.getItem('role');
                if (userToken) {
                    setAuthenticated(userToken);
                }
                if (userrole) {
                    setrole(userrole);
                }
            } catch (error) {
                console.log(error);
            }
        };

        checkAuthentication();

        const onFocus = navigation.addListener('focus', () => {
            setRefreshFlag(prevFlag => !prevFlag);
        });

        return () => {
            onFocus();
        };
    }, [navigation]);

    useEffect(() => {
        if (isAuthenticated && role) {
            getLeadbyScheduleEventid();
        }
    }, [isAuthenticated, role, leadId]);

    const getLeadbyScheduleEventid = async () => {
        const datas = {
            assign_to_agent: isAuthenticated,
            role: role,
            status_id: leadId,
        }
        console.log('role', datas)
        try {
            const response = await axios.post(
                `${PROCESS_KEY}/getLeadbyScheduleEventid`,
                {
                    assign_to_agent: isAuthenticated,
                    role: role,
                    status_id: leadId,
                },
            );
            if (!response) {
                console.error('No response received from the server.');
                return;
            }
            const responseData = response.data;
            console.log('responseData', responseData)
            if (!responseData) {
                console.error('Response data is empty.');
                return;
            }
            if (responseData.success === true) {
                setLoading(false);
                const allData = [...responseData.lead, ...(responseData.adminData || [])];
                setdata(allData);
                setSearch(allData);
            } else {
                setLoading(false);
                setdata([]);
                setSearch([]);
                console.error('Error fetching data:', responseData.message || 'Unknown error.');
            }
        } catch (error) {
            setLoading(false);
            // setdata([]);
            // setSearch([]);
            console.error('Error fetching data:', error.message || 'Unknown error.');
        }
    };

    const ScheduleEv = (leadId) => {
        navigation.navigate("EditFollowup", { leadId })
    }

    return (
        <View style={styles.container}>
            <View style={styles.mainContainer}>
                {isLoading ? (
                    <CustomLoader />
                ) : (
                    <ScrollView>

                        {!data || data.length === 0 ? (<>
                            <View style={styles.notData}>
                                <Text style={styles.notDataTxt}>
                                    No Leads Found
                                </Text>
                            </View>
                        </>) : (
                            <>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 25, marginBottom: 10, paddingHorizontal: 15, }}>
                                    <View style={{
                                        width: '100%',
                                        height: 40,
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        borderRadius: 30,
                                        borderWidth: 1,
                                        borderColor: "rgba(0,0,0,0.4)",
                                        paddingLeft: 15,
                                    }}>
                                        <Image
                                            source={require('../assets/images/search.png')}
                                            style={{ width: 22, height: 22, marginRight: 5, opacity: 0.5, }}
                                        />
                                        <TextInput
                                            style={{ width: '82%', color: '#9e9e9e' }}
                                            placeholder={'Search here...'}
                                            placeholderTextColor="#9e9e9e"
                                            value={searchtext}
                                            onChangeText={txt => {
                                                onSearch(txt);
                                                // setSearch(txt);
                                            }}
                                        />
                                        <TouchableOpacity
                                            style={{ marginRight: 15 }}
                                            onPress={ClearText}
                                        >
                                            <Image
                                                source={require('../assets/images/close.png')}
                                                style={{ width: 22, height: 22, opacity: 0.8, tintColor: '#f00' }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.cardWraper}>
                                    <View style={styles.cardWraperInn}>
                                        {
                                            data?.slice(0, visibleDataCount).map((daata) => {
                                                const datatime = daata?.followup_date;
                                                const contact_no = daata?.contact_no;
                                                const MobileNo = contact_no ? contact_no.toString().slice(-10) : '';
                                                return (
                                                    <View style={styles.cardWrap}>
                                                        <TouchableOpacity style={styles.card} key={daata._id}
                                                            onPress={() => ScheduleEv(daata._id)} >
                                                            <View style={styles.cardInn}>
                                                                <View style={styles.cardRowF}>
                                                                    <Image source={require('../assets/images/avatar5.png')} style={styles.iconF} />
                                                                    <Text style={styles.cardTxtF}>{daata.full_name}</Text>
                                                                    <Text style={styles.status}>
                                                                        {daata.status_details['0']?.status_name}
                                                                    </Text>
                                                                </View>
                                                                <View style={styles.cardRowS}>
                                                                    <Image source={require('../assets/images/call.png')} style={styles.iconS} />
                                                                    <Text style={styles.cardTxtS}>{daata?.contact_no}</Text>
                                                                    <Image source={require('../assets/images/settings.png')} style={styles.iconST} />
                                                                    <Text style={styles.source}>
                                                                        <Text style={styles.cardTxtST}>{daata.service_details['0']?.product_service_name}</Text>
                                                                    </Text>
                                                                </View>
                                                                {(daata?.followup_date) ?
                                                                    (
                                                                        <View style={styles.cardRowT}>
                                                                            <Image source={require('../assets/images/person.png')} style={styles.iconT} />
                                                                            <Text style={styles.cardTxtIV}>
                                                                                {daata?.agent_details['0']?.agent_name}
                                                                            </Text>
                                                                            <Image source={require('../assets/images/alarm.png')} style={styles.iconT} />
                                                                            <Text style={styles.cardTxtT}>
                                                                                {datatime.split('T')['0'] + ' ' + datatime.split('T')['1'].split('.')['0']}
                                                                            </Text>
                                                                        </View>
                                                                    ) : (
                                                                        <View style={styles.cardRowT}>
                                                                            <Image source={require('../assets/images/person.png')} style={styles.iconT} />
                                                                            <Text style={styles.cardTxtIV}>
                                                                                {(daata?.agent_details['0']?.agent_name) ? daata?.agent_details['0']?.agent_name : 'admin'}
                                                                            </Text>
                                                                        </View>
                                                                    )
                                                                }
                                                            </View>
                                                        </TouchableOpacity>
                                                        <View style={styles.cardCallTabs}>
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    Linking.openURL(`whatsapp://send?phone=+91${MobileNo}`);
                                                                }}
                                                                style={styles.collsimg}>
                                                                <Image source={require('../assets/images/whatsapp.png')} style={styles.iCall} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    Linking.openURL(`tel:+91${MobileNo}`);
                                                                }}
                                                                style={styles.collsimg2}>
                                                                <Image source={require('../assets/images/call.png')} style={styles.iCall} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                </View>
                            </>
                        )}

                        {data && data.length > visibleDataCount && (
                            <View style={[styles.loadMoreContainer, { marginBottom: 80 }]}>
                                <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreLeads}>
                                    <Text style={styles.loadMoreText}>Load More</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                )}
            </View>
            <BottomNav />
        </View>
    )
}

const styles = StyleSheet.create({
    collsimg: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#22c55e',
        width: scale(22),
        height: scale(18),
        borderRadius: 5,
        margin: 3,
    },
    collsimg2: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f43f5e',
        width: scale(22),
        height: scale(18),
        borderRadius: 5,
        margin: 3,
    },
    iCall: {
        width: scale(12),
        height: scale(12),
        tintColor: '#fff',
    },
    loadMoreContainer: {
        backgroundColor: "#fff",
        borderRadius: 5,
        paddingHorizontal: 15,
    },
    loadMoreButton: {
        fontSize: 14,
        fontWeight: "500",
        textAlign: "center",
        color: "#fff",
        backgroundColor: '#22c55e',
        textTransform: "capitalize",
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderRadius: 5,
    },
    loadMoreText: {
        fontSize: 14,
        fontWeight: "500",
        textAlign: "center",
        color: "#fff",
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 85,
        height: 85,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    loaderImage: {
        width: 80,
        height: 80,
        shadowColor: '#000',
        elevation: 5,
        borderRadius: 5,
    },
    notData: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notDataTxt: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor: '#fff',
    },
    mainContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: '#fff',
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
        flexDirection: 'row',
        marginBottom: moderateVerticalScale(50),
        paddingHorizontal: 15,
    },
    cardWraperInn: {
        width: '100%',
    },
    cardWrap: {
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#edf5fd',
        flexDirection: 'row',
    },
    card: {
        width: '90%',
        alignItems: 'center',
    },
    cardCallTabs: {
        alignItems: 'center',
    },
    cardInn: {
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
        borderRadius: 50,
    },
    cardTxtF: {
        color: '#727272',
        fontWeight: '600',
        fontSize: moderateScale(12),
        marginRight: 12,
    },
    status: {
        color: '#22c55e',
        fontWeight: '400',
        fontSize: moderateScale(11),
        alignItems: 'flex-end',
    },
    cardRowS: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateVerticalScale(4),
    },
    iconS: {
        width: scale(13),
        height: scale(13),
        marginRight: 7,
        tintColor: '#727272',
    },
    cardTxtS: {
        color: '#727272',
        fontWeight: '500',
        fontSize: moderateScale(12),
        marginRight: 15,
    },
    cardTxtST: {
        color: '#727272',
        fontWeight: '500',
        fontSize: moderateScale(11),
        marginLeft: 1,
    },
    source: {
        color: '#727272',
        fontWeight: '500',
        fontSize: moderateScale(13),
        marginLeft: 5,
    },
    cardRowT: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateVerticalScale(4),
    },
    iconT: {
        width: scale(13),
        height: scale(13),
        marginLeft: 5,
        marginRight: 5,
        tintColor: '#727272',
    },
    iconST: {
        width: scale(13),
        height: scale(13),
        tintColor: '#727272',
    },
    iconC: {
        color: '#727272',
        marginRight: moderateVerticalScale(8),
    },
    cardTxtT: {
        color: '#727272',
        fontWeight: '500',
        fontSize: moderateScale(12),
    },
    secHead: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center'
    },
    secHeadTxt: {
        fontSize: moderateScale(16),
        marginTop: moderateVerticalScale(20),
        fontWeight: '700',
        color: '#000',
        justifyContent: 'center',
        textAlign: "center"
    },
    cardRowIV: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateVerticalScale(8),
    },
    iconIV: {
        width: scale(16),
        height: scale(16),
        marginRight: 7,
        tintColor: '#02b053',
    },
    cardTxtIV: {
        color: '#727272',
        fontWeight: '500',
        fontSize: moderateScale(12),
        marginRight: 15,
    },
})

export default ScheduleEv

