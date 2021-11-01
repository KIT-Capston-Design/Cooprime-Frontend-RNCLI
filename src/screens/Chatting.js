import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Chatting() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 50 }}>Chatting</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeeeee",
    alignItems: "center",
    justifyContent: "center",
  },
});
