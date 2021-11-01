import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import {MaterialCommunityIcons} from '@expo/vector-icons';
// import OneToOneCall from './OneToOneCall';
// import GroupCall from './GroupCall';
// import {NavigationContainer} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';

// const Stack = createNativeStackNavigator();

export default function Calling({ navigation }) {
  const startOneToOneCall = () => {
    // 일대일 통화 시작
    console.log("??");
    navigation.navigate("OneToOne"); // 일대일 통화 페이지로 이동
  };

  const startGroupCall = () => {
    // 그룹 통화 시작
    navigation.navigate("Group"); // 그룹 통화 페이지로 이동
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.oneToOne} onPress={startOneToOneCall}>
        <Text style={styles.innerText}>One To One</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.groupCall} onPress={startGroupCall}>
        <Text style={styles.innerText}>Group Call</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeeeee",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  oneToOne: {
    width: 150,
    height: 300,
    borderRadius: 40,
    backgroundColor: "#fedcba",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  groupCall: {
    width: 150,
    height: 300,
    borderRadius: 40,
    backgroundColor: "#abcdef",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  innerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
