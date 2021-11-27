import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import ReportModal from "../../components/ReportModal";
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
import InCallManager from "react-native-incall-manager";

// const SERVER_DOMAIN = "http://KITCapstone.iptime.org";
const SERVER_DOMAIN = "http://KITCapstone.iptime.org";
const SERVER_PORT = "3002";

let socket;
let roomName;
let myStream;

export default function OneToOneCall({ navigation }) {
  const iconSize = 60;
  const [localStream, setLocalStream] = useState({ toURL: () => null });
  const [remoteStream, setRemoteStream] = useState({ toURL: () => null });
  const [onMic, setOnMic] = useState(false);
  const onVideo = useRef(true);
  const [showModal, setShowModal] = useState(false); // 신고 팝업창 활성화 변수
  const [myPeerConnection, setMyPeerConnection] = useState(
    // 우리 서버 : stun:20.78.169.27:3478
    new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
        {
          urls: "stun:stun1.l.google.com:19302",
        },
        {
          urls: "stun:stun2.l.google.com:19302",
        },
      ],
    })
  );

  const toggleMic = () => {
    setOnMic(!onMic);
    console.log("onMic", onMic);
    myPeerConnection.getLocalStreams()[0].getAudioTracks()[0].enabled = onMic;
  };

  const toggleVideo = async () => {
    onVideo.current = !onVideo.current;
    onVideo.current
      ? setLocalStream(myStream)
      : setLocalStream({ toURL: () => null });
    // myPeerConnection
    //   .getLocalStreams()[0]
    //   .getVideoTracks()[0]
    //   .onended(setRemoteStream({ toURL: () => null }));
    myPeerConnection.getLocalStreams()[0].getVideoTracks()[0].enabled =
      onVideo.current;
  };

  useEffect(async () => {
    console.log("-----------------useEffect----------------");

    InCallManager.start({ media: "audio" });
    InCallManager.setForceSpeakerphoneOn(true);
    await getMedia();
    setLocalStream(myStream);

    await initSocket();
    await initCall();

    // RTC Code
    myPeerConnection.onicecandidate = (data) => {
      console.log("sent candidate");
      socket.emit("ice", data.candidate, roomName);
    };

    myPeerConnection.onaddstream = async (data) => {
      console.log("On Add Stream");
      await setRemoteStream(data.stream);
      setTimeout(() => setLocalStream(myStream), 1000);
    };

    myPeerConnection
      .getLocalStreams()[0]
      .getVideoTracks()[0]
      .onended(() => console.log("aaa"));

    return () => {
      InCallManager.stop();
    };
  }, []);

  const initSocket = async () => {
    console.log("initSocket");

    // 서버 연결
    socket = await io(SERVER_DOMAIN + ":" + SERVER_PORT, {
      cors: { origin: "*" },
    });

    // Socket Code
    socket.on("matched", async (data) => {
      console.log("matched start");

      roomName = data;

      //룸네임이 본인의 아이디로 시작하면 본인이 시그널링 주도
      if (data.match(new RegExp(`^${socket.id}`))) {
        // 방장 역할
        console.log("나는 방장입니다.");
        const offer = await myPeerConnection.createOffer();
        myPeerConnection.setLocalDescription(offer);
        console.log("sent the offer");
        socket.emit("offer", offer, roomName);
      } else {
        // 방장이 아닌 역할
        console.log("나는 방장이 아닙니다.");
      }
    });

    socket.on("offer", async (offer) => {
      console.log("received the offer");
      await myPeerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      const answer = await myPeerConnection.createAnswer();
      myPeerConnection.setLocalDescription(answer);

      console.log("sent the answer");
      socket.emit("answer", answer, roomName);
    });

    socket.on("answer", async (answer) => {
      console.log("received the answer");
      await myPeerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on("ice", (ice) => {
      console.log("received candidate");
      myPeerConnection.addIceCandidate(ice);
    });
  };

  const initCall = async () => {
    console.log("sent random_one_to_one");
    socket.emit("random_one_to_one");
  };

  /*
   화질에 따른 네트워크 지연?
  */
  const getMedia = async () => {
    console.log("getMedia() Start");
    await mediaDevices
      .getUserMedia({
        audio: true,
        video: {
          width: { min: 1024, ideal: 1280, max: 1920 },
          height: { min: 776, ideal: 720, max: 1080 },
          minFrameRate: 15,
          facingMode: "user",
        },
      })
      .then((stream) => {
        // 스트림 얻음
        console.log("get myStream");
        myStream = stream;

        myPeerConnection.addStream(myStream);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /* 피어간 연결 종료 */
  const handleDisconnectBtn = () => {
    console.log("socket disconnect");
    if (socket !== undefined && socket !== null && socket.connected) {
      socket.emit("discon", roomName);
      // socket.disconnect();
      myPeerConnection.close();
    } else {
      console.log("socket is undifined");
    }
    socket = null;
    navigation.navigate("Calling");
  };

  const openModal = () => {
    setShowModal((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <View style={styles.remoteVideos}>
          <RTCView
            streamURL={remoteStream.toURL()}
            style={styles.remoteVideo}
            mirror={true}
            zOrder={999}
            objectFit={"cover"}
          />
        </View>
        <View style={styles.localVideos}>
          <RTCView
            streamURL={localStream.toURL()}
            style={styles.localVideo}
            mirror={true}
            zOrder={1}
            objectFit={"cover"}
          />
        </View>
      </View>
      <View style={styles.callSetting}>
        <TouchableOpacity onPress={toggleMic}>
          <MaterialCommunityIcons
            name={onMic ? "volume-mute" : "volume-source"}
            size={iconSize}
            color={onMic ? "grey" : "red"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleVideo}>
          <MaterialIcons
            name={onVideo.current ? "videocam" : "videocam-off"}
            size={iconSize}
            color={onVideo.current ? "#05ff05" : "red"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDisconnectBtn}>
          <MaterialCommunityIcons
            name="phone-off"
            size={iconSize}
            color="red"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={openModal}>
          <MaterialIcons name="report" size={iconSize} color="red" />
        </TouchableOpacity>
      </View>
      <ReportModal showModal={showModal} setShowModal={setShowModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    // alignItems: "center",
    // justifyContent: "center",
    // flexDirection: "row",
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
    overflow: "hidden",
    height: "20%",
    width: "25%",
    // marginBottom: 10,
    backgroundColor: "black",
    zIndex: 1,
    borderWidth: 2,
    borderColor: "black",
  },
  remoteVideos: {
    width: "100%",
    flex: 1,
    position: "relative",
    overflow: "hidden",
    borderRadius: 6,
    height: 400,
  },
  localVideo: {
    height: "100%",
    width: "100%",
    backgroundColor: "#009999",
    zIndex: 999,
  },
  remoteVideo: {
    // flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "#000000",
    zIndex: -1,
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
