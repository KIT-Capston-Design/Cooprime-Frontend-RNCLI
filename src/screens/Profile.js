import React from "react";
import { View, StyleSheet } from "react-native";
import { Box, ScrollView, Text } from "native-base";

export const Profile = () => {
  return (
    <>
      <Box></Box>
    </>
  );
};

export default function Profile() {
  return (
    <Box>
      <Profile />
      <ScrollView></ScrollView>
    </Box>
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
