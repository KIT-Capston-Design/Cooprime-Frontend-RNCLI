import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Icon from "react-native-vector-icons/Feather";

export default function GroupCall({ navigation }) {
  const iconSize = 60;
  const [onMic, setOnMic] = useState(false);
  const [onVideo, setOnVideo] = useState(true);

  const toggleMic = () => {
    setOnMic(!onMic);
  };

  const toggleVideo = () => {
    setOnVideo(!onVideo);
  };

  const disconnect = () => {
    navigation.navigate("Calling");
    console.log("disconnect");
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30, alignSelf: "center" }}>그룹 통화</Text>
      <View style={styles.videoContainer}></View>
      <View style={styles.callSetting}>
        <TouchableOpacity onPress={toggleMic}>
          <MaterialCommunityIcons
            name={onMic ? "volume-mute" : "volume-source"}
            size={iconSize}
            color={onMic ? "grey" : "black"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleVideo}>
          <MaterialIcons
            name={onVideo ? "videocam" : "videocam-off"}
            size={iconSize}
            color={onVideo ? "#05ff05" : "red"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={disconnect}>
          <MaterialCommunityIcons
            name="phone-off"
            size={iconSize}
            color="red"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeeeee",
  },
  disconnectBtn: { backgroundColor: "#0000ff" },
  videoContainer: {
    flex: 1,
    position: "relative",
  },
  callSetting: {
    backgroundColor: "#fff0ff",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopColor: "#aaaaaa",
    borderTopWidth: 0.5,
  },
});
