import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomTextInput from "../Components/CustomTextInput";
import { useNavigation } from '@react-navigation/native'
import CustomAlert from "../Components/CustomAlert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PROCESS_KEY } from "@env";
import { color } from "react-native-reanimated";
import CustomTextPasswordInput from "../Components/CustomTextPasswordInput";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [badEmail, setbadEmail] = useState('');
  const [badPassword, setbadPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const showAlert = (message) => {
    setErrorMessage(message);
    setShowError(true);
  };

  const validate = () => {
    let isValid = false;
    if (email === '') {
      setbadEmail("Please Enter Email");
      isValid = false;
    } else if (
      email !== '' &&
      !email.toLowerCase().match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      setbadEmail("Please Enter Valid Email");
      isValid = false;
    } else if (email !== '' &&
      email.toLowerCase().match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      isValid = true;
      setbadEmail("");
    }
    if (password === '') {
      setbadPassword("Please Enter Password");
      isValid = false;
    } else if (password !== '' && password.length < 4) {
      setbadPassword("Please Enter Valid Password");
      isValid = false;
    } else if (password !== '' && password.length > 3) {
      setbadPassword("");
      isValid = true;
    }
    return isValid;
  };

  const login = async () => {
    const body = {
      email: email,
      password: password,
    };
    const responce = await fetch(`${PROCESS_KEY}/agent_login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const result = await responce.json();
    // console.log('result', result);
    if (result.success === true) {
      // console.log('wer', result.agent)
      await AsyncStorage.setItem('user_id', result.agent._id);
      await AsyncStorage.setItem('name', result.agent.agent_name);
      await AsyncStorage.setItem('role', result.agent.role);
      await AsyncStorage.setItem('agent_mobile', result.agent.agent_mobile);
      await AsyncStorage.setItem('token', result.token, error => {
        if (error) {
          console.log("data not save");
          throw error;
        } else {
          console.log("data  save");
        }
      });
      navigation.navigate("Home");
    } else {
      showAlert('Please Enter Correct E-mail & Password');
      console.log('not login');
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mainHeader}>MagiecBiz</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputHeader}>Sign In to MagiecBiz</Text>
        <Text style={styles.labels}>Email Address</Text>
        <CustomTextInput
          icon={require('../assets/images/mail.png')}
          placeholder={'Enter Email'}
          value={email}
          onChangeText={txt => setEmail(txt)}
          isValid={badEmail === '' ? true : false}
        />
        {badEmail !== '' && <Text style={styles.errorText}>{badEmail}</Text>}

        <Text style={styles.labels}>Password</Text>
        <CustomTextPasswordInput
          icon={require('../assets/images/lock-open.png')}
          iconeye={require('../assets/images/eye-outline.png')}
          iconeyeOff={require('../assets/images/eye-off-outline.png')}
          placeholder={'Enter Password'}
          value={password}
          onChangeText={txt => setPassword(txt)}
          isValid={badPassword === '' ? true : false}
        />
        {/* <CustomTextInput
            icon={require('../assets/images/lock-open.png')}
            placeholder={'Enter Password'}
            value={password}
            onChangeText={txt => setPassword(txt)}
            isValid={badPassword === '' ? true : false}
          /> */}
        {badPassword !== '' && <Text style={styles.errorText}>{badPassword}</Text>}

        <Text style={styles.btnBtxt}>ForgotPassword</Text>
        <TouchableOpacity
          style={styles.btnLog}
          onPress={() => {
            if (validate()) {
              login();
            }
          }}
        >
          <Text style={styles.btnLogtx}>Sign In</Text>
        </TouchableOpacity>
      </View>
      <CustomAlert visible={showError} message={errorMessage} onClose={() => setShowError(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: "100%",
    paddingTop: 80,
    backgroundColor: "#c02221",
  },
  mainHeader: {
    fontSize: 26,
    color: "#fff",
    paddingTop: 20,
    paddingBottom: 50,
    textAlign: "center",
    fontWeight: "bold",
  },
  inputContainer: {
    height: "100%",
    backgroundColor: "#f1f1f1",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 25,
    paddingBottom: 25,
    paddingLeft: 20,
    paddingRight: 20,
    shadowColor: '#000',
    elevation: 20,
  },
  inputHeader: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#344055",
    paddingBottom: 10,
    textTransform: "capitalize",
  },
  labels: {
    fontSize: 14,
    color: "#898989",
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 10,
    lineHeight: 25,
    fontFamily: "regular",
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    fontFamily: "regular",
  },
  checkbox: {
  },
  btnLog: {
    backgroundColor: "#c02221",
    color: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 30,
    textAlign: "center"
  },
  btnLogtx: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  btnBtxt: {
    color: "#999999",
    marginTop: 15,
    textAlign: "center"
  },
  errorText: {
    color: '#f00',
    marginLeft: 20,
    marginTop: 5,
  },
});

export default LoginScreen;
