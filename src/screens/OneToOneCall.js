import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
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

export default function OneToOneCall({ navigation }) {
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
    /* 피어간 연결 종료 로직 */
    navigation.navigate("Calling");
    console.log("socket disconnect");
    // socket.disconnect();
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <View style={styles.localVideos}>
          <Text>내 화면</Text>
          {/* <RTCView streamURL={localStream.toURL()} style={styles.localVideo} /> */}
        </View>
        <View style={styles.remoteVideos}>
          <Text>상대방 화면</Text>
          {/* remote */}
          {/* <RTCView
            streamURL={remoteStream.toURL()}
            style={styles.remoteVideo}
          /> */}
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
    backgroundColor: "#ffff00",
  },
  videoContainer: {
    flex: 1,
    position: "relative",
  },
  localVideos: {
    flex: 1,
    bottom: 0,
    right: 0,
    position: "absolute",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 6,
    height: "20%",
    width: "25%",
    backgroundColor: "#ffffff",
    zIndex: 1,
    borderColor: "#aaaaaa",
    borderWidth: 0.7,
  },
  remoteVideos: {
    width: "100%",
    flex: 1,
    position: "relative",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 6,
    height: 400,
    backgroundColor: "#ffffff",
  },
  localVideo: {
    height: "100%",
    width: "100%",
    backgroundColor: "#009999",
  },
  remoteVideo: {
    height: "100%",
    width: "100%",
    backgroundColor: "#ff0000",
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
