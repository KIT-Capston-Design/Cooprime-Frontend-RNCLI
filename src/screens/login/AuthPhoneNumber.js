import React, { useState, createRef } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Alert,
  AsyncStorage,
} from "react-native";

import Loader from "../../components/Loader";
import { SERVER_DOMAIN, SERVER_PORT } from "../../../env";

const AuthPhoneNumber = (props) => {
  const [authNumber, setAuthNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState("");
  const { phone_number } = props.route.params;
  const emailInputRef = createRef();

  const handleSubmitButton = () => {
    setErrortext("");
    if (!authNumber) {
      alert("Please fill Phone Number");
      return;
    }
    //Show Loader
    setLoading(true);

    // url 교체 필요
    fetch(`${SERVER_DOMAIN}:${SERVER_PORT}/api/login/register/auth/msg`, {
      method: "POST",
      body: JSON.stringify({
        phone_number: phone_number,
        auth_number: authNumber,
      }),
      headers: {
        //Header Defination
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //Hide Loader
        setLoading(false);

        // If server response message same as Data Matched
        if (responseJson.status === "success") {
          AsyncStorage.setItem("token", responseJson.token);
          props.navigation.replace("HomeScreen");
        } else {
          setErrortext(responseJson.msg);
        }
      })
      .catch((error) => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <View style={{ alignItems: "center", margin: 50 }}>
          <Text style={styles.TitleStyle}>인증번호 입력</Text>
          <Text style={{ color: "red" }}>{phone_number}</Text>
        </View>
        <KeyboardAvoidingView enabled>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserPhonesetauthNumber) =>
                setAuthNumber(UserPhonesetauthNumber)
              }
              underlineColorAndroid="#f000"
              placeholder="인증번호 입력"
              placeholderTextColor="#8b9cb5"
              color="black"
              keyboardType="phone-pad"
              ref={emailInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current && passwordInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          {errortext != "" ? (
            <Text style={styles.errorTextStyle}>{errortext}</Text>
          ) : null}
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleSubmitButton}
          >
            <Text style={styles.buttonTextStyle}>확인</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};
export default AuthPhoneNumber;

const styles = StyleSheet.create({
  TitleStyle: {
    color: "#000000",
    paddingVertical: 10,
    fontSize: 36,
  },
  SectionStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: "#7DE24E",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#7DE24E",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: "white",
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#dadae8",
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
  successTextStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    padding: 30,
  },
});
