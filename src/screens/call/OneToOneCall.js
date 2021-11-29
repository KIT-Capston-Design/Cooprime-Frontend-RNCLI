import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import ReportModal from "../../components/ReportModal";
import Loading from "../../components/Loading";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
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
import {
  Box,
  NativeBaseProvider,
  Stagger,
  IconButton,
  Icon,
  useDisclose,
} from "native-base";
import InCallManager from "react-native-incall-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const SERVER_DOMAIN = "http://KITCapstone.iptime.org";
const SERVER_DOMAIN = "http://KITCapstone.iptime.org";
const SERVER_PORT = "3002";

let socket;
let roomName;
let myStream;

let trueOnMic = true; // State의 상식 밖 동작으로 인한 전역변수
let trueOnSpeak = false; // State의 상식 밖 동작으로 인한 전역변수
export default function OneToOneCall({ navigation }) {
  const iconSize = 60;
  const [localStream, setLocalStream] = useState({ toURL: () => null });
  const [remoteStream, setRemoteStream] = useState({ toURL: () => null });
  const [onMic, setOnMic] = useState(true);
  const onVideo = useRef(true);
  const [onSpeak, setOnSpeak] = useState(false);

  // "..." 단추 클릭시 메뉴 ON/OFF
  const { isOpen, onToggle } = useDisclose();
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
    trueOnMic = !trueOnMic;
    setOnMic(trueOnMic);
    myPeerConnection.getLocalStreams()[0].getAudioTracks()[0].enabled = onMic;
  };

  const toggleVideo = async () => {
    onVideo.current = !onVideo.current;
    onVideo.current
      ? setLocalStream(myStream)
      : setLocalStream({ toURL: () => null });
    myPeerConnection.getLocalStreams()[0].getVideoTracks()[0].enabled =
      onVideo.current;
  };

  const toggleSpeak = () => {
    trueOnSpeak = !trueOnSpeak;
    setOnSpeak(trueOnSpeak);
    InCallManager.setForceSpeakerphoneOn(trueOnSpeak);
  };

  useEffect(async () => {
    console.log("-----------------useEffect----------------");

    InCallManager.start({ media: "audio" });

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
    const tags = [];
    const TAGS_STORAGE_KEY = "@matchTags";

    console.log("sent random_one_to_one");

    const data = JSON.parse(await AsyncStorage.getItem(TAGS_STORAGE_KEY));
    for (const item in data) {
      tags.push(data[item].tagName);
    }

    socket.emit("random_one_to_one", JSON.stringify(tags));
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
      socket.emit("discon_onetoone", roomName);
      myPeerConnection.close();
    }

    socket = null;

    navigation.pop();
  };

  const openModal = () => {
    setShowModal((prev) => !prev);
  };

  return (
    <NativeBaseProvider flex="1">
      <Box style={styles.videoContainer}>
        <Box style={styles.remoteVideos}>
          <RTCView
            streamURL={remoteStream.toURL()}
            style={styles.remoteVideo}
            mirror={true}
            zOrder={999}
            objectFit={"cover"}
          />
        </Box>
        <Box style={styles.localVideos}>
          <RTCView
            streamURL={localStream.toURL()}
            style={styles.localVideo}
            mirror={true}
            zOrder={1}
            objectFit={"cover"}
          />
        </Box>
      </Box>
      <Box position="absolute" bottom="5" left="5">
        <Box alignItems="center">
          <Stagger
            visible={isOpen}
            initial={{
              opacity: 0,
              scale: 0,
              translateY: 34,
            }}
            animate={{
              translateY: 0,
              scale: 1,
              opacity: 1,
              transition: {
                type: "spring",
                mass: 0.8,
                stagger: {
                  offset: 30,
                  reverse: true,
                },
              },
            }}
            exit={{
              translateY: 34,
              scale: 0.5,
              opacity: 0,
              transition: {
                duration: 100,
                stagger: {
                  offset: 30,
                  reverse: true,
                },
              },
            }}
          >
            <IconButton
              mb="4"
              variant="solid"
              bg="red.500"
              colorScheme="red"
              borderRadius="full"
              onPress={handleDisconnectBtn}
              icon={
                <Icon
                  as={MaterialCommunityIcons}
                  size="6"
                  name="phone-off"
                  color="white"
                />
              }
            />
            <IconButton
              mb="4"
              variant="solid"
              bg={onMic ? "green.500" : "gray.600"}
              opacity={onMic ? 100 : 70}
              colorScheme="green"
              borderRadius="full"
              onPress={toggleMic}
              icon={
                <Icon
                  as={MaterialCommunityIcons}
                  size="6"
                  name={onMic ? "microphone" : "microphone-off"}
                  color="white"
                />
              }
            />
            <IconButton
              mb="4"
              variant="solid"
              bg={onSpeak ? "lime.500" : "gray.600"}
              opacity={onSpeak ? 100 : 70}
              onPress={toggleSpeak}
              colorScheme="lime"
              borderRadius="full"
              icon={
                <Icon as={Ionicons} size="6" name="megaphone" color="white" />
              }
            />
            <IconButton
              mb="4"
              variant="solid"
              bg={onVideo.current ? "teal.500" : "gray.600"}
              opacity={onVideo.current ? 100 : 70}
              colorScheme="teal"
              borderRadius="full"
              onPress={toggleVideo}
              icon={
                <Icon
                  as={MaterialCommunityIcons}
                  size="6"
                  name={onVideo.current ? "video" : "video-off"}
                  color="white"
                />
              }
            />
            <IconButton
              mb="4"
              variant="solid"
              bg="red.500"
              colorScheme="red"
              onPress={openModal}
              borderRadius="full"
              icon={
                <Icon as={MaterialIcons} size="6" name="report" color="white" />
              }
            />
          </Stagger>
        </Box>
        <IconButton
          variant="solid"
          borderRadius="full"
          size="lg"
          onPress={onToggle}
          bg="cyan.400"
          icon={
            <Icon
              as={MaterialCommunityIcons}
              size="6"
              name="dots-horizontal"
              color="warmGray.50"
              _dark={{
                color: "warmGray.50",
              }}
            />
          }
        />
      </Box>
      <ReportModal showModal={showModal} setShowModal={setShowModal} />
    </NativeBaseProvider>
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
  },
  remoteVideo: {
    // flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "#000000",
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
