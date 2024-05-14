import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, } from "react-native";
import { moderateScale, moderateVerticalScale, scale, verticalScale } from 'react-native-size-matters'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ProgressBar, MD3Colors } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import LeadSourceGraph from "./LeadSourceGraph";
import MonthlyEarningsGraph from "./MonthlyEarningsGraph";
import BottomNav from "../Components/BottomNav";
import { PROCESS_KEY } from "@env";
import ScheduleEvent from "./ScheduleEvent";
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { BASE_COLOR, BASE_COLOR2, BASE_COLOR3 } from "../utils/Colors";

const { height, width } = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation()
  const [currentIndex, setCurrentIndex] = useState(0);
  const [leadcountdata, setleadcountdata] = useState([]);
  const [isAuthenticated, setAuthenticated] = useState('');
  const [role, setRole] = useState('');
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [Sale, setSale] = useState([]);
  const [allAgent, setAllAgent] = useState([]);
  const [Detail, setDetail] = useState([]);
  const [Unassign, setUnassign] = useState();
  const [AgentleadCount, setAgentleadCount] = useState();
  const [agent, setagent] = useState([]);
  const [data, setdata] = useState([]);
  const [notificationtoken, setnotificationtoken] = useState([]);


  const getDeviceToken = async () => {
    let token = await messaging().getToken();
    setnotificationtoken(token)
    console.log('tokenHome', token);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getDeviceToken();
      await setUserIdAndRole();
      UnAssignedDashboardLeadCount();
      dispatchAgentAction();
      getSale();
      if (role === "admin") {
        getLeadCountData();
        getAllAgent();
        getAlllead();
      } else if (role === "TeamLeader") {
        DashboardLeadCountOfUserByTeamLeader();
        const userId = await AsyncStorage.getItem('user_id');
        getAllAgentWithData({ assign_to_agent: userId });
        getAllLead2({ assign_to_agent: userId });
      } else {
        DashboardLeadCountOfUser();
        const userId = await AsyncStorage.getItem('user_id');
        getAllAgent({ assign_to_agent: userId });
        getAllLead2({ assign_to_agent: userId });
      }
      await updateToken();
    };
    fetchData();

    const onFocus = navigation.addListener('focus', () => {
      setRefreshFlag((prevFlag) => !prevFlag);
    });
    return () => {
      onFocus();
    };
  }, [navigation, refreshFlag, isAuthenticated, role]);

  const updateToken = async () => {
    const data = {
      "user_id": isAuthenticated,
      "token": notificationtoken,
    }
    try {
      const response = await fetch(`${PROCESS_KEY}/update_and_save_notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log(result)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  const setUserIdAndRole = async () => {
    try {
      const userToken = await AsyncStorage.getItem('user_id');
      const userRole = await AsyncStorage.getItem('role');
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

  const UnAssignedDashboardLeadCount = async () => {
    try {
      const responce = await axios.get(`${PROCESS_KEY}/UnAssignedDashboardLeadCount`);
      setUnassign(responce?.data?.Count);
    } catch (error) {
      console.log(error);
    }
  };

  const dispatchAgentAction = async () => {
    try {
      const userRole = await AsyncStorage.getItem('role');
      if (userRole === 'admin') {
        getAllAgent();
        AgentWishLeadCount1();
        getHigstNoOfCall();
      } else if (userRole === 'TeamLeader') {
        const userId = await AsyncStorage.getItem('user_id');
        YearlySaleApiForTeamLeader();
        getAllAgentWithData({ assign_to_agent: userId });
        AgentWishLeadCount1();
        GetUserCallAccordingToTeamLeader();
      } else if (userRole === 'user') {
        const userId = await AsyncStorage.getItem('user_id');
        YearlySaleApiForUser();
        getAllAgent({ assign_to_agent: userId });
        AgentWishLeadCount1();
        getHigstNoOfCall();
      }
    } catch (error) {
      console.error('Error dispatching agent action:', error);
    }
  };

  const getSale = async () => {
    try {
      const response = await axios.get(`${PROCESS_KEY}/YearlySaleApi`);
      setSale(response?.data?.details);
    } catch (error) {
      console.log(error);
    }
  };

  const YearlySaleApiForTeamLeader = async () => {
    try {
      const responce = await axios.post(`${PROCESS_KEY}/YearlySaleApiForTeamLeader`, { user_id: isAuthenticated },
        { headers: { "Content-Type": "application/json", } }
      );
      setSale(responce?.data?.details);
    } catch (error) {
      console.log(error);
    }
  }
  const YearlySaleApiForUser = async () => {
    try {
      const responce = await axios.post(`${PROCESS_KEY}/YearlySaleApiForUser`, { user_id: isAuthenticated },
        { headers: { "Content-Type": "application/json", } }
      );
      setSale(responce?.data?.details);
    } catch (error) {
      console.log(error);
    }
  }

  const getLeadCountData = async () => {
    try {
      const responce = await axios.get(`${PROCESS_KEY}/DashboardLeadCount`);
      setleadcountdata(responce?.data?.Count);
    } catch (error) {
      console.log(error);
    }
  };

  const DashboardLeadCountOfUser = async () => {
    try {
      const responce = await axios.post(`${PROCESS_KEY}/DashboardLeadCountOfUser`, { user_id: isAuthenticated });
      setleadcountdata(responce?.data?.Count);
    } catch (error) {
      console.log(error);
    }
  };

  const DashboardLeadCountOfUserByTeamLeader = async () => {
    try {
      const responce = await axios.post(`${PROCESS_KEY}/DashboardLeadCountOfUserByTeamLeader`, { user_id: isAuthenticated });
      setleadcountdata(responce?.data?.Count);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllAgent = async () => {
    try {
      const responce = await axios.get(`${PROCESS_KEY}/get_all_agent`);
      setAllAgent(responce?.data?.agent);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllAgentWithData = async (data) => {
    try {
      const response = await fetch(`${PROCESS_KEY}/getAllAgentByTeamLeader`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success === true) {
        const agentList = result?.agent.map(agent111 => ({
          label: agent111.agent_name,
          value: agent111._id,
        }));
        setagent(agentList);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const AgentWishLeadCount1 = async () => {
    try {
      const responce = await axios.post(`${PROCESS_KEY}/AgentWishLeadCount1`, { role: role, user_id: isAuthenticated }, { headers: { "Content-Type": "application/json" } });
      setAgentleadCount(responce?.data?.Count);
    } catch (error) {
      console.log(error);
      setAgentleadCount(error.responce?.data?.Count);
    }
  };

  const getHigstNoOfCall = async () => {
    try {
      const responce = await axios.get(`${PROCESS_KEY}/GetAllUserCallLogById/`, { headers: { "Content-Type": "application/json" } });
      setDetail(responce?.data?.array);
    } catch (error) {
      console.log(error);
      setDetail(error.responce?.data?.array);
    }
  };

  const GetUserCallAccordingToTeamLeader = async () => {
    try {
      const responce = await axios.post(`${PROCESS_KEY}/GetUserCallAccordingToTeamLeader`, { assign_to_agent: isAuthenticated }, { headers: { "Content-Type": "application/json" } });
      setDetail(responce?.data?.array);
    } catch (error) {
      console.log(error);
      setDetail(error.responce?.data?.array);
    }
  };

  const getAlllead = async () => {
    try {
      const response = await axios.get(`${PROCESS_KEY}/getAllNewLead`);
      setdata(response?.data?.lead);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllLead2 = async (assign_to_agent) => {
    try {
      const response = await axios.post(`${PROCESS_KEY}/getAllNewLeadBYAgentId`, { assign_to_agent: isAuthenticated }, { headers: { "Content-Type": "application/json" } });
      setdata(response?.data?.lead);
    } catch (error) {
      console.log(error);
    }
  };

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };
  const FollowupLeads = (leadId) => {
    navigation.navigate("ScheduleEv", { leadId })
  }


  return (
    <>
      <ScrollView>

        <View style={styles.mainContainer}>

          <View style={styles.leadContainer}>
            <View style={styles.newLead}>
              <TouchableOpacity
                onPress={() => navigateToScreen('NewLeads')}
                style={styles.newLeadRow}
              >
                <View style={styles.newLeadCenter}>
                  <View style={styles.newLeadCenterIn}>
                    <View style={styles.CenterInO}>
                      <Image source={require('../assets/images/new-icon.gif')} style={styles.newLeadGif} />
                      <Text style={styles.newLeadHead}>Lead</Text>
                    </View>
                    <View style={styles.CenterInT}>
                      <Text style={styles.newLeadSubhead}>{data?.length !== 0 ? data.length : 0}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.newLeadRight}>
                  <Image source={require('../assets/images/bg.png')} style={styles.newLeadImg} />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.newLead}>
              {role === 'admin' ? (
                <TouchableOpacity
                  onPress={() => navigateToScreen('UnAssignedLeads')}
                  style={styles.newLeadRow}
                >
                  <View style={styles.newLeadCenter}>
                    <View style={styles.newLeadCenterIn}>
                      <View style={styles.CenterInO}>
                        <Text style={styles.newLeadHead}>UnAssign Lead</Text>
                      </View>
                      <View style={styles.CenterInT}>
                        <Text style={styles.newLeadSubhead}>
                          {Unassign && Unassign[0] ? Unassign[0].Value : 0}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.newLeadRight}>
                    <Image source={require('../assets/images/bg-i-2.png')} style={styles.newLeadImg} />
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.newLeadRow}
                >
                  <View style={styles.newLeadCenter}>
                    <View style={styles.newLeadCenterIn}>
                      <View style={styles.CenterInO}>
                        <Text style={styles.newLeadHead}>UnAssign Lead</Text>
                      </View>
                      <View style={styles.CenterInT}>
                        <Text style={styles.newLeadSubhead}>0</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.newLeadRight}>
                    <Image source={require('../assets/images/bg-i-2.png')} style={styles.newLeadImg} />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.categoryCard}>
            <FlatList
              numColumns={3}
              contentContainerStyle={{ marginTop: moderateScale(2) }}
              data={leadcountdata}
              renderItem={({ item: leadcountdata1, index }) => {

                const backgroundColor = index === 0 ? '#fff' : index === 1 ?
                  '#fff' : index === 2 ? '#fff' : index === 3 ? '#fff' : index === 4 ? '#fff' : '#fff';

                const imageSource = index === 0 ? leadcountdata1.imageSource || require('../assets/images/clients-icon.png') :
                  index === 1 ? leadcountdata1.imageSource || require('../assets/images/agent-icon.png') :
                    index === 2 ? leadcountdata1.imageSource || require('../assets/images/meeting-icon.png') :
                      index === 3 ? leadcountdata1.imageSource || require('../assets/images/interested-icon.png') :
                        index === 4 ? leadcountdata1.imageSource || require('../assets/images/re-visit-icon.png') :
                          leadcountdata1.imageSource || require('../assets/images/schedule-visit-icon.png');
                return (
                  leadcountdata1?.name === 'Followup Lead' ? (
                    <TouchableOpacity
                      onPress={() => navigateToScreen('FollowupLead')}
                      style={styles.categoryItem}
                    >
                      <Image source={imageSource} style={styles.cardItemIcon} />
                      <Text style={styles.cardItemHead}>{leadcountdata1.name}</Text>
                      <Text style={styles.cardItemSubHead}>{leadcountdata1?.Value}</Text>
                    </TouchableOpacity>
                  ) : leadcountdata1?.name === 'Total Agent' ? (
                    <TouchableOpacity disabled={true}
                      style={styles.categoryItem}
                    >
                      <Image source={imageSource} style={styles.cardItemIcon} />
                      <Text style={styles.cardItemHead}>{leadcountdata1.name}</Text>
                      <Text style={styles.cardItemSubHead}>{leadcountdata1?.Value}</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => FollowupLeads(leadcountdata1.id)}
                      style={styles.categoryItem}
                    >
                      <Image source={imageSource} style={styles.cardItemIcon} />
                      <Text style={styles.cardItemHead}>{leadcountdata1.name}</Text>
                      <Text style={styles.cardItemSubHead}>{leadcountdata1?.Value} - {leadcountdata1?.Value1}</Text>
                    </TouchableOpacity>
                  )
                )
              }}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>

          <View style={styles.graphWraper}>
            <View style={styles.graphWraperInn}>

              <View style={styles.taskhead}>
                <View style={styles.cardLeftView}>
                  <Text style={styles.cardLeftViewHead}>Earning Reports</Text>
                  <Text style={styles.cardLeftTxt}>Monthly Earnings Overview</Text>
                </View>
                <View style={styles.cardRightView}>
                  <Text style={styles.cardRightViewHead}>
                    <Ionicons name="ellipsis-vertical" size={22} />
                  </Text>
                </View>
              </View>

              {/* <View style={styles.chartwraper}>
                  <MonthlyEarningsGraph />
                </View> */}

              <View style={styles.cardWraper}>
                <View style={styles.cardWraperInn}>
                  <View style={styles.cardf}>
                    <View style={styles.cardfRow}>
                      <View style={styles.cardIconBg}>
                        <Image source={require('../assets/images/inr.png')} style={styles.cardIcons} />
                      </View>
                      <View style={styles.cardHead}>
                        <Text style={styles.cardHeadTxt}>Yearly Sales</Text>
                      </View>
                    </View>
                    <View style={[styles.cardfRow, { marginTop: 10, }]}>
                      <View style={styles.cardIconInr}>
                        <Image source={require('../assets/images/inr.png')} style={styles.IconsInr} />
                      </View>
                      <View style={styles.cardSubHead}>
                        <Text style={styles.cardSubHeadTxt}>{Sale['0']?.TotalAmountWon}.00  ({Sale['0']?.Yearly_lead_count_for_won})</Text>
                      </View>
                    </View>
                    <View style={styles.progressRow}>
                      <ProgressBar progress={0.9} color={BASE_COLOR} />
                    </View>
                  </View>
                  <View style={[styles.cardf, { marginTop: 25, }]}>
                    <View style={styles.cardfRow}>
                      <View style={styles.cardIconBg2}>
                        <Image source={require('../assets/images/inr.png')} style={styles.cardIcons2} />
                      </View>
                      <View style={styles.cardHead}>
                        <Text style={styles.cardHeadTxt}>Monthly Sales</Text>
                      </View>
                    </View>
                    <View style={[styles.cardfRow, { marginTop: 10, }]}>
                      <View style={styles.cardIconInr}>
                        <Image source={require('../assets/images/inr.png')} style={styles.IconsInr} />
                      </View>
                      <View style={styles.cardSubHead}>
                        <Text style={styles.cardSubHeadTxt}>{Sale['0']?.TotalAmountwonmanthely}.00  ({Sale['0']?.wonleadforthirtyday_count_lead})</Text>
                      </View>
                    </View>
                    <View style={styles.progressRow}>
                      <ProgressBar progress={0.4} color={BASE_COLOR2} />
                    </View>
                  </View>
                  <View style={[styles.cardf, { marginTop: 25, }]}>
                    <View style={styles.cardfRow}>
                      <View style={styles.cardIconBg3}>
                        <Image source={require('../assets/images/inr.png')} style={styles.cardIcons3} />
                      </View>
                      <View style={styles.cardHead}>
                        <Text style={styles.cardHeadTxt}>Miss opportunity</Text>
                      </View>
                    </View>
                    <View style={[styles.cardfRow, { marginTop: 10, }]}>
                      <View style={styles.cardIconInr}>
                        <Image source={require('../assets/images/inr.png')} style={styles.IconsInr} />
                      </View>
                      <View style={styles.cardSubHead}>
                        <Text style={styles.cardSubHeadTxt}>{Sale['0']?.TotalAmountLost}.00  ({Sale['0']?.Yearly_lead_count_Lost})</Text>
                      </View>
                    </View>
                    <View style={styles.progressRow}>
                      <ProgressBar progress={0.1} color={BASE_COLOR3} />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.graphWraper}>
            <View style={styles.graphWraperInn}>
              <View style={styles.taskhead}>
                <View style={styles.cardLeftView}>
                  <Text style={styles.cardLeftViewHead}>Lead Source Overview</Text>
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

          <View style={styles.taskWraper}>
            <View style={styles.taskWraperInn}>
              <View style={styles.taskhead}>
                <View style={styles.cardLeftView}>
                  <Text style={styles.cardLeftViewHead}>Employee Report</Text>
                </View>
                <View style={styles.cardRightView}>
                  <Text style={styles.cardRightViewHead}>
                    <Ionicons name="ellipsis-vertical" size={22} />
                  </Text>
                </View>
              </View>
              <View style={styles.taskBody}>
                <ScrollView>
                  {Detail ? (
                    Detail.map((Details) => {
                      const converttime = (ffgfgf) => {
                        const second = ffgfgf;
                        const hours = Math.floor(second / 3600);
                        const minutes = Math.floor((second % 3600) / 60);
                        const remainingSeconds = second % 60;
                        const timeconverted = hours + 'h ' + minutes + 'm ' + remainingSeconds + 's';
                        return timeconverted;
                      }

                      const isUser = role === 'user';
                      const isCurrentUser = Details?.user_id === isAuthenticated;

                      if (isUser && isCurrentUser) {
                        return (
                          <View style={styles.cardTaskRow} key={Details.id}>
                            <View style={styles.cardTask}>
                              <View style={styles.cardTaskLeft}>
                                <Image source={require('../assets/images/agent.png')} style={styles.star} />
                                <Text style={styles.cardTaskLtxt}>{Details?.username}</Text>
                              </View>
                              <View style={styles.cardTaskCenter}>
                                <Image source={require('../assets/images/call.png')} style={styles.callicon} />
                                <Text style={styles.cardTaskCenterTxt}>{Details.HigstNoOfCall}</Text>
                              </View>
                              <View style={styles.cardTaskRight}>
                                <Text style={styles.cardTaskRightcnt}>{converttime(Details.TotalTime)}</Text>
                              </View>
                            </View>
                          </View>
                        );
                      } else if (!isUser) {
                        return (
                          <View style={styles.cardTaskRow} key={Details.id}>
                            <View style={styles.cardTask}>
                              <View style={styles.cardTaskLeft}>
                                <Image source={require('../assets/images/agent.png')} style={styles.star} />
                                <Text style={styles.cardTaskLtxt}>{Details?.username}</Text>
                              </View>
                              <View style={styles.cardTaskCenter}>
                                <Image source={require('../assets/images/call.png')} style={styles.callicon} />
                                <Text style={styles.cardTaskCenterTxt}>{Details.HigstNoOfCall}</Text>
                              </View>
                              <View style={styles.cardTaskRight}>
                                <Text style={styles.cardTaskRightcnt}>{converttime(Details.TotalTime)}</Text>
                              </View>
                            </View>
                          </View>
                        );
                      }
                      else {
                        return null;
                      }
                    })
                  ) : (
                    <Text>No data available</Text>
                  )}
                </ScrollView>
              </View>
            </View>
          </View>

          <View style={[styles.taskWraper, { marginBottom: 60 }]}>
            <View style={styles.taskWraperInn}>
              <View style={styles.taskhead}>
                <View style={styles.cardLeftView}>
                  <Text style={styles.cardLeftViewHead}>All Leads Information</Text>
                  <Text style={styles.cardLeftTxt}>Since Last Year</Text>
                </View>
                <View style={styles.cardRightView}>
                  <Text style={styles.cardRightViewHead}>
                    <Ionicons name="ellipsis-vertical" size={22} />
                  </Text>
                </View>
              </View>
              <View style={styles.taskBodyS}>
                <ScrollView>{
                  AgentleadCount?.map((leadCount) => {
                    return (
                      <View style={styles.cardTaskRow}>
                        <View style={styles.cardTask}>
                          <View style={styles.taskLeft}>
                            <View style={styles.tIconBg}>
                              <Ionicons name="person-outline" size={20} style={styles.tIcon} />
                            </View>
                            <View>
                              <Text style={styles.cardTaskLtxt}>{leadCount?.name}</Text>
                            </View>
                          </View>
                          <View style={styles.taskRight}>
                            <Text style={styles.cardTaskRightcntxt}>{leadCount?.Value}</Text>
                          </View>
                        </View>
                      </View>
                    )
                  })
                }
                </ScrollView>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>
      <BottomNav />
    </>
  )
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  chartwraper: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 5,
  },
  graphWraper: {
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: moderateVerticalScale(25),
    backgroundColor: '#ffffff',
    shadowColor: '#545454',
    elevation: 3,
    padding: 10,
    marginBottom: 5,
  },
  graphWraperInn: {
    width: '100%',
  },
  graphheading: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    alignItems: 'center',
    color: '#000',
    justifyContent: 'center',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  chart: {
    width: '100%',
    height: verticalScale(75),
    alignItems: 'center',
    marginTop: moderateVerticalScale(20),
  },
  cardWraper: {
    width: '100%',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    padding: 20,
    marginTop: 15,
  },
  cardWraperInn: {
    width: '100%',
  },
  cardf: {
    width: '100%',
  },
  cardfRow: {
    flexDirection: 'row',
  },
  progressRow: {
    marginTop: 5,
  },
  cardHead: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeadTxt: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#5d596c',
    fontFamily: 'Poppins-Regular',
  },
  cardSubHead: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSubHeadTxt: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: '#5d596c',
    fontFamily: 'Poppins-Regular',
  },
  cardIconBg: {
    width: scale(30),
    height: scale(30),
    backgroundColor: '#eae8fd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginRight: moderateVerticalScale(10),
  },
  cardIcons: {
    tintColor: '#7367f0',
    width: scale(16),
    height: scale(16),
  },
  cardIconBg2: {
    width: scale(30),
    height: scale(30),
    backgroundColor: '#d9f8fc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginRight: moderateVerticalScale(10),
  },
  cardIcons2: {
    tintColor: '#00cfe8',
    width: scale(16),
    height: scale(16),
  },
  cardIconBg3: {
    width: scale(30),
    height: scale(30),
    backgroundColor: '#fce5e6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginRight: moderateVerticalScale(10),
  },
  cardIcons3: {
    tintColor: '#ea5455',
    width: scale(16),
    height: scale(16),
  },
  cardIconInr: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateVerticalScale(1),
  },
  IconsInr: {
    tintColor: '#5d596c',
    width: scale(17),
    height: scale(17),
  },
  taskWraper: {
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: moderateVerticalScale(10),
    marginBottom: moderateVerticalScale(20),
    backgroundColor: '#ffffff',
    shadowColor: '#545454',
    elevation: 3,
    padding: 10,
  },
  taskWraperInn: {
    width: '100%',
  },
  taskhead: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    fontFamily: 'Poppins-Regular',
    marginBottom: 20,
  },
  cardLeftViewHead: {
    fontSize: 15,
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
  cardRightViewHeadtxt: {
    fontSize: moderateScale(12),
    color: '#fff',
    fontWeight: 700,
  },
  cardViewIcons: {
    fontSize: moderateScale(14),
    color: '#fff',
    marginRight: 5,
    fontWeight: 700,
  },
  taskBody: {
    width: '100%',
    height: 150,
    flexDirection: 'row',
  },
  taskBodyS: {
    width: '100%',
    height: 150,
    flexDirection: 'row',
  },
  cardTaskRow: {
    width: '100%',
  },
  cardTask: {
    backgroundColor: '#fff',
    paddingTop: 4,
    paddingBottom: 10,
    flexDirection: 'row',
    width: '100%',
  },
  cardTaskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '47%',
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
  },
  tIconBg: {
    width: scale(30),
    height: scale(30),
    backgroundColor: '#fff1e3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginRight: moderateVerticalScale(10),
  },
  tIcon: {
    color: '#ff9f43',
  },
  star: {
    width: scale(25),
    height: scale(25),
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#22c55e',
  },
  cardTaskLtxt: {
    color: '#5d596c',
    fontWeight: '600',
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Regular',
    textTransform: 'capitalize'
  },
  cardTaskCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '20%',
  },
  cardTaskCenterTxt: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#5d596c',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 5,
    paddingRight: 13,
    borderRadius: 5,
    fontFamily: 'Poppins-Regular',
  },
  callicon: {
    width: scale(14),
    height: scale(14),
    paddingTop: 3,
    paddingBottom: 3,
    tintColor: '#22c55e',
  },
  cardTaskRight: {
    alignItems: 'flex-end',
    width: '33%',
  },
  taskRight: {
    alignItems: 'flex-end',
    width: '32%',
  },
  cardTaskRightcnt: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#28c76f',
    backgroundColor: '#dff7e9',
    justifyContent: 'center',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    textAlign: "center",
    fontFamily: 'Poppins-Regular',
  },
  cardTaskRightcntxt: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#fd8717',
    justifyContent: 'center',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 13,
    paddingRight: 13,
    borderRadius: 5,
    textAlign: "center",
    fontFamily: 'Poppins-Regular',
  },

  itemCardContainer: {
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  itemCardContainerInn: {
    width: '100%',
    flexDirection: 'row',
  },
  cardItemFirst: {
    width: '47%',
    height: verticalScale(140),
    borderRadius: 5,
    alignItems: 'center',
    marginTop: moderateVerticalScale(10),
    backgroundColor: '#22d3ee',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    shadowColor: '#2709c7',
    elevation: 15,
  },
  cardItemSecond: {
    width: '47%',
    height: verticalScale(140),
    borderRadius: 5,
    alignItems: 'center',
    marginTop: moderateVerticalScale(10),
    backgroundColor: '#4ade80',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    marginLeft: 22,
    shadowColor: '#e37800',
    elevation: 15,
  },
  cardItemHead: {
    fontSize: moderateScale(10),
    fontWeight: '500',
    alignItems: 'center',
    color: '#222',
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  cardItemSubHead: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    alignItems: 'center',
    color: '#222',
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: 2,
    fontFamily: 'Poppins-Regular',
  },
  cardItemHeadS: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    alignItems: 'center',
    color: '#166534',
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  cardItemSubHeadS: {
    fontSize: moderateScale(18),
    fontWeight: '500',
    alignItems: 'center',
    color: '#166534',
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: 5,
    fontFamily: 'Poppins-Regular',
  },
  cardItemIcon: {
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 6,
    width: scale(30),
    height: scale(30),
  },
  categoryCard: {
    width: '100%',
    alignSelf: "center",
    marginTop: moderateVerticalScale(5),
  },
  categoryItem: {
    width: '29%',
    backgroundColor: '#fef5f0',
    shadowColor: '#2709c7',
    elevation: 2,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 7,
    marginVertical: 7,
    paddingBottom: 5,
  },
  leadContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  newLead: {
    width: '46%',
    backgroundColor: '#dcfce7',
    borderColor: '#c9f4d8',
    borderWidth: 1,
    flexDirection: 'row',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  newLeadRow: {
    flexDirection: 'row',
  },
  newLeadLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%',
  },
  newLeadCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '65%',
  },
  newLeadRight: {
    alignItems: 'flex-end',
    width: '35%',
  },
  newLeadLeftIn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  newLeadCenterIn: {
    width: '100%',
    alignItems: 'center',
  },
  CenterInO: {
    flexDirection: 'row',
  },
  CenterInT: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    paddingTop: 8,
  },
  newLeadI: {
    width: scale(100),
    height: scale(70),
    position: 'absolute',
    top: 0,
  },
  newLeadImg: {
    width: scale(60),
    height: scale(40),
    marginTop: 5,
  },
  newLeadGif: {
    width: scale(30),
    height: scale(13),
    marginRight: 5,
  },
  newLeadHead: {
    color: '#fc221b',
    fontWeight: '700',
    fontSize: moderateScale(9),
    fontFamily: 'Poppins-Regular',
  },
  newLeadSubhead: {
    flexDirection: 'row',
    fontSize: moderateScale(11),
    fontWeight: '700',
    color: '#166534',
    backgroundColor: '#bbf7d0',
    borderRadius: 3,
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 8,
    paddingVertical: 1,
  },
  imgCrmWrapper: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 5,
    marginHorizontal: 7,
    marginVertical: 10,
    width: '95%',
  },
  imgCrm: {
    width: '100%',
    height: 350,
    borderRadius: 5,
  },
})
