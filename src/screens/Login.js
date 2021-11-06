import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import Input from "../components/Input";
import Button from "../components/Button";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

export default function Login() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Cooprime</Text>
      {/* <Input /> */}
      <Input style={{ fontSize: 17 }} placeholder={"전화번호 또는 이메일"} />
      <Input
        style={{ fontSize: 17 }}
        placeholder={"비밀번호"}
        secureTextEntry={true}
      />
      <Button
        style={{ width: width * 0.85, marginTop: 15, fontSize: 17 }}
        onLabel={true}
        label={"로그인"}
      />
      <TouchableOpacity></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontSize: 60,
    marginBottom: 20,
  },
});
