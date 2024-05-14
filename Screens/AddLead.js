import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, Alert, Text, TouchableOpacity, ScrollView, } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PROCESS_KEY } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

const Stack = createNativeStackNavigator();
const AddLead = () => {

    const navigation = useNavigation()
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [inputTime, setInputTime] = useState('');
    const [inputDate, setInputDate] = useState('');
    const [datatime, setdatetime] = useState({
        date: '',
        time: '',
    });

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const handleConfirm = (date) => {
        // console.warn("A date has been picked: ", date);
        hideDatePicker();
        const formattedDate = date.toISOString();

        setSelectedDate(formattedDate.split('T')['0']);
        setInputDate(formattedDate.split('T')['0']); // Set the input value if needed
        handleInputChange('followup_date', formattedDate.split('T')['0']);
    };

    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };
    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };
    const handleTimeConfirm = (date) => {
        console.log('date', date)
        hideTimePicker();
        const formattedTime = date.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' });
        setSelectedTime(formattedTime);
        setInputTime(formattedTime);
        const selecteddate = data1?.followup_date;
        if (data1?.followup_date.includes("T")) {
        } else {
            const combinedDateTimeString = `${selecteddate}T${formattedTime}`;
            const givenDateTime = moment(combinedDateTimeString, "YYYY-MM-DDThh:mm:ss A");
            const formattedDateTimeString = givenDateTime.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
            handleInputChange('followup_date', formattedDateTimeString);
        }


    };


    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const [name, setName] = useState('');

    const [nameError, setNameError] = useState('');
    const [DatetimeError, setDatetimeError] = useState('');
    const [contactError, setcontactError] = useState('');
    const [servicesError, setservicesError] = useState('');
    const [leadsourceError, setleadsourceError] = useState('');
    const [agentError, setagentError] = useState('');
    const [statusError, setstatusError] = useState('');

    const [services, setservices] = useState([]);
    const [agent, setagent] = useState([]);
    const [status, setstatus] = useState([]);
    const [leadsource, setleadsource] = useState([]);

    const [data1, setData] = useState({
        contact_no: '',
        assign_to_agent: '',
        company_name: '',
        country: '',
        description: '',
        email_id: '',
        full_address: '',
        full_name: '',
        lead_cost: '',
        pincode: '',
        service: '',
        lead_source: '',
        state: '',
        status: '',
        website: '',
    });
    const [country, setcountry] = useState([]);
    const [state, setstate] = useState([]);

    const handleInputChange = (key, value, field, text) => {

        const truncatedText = text ? text.substring(0, 10) : '';
        setData({ ...data1, [field]: truncatedText });
        setData({ ...data1, [field]: text });
        if (field === 'contact_no') {
            if (text && truncatedText.length !== text.length) {
                setContactError('Only 10 digits are allowed');
            } else {
                setContactError('');
            }
        }
        setData({
            ...data1,
            [key]: value,
        });
        // console.log('data1', data1)
    };

    const servicesset = (key, value) => {
        setData({
            ...data1,
            [key]: value,
        });
    }

    const showAlert = (msg) => {
        console.log(msg)
        Alert.alert(
            'Alert Title',
            msg,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
        );
    };
    const handleContact = (text) => {
        const numericValue = text.replace(/\D/g, "");
        const limitedValue = numericValue.slice(0, 10);
        setData({ ...data1, contact_no: limitedValue });
    }

    const [isAuthenticated, setAuthenticated] = useState('');
    useEffect(() => {
        const checkAuthentication = async () => {
            const userToken = await AsyncStorage.getItem('user_id');
            if (userToken) {
                setAuthenticated(userToken);
            } else {
                setAuthenticated('');
            }
        };
        checkAuthentication();
    }, []);


    const submitLead = async (e) => {
        const data2 = { ...data1, commented_id: isAuthenticated, };


        if (!data1.full_name) {
            setNameError('Please Enter Full Name')
            return;
        } else {
            setNameError('')
        }
        if (!data1.contact_no) {
            setcontactError('Please Enter Contact Number');
            return;
        } else {
            setcontactError('');
        }

        if (!/^[\d]{8,10}$/.test(data1.contact_no)) {
            setcontactError('Minimum 10 digits required');
            return;
        } else {
            setcontactError('');
        }
        if (!data1.assign_to_agent) {
            setagentError('Please Select Agent')
            return;
        } else {
            setagentError('')
        }
        if (!data1.status) {
            setstatusError('Please Select Status')
            return;
        } else {
            setstatusError('')
        }
        if (!data1.service) {
            setservicesError('Please Select Service');
            return;
        } else {
            setservicesError('');
        }
        if (!data1.lead_source) {
            setleadsourceError('Please Select Lead Source');
            return;
        } else {
            setleadsourceError('');
        }
        if (!data1.followup_date) {
            setDatetimeError('Please Select Date')
            return;

        } else {
            if (data1?.followup_date && data1.followup_date.includes("T")) {
                setDatetimeError('');
            } else {
                setDatetimeError('Please Select Time');
                return;
            }
            setDatetimeError('');
            console.log('ff', data1.followup_date)
        }
        const apiUrl = `${PROCESS_KEY}/add_lead`;
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data2),
            });
            if (!response.ok) {
                showAlert('Something Wrong')
            } else {
                showAlert('Lead Add Successfully');
                resetForm();
            }
            const data = await response.json();
            navigation.navigate("FollowupLead");
            setData({});
        } catch (error) {
        }
    };

    const submitAndAdd = async (e) => {
        const data2 = { ...data1, commented_id: isAuthenticated, };
        if (!data1.full_name) {
            setNameError('Please Enter Full Name')
            return;
        } else {
            setNameError('')
        }
        if (!data1.contact_no) {
            setcontactError('Please Enter Contact Number');
            return;
        }
        if (!/^[\d]{8,10}$/.test(data1.contact_no)) {
            setcontactError('Minimum 10 digits required');
            return;
        } else {
            setcontactError('')
        }

        if (!data1.assign_to_agent) {
            setagentError('Please Select Agent')
            return;
        } else {
            setagentError('')
        }

        if (!data1.status) {
            setstatusError('Please Select Status')
            return;
        } else {
            setstatusError('')
        }
        if (!data1.service) {
            setservicesError('Please Select Service');
            return;
        } else {
            setservicesError('')
        }
        if (!data1.lead_source) {
            setleadsourceError('Please Select Lead Source');
            return;
        } else {
            setleadsourceError('')
        }

        if (!data1.followup_date) {
            setDatetimeError('Please Select Date')
            return;

        } else {
            if (data1?.followup_date && data1.followup_date.includes("T")) {
                setDatetimeError('');
            } else {
                setDatetimeError('Please Select Time');
                return;
            }
            setDatetimeError('');

        }
        // else {
        setNameError('');
        setcontactError('');
        setagentError('');
        setstatusError('');
        setservicesError('');
        setleadsourceError('');
        // setleadcostError('');
        const apiUrl = `${PROCESS_KEY}/add_lead`;
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data2),
            });
            if (!response.ok) {
                showAlert('Something Wrong')
            } else {
                showAlert('Lead Add Successfully');
                resetForm();
            }
            const data = await response.json();
            setData({});
        } catch (error) {
        }
    };

    const resetForm = () => {
        setData({});
    };

    useEffect(() => {

        //// for get country 
        const fetchCountry = async () => {
            try {
                const response = await fetch(
                    `${PROCESS_KEY}/get_all_country`
                );
                const result = await response.json();
                const countryList = result?.country.map(country111 => ({
                    label: country111.name,
                    value: country111.isoCode,
                }));
                setcountry(countryList);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchCountry();

        //// for get  Services
        const fetchServices = async () => {
            try {
                const response = await fetch(
                    `${PROCESS_KEY}/all_product_service`
                );
                const result = await response.json();
                const serviceList = result?.product_service.map(service111 => ({
                    label: service111.product_service_name,
                    value: service111._id,
                }));
                setservices(serviceList);
                //setservices(result);  
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchServices();

        //// for get  Agent
        // const fetchAgent = async () => {
        //     try {
        //         const response = await fetch(
        //             `${PROCESS_KEY}/get_all_agent`
        //         );
        //         const result = await response.json();
        //         const agentList = result?.agent.map(agent111 => ({
        //             label: agent111.agent_name,
        //             value: agent111._id,
        //         }));
        //         setagent(agentList);
        //         //setservices(result);  
        //     } catch (error) {
        //         console.error('Error fetching data:', error);
        //     }
        // };
        // fetchAgent();

        //// for get  Lead Source
        const fetchLeadSource = async () => {
            try {
                const response = await fetch(
                    `${PROCESS_KEY}/all_lead_source`
                );
                const result = await response.json();
                const leadsourceList = result?.leadSource.map(leadsource111 => ({
                    label: leadsource111.lead_source_name,
                    value: leadsource111._id,
                }));
                setleadsource(leadsourceList);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchLeadSource();

        //// for get Status
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
    }, []);

    const fetchState = async (contryShortdata) => {
        try {
            const response = await fetch(`${PROCESS_KEY}/get_state_by_country`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ short_name: contryShortdata })
            });
            const result = await response.json();

            const countryList1 = result?.state.map(state111 => ({
                label: state111.name,
                value: state111.name,
            }));
            setstate(countryList1);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const getshortcountry = async (item) => {
        fetchState(item.value)
        setData({
            ...data1,
            ['country']: item.value,
        });
    };

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
                // console.log('result', result)
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

    const toggleAccordion = () => {
        setIsExpanded(!isExpanded);
    };

    // Render the accordion content if expanded
    const renderAccordionContent = () => {
        if (isExpanded) {
            return (
                <View style={styles.toggleFrameInn}>

                    <View style={styles.FrameInput}>
                        <TextInput
                            placeholder="Full Address"
                            multiline={true}
                            numberOfLines={5}
                            value={data1.full_address}
                            onChangeText={(text) => handleInputChange('full_address', text)}
                            placeholderTextColor="#9e9e9e"
                            style={[styles.inputStyle, { height: 70, textAlignVertical: 'top', color: '#000' }]}
                        />
                    </View>

                    <View style={styles.FrameDtime}>
                        <View style={styles.btnCalender}>
                            <Dropdown
                                style={[styles.dropdown, isFocus && { borderColor: '#c02221', color: '#000' }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                itemTextStyle={{ color: '#9e9e9e' }}
                                data={country}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocus ? 'Country' : '...'}
                                searchPlaceholder="Search..."
                                value={value}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={(item) => getshortcountry(item)}
                                placeholderTextColor="#9e9e9e"
                            />
                        </View>
                        <View style={styles.btnCalender}>
                            <Dropdown
                                style={[styles.dropdown, isFocus && { borderColor: '#c02221' }]}
                                placeholderTextColor="#9e9e9e"
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                itemTextStyle={{ color: '#9e9e9e' }}
                                data={state}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocus ? 'State' : '...'}
                                searchPlaceholder="Search..."
                                value={value}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={item => {
                                    servicesset('state', item.value);
                                    setIsFocus(false);
                                }}
                            />
                        </View>
                    </View>

                    <View style={styles.FrameDtime}>
                        <View style={styles.btnCalender}>
                            <TextInput
                                placeholder="PinCode"
                                placeholderTextColor="#9e9e9e"
                                style={[styles.inputStyle, { color: '#000' }]}
                                value={data1.pincode}
                                onChangeText={(text) => handleInputChange('pincode', text)}
                            />
                        </View>
                        <View style={styles.btnCalender}>
                            <TextInput
                                placeholder="Lead Cost"
                                placeholderTextColor="#9e9e9e"
                                style={[styles.inputStyle, { color: '#000' }]}
                                value={data1.lead_cost}
                                onChangeText={(text) => handleInputChange('lead_cost', text)}
                            />
                            {/* {leadcostError ? <Text style={styles.errorText}>{leadcostError}</Text> : null} */}
                        </View>
                    </View>

                </View>
            );
        }
        return null; // Render nothing if not expanded
    };

    // const [selected, setSelected] = React.useState("");

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <View style={styles.mainContainer}>

                    <ScrollView>
                        <View style={[styles.inputContainer, { marginTop: 25, }]}>
                            <Text style={styles.inputHeader}>Lead Information</Text>
                            <View style={styles.inputFrame}>
                                <View style={styles.inputFrameInn}>

                                    <View style={styles.FrameDtime}>
                                        <View style={styles.btnCalender}>
                                            <TextInput
                                                placeholder="Full Name *"
                                                placeholderTextColor="#9e9e9e"
                                                style={[styles.inputStyle, { color: '#000' }]}
                                                value={data1.full_name}
                                                onChangeText={(text) => handleInputChange('full_name', text)}
                                            />
                                            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
                                        </View>
                                        <View style={styles.btnCalender}>
                                            <TextInput
                                                placeholder="Email Id"
                                                placeholderTextColor="#9e9e9e"
                                                style={[styles.inputStyle, { color: '#000' }]}
                                                value={data1.email_id}
                                                onChangeText={(text) => handleInputChange('email_id', text)}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.FrameInput}>
                                        <TextInput
                                            placeholder="Contact No. *"
                                            placeholderTextColor="#9e9e9e"
                                            style={[styles.inputStyle, { color: '#000' }]}
                                            keyboardType="numeric"  // Set keyboardType to 'numeric'
                                            value={data1.contact_no}
                                            onChangeText={handleContact}
                                        // onChangeText={(text) => handleInputChange('contact_no', text)}
                                        />
                                        {contactError ? <Text style={styles.errorText}>{contactError}</Text> : null}
                                    </View>

                                    <View style={styles.FrameDtime}>
                                        <View style={styles.btnCalender}>
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderTextColor="#9e9e9e"
                                                // style={[styles.dropdown, isFocus && { borderColor: '#c02221' }]}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                inputSearchStyle={styles.inputSearchStyle}
                                                iconStyle={styles.iconStyle}
                                                itemTextStyle={{ color: '#9e9e9e' }}
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
                                                    servicesset('assign_to_agent', item.value);
                                                    setIsFocus(false);
                                                }}
                                            />
                                            {agentError ? <Text style={styles.errorText}>{agentError}</Text> : null}
                                        </View>
                                        <View style={styles.btnCalender}>
                                            <Dropdown
                                                style={styles.dropdown}
                                                // style={[styles.dropdown, isFocus && { borderColor: '#c02221' }]}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                inputSearchStyle={styles.inputSearchStyle}
                                                iconStyle={styles.iconStyle}
                                                itemTextStyle={{ color: '#9e9e9e' }}
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
                                                    servicesset('status', item.value);
                                                    setIsFocus(false);
                                                }}
                                            />
                                            {statusError ? <Text style={styles.errorText}>{statusError}</Text> : null}
                                        </View>
                                    </View>

                                    <View style={styles.FrameDtime}>
                                        <View style={styles.btnCalender}>
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderTextColor="#9e9e9e"
                                                // style={[styles.dropdown, isFocus && { borderColor: '#c02221' }]}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                inputSearchStyle={styles.inputSearchStyle}
                                                iconStyle={styles.iconStyle}
                                                itemTextStyle={{ color: '#9e9e9e' }}
                                                data={services}
                                                search
                                                maxHeight={300}
                                                labelField="label"
                                                valueField="value"
                                                placeholder={!isFocus ? 'Services' : '...'}
                                                searchPlaceholder="Search..."
                                                value={value}
                                                onFocus={() => setIsFocus(true)}
                                                onBlur={() => setIsFocus(false)}
                                                /// onChangeText={(text) => handleInputChange('service', text)}
                                                onChange={item => {
                                                    servicesset('service', item.value);
                                                    setIsFocus(false);
                                                }}
                                            />
                                            {servicesError ? <Text style={styles.errorText}>{servicesError}</Text> : null}
                                        </View>
                                        <View style={styles.btnCalender}>
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderTextColor="#9e9e9e"
                                                // style={[styles.dropdown, isFocus && { borderColor: '#c02221' }]}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                inputSearchStyle={styles.inputSearchStyle}
                                                iconStyle={styles.iconStyle}
                                                itemTextStyle={{ color: '#9e9e9e' }}
                                                data={leadsource}
                                                search
                                                maxHeight={300}
                                                labelField="label"
                                                valueField="value"
                                                placeholder={!isFocus ? 'Lead Source' : '...'}
                                                searchPlaceholder="Search..."
                                                value={value}
                                                onFocus={() => setIsFocus(true)}
                                                onBlur={() => setIsFocus(false)}
                                                /// onChangeText={(text) => handleInputChange('service', text)}
                                                onChange={item => {
                                                    servicesset('lead_source', item.value);
                                                    setIsFocus(false);
                                                }}
                                            />
                                            {leadsourceError ? <Text style={styles.errorText}>{leadsourceError}</Text> : null}
                                        </View>
                                    </View>

                                    <View style={styles.FrameInput}>
                                        <TextInput
                                            placeholder="Enter Comment"
                                            multiline={true}
                                            numberOfLines={5}
                                            value={data1.description}
                                            placeholderTextColor="#9e9e9e"
                                            style={[styles.inputStyle, { height: 70, textAlignVertical: 'top', color: '#000' }]}
                                            onChangeText={(text) => handleInputChange('description', text)}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.inputContainer, { marginTop: 15, }]}>
                            <Text style={styles.inputHeader}>Followup Date</Text>
                            <View style={styles.inputFrame}>
                                <View style={styles.inputFrameInn}>
                                    <View style={styles.FrameDtime}>
                                        <View style={styles.btnCalender}>
                                            <TouchableOpacity onPress={showDatePicker} style={styles.btnDate}>
                                                <TextInput
                                                    placeholder="Select Date"
                                                    value={inputDate}
                                                    editable={false}
                                                    placeholderTextColor="#9e9e9e"
                                                    style={{ color: '#000' }}
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
                                            <TouchableOpacity onPress={showTimePicker} style={styles.btnDate}>
                                                <TextInput
                                                    placeholder="Select Time"
                                                    value={inputTime}
                                                    editable={false}
                                                    placeholderTextColor="#9e9e9e"
                                                    style={{ color: '#000' }}
                                                />
                                                <DateTimePickerModal
                                                    isVisible={isTimePickerVisible}
                                                    onConfirm={handleTimeConfirm}
                                                    onCancel={hideTimePicker}
                                                    mode={'time'}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        {DatetimeError ? <Text style={styles.errorText}>{DatetimeError}</Text> : null}
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.toggleContainer, { marginTop: 15, marginBottom: 60 }]}>
                            <TouchableOpacity onPress={toggleAccordion}>
                                <Text style={styles.toggleHeader}>Additional Information (Optional)</Text>
                            </TouchableOpacity>
                            {renderAccordionContent()}
                        </View>
                    </ScrollView>
                </View>
            </View>

            <View style={[styles.btnContainer, { marginTop: 15, }]}>
                <View style={styles.btnwrap}>
                    <TouchableOpacity
                        style={styles.btnSave}
                        onPress={submitLead}
                    >
                        <Text style={styles.btnLogtx}>Save Lead</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.btnwrap}>
                    <TouchableOpacity
                        style={styles.btnSaveAnd}
                        onPress={submitAndAdd}
                    >
                        <Text style={styles.btnLogtx}>Save & Add Another</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    mainContainer: {
        backgroundColor: '#f5f9fd',
        paddingHorizontal: 10,
    },
    btnContainer: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'row',
    },
    btnwrap: {
        width: '50%',
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
    mainHeader: {
        fontSize: 18,
        color: "#c02221",
        paddingTop: 20,
        paddingBottom: 10,
        textAlign: "center",
        fontWeight: "bold",
        textTransform: 'uppercase'
    },
    inputContainer: {
        backgroundColor: "#fff",
        borderRadius: 5,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        paddingRight: 5,
        shadowColor: '#000',
        elevation: 3,
    },
    inputHeader: {
        fontSize: 14,
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
        paddingLeft: 10,
        height: 45,
        borderRadius: 5,
        fontFamily: "regular",
        marginTop: moderateScale(8),
        marginBottom: moderateScale(8),
        fontSize: 13,
    },
    checkbox: {

    },
    btnSave: {
        backgroundColor: "#c02221",
        Color: "#ffffff",
        paddingHorizontal: 20,
        paddingVertical: 10,
        textAlign: "center",
    },
    btnSaveAnd: {
        backgroundColor: "#d92726",
        Color: "#ffffff",
        paddingHorizontal: 5,
        paddingVertical: 10,
        textAlign: "center",
    },
    btnLogtx: {
        color: "#fff",
        textAlign: "center",
        fontSize: 14,
    },
    btnBtxt: {
        Color: "#ffffff",
        marginTop: 15,
        textAlign: "center"

    },
    errorText: {
        color: '#f00',
        marginLeft: 3,
        marginBottom: 7,
        fontSize: 11,
        position: 'absolute',
        bottom: -13,
    },

    dropdown: {
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        padding: 10,
        height: 45,
        borderRadius: 5,
        fontFamily: "regular",
        marginTop: moderateScale(8),
        marginBottom: moderateScale(8),
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 14,
        color: '#9e9e9e',
    },
    selectedTextStyle: {
        fontSize: 14,
        color: '#000',
        color: '#9e9e9e',
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 14,
        color: '#9e9e9e'
    },
    searchPlaceholder: {
        color: '#9e9e9e'
    },
    btnCalender: {
        width: '48.5%',
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
    toggleContainer: {
        backgroundColor: "#fff",
        borderRadius: 5,
        shadowColor: '#000',
        elevation: 3,
    },
    toggleFrameInn: {
        textAlign: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        width: '100%',
    },
    toggleHeader: {
        fontSize: 14,
        fontWeight: "500",
        textAlign: "center",
        color: "#fff",
        backgroundColor: '#1d4ed8',
        textTransform: "capitalize",
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderRadius: 5,
    },
});

export default AddLead