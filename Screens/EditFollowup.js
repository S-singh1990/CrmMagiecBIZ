import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, TextInput, Alert, Text, TouchableOpacity, Modal, ScrollView, Image, Dimensions, Linking } from 'react-native'
import { scale, moderateScale } from 'react-native-size-matters';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNav from "../Components/BottomNav";
import ImagePicker from 'react-native-image-crop-picker';
import { PermissionsAndroid } from "react-native";
import Geolocation from "@react-native-community/geolocation";
import { PROCESS_KEY } from "@env";
import { SMS_KEY } from "@env";

const Stack = createNativeStackNavigator();
const EditFollowup = () => {

    const route = useRoute();
    const { leadId } = route.params;

    const [image, setImage] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [inputTime, setInputTime] = useState('');
    const [inputDate, setInputDate] = useState('');
    const selectedAgentRef = useRef('');
    const [onlydate, setonlydate] = useState('');
    const [onlytime, setonlytime] = useState('');

    const [role, setRole] = useState('');
    const [userName, setuser] = useState('');

    const setRoleFromStorage = async () => {
        try {
            const userRole = await AsyncStorage.getItem('role');
            const userName = await AsyncStorage.getItem('name');
            if (userRole) {
                setRole(userRole);
            } else {
                setRole('');
            }
            if (userName) {
                setuser(userName);
            }
        } catch (error) {
            console.error('Error getting user role:', error);
        }
    };

    useEffect(() => {
        setRoleFromStorage();
    }, []);


    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const handleConfirm = (date) => {
        hideDatePicker();
        const formattedDate = date.toISOString();
        setSelectedDate(formattedDate.split('T')['0']);
        setInputDate(formattedDate.split('T')['0']);
        setonlydate(formattedDate.split('T')['0']);
    };

    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };
    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };
    const handleTimeConfirm = (date) => {
        hideTimePicker();
        const formattedTime = date.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' });
        setSelectedTime(formattedTime);
        setInputTime(formattedTime);
        setonlytime(formattedTime)
    };

    const [value, setValue] = useState(null);
    const [statusvalue, setstatusvalue] = useState(null);
    // const [sourcevalue, setsourcevalue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const [agentError, setagentError] = useState('');
    const [statusError, setstatusError] = useState('');

    const [services, setservices] = useState([]);
    const [agent, setagent] = useState([]);
    const [status, setstatus] = useState([]);
    // const [source, setsource] = useState([]);
    const navigation = useNavigation()
    const [data1, setData] = useState({
        assign_to_agent: '',
        commented_by: '',
        lead_id: '',
        followup_status_id: '',
        followup_desc: '',
    });
    const [country, setcountry] = useState([]);
    const [state, setstate] = useState([]);

    const handleInputChange = (key, value) => {
        setData({
            ...data1,
            [key]: value,
        });
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

    const [commentError, setCommentError] = useState('');
    const [dateError, setdateError] = useState('');
    const [datetimeError, setdatetimeError] = useState('');
    const submitLead = async (e) => {

        if (!data1.followup_desc) {
            setCommentError('Please Enter Comment');
            return;
        } else {
            setCommentError('');
        }
        if (!onlydate) {
            setdateError('Please Select date');
            return;
        } else {
            setdateError('');
        }

        if (!onlytime) {
            setdatetimeError('Please Select Time');
            return;
        } else {
            setdatetimeError('');
        }
        const [timeWithoutMeridian, meridian] = onlytime.split(' ');
        const [hours, minutes, seconds] = timeWithoutMeridian.split(':');
        let dddd;
        if (hours < 10) {
            dddd = onlydate + 'T' + '0' + hours + ':' + minutes;
        } else {
            dddd = onlydate + 'T' + hours + ':' + minutes;
        }
        const updatedLeadData = await {
            ...data1,
            lead_id: leadId,
            commented_by: isAuthenticated,
            followup_date: dddd,
        };

        if (updatedLeadData?.assign_to_agent === '') {
            const result = agent.find((item) => item.value === leaddetails['0']?.assign_to_agent);
            if (result) {
                updatedLeadData.assign_to_agent = result.value;
            }
        }

        if (updatedLeadData?.followup_status_id === '') {
            const result1 = status.find((item) => item.value === leaddetails['0']?.status);
            if (result1) {
                updatedLeadData.followup_status_id = result1.value;
            }
        }

        // console.log('data1',data1)   
        // console.log('updatedLeadData', updatedLeadData)
        const apiUrl = `${PROCESS_KEY}/add_followup_lead`;
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedLeadData),
            });
            // console.log(response)
            if (!response.ok) {
                setInputTime('')
                setInputDate('')
                showAlert('Something Wrong')
            } else {
                // showAlert('Lead Update Successfully');
                // resetForm();
                const data = await response.json();
                setInputTime('')
                setInputDate('')
                navigation.navigate("FollowupLead");
                setData({});
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const [refreshFlag, setRefreshFlag] = useState(false);
    const [followuphistory, setfollowuphistory] = useState([]);
    const [leaddetails, setleaddetails] = useState([]);
    // console.log('leaddetails', leaddetails)
    const getLeadDetailByLeadId = async (_id) => {
        try {
            const responce = await axios.get(
                `${PROCESS_KEY}/get_lead_by_id/${_id}`
            );
            setleaddetails(responce?.data?.leads);
        } catch (error) {
            console.log(error)
        }
    }

    const getfollowuphistory = async (_id) => {
        try {
            const responce = await axios.get(
                `${PROCESS_KEY}/all_followup_lead_by_id/${_id}`
            );
            setfollowuphistory(responce?.data?.followuplead);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        const checkAuthenticationvgdfgg = async () => {
            await getfollowuphistory(leadId)
        };
        checkAuthenticationvgdfgg();
        const onFocus = navigation.addListener('focus', () => {
            setRefreshFlag((prevFlag) => !prevFlag);
        });
    }, []);

    const contact_no = leaddetails['0']?.contact_no;
    const MobileNo = contact_no ? contact_no.toString().slice(-10) : '';

    useEffect(() => {
        const fetchData = async () => {
            await getLeadDetailByLeadId(leadId);
            const result = agent.find(item => item.value === leaddetails['0']?.assign_to_agent);
            const result1 = status.find(item => item.value === leaddetails['0']?.status);
            // const result2 = source.find(item => item.value === leaddetails['0']?.source);
            setValue(result);
            setstatusvalue(result1);
            // setsourcevalue(result2);
        };
        fetchData();
    }, [agent, status]);

    const dispatch = async (action) => {
        try {
            switch (action.type) {
                case 'GET_ALL_AGENT':
                    const response = await fetch(`${apiUrl}/get_all_agent`, {
                        headers: {
                            "Content-Type": "application/json",
                            "mongodb-url": DBuUrl,
                        },
                    });
                    const result = await response.json();
                    if (result.success === true) {
                        setAgent(result.agent);
                    }
                    break;
                case 'GET_ALL_AGENT_WITH_DATA':
                    const userId = await AsyncStorage.getItem('user_id');
                    const responce = await fetch(`${apiUrl}/getAllAgentByTeamLeader`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "mongodb-url": DBuUrl,
                        },
                        body: JSON.stringify({ assign_to_agent: userId }),
                    });
                    const agentResult = await responce.json();
                    if (agentResult.success === true) {
                        setAgent(agentResult.agent);
                    }
                    break;
                // Add other action cases if needed
                default:
                    break;
            }
        } catch (error) {
            console.error('Error dispatching action:', error);
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
                    value: country111.short_name,
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

    const dispatchAgentAction = async (dispatch) => {
        try {
            const role = await AsyncStorage.getItem('role');

            if (role === 'admin') {
                dispatch(getAllAgent());
            } else if (role === 'TeamLeader') {
                const userId = await AsyncStorage.getItem('user_id');
                dispatch(getAllAgentWithData({ assign_to_agent: userId }));
            } else if (role === 'user') {
                const userId = await AsyncStorage.getItem('user_id');
                dispatch(getAllAgent({ assign_to_agent: userId }));
            }
        } catch (error) {
            console.error('Error dispatching agent action:', error);
        }
    };
    useEffect(() => {
        dispatchAgentAction(dispatch);
    }, []);

    const fetchState = async (contryShortdata) => {
        try {
            const response = await fetch(
                `${PROCESS_KEY}/get_state_by_country`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ short_name: contryShortdata })
                }
            );
            const result = await response.json();
            const countryList1 = result?.state.map(state111 => ({
                label: state111.name,
                value: state111._id,
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

    const updatethis = async (item) => {
        const updatedStatus = status.find((statusItem) => statusItem.value === leaddetails['0']?.status);
        setData({
            ...data1,
            followup_status_id: item?.value,
        });
        setIsFocus(false);
        if (item?.value == '65a904e04473619190494482') {
            setIsVisible(true)
        } else {
            setIsVisible(false)
        }

    }
    const [openHistory, setOpenHistory] = React.useState(false);
    function renderHistory() {
        return (
            <Modal
                visible={openHistory}
                animationType="fade"
                transparent={true}
            >
                <View style={styles.transparentBg}>
                    <View style={styles.containerModal}>
                        <View style={styles.taskhead}>
                            <View style={styles.cardLeftView}>
                                <Text style={styles.cardLeftViewHead}>Followup History</Text>
                            </View>
                            <View style={styles.cardRightView}>
                                <TouchableOpacity onPress={() => setOpenHistory(false)}>
                                    <View style={styles.closeBox}>
                                        <Ionicons name="close" style={styles.iconCl} size={20} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {followuphistory.length == 0 ? (<>
                            <View style={styles.notData}>
                                <Text style={styles.notDataTxt}>
                                    Data Not Found
                                </Text>
                            </View>
                        </>) : (<ScrollView style={{ height: 460, }}>
                            <View style={styles.tabContainer}>
                                <View style={styles.scrolContainer}>
                                    {followuphistory?.map((followuphistory1) => {
                                        const inputDateString = followuphistory1?.updated;
                                        const splitArray = inputDateString?.split('T');
                                        const inputDateTimeString = followuphistory1?.followup_date;
                                        const splitTimeArray = inputDateTimeString?.split('.');
                                        //  if(splitTimeArray['0']){

                                        let dateTime;
                                        if (splitTimeArray && splitTimeArray[0]) {
                                            dateTime = splitTimeArray[0].split('T');
                                        }
                                        // const dateTime = splitTimeArray?['0']?.split('T');
                                        // }

                                        return (
                                            <View style={[styles.modalrContainer, { marginTop: 10, marginBottom: 10 }]}>
                                                <View style={styles.modalFrame}>
                                                    <View style={styles.modalRow}>
                                                        <View style={styles.modalRowLeft}>
                                                            <Image source={require('../assets/images/icon-fh.png')} style={styles.modalImage} />
                                                        </View>
                                                        <View style={styles.modalRowRight}>
                                                            <Text style={styles.modalName}>Commented By: {followuphistory1?.comment_by['0']?.agent_name}</Text>
                                                            <Text style={styles.modalContact}>Date: {splitArray['0']}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.modalRowFull}>
                                                        <Image source={require('../assets/images/icon-status.png')} style={styles.iconM} />
                                                        <Text style={styles.cardTxtM}>{followuphistory1?.status_details['0']?.status_name}</Text>
                                                        <Image source={require('../assets/images/icon-fd.png')} style={styles.iconM} />
                                                        <Text style={styles.cardTxtM}>
                                                            {dateTime && dateTime[0] ? dateTime[0] : null} {/* Display date if available */}
                                                            {' '}
                                                            {dateTime && dateTime[1] ? dateTime[1] : null}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.modalRowFull}>
                                                        <Image source={require('../assets/images/icon-comment.png')} style={styles.iconM} />
                                                        <Text style={styles.cardTxtM}>
                                                            {followuphistory1?.followup_desc}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        </ScrollView>)}

                    </View>
                </View>
            </Modal>
        )
    }

    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'App needs access to your location.',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // Permission granted, now fetch the location
                fetchLocation();
            } else {
                console.log('Location permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const fetchLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                console.log('Latitude:', latitude, 'Longitude:', longitude);
                setLatitude(latitude);
                setLongitude(longitude);
                // You can now upload the image and include the latitude and longitude with it
            },
            error => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };
    //  console.warn(latitude)
    const takePhotoFromCamera = async () => {
        await requestLocationPermission();
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
        }).then(image => {
            fetchLocation();
            setImage(image.path);
        });
    }
    const choosePhotoFromLibarary = async () => {
        await requestLocationPermission();
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            fetchLocation();
            setImage(image.path);
        });
    }

    const submitakeImage = async () => {
        if (!image) {
            // Image not selected, display an error message
            console.log('Please select an image');
            return;
        }
        // Check if latitude and longitude are available
        if (latitude !== null && longitude !== null) {
            // Latitude and longitude available, proceed with submission
            const formData = new FormData();
            formData.append('image', { uri: image, name: 'image.jpg', type: 'image/jpeg' });
            formData.append('latitude', latitude.toFixed(6));
            formData.append('longitude', longitude.toFixed(6));
            try {
                const response = await fetch('YOUR_API_ENDPOINT', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        // Add any additional headers if required
                    },
                });
                if (response.ok) {
                    // Submission successful, handle the response accordingly
                    const data = await response.json();
                    console.log('Submission successful:', data);
                } else {
                    // Handle errors if submission fails
                    console.log('Submission failed:', response.status);
                }
            } catch (error) {
                // Handle any network or other errors
                console.error('Error:', error);
            }
        } else {
            // Latitude and longitude not available, display an error message
            console.log('Location data not available');
        }
    };
    // console.log('ddd', leaddetails[0]?.lead_source_details[0]?.lead_source_name)

    const [openDoc, setOpenDoc] = React.useState(false);
    function renderDoc() {
        return (
            <Modal
                visible={openDoc}
                animationType="fade"
                transparent={true}
            >
                <View style={styles.transparentBg}>
                    <View style={styles.containerAttachModal}>

                        <View style={styles.taskhead}>
                            <View style={styles.cardLeftView}>
                                <Text style={styles.cardLeftViewHead}>Attach File</Text>
                                {/* <Text style={styles.cardLeftTxt}>Last 30 Days</Text> */}
                            </View>
                            <View style={styles.cardRightView}>
                                <TouchableOpacity onPress={() => setOpenDoc(false)}>
                                    <View style={styles.closeBox}>
                                        <Ionicons name="close" style={styles.iconCl} size={20} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <ScrollView style={{ height: 400, }}>
                            <View style={styles.tabContainer}>
                                <View style={styles.scrolContainer}>
                                    <View style={{ marginBottom: 10 }}>
                                        <View style={styles.tabBtnRow}>
                                            <TouchableOpacity
                                                onPress={takePhotoFromCamera}
                                                style={styles.btntake}
                                            >
                                                <Text style={styles.btnLogtx}>
                                                    <Ionicons name="camera-outline" style={styles.iconCamera} size={24} />
                                                </Text>
                                                <Text style={styles.btnLogtx}>Take Photo</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={choosePhotoFromLibarary}
                                                style={styles.btnChoose}
                                            >
                                                <Text style={styles.btnLogtx}>
                                                    <Ionicons name="film-outline" style={styles.iconCamera} size={24} />
                                                </Text>
                                                <Text style={styles.btnLogtx}>Choose From Libarary</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.imagecontainer}>
                                            <View style={styles.imagecontainerLeft}>
                                                <Image
                                                    style={styles.imagebg}
                                                    source={image ? { uri: image } : require('../assets/images/no-image.jpg')}
                                                />
                                            </View>
                                            <View style={styles.imagecontainerRight}>
                                                {latitude !== null && longitude !== null ? (
                                                    <>
                                                        <Text style={styles.locationTxt}>
                                                            {latitude !== null ? latitude.toFixed(6) : ''},{longitude !== null ? longitude.toFixed(6) : ''}
                                                        </Text>
                                                        <Text style={styles.locationTxtH}>
                                                            Latitude And Longitude Value
                                                        </Text>
                                                    </>
                                                ) : (
                                                    <Text>
                                                        Please Take & Choose Photo
                                                    </Text>
                                                )}
                                            </View>
                                        </View>

                                        {/* Display image and location here */}
                                        {image && latitude !== null && longitude !== null && (
                                            <View style={styles.imageAndLocationContainer}>
                                                <Image
                                                    style={styles.imagePreview}
                                                    source={{ uri: image }}
                                                    onError={(error) => console.log('Image load error:', error)}
                                                />
                                                <Text style={styles.locationText}>
                                                    Latitude: {latitude.toFixed(6)}, Longitude: {longitude.toFixed(6)}
                                                </Text>
                                            </View>
                                        )}

                                        <View style={styles.tabBtnRow}>
                                            <TouchableOpacity
                                                style={styles.btnSub}
                                                onPress={submitakeImage}
                                            >
                                                <Text style={styles.btnSubtxt}>
                                                    Submit
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        )
    }

    const [openUserDetail, setUserDetail] = React.useState(false);
    function renderUserDetail() {
        return (
            <Modal
                visible={openUserDetail}
                animationType="fade"
                transparent={true}
            >
                <View style={styles.transparentBg}>
                    <View style={styles.containerAllDetail}>

                        <View style={styles.taskhead}>
                            <View style={styles.cardLeftView}>
                                <Text style={styles.cardLeftViewHead}>All Details</Text>
                            </View>
                            <View style={styles.cardRightView}>
                                <TouchableOpacity onPress={() => setUserDetail(false)}>
                                    <View style={styles.closeBox}>
                                        <Ionicons name="close" style={styles.iconCl} size={20} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <ScrollView style={{ height: 360, }}>
                            <View style={styles.tabContainer}>
                                <View style={styles.scrolContainer}>
                                    <View style={styles.inputFrame}>
                                        <View style={styles.inputFrameInn}>
                                            <View style={styles.FrameDtime}>
                                                <View style={styles.btnCalender}>
                                                    <TextInput
                                                        style={styles.inputStyle}
                                                        value={leaddetails['0']?.full_name}
                                                    />
                                                </View>
                                                <View style={styles.btnCalender}>
                                                    <TextInput
                                                        style={styles.inputStyle}
                                                        value={leaddetails['0']?.email_id}
                                                    />
                                                </View>
                                            </View>
                                            <View style={styles.FrameDtime}>
                                                <View style={styles.btnCalender}>
                                                    <TextInput
                                                        style={styles.inputStyle}
                                                        value={String(leaddetails['0']?.contact_no)}
                                                    />
                                                </View>
                                                <View style={styles.btnCalender}>
                                                    <TextInput
                                                        placeholder="Alternative No."
                                                        style={styles.inputStyle}
                                                        value={leaddetails['0']?.alternative_no}
                                                    />
                                                </View>
                                            </View>
                                            <View style={styles.FrameDtime}>
                                                <View style={styles.btnCalender}>
                                                    <TextInput
                                                        placeholder="Company Name"
                                                        style={styles.inputStyle}
                                                        value={leaddetails['0']?.company_name}
                                                    />
                                                </View>
                                                <View style={styles.btnCalender}>
                                                    <TextInput
                                                        placeholder="Website"
                                                        style={styles.inputStyle}
                                                        value={leaddetails['0']?.website}
                                                    />
                                                </View>
                                            </View>
                                            <View style={styles.FrameDtime}>
                                                <View style={styles.btnCalender}>
                                                    <TextInput
                                                        placeholder="Position"
                                                        style={styles.inputStyle}
                                                        value={leaddetails['0']?.position}
                                                    />
                                                </View>
                                                <View style={styles.btnCalender}>
                                                    <TextInput
                                                        placeholder="Lead Cost"
                                                        style={styles.inputStyle}
                                                        value={leaddetails['0']?.lead_cost}
                                                    />
                                                </View>
                                            </View>
                                            <View>
                                                <TouchableOpacity
                                                    style={styles.btnLog}
                                                // onPress={submitLead}
                                                >
                                                    <Text style={styles.btnLogtx}>Submit</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>

                    </View>
                </View>
            </Modal>
        )
    }

    const [openAditionalDetail, setAditionalDetail] = React.useState(false);
    function renderAditionalDetail() {
        return (
            <Modal
                visible={openAditionalDetail}
                animationType="fade"
                transparent={true}
            >
                <View style={styles.transparentBg}>
                    <View style={styles.containerAdditionanDetail}>

                        <View style={styles.taskhead}>
                            <View style={styles.cardLeftView}>
                                <Text style={styles.cardLeftViewHead}>Additional Information</Text>
                            </View>
                            <View style={styles.cardRightView}>
                                <TouchableOpacity onPress={() => setAditionalDetail(false)}>
                                    <View style={styles.closeBox}>
                                        <Ionicons name="close" style={styles.iconCl} size={20} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <ScrollView style={{ height: 360, }}>
                            <View style={styles.tabContainer}>
                                <View style={styles.scrolContainer}>
                                    <View style={styles.inputFrame}>
                                        <View style={styles.inputFrameInn}>

                                            <View style={styles.FrameInput}>
                                                <TextInput
                                                    placeholder="Full Address"
                                                    multiline={true}
                                                    numberOfLines={5}
                                                    value={data1.full_address}
                                                    style={[styles.inputStyle, { height: 70, textAlignVertical: 'top', }]}
                                                />
                                            </View>
                                            <View style={styles.FrameDtime}>
                                                <View style={styles.btnCalender}>
                                                    <Dropdown
                                                        style={[styles.dropdown, isFocus && { borderColor: '#c02221' }]}
                                                        placeholderStyle={styles.placeholderStyle}
                                                        selectedTextStyle={styles.selectedTextStyle}
                                                        inputSearchStyle={styles.inputSearchStyle}
                                                        iconStyle={styles.iconStyle}
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
                                                    />
                                                </View>
                                                <View style={styles.btnCalender}>
                                                    <Dropdown
                                                        style={[styles.dropdown, isFocus && { borderColor: '#c02221' }]}
                                                        placeholderStyle={styles.placeholderStyle}
                                                        selectedTextStyle={styles.selectedTextStyle}
                                                        inputSearchStyle={styles.inputSearchStyle}
                                                        iconStyle={styles.iconStyle}
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
                                                        placeholder="city"
                                                        style={styles.inputStyle}
                                                        value={leaddetails['0']?.city}
                                                    />
                                                </View>
                                                <View style={styles.btnCalender}>
                                                    <TextInput
                                                        placeholder="pincode"
                                                        style={styles.inputStyle}
                                                        value={leaddetails['0']?.pincode}
                                                    />
                                                </View>
                                            </View>
                                            <View>
                                                <TouchableOpacity
                                                    style={styles.btnLog}
                                                // onPress={submitLead}
                                                >
                                                    <Text style={styles.btnLogtx}>Submit</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        )
    }

    const [carecters, setCarecters] = useState(0);
    const [row, setRow] = useState(1);
    const [sendmessage, setsendmessage] = useState([]);
    const [smsdata, setsmsdata] = useState();

    const SendSMS = async () => {
        const url = hostings[0]?.smsendpointurl;
        const updated = { ...sendmessage, noofperson: selectedRowIds.length };
        const selectedMobileNumber = selectedRowIds.join(',');

        try {
            await savesmsreport(updated);

            const response = await axios.get(`${SMS_KEY}/sendmsg.php`, {
                params: {
                    user: hostings[0]?.freshtranss,
                    pass: hostings[0]['bulk@123'],
                    sender: hostings[0]?.SMSFRE,
                    phone: selectedMobileNumber,
                    text: 'API Test - SMSFresh',
                    priority: 'ndnd',
                    stype: 'normal'
                }
            });

            console.log('SMS sent successfully:', response.data);
        } catch (error) {
            console.error('Error sending SMS:', error);
        }
    };

    const EnterMessage = (text) => {
        const message = text.nativeEvent.text;
        const characterCount = message.length;
        setCarecters(characterCount);
        if (characterCount === 0) {
            setRow(1);
        } else if (characterCount <= 160) {
            setRow(1);
        } else {
            const numberOfRows = Math.ceil(characterCount / 160);
            setRow(numberOfRows);
        }
        setsendmessage({ ...sendmessage, message: message });
    };

    const [openSms, setopenSms] = React.useState(false);

    function renderOpenSms() {
        return (
            <Modal
                visible={openSms}
                animationType="fade"
                transparent={true}
            >
                <View style={styles.transparentBg}>
                    <View style={styles.containerAdditionanDetail}>

                        <View style={styles.taskhead}>
                            <View style={styles.cardLeftView}>
                                <Text style={styles.cardLeftViewHead}>Send SMS</Text>
                            </View>
                            <View style={styles.cardRightView}>
                                <TouchableOpacity onPress={() => setopenSms(false)}>
                                    <View style={styles.closeBox}>
                                        <Ionicons name="close" style={styles.iconCl} size={20} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <ScrollView style={{ height: 360, }}>
                            <View style={styles.tabContainer}>
                                <View style={styles.scrolContainer}>
                                    <View style={styles.inputFrame}>
                                        <View style={styles.inputFrameInn}>
                                            <View style={styles.FrameInput}>
                                                <Text style={styles.inputLable}>Enter Message</Text>
                                                <TextInput
                                                    placeholder="Enter Message"
                                                    multiline={true}
                                                    onChangeText={(text) => EnterMessage({ nativeEvent: { text } })}
                                                    numberOfLines={10}
                                                    style={[styles.inputStyle, { height: 100, textAlignVertical: 'top', }]}
                                                />
                                            </View>
                                            <View style={styles.FrameDtime}>
                                                <View style={styles.btnCalender}>
                                                    <Text style={styles.inputLable}>Characters</Text>
                                                    <TextInput
                                                        placeholder="Characters"
                                                        value={String(carecters)}
                                                        style={styles.inputStyle}
                                                    />
                                                </View>
                                                <View style={styles.btnCalender}>
                                                    <Text style={styles.inputLable}>No of SMS</Text>
                                                    <TextInput
                                                        placeholder="No. of SMS"
                                                        value={String(row)}
                                                        style={styles.inputStyle}
                                                    />
                                                </View>
                                            </View>
                                            <View>
                                                <TouchableOpacity
                                                    style={styles.btnLog}
                                                    onPress={SendSMS}
                                                >
                                                    <Text style={styles.btnLogtx}>Send Instant SMS</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.mainContainer}>

                    <View style={[styles.inputContainer, { marginTop: 15, marginBottom: 10 }]}>
                        <View style={styles.inputFrame}>
                            <View style={styles.infoRow}>
                                <View style={styles.infoRowcollf}>
                                    <View style={styles.infoRowLeft}>
                                        <Image source={require('../assets/images/avatar3.png')} style={styles.infoIcon} />
                                    </View>
                                    <View style={styles.infoRowRight}>
                                        <Text style={styles.name}>{leaddetails['0']?.full_name}</Text>
                                        <Text style={styles.contact}>{leaddetails['0']?.contact_no}</Text>
                                    </View>
                                </View>
                                <View style={styles.infoRowcolls}>
                                    <TouchableOpacity
                                        onPress={() => setopenSms(true)}
                                        style={styles.collsimg1}>
                                        <Image source={require('../assets/images/mail-open-outline.png')} style={styles.iCall} />
                                    </TouchableOpacity>
                                    {renderOpenSms()}
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
                            <View style={styles.infoRowFull}>
                                <View style={styles.infoRowFullL}>
                                    <Image source={require('../assets/images/chatbox.png')} style={styles.iconS} />
                                    {leaddetails['0']?.massage_of_calander ? (
                                        <Text style={styles.cardTxtS}>
                                            {(leaddetails['0']?.massage_of_calander) ? leaddetails['0']?.massage_of_calander : leaddetails['0']?.description}
                                        </Text>
                                    ) : (
                                        <Text style={styles.cardTxtS}>{leaddetails['0']?.description}</Text>
                                    )}
                                </View>
                                {/* <View style={styles.infoRowFullR}>
                                    <TouchableOpacity
                                        style={styles.btnSend}
                                        onPress={() => setopenSms(true)}
                                    >
                                        <Text style={styles.btnSendTxt}>
                                            Send SMS
                                        </Text>
                                    </TouchableOpacity>
                                    {renderOpenSms()}
                                </View> */}
                            </View>
                        </View>
                    </View>

                    <View style={[styles.inputContainer, { marginTop: 1 }]}>
                        <Text style={styles.inputHeader}>Lead Update</Text>
                        <View style={styles.inputFrame}>
                            <View style={styles.inputFrameInn}>
                                <View style={styles.FrameInput}>
                                    <TextInput
                                        placeholder="Enter Comment"
                                        multiline={true}
                                        numberOfLines={4}
                                        value={data1.followup_desc}
                                        style={[styles.inputStyle, { height: 50, textAlignVertical: 'top', }]}
                                        onChangeText={(text) => handleInputChange('followup_desc', text)}
                                    />
                                    {commentError ? <Text style={styles.errorText}>{commentError}</Text> : null}
                                </View>
                                <View style={styles.FrameInput}>
                                    <TextInput
                                        value={"Source: " + (leaddetails[0]?.lead_source_details[0]?.lead_source_name ?? '')}
                                        style={[styles.inputStyle, { textAlignVertical: 'top', color: '#727272' }]}
                                        editable={false}
                                    />
                                </View>

                                <View style={styles.FrameInput}>
                                    {(role === 'admin' || role === 'TeamLeader') ? (
                                        <Dropdown
                                            style={[styles.dropdown, isFocus && { borderColor: '#c02221' }]}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={agent}
                                            search
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            placeholder={!isFocus ? 'Select Agent' : '...'}
                                            searchPlaceholder="Search..."
                                            value={value}
                                            onFocus={() => setIsFocus(true)}
                                            onBlur={() => setIsFocus(false)}
                                            onChange={(item) => {
                                                const updatedAssignToAgent = agent?.find((agentItem) => agentItem?.value === item?.value);
                                                setData({
                                                    ...data1,
                                                    assign_to_agent: updatedAssignToAgent?.value,
                                                });
                                                setIsFocus(false);
                                            }}
                                        />
                                    ) : (
                                        <Dropdown
                                            style={styles.dropdown}
                                            disable
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={agent}
                                            search
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            placeholder={!isFocus ? 'Select Agent' : '...'}
                                            searchPlaceholder="Search..."
                                            value={value}
                                            onChange={(item) => {
                                                const updatedAssignToAgent = agent?.find((agentItem) => agentItem?.value === item?.value);
                                                setData({
                                                    ...data1,
                                                    assign_to_agent: updatedAssignToAgent?.value,
                                                });
                                            }}
                                        />
                                    )}
                                    {agentError ? <Text style={styles.errorText}>{agentError}</Text> : null}
                                </View>

                                {/* <View style={styles.FrameInput}>
                                    <Dropdown
                                        style={[styles.dropdown, isFocus && { borderColor: '#c02221' }]}
                                        disable
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        inputSearchStyle={styles.inputSearchStyle}
                                        iconStyle={styles.iconStyle}
                                        data={agent}
                                        search
                                        maxHeight={300}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={!isFocus ? 'Select Agent' : '...'}
                                        searchPlaceholder="Search..."
                                        value={value}
                                        onChange={(item) => {
                                            const updatedAssignToAgent = agent?.find((agentItem) => agentItem?.value === item?.value);
                                            setData({
                                                ...data1,
                                                assign_to_agent: updatedAssignToAgent?.value,
                                            });
                                            setIsFocus(false);
                                        }}
                                    />
                                    {agentError ? <Text style={styles.errorText}>{agentError}</Text> : null}
                                </View> */}

                                <View style={styles.FrameInput}>
                                    <Dropdown
                                        style={[styles.dropdown, isFocus && { borderColor: '#c02221' }]}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        inputSearchStyle={styles.inputSearchStyle}
                                        iconStyle={styles.iconStyle}
                                        data={status}
                                        search
                                        maxHeight={300}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={!isFocus ? 'Select Status' : '...'}
                                        searchPlaceholder="Search..."
                                        value={statusvalue}
                                        onFocus={() => setIsFocus(true)}
                                        onBlur={() => setIsFocus(false)}
                                        onChange={(item) => updatethis(item)}
                                    // onChange={(item) => {
                                    //     const updatedStatus = status.find((statusItem) => statusItem.value === leaddetails['0']?.status);
                                    //     setData({
                                    //         ...data1,
                                    //         followup_status_id: item?.value,
                                    //     });
                                    //     setIsFocus(false);
                                    // }}
                                    />
                                    {statusError ? <Text style={styles.errorText}>{statusError}</Text> : null}
                                </View>

                                {isVisible && (
                                    <View style={styles.FrameInput}>
                                        <TextInput
                                            placeholder="Enter Won Amount"
                                            multiline={true}
                                            numberOfLines={5}
                                            value={data1.followup_won_amount}
                                            style={[styles.inputStyle, { textAlignVertical: 'top' }]}
                                            onChangeText={(text) => handleInputChange('followup_won_amount', text)}
                                        />
                                    </View>
                                )}

                                <View style={styles.FrameDtime}>
                                    <View style={styles.btnCalender}>
                                        <TouchableOpacity onPress={showDatePicker} style={styles.btnDate}>
                                            <TextInput
                                                placeholder="Select Date"
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
                                        {/* <Text style={styles.errorText}></Text> */}
                                        {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
                                    </View>
                                    <View style={styles.btnCalender}>
                                        <TouchableOpacity onPress={showTimePicker} style={styles.btnDate}>
                                            <TextInput
                                                placeholder="Select Time"
                                                value={inputTime}
                                                editable={false}
                                            />
                                            <DateTimePickerModal
                                                isVisible={isTimePickerVisible}
                                                onConfirm={handleTimeConfirm}
                                                onCancel={hideTimePicker}
                                                mode={'time'}
                                            />
                                        </TouchableOpacity>
                                        {datetimeError ? <Text style={styles.errorText}>{datetimeError}</Text> : null}
                                    </View>
                                </View>

                                <View>
                                    <TouchableOpacity
                                        style={styles.btnLog}
                                        onPress={submitLead}
                                    >
                                        <Text style={styles.btnLogtx}>Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={[styles.inputContainer, { marginTop: 10, marginBottom: 90 }]}>
                        <Text style={styles.inputHeader}>Followup History</Text>
                        <View style={styles.inputFrame}>
                            <View style={styles.inputFrameInn}>
                                <View style={styles.modalTabContainer}>
                                    <TouchableOpacity
                                        style={styles.btnModal}
                                        onPress={() => setOpenHistory(true)}
                                    >
                                        <Text style={styles.btnModalTxt}>History</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.btnModal}
                                        onPress={() => setUserDetail(true)}
                                    >
                                        <Text style={styles.btnModalTxt}>All Detail</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.btnModal}
                                        onPress={() => setAditionalDetail(true)}
                                    >
                                        <Text style={styles.btnModalTxt}>Aditional Info</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.btnModal}
                                        onPress={() => setOpenDoc(true)}
                                    >
                                        <Text style={styles.btnModalTxt}>Files</Text>
                                    </TouchableOpacity>
                                </View>
                                {renderHistory()}
                                {renderUserDetail()}
                                {renderAditionalDetail()}
                                {renderDoc()}
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <BottomNav />

        </View>

    );
}

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
        paddingHorizontal: 10,
    },
    commonHead: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        fontFamily: 'Poppins-Regular',
        marginTop: 15,
        marginBottom: 5,
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
        color: '#fff',
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#c02221',
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
        paddingLeft: 10,
        paddingRight: 10,
        shadowColor: '#000',
        elevation: 5,
    },
    inputHeader: {
        fontSize: 15,
        fontWeight: '500',
        textAlign: "center",
        color: "#344055",
        paddingBottom: 5,
        textTransform: "capitalize",
    },
    inputFrame: {
        width: '100%',
    },
    inputFrameInn: {
        textAlign: 'center',
        backgroundColor: '#fff',
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%',
    },
    FrameInput: {
        width: '100%',
    },
    inputLable: {
        fontSize: 14,
        marginTop: 5,
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
    btnLog: {
        backgroundColor: "#22c55e",
        Color: "#ffffff",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 5,
        marginRight: 4,
        textAlign: "center",
    },
    btntake: {
        // backgroundColor: "#f43f5e",
        paddingHorizontal: 0,
        paddingVertical: 8,
        borderRadius: 5,
        marginTop: 10,
        marginRight: 4,
        textAlign: "center",
        width: '49%'
    },
    btnChoose: {
        // backgroundColor: "#1d4ed8",
        paddingHorizontal: 0,
        paddingVertical: 8,
        borderRadius: 5,
        marginTop: 10,
        marginRight: 4,
        textAlign: "center",
        width: '49%'
    },
    btnSub: {
        backgroundColor: "#f43f5e",
        paddingHorizontal: 0,
        paddingVertical: 8,
        borderRadius: 5,
        marginTop: 10,
        marginRight: 4,
        textAlign: "center",
        width: '49%'
    },
    iconCamera: {
        color: '#f43f5e',
    },
    btnLogtx: {
        color: "#000",
        textAlign: "center",
        fontSize: 14,
    },
    btnSubtxt: {
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
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 14,
    },

    btnCalender: {
        width: '48%',
        marginRight: 10,
        marginTop: moderateScale(8),
        marginBottom: moderateScale(8),
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
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 2,
        borderBottomColor: '#e9e9e9',
        marginTop: moderateScale(3),
        marginBottom: moderateScale(5),
    },
    infoRowcollf: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    infoRowcolls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    collsimg: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#22c55e',
        width: scale(30),
        height: scale(25),
        borderRadius: 5,
        marginLeft: 10,
    },
    collsimg1: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0ea5e9',
        width: scale(30),
        height: scale(25),
        borderRadius: 5,
        marginLeft: 10,
    },
    collsimg2: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f43f5e',
        width: scale(30),
        height: scale(25),
        borderRadius: 5,
        marginLeft: 10,
    },
    iCall: {
        width: scale(16),
        height: scale(16),
        tintColor: '#fff',
    },
    infoRowLeft: {
        alignItems: 'center',
        marginRight: 6,
        marginBottom: moderateScale(10),
    },
    infoRowRight: {
        marginBottom: moderateScale(10),
        alignItems: 'center',
    },
    infoRowEnd: {
        alignItems: 'baseline'
    },
    infoIcon: {
        width: scale(25),
        height: scale(25),
        marginRight: 3,
        borderRadius: 5,
    },
    name: {
        color: '#2a2a2a',
        fontSize: moderateScale(11),
        fontWeight: '700',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: moderateScale(3),
        textTransform: 'capitalize'
    },
    contact: {
        color: '#727272',
        fontWeight: '500',
        fontSize: moderateScale(11),
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: moderateScale(2),
    },
    infoRowFull: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(4),
        marginBottom: moderateScale(5),
    },
    infoRowFullL: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '100%',
    },
    infoRowFullR: {
        alignItems: 'flex-end',
        width: '50%',
    },
    iconS: {
        width: scale(16),
        height: scale(16),
        marginRight: 7,
        tintColor: '#1d4ed8',
    },
    cardTxtS: {
        color: '#727272',
        fontWeight: '700',
        fontSize: moderateScale(12),
        marginRight: 15,
    },
    iconST: {
        width: scale(14),
        height: scale(14),
        tintColor: '#01a07e',
        marginRight: 7,
    },
    cardTxtST: {
        color: '#727272',
        fontWeight: '700',
        fontSize: moderateScale(11),
    },
    modalrContainer: {
        backgroundColor: "#fff",
        borderRadius: 5,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        shadowColor: '#000',
        elevation: 3,
    },
    modalFrame: {
        width: '100%',
    },
    modalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#e9e9e9',
        marginTop: moderateScale(2),
        marginBottom: moderateScale(3),
    },
    modalRowLeft: {
        alignItems: 'center',
        marginRight: 5,
        marginBottom: moderateScale(5),
    },
    modalRowRight: {
        marginBottom: moderateScale(8),
        alignItems: 'center',
    },
    modalImage: {
        width: scale(30),
        height: scale(30),
        marginRight: 7,
        borderRadius: 5,
    },
    modalName: {
        color: '#2a2a2a',
        fontSize: moderateScale(13),
        fontWeight: '600',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: moderateScale(1),
        marginBottom: moderateScale(1),
    },
    modalContact: {
        color: '#727272',
        fontWeight: '500',
        fontSize: moderateScale(13),
        width: '100%',
        justifyContent: 'space-between',
        marginTop: moderateScale(1),
        marginBottom: moderateScale(1),
    },
    modalRowFull: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(2),
        marginBottom: moderateScale(2),
    },
    iconM: {
        width: scale(14),
        height: scale(14),
        marginRight: 5,
        borderRadius: 3,
    },
    cardTxtM: {
        color: '#727272',
        fontWeight: '500',
        fontSize: moderateScale(13),
        marginRight: 12,
    },
    taskhead: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        fontFamily: 'Poppins-Regular',
        height: 45,
    },
    cardLeftView: {
    },
    cardLeftViewHead: {
        fontSize: 14,
        fontWeight: '700',
        color: '#5d596c',
        fontFamily: 'Poppins-Regular',
    },
    cardLeftTxt: {
        fontSize: 13,
        fontWeight: '700',
        color: '#5d596c',
        fontFamily: 'Poppins-Regular',
        marginTop: 2,
    },
    cardRightView: {
        alignItems: 'center',
    },
    cardRightViewHead: {
        color: '#a5a3ae',
    },
    cardRightViewHeadtxt: {
        fontSize: moderateScale(12),
        color: '#fff',
        fontWeight: 700,
    },
    modalTabContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    btnModal: {
        justifyContent: 'center',
        backgroundColor: '#1d4ed8',
        paddingTop: 5,
        paddingBottom: 7,
        paddingLeft: 12,
        paddingRight: 12,
        marginLeft: 3,
        marginRight: 3,
        borderRadius: 5,
    },
    btnModalTxt: {
        color: '#fff',
        fontSize: 12,
    },
    btnBrowse: {
        paddingTop: 6,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    appButtonContainer: {
        elevation: 8,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12
    },
    btnBrowseTxt: {
        color: '#fff',
        fontSize: 16,
    },
    browseContainer: {
        justifyContent: 'center',
        backgroundColor: '#f1f1f1',
        paddingTop: 6,
        paddingBottom: 8,
        borderRadius: 5,
        alignItems: 'center',
    },
    transparentBg: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)'
    },
    containerModal: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: '#fff',
        width: '100%',
        height: 510,
        padding: 15,
        borderRadius: 5,
    },
    containerAttachModal: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: '#fff',
        width: '100%',
        height: 350,
        padding: 15,
        borderRadius: 5,
    },
    containerAllDetail: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: '#fff',
        width: '100%',
        height: 350,
        padding: 15,
        borderRadius: 5,
    },
    containerAdditionanDetail: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: '#fff',
        width: '100%',
        height: 350,
        padding: 15,
        borderRadius: 5,
    },
    closeBox: {
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
        width: scale(22),
        height: scale(22),
        marginBottom: 30,
        backgroundColor: '#c02221',
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        tintColor: '#fff',
    },
    iconCl: {
        tintColor: '#fff',
        color: '#fff',
    },
    iconClose: {
        width: scale(16),
        height: scale(16),
        marginRight: 7,
        tintColor: '#fff',
    },
    tabContainer: {
        flex: 1,
    },
    scrolContainer: {
        flex: 1,
    },
    itemContainer: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        paddingBottom: 10,
        marginBottom: 15,
        borderBottomWidth: 0.5,
        borderColor: "rgba(0,0,0,0.5)",
    },
    listTab: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginBottom: 30,
    },
    btnTab: {
        width: Dimensions.get('window').width / 2.5,
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: '#ebebeb',
        padding: 10,
        justifyContent: 'center',
    },
    textTab: {
        fontSize: 12,
        fontWeight: "700",
        alignSelf: 'center',
        textAlign: 'center',
    },
    btnTabActive: {
        backgroundColor: '#FF9000',
    },
    textTabActive: {
        color: '#fff',
    },
    itemRow: {
        flexDirection: 'row',
    },
    comentBy: {

    },
    comentByText: {
        fontSize: 12,
        fontWeight: "700",
    },
    boldText: {
        fontWeight: 'bold',
    },
    notData: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    notDataTxt: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        backgroundColor: '#22c55e',
        paddingHorizontal: 30,
        paddingVertical: 8,
        borderRadius: 5,
    },
    imagecontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginTop: 20,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        borderRadius: 5,
    },
    imagecontainerLeft: {
        marginRight: 15,
    },
    imagecontainerRight: {
        marginRight: 10,
        textAlign: 'center'
    },
    imagebg: {
        width: 65,
        height: 65,
        backgroundColor: '#f1f1f1',
        padding: 5,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        borderRadius: 5,
    },
    locationTxt: {
        color: '#2a2a2a',
        fontSize: moderateScale(13),
        fontWeight: '700',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: moderateScale(3),
        marginBottom: moderateScale(1),
        textAlign: 'center'
    },
    locationTxtH: {
        color: '#fff',
        backgroundColor: '#10b981',
        fontSize: moderateScale(11),
        fontWeight: '700',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: moderateScale(3),
        marginBottom: moderateScale(1),
        textAlign: 'center',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 2,
    },
    btnSend: {
        backgroundColor: "#1d4ed8",
        Color: "#ffffff",
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 5,
        textAlign: "center",
    },
    btnSendTxt: {
        color: "#fff",
        textAlign: "center",
        fontSize: 12,
    },
    tabBtnRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default EditFollowup