import React, { useState, createRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  KeyboardAvoidingView,
} from "react-native";

import Loader from "../../components/Loader";

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <View>
          <KeyboardAvoidingView enabled>
            <Text
              style={{
                color: "#000000",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 18,
                alignSelf: "center",
                padding: 10,
              }}
              onPress={() => navigation.navigate("RegisterPhoneNumberScreen")}
            >
              서로 다른 우리, 함께
            </Text>
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../assets/images/Cooprime_title.png")}
                style={{
                  width: "50%",
                  height: 300,
                  resizeMode: "contain",
                  margin: 30,
                }}
              />
            </View>
            <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.navigate("RegisterPhoneNumberScreen")}
            >
              New Here ? Register
            </Text>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#E6E6E6",
    alignContent: "center",
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
    marginBottom: 25,
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
  registerTextStyle: {
    color: "#000000",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
    padding: 10,
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
});

// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
// } from "react-native";

// import Input from "../components/Input";
// import Button from "../components/Button";

// const height = Dimensions.get("window").height;
// const width = Dimensions.get("window").width;

// export default function Login() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.logo}>Cooprime</Text>
//       {/* <Input /> */}
//       <Input style={{ fontSize: 17 }} placeholder={"전화번호 또는 이메일"} />
//       <Input
//         style={{ fontSize: 17 }}
//         placeholder={"비밀번호"}
//         secureTextEntry={true}
//       />
//       <Button
//         style={{ width: width * 0.85, marginTop: 15, fontSize: 17 }}
//         onLabel={true}
//         label={"로그인"}
//       />
//       <TouchableOpacity></TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ffffff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   logo: {
//     fontSize: 60,
//     marginBottom: 20,
//   },
// });
