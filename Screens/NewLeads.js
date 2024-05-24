import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, } from 'react-native';
import { scale, moderateScale, moderateVerticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import BottomNav from '../Components/BottomNav';
import { Dropdown } from 'react-native-element-dropdown';
import { PROCESS_KEY } from "@env";

const CustomLoader = () => (
    <View style={styles.loaderContainer}>
        <View style={styles.loaderImageContainer}>
            <Image source={require('../assets/images/mobile-loader.gif')} style={styles.loaderImage} />
        </View>
    </View>
);

const NewLeads = () => {
    const [isLoading, setLoading] = useState(true);
    const navigation = useNavigation()
    const [data, setdata] = useState([]);
    const [isAuthenticated, setAuthenticated] = useState('');
    const [role, setrole] = useState('');
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [search, setSearch] = useState([]);
    const [searchtext, setsearchtext] = useState('');
    const [visibleDataCount, setVisibleDataCount] = useState(10);

    const [agent, setagent] = useState([]);
    const [status, setstatus] = useState([]);
    const [isFocus, setIsFocus] = useState(false);
    const [value, setValue] = useState(null);
    const [showMsg, setShowMsg] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowMsg(true);
    };

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await fetch(
                    `${PROCESS_KEY}/all_lead_status`
                );
                const result = await response.json();
                const statustList = result?.leadstatus.map(status111 => ({
                    label: status111.status_name,
                    value: status111._id,
                }));
                setstatus(statustList);
                //setservices(result);  
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchStatus();
    }, [refreshFlag]);

    const getAllAgentWithData = async (data) => {
        try {
            const response = await fetch(`${PROCESS_KEY}/getAllAgentByTeamLeader`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (result.success === true) {
                const agentList = result?.agent.map(agent111 => ({
                    label: agent111.agent_name,
                    value: agent111._id,
                }));
                setagent(agentList);
            } else {
                if (result.message === 'Client must be connected before running operations') {
                    const secondResponse = await fetch(`${PROCESS_KEY}/getAllAgentByTeamLeader`, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    const secondResult = await secondResponse.json();
                    if (secondResult.success === true) {
                        const agentList = result?.agent.map(agent111 => ({
                            label: agent111.agent_name,
                            value: agent111._id,
                        }));
                        setagent(agentList);
                    }
                } else {
                    console.error(result.message);
                    return null;
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    };
    const getAllAgent = async (data) => {
        const role = await AsyncStorage.getItem('role');

        try {
            if (role === 'admin') {
                const response = await fetch(`${PROCESS_KEY}/get_all_agent`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const result = await response.json();
                console.log('result', result)
                if (result.success === true) {
                    const agentList = result?.agent.map(agent111 => ({
                        label: agent111.agent_name,
                        value: agent111._id,
                    }));
                    setagent(agentList);
                }
            } else if (role === 'user') {
                const response = await fetch(`${PROCESS_KEY}/getAllAgentofATeamByAgent`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();
                // console.log('rolerolefdff', result)
                if (result.success === true) {
                    const agentList = result?.agent.map(agent111 => ({
                        label: agent111.agent_name,
                        value: agent111._id,
                    }));
                    setagent(agentList);
                } else {
                    console.error(result.message);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const dispatchAgentAction = async () => {
        try {
            const role = await AsyncStorage.getItem('role');

            if (role === 'admin') {
                getAllAgent();
            } else if (role === 'TeamLeader') {
                const userId = await AsyncStorage.getItem('user_id');
                getAllAgentWithData({ assign_to_agent: userId });
            } else if (role === 'user') {
                const userId = await AsyncStorage.getItem('user_id');
                getAllAgent({ assign_to_agent: userId });
            }
        } catch (error) {
            console.error('Error dispatching agent action:', error);
        }
    };
    useEffect(() => {
        dispatchAgentAction();
    }, []);

    const [selectedItems, setSelectedItems] = useState([]);
    const [longPressActivated, setLongPressActivated] = useState(false);

    const handlePress = (id) => {
        if (selectedItems.length > 0) {
            if (longPressActivated) {
                const selectedIndex = selectedItems.indexOf(id);
                if (selectedIndex === -1) {
                    setSelectedItems([...selectedItems, id]);
                } else {
                    setSelectedItems(selectedItems.filter(item => item !== id));
                }
            } else {
                if (selectedItems.includes(id)) {
                    setSelectedItems(selectedItems.filter(item => item !== id));
                } else {
                    setSelectedItems([...selectedItems, id]);
                }
            }
        } else {
            const leadId = id;
            navigation.navigate("EditFollowup", { leadId })
        }
    };

    const handleLongPress = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter((item) => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const [LeadStatus, setLeadStatus] = useState();
    const [Leadagent, setLeadagent] = useState();

    const bulkAction = async (e) => {
        e.preventDefault();
        const leads = selectedItems;
        const updatedData = {
            leads,
            Leadagent,
            LeadStatus
        };
        try {
            const response = await axios.put(`${PROCESS_KEY}/BulkLeadUpdate/`, updatedData);
            if (response.data.success === false) {
            }
            if (response.data.success === true) {
                // showAlert('Followup Update Successfully');
                setRefreshFlag(prevFlag => !prevFlag);
                setSelectedItems([]);
            }

        } catch (error) {
            console.error('Error performing bulk action:', error);
        }
    }

    // const FollowupLeads = (leadId) => {
    //     navigation.navigate("EditFollowup", { leadId })
    // }

    const getAlllead = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${PROCESS_KEY}/getAllNewLead`
            );
            setdata(response?.data?.lead);
            setSearch(response?.data?.lead);
        } catch (error) {
            if (error.response) {
                console.log("Server responded with a non-success status:", error.response.status);
                console.log("Response data:", error.response.data);
            } else if (error.request) {
                console.log("No response received from the server");
            } else {
                console.log("Error during request setup:", error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    const onSearch = (text) => {
        setsearchtext(text);
        if (!text == '') {
            setdata(search);
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
                        .match(text.toLowerCase()) ||
                    Item?.contact_no
                        .toLowerCase()
                        .match(text.toLowerCase())
                );
            });
            setdata(tempList)
        } else {
            setsearchtext('')
            setdata(search)
        }
    }

    const ClearText = async () => {
        setsearchtext('')
        setdata(search)
    }

    const getAllLead2 = async (assign_to_agent) => {
        try {
            setLoading(true);
            const response = await axios.post(
                `${PROCESS_KEY}/getAllNewLeadBYAgentId`,
                { assign_to_agent }
            );
            setdata(response?.data?.lead);
            setSearch(response?.data?.lead);
        } catch (error) {
            if (error.response) {
                console.log("Server responded with a non-success status:", error.response.status);
                console.log("Response data:", error.response.data);
            } else if (error.request) {
                console.log("No response received from the server");
            } else {
                console.log("Error during request setup:", error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const setidrole = async () => {
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

    useEffect(() => {
        const checkAuthentication = async () => {
            await setidrole();
        };
        checkAuthentication();
        const onFocus = navigation.addListener('focus', () => {
            setRefreshFlag((prevFlag) => !prevFlag);
        });
        return () => {
            onFocus();
        };
    }, [navigation, refreshFlag]);

    const loadMoreLeads = () => {
        setVisibleDataCount(prevCount => prevCount + 10);
    }

    useEffect(() => {
        if (role === "admin") {
            getAlllead();
        }
        else {
            getAllLead2(isAuthenticated);
        }
    }, [role, isAuthenticated, refreshFlag]);

    return (
        <View style={styles.container}>
            <View style={styles.mainContainer}>
                {isLoading ? (
                    <CustomLoader />
                ) : (
                    <>
                        {selectedItems?.length > 0 ? (
                            <View style={styles.bulkContainerOuter}>
                                {(role === 'admin' || role === 'TeamLeader') ? (
                                    <View style={styles.bulkContainer}>
                                        <Text style={styles.bulkHeader}>Bulk Action</Text>
                                        <View style={styles.FrameDtime}>
                                            <View style={styles.btnCalender}>
                                                <Dropdown
                                                    style={styles.dropdown}
                                                    placeholderStyle={styles.placeholderStyle}
                                                    selectedTextStyle={styles.selectedTextStyle}
                                                    inputSearchStyle={styles.inputSearchStyle}
                                                    iconStyle={styles.iconStyle}
                                                    itemTextStyle={{ color: '#9e9e9e' }}
                                                    placeholderTextColor="#9e9e9e"
                                                    data={agent}
                                                    search
                                                    maxHeight={300}
                                                    labelField="label"
                                                    valueField="value"
                                                    placeholder={!isFocus ? 'Agent' : '...'}
                                                    searchPlaceholder="Search..."
                                                    value={value}
                                                    onFocus={() => setIsFocus(true)}
                                                    onBlur={() => setIsFocus(false)}
                                                    onChange={item => {
                                                        setLeadagent({ ...Leadagent, 'agent': item.value });
                                                        setIsFocus(false);
                                                    }}
                                                />
                                            </View>
                                            <View style={styles.btnCalender}>
                                                <Dropdown
                                                    style={styles.dropdown}
                                                    placeholderStyle={styles.placeholderStyle}
                                                    selectedTextStyle={styles.selectedTextStyle}
                                                    inputSearchStyle={styles.inputSearchStyle}
                                                    iconStyle={styles.iconStyle}
                                                    itemTextStyle={{ color: '#9e9e9e' }}
                                                    placeholderTextColor="#9e9e9e"
                                                    data={status}
                                                    search
                                                    maxHeight={300}
                                                    labelField="label"
                                                    valueField="value"
                                                    placeholder={!isFocus ? 'Status' : '...'}
                                                    searchPlaceholder="Search..."
                                                    value={value}
                                                    onFocus={() => setIsFocus(true)}
                                                    onBlur={() => setIsFocus(false)}
                                                    onChange={item => {
                                                        setLeadStatus({ ...LeadStatus, 'status': item.value });
                                                        setIsFocus(false);
                                                    }}

                                                />
                                            </View>
                                        </View>
                                        <View style={styles.btnContainer}>
                                            <TouchableOpacity
                                                style={styles.btnLog}
                                                onPress={bulkAction}
                                            >
                                                <Text style={styles.btnLogtx}>Submit</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={styles.bulkContainer}>
                                        <Text style={styles.bulkHeader}>Bulk Action</Text>
                                        <View style={styles.FrameDtime}>
                                            <View style={styles.btnCalender}>
                                                <Dropdown
                                                    style={styles.dropdown}
                                                    placeholderStyle={styles.placeholderStyle}
                                                    selectedTextStyle={styles.selectedTextStyle}
                                                    inputSearchStyle={styles.inputSearchStyle}
                                                    iconStyle={styles.iconStyle}
                                                    itemTextStyle={{ color: '#9e9e9e' }}
                                                    placeholderTextColor="#9e9e9e"
                                                    data={status}
                                                    search
                                                    maxHeight={300}
                                                    labelField="label"
                                                    valueField="value"
                                                    placeholder={!isFocus ? 'Status' : '...'}
                                                    searchPlaceholder="Search..."
                                                    value={value}
                                                    onFocus={() => setIsFocus(true)}
                                                    onBlur={() => setIsFocus(false)}
                                                    onChange={item => {
                                                        setLeadStatus({ ...LeadStatus, 'status': item.value });
                                                        setIsFocus(false);
                                                    }}
                                                />
                                            </View>
                                            <View style={styles.btnCalender}>
                                                <TouchableOpacity
                                                    style={styles.btnLogUser}
                                                    onPress={bulkAction}
                                                >
                                                    <Text style={styles.btnLogtx}>Submit</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </View>
                        ) : (
                            <View style={styles.searchContainerOuter}>
                                <View style={styles.searchContainer}>
                                    <Image
                                        source={require('../assets/images/search.png')}
                                        style={{ width: 22, height: 22, marginRight: 5, opacity: 0.5 }}
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
                        )}
                        <ScrollView>
                            {!data || data.length === 0 ? (<>
                                <View style={styles.notData}>
                                    <Text style={styles.notDataTxt}>
                                        Data Not Found
                                    </Text>
                                </View>
                            </>) : (
                                <>
                                    <View style={styles.cardWraper}>
                                        <View style={styles.cardWraperInn}>
                                            {
                                                data?.slice(0, visibleDataCount).map((daata, index) => {
                                                    const datatime = daata?.followup_date;
                                                    return (
                                                        <View style={[styles.cardWrap, selectedItems.includes(daata._id) && styles.selectedCardWrap]} key={daata._id}>
                                                            <TouchableOpacity
                                                                style={styles.card}
                                                                key={daata._id}
                                                                onPress={() => handlePress(daata._id)}
                                                                onLongPress={() => handleLongPress(daata._id, index)}
                                                            >
                                                                <View style={styles.cardInn}>
                                                                    <View style={styles.cardRowF}>
                                                                        {selectedItems.includes(daata._id) && (
                                                                            <Image source={require('../assets/images/checkmark-outline.png')} style={styles.checkmarkIcon} />
                                                                        )}
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
                    </>
                )}
            </View>
            <BottomNav />
        </View>
    )
}

const styles = StyleSheet.create({
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
    },
    container: {
        flex: 1,
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
    card: {
        width: '100%',
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
        textTransform: 'capitalize'
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
    cardWrap: {
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#edf5fd',
        flexDirection: 'row',
        borderRadius: 5,
    },
    selectedCardWrap: {
        backgroundColor: '#edf5fd',
        marginTop: 1,
    },
    searchContainerOuter: {
        backgroundColor: '#fff',
        marginTop: 20,
        marginBottom: 10,
        paddingHorizontal: 15
    },
    searchContainer: {
        width: '100%',
        height: 40,
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.4)',
        paddingLeft: 15
    },
    bulkContainerOuter: {
        paddingHorizontal: 15,
    },
    bulkContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 20,
        backgroundColor: "#fff",
        borderRadius: 5,
        shadowColor: '#000',
        elevation: 5,
        padding: 10,
    },
    bulkHeader: {
        fontSize: 15,
        fontWeight: '500',
        textAlign: "center",
        color: "#344055",
        paddingBottom: 5,
        textTransform: "capitalize",
    },
    FrameDtime: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    btnCalender: {
        width: '48.5%',
        marginRight: 10,
    },
    dropdown: {
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        padding: 10,
        height: 40,
        borderRadius: 5,
        fontFamily: "regular",
        marginTop: moderateScale(8),
        marginBottom: moderateScale(8),
    },
    placeholderStyle: {
        fontSize: 14,
        color: '#9e9e9e',
    },
    selectedTextStyle: {
        fontSize: 14,
        color: '#9e9e9e',
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 14,
        color: '#9e9e9e',
    },
    searchPlaceholder: {
        color: '#9e9e9e'
    },
    btnContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    btnLog: {
        backgroundColor: "#22c55e",
        Color: "#ffffff",
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 5,
        marginTop: 5,
        marginRight: 4,
        textAlign: "center",
        width: '100%',
    },
    btnLogUser: {
        backgroundColor: "#22c55e",
        Color: "#ffffff",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginRight: 4,
        textAlign: "center",
        width: '100%',
    },
    btnLogtx: {
        color: "#fff",
        textAlign: "center",
        fontSize: 14,
    },
    checkmarkIcon: {
        width: scale(15),
        height: scale(15),
        marginRight: 7,
        tintColor: '#fff',
        backgroundColor: '#10b981',
        position: 'absolute',
        left: 20,
        top: 16,
        zIndex: 1,
        borderRadius: 50,
    },
})

export default NewLeads