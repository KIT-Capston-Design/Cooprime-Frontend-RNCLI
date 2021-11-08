import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { io } from "socket.io-client";
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from "react-native-webrtc";

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

  const handleDisconnectBtn = () => {
    /* 피어간 연결 종료 로직 */
    console.log("socket disconnect");

    /*
	로직 필요
	*/

    // 메인 화면으로 이동
    navigation.navigate("Calling");
    console.log("handleDisconnectBtn");
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <View style={styles.video}>
          <RTCView style={styles.rtcVideo} />
        </View>
        <View style={styles.video}>
          <RTCView style={styles.rtcVideo} />
        </View>
      </View>
      <View style={styles.videoContainer}>
        <View style={styles.video}>
          <RTCView style={styles.rtcVideo} />
        </View>
        <View style={styles.video}>
          <RTCView style={styles.rtcVideo} />
        </View>
      </View>
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
        <TouchableOpacity onPress={handleDisconnectBtn}>
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
  container: { flex: 1, backgroundColor: "#eeeeee" },
  videoContainer: {
    flex: 1,
    position: "relative",
    flexDirection: "row",
  },
  video: {
    width: "100%",
    flex: 1,
    position: "relative",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 6,
    height: 400,
    backgroundColor: "#ffffff",
    borderColor: "#cccccc",
    borderWidth: 1.5,
  },
  rtcVideo: {
    height: "100%",
    width: "100%",
    backgroundColor: "#f0f0f0",
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
