import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

export default function HeaderBar() {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Cooprime</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.15,
    borderBottomColor: "#aaaaaa",
    borderBottomWidth: 0.5,
    // alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    paddingTop: width / 10,
    paddingLeft: width / 20,
    fontSize: width / 10,
    fontFamily: "DancingScript-Bold",
  },
});
