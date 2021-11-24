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

// 서버 : "http://kitcapstone.codns.com"
// PC  : "http://localhost"
// 로컬 : "http://192.168.0.9"
// 승형PC : "aitta.iptime.org"

const SERVER_DOMAIN = "KITCapstone.iptime.org";
const SERVER_PORT = "3000";

let socket;
let realRoomName;
let myRoleNum;

export default function GroupCall({ navigation }) {
  const iconSize = 60;
  const [onMic, setOnMic] = useState(false);
  const [onVideo, setOnVideo] = useState(true);

  const [lStream, setlStream] = useState({ toURL: () => null });
  const [rStreamA, setrStreamA] = useState({ toURL: () => null });
  const [rStreamB, setrStreamB] = useState({ toURL: () => null });
  const [rStreamC, setrStreamC] = useState({ toURL: () => null });

  const setStreams = [setrStreamA, setrStreamB, setrStreamC];

  const myPeerConnections = [];

  for (let i = 0; i < 3; i++) {
    myPeerConnections.push(
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
    myPeerConnections[i].setRemoteStream = setStreams[i];
  }

  const toggleMic = () => {
    setOnMic(!onMic);
  };

  const toggleVideo = () => {
    setOnVideo(!onVideo);
  };

  // const handleDisconnectBtn = () => {
  // 	/* 피어간 연결 종료 로직 */
  // 	console.log("socket disconnect");

  // 	/*	로직 필요	*/
  // 	// 메인 화면으로 이동
  // 	navigation.navigate("Calling");
  // 	console.log("handleDisconnectBtn");
  // };

  const handleDisconnectBtn = () => {
    /* 피어간 연결 종료 로직 */
    console.log("socket disconnect");
    // console.log(socket);
    myPeerConnections.forEach((mPC) => {
      mPC.close();
      mPC.setRemoteStream(null);
    });

    setlStream({ toURL: () => null });

    if (socket !== undefined && socket !== null && socket.connected) {
      socket.emit("discon", realRoomName);
      //socket.disconnect();
    } else {
      console.log("socket is undifined");
    }
    socket = null;

    navigation.navigate("Calling");
  };
  useEffect(async () => {
    console.log("-----------------useEffect----------------");

    await initSocket();
    await initCall();

    console.log("End initCall method");
    console.log("matching start");

    // RTC Code
    myPeerConnections.forEach((myPeerConnection) => {
      myPeerConnection.onicecandidate = (data) => {
        console.log("sent candidate");
        socket.emit(
          "ice",
          data.candidate,
          realRoomName,
          myPeerConnection.rPeerRoleNum
        );
      };

      myPeerConnection.onaddstream = async (data) => {
        console.log("On Add Stream");
        await myPeerConnection.setRemoteStream(data.stream);
      };
    });
  }, []);

  const initCall = async () => {
    console.log("initCall");

    socket.emit("random_group");
    console.log("sent random_group");

    await getMedia();
    //await getCamera();
  };

  const getMedia = async () => {
    console.log("getMedia start");
    const myStream = await mediaDevices.getUserMedia({
      audio: true,
      video: {
        mandatory: {
          minWidth: 500, // Provide your own width, height and frame rate here
          minHeight: 300,
          minFrameRate: 30,
        },
        facingMode: "user",
        // optional: videoSourceId ? expo start --localhost --android[{ sourceId: videoSourceId }] : [],
      },
    });
    console.log("get mystream");

    // Got stream!room
    setlStream(myStream);

    // setup stream listening
    myPeerConnections.forEach((myPeerConnection) => {
      myPeerConnection.addStream(myStream);
    });
  };

  // 역할 : roleNum
  // A : 0, B : 1, C : 2, D : 3

  const sendOffer = async (myPCIdx, roleNum) => {
    const offer = await myPeerConnections[myPCIdx].createOffer();
    await myPeerConnections[myPCIdx].setLocalDescription(offer);
    console.log("sent the offer");
    socket.emit("offer", offer, realRoomName, roleNum);
  };

  const roleA = () => {
    console.log("나는 역할 A이무니다.");
    myRoleNum = 0;

    myPeerConnections[0].rPeerRoleNum = 1;
    myPeerConnections[1].rPeerRoleNum = 2;
    myPeerConnections[2].rPeerRoleNum = 3;

    // A의 rStream  : myPeerConnection idx : roleNum  : 역할
    //        A     :        0         :     1    :  B
    //        B     :        1         :     2    :  C
    //        C     :        2         :     3    :  D

    // A는 세 번 방장 역할

    sendOffer(0, 1);
    sendOffer(1, 2);
    sendOffer(2, 3);
  };
  const roleB = () => {
    myRoleNum = 1;
    console.log("나는 역할 B이무니다.");

    myPeerConnections[0].rPeerRoleNum = 0;
    myPeerConnections[1].rPeerRoleNum = 2;
    myPeerConnections[2].rPeerRoleNum = 3;

    // B의 rStream  : myPeerConnection idx : roleNum  : 역할
    //        A     :        0         :     0    :  A
    //        B     :        1         :     2    :  C
    //        C     :        2         :     3    :  D

    sendOffer(1, 2);
    sendOffer(2, 3);
  };
  const roleC = () => {
    myRoleNum = 2;
    console.log("나는 역할 C이무니다.");

    myPeerConnections[0].rPeerRoleNum = 0;
    myPeerConnections[1].rPeerRoleNum = 1;
    myPeerConnections[2].rPeerRoleNum = 3;

    // C의 rStream  : myPeerConnection idx : roleNum  : 역할
    //        A     :        0         :     0    :  A
    //        B     :        1         :     1    :  B
    //        C     :        2         :     3    :  D

    sendOffer(2, 3);
  };

  const roleD = () => {
    myRoleNum = 3;
    myPeerConnections[0].rPeerRoleNum = 0;
    myPeerConnections[1].rPeerRoleNum = 1;
    myPeerConnections[2].rPeerRoleNum = 2;
    console.log("나는 역할 D이무니다.");
    // D는 offer를 날리지 않는다.
  };

  const initSocket = async () => {
    console.log("initSocket");

    // 서버 연결
    socket = await io(SERVER_DOMAIN + ":" + SERVER_PORT, {
      cors: { origin: "*" },
    });

    // Socket Code
    socket.on("random_group_matched", async (roomName, roleNum) => {
      realRoomName = roomName;

      if (roleNum === 0) {
        roleA();
      } else if (roleNum === 1) {
        roleB();
      } else if (roleNum === 2) {
        roleC();
      } else if (roleNum === 3) {
        roleD();
      }
    });

    const receiveOffer = async (offer, myPCIdx, roleNum) => {
      console.log("received the offer");

      if (myPeerConnections[myPCIdx] !== undefined) {
        if (myPeerConnections[myPCIdx].setRemoteDescription !== undefined) {
          if (new RTCSessionDescription(offer) !== undefined) {
            await myPeerConnections[myPCIdx].setRemoteDescription(
              new RTCSessionDescription(offer)
            );
          } else {
            console.log("offer is not RTCSessionDescription");
          }
        } else {
          console.log("setRemoteDescription() is undefined");
        }
      } else {
        console.log("myPeerConnection is undefined (idx :", myPCIdx, ")");
      }

      const answer = await myPeerConnections[myPCIdx].createAnswer();
      myPeerConnections[myPCIdx].setLocalDescription(answer);

      socket.emit("answer", answer, realRoomName, roleNum);
      console.log("sent the answer");
    };

    socket.on("offer", async (offer, roleNum) => {
      if (myRoleNum === 1) {
        receiveOffer(offer, 0, roleNum);
      } else if (myRoleNum === 2) {
        if (roleNum === 0) {
          receiveOffer(offer, 0, roleNum);
        } else if (roleNum === 1) {
          receiveOffer(offer, 1, roleNum);
        } else {
          console.log("ERROR :");
        }
      } else if (myRoleNum === 3) {
        if (roleNum === 0) {
          receiveOffer(offer, 0, roleNum);
        } else if (roleNum === 1) {
          receiveOffer(offer, 1, roleNum);
        } else if (roleNum === 2) {
          receiveOffer(offer, 2, roleNum);
        } else {
          console.log("ERROR :");
        }
      } else {
        console.log("ERROR :");
      }
    });

    const receiveAnswer = async (answer, myPCIdx) => {
      console.log("received the answer");
      console.log(myRoleNum, ", ", myPCIdx);
      ///

      if (myPeerConnections[myPCIdx] !== undefined) {
        if (myPeerConnections[myPCIdx].setRemoteDescription !== undefined) {
          if (new RTCSessionDescription(answer) !== undefined) {
            await myPeerConnections[myPCIdx].setRemoteDescription(
              new RTCSessionDescription(answer)
            );
          } else {
            console.log("offer is not RTCSessionDescription");
          }
        } else {
          console.log("setRemoteDescription() is undefined");
        }
      } else {
        console.log("myPeerConnection is undefined (idx :", myPCIdx, ")");
      }

      ///
    };

    socket.on("answer", async (answer, roleNum) => {
      if (myRoleNum === 2) {
        receiveAnswer(answer, 2);
      } else if (myRoleNum === 1) {
        if (roleNum === 2) {
          receiveAnswer(answer, 1);
        } else if (roleNum === 3) {
          receiveAnswer(answer, 2);
        } else {
          console.log("ERROR :");
        }
      } else if (myRoleNum === 0) {
        if (roleNum === 1) {
          receiveAnswer(answer, 0);
        } else if (roleNum === 2) {
          receiveAnswer(answer, 1);
        } else if (roleNum === 3) {
          receiveAnswer(answer, 2);
        } else {
          console.log("ERROR :");
        }
      } else {
        console.log("ERROR :");
      }
    });

    socket.on("ice", (ice, roleNum) => {
      console.log("received candidate");

      if (myRoleNum === 0) {
        // A
        if (roleNum === 1) {
          myPeerConnections[0].addIceCandidate(ice); // B
        } else if (roleNum === 2) {
          myPeerConnections[1].addIceCandidate(ice); // C
        } else if (roleNum === 3) {
          myPeerConnections[2].addIceCandidate(ice); // D
        } else {
          console.log("ERROR :", myRoleNum, roleNum);
        }
      } else if (myRoleNum === 1) {
        // B
        if (roleNum === 0) {
          myPeerConnections[0].addIceCandidate(ice); // A
        } else if (roleNum === 2) {
          myPeerConnections[1].addIceCandidate(ice); // C
        } else if (roleNum === 3) {
          myPeerConnections[2].addIceCandidate(ice); // D
        } else {
          console.log("ERROR :", myRoleNum, roleNum);
        }
      } else if (myRoleNum === 2) {
        // C
        if (roleNum === 0) {
          myPeerConnections[0].addIceCandidate(ice); // A
        } else if (roleNum === 1) {
          myPeerConnections[1].addIceCandidate(ice); // B
        } else if (roleNum === 3) {
          myPeerConnections[2].addIceCandidate(ice); // D
        } else {
          console.log("ERROR :", myRoleNum, roleNum);
        }
      } else if (myRoleNum === 3) {
        //D
        if (roleNum === 0) {
          myPeerConnections[0].addIceCandidate(ice); // A
        } else if (roleNum === 1) {
          myPeerConnections[1].addIceCandidate(ice); // B
        } else if (roleNum === 2) {
          myPeerConnections[2].addIceCandidate(ice); // C
        } else {
          console.log("ERROR :", myRoleNum, roleNum);
        }
      } else {
        console.log("ERROR :", myRoleNum);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <View style={styles.video}>
          <RTCView streamURL={rStreamA.toURL()} style={styles.rtcVideo} />
        </View>
        <View style={styles.video}>
          <RTCView streamURL={rStreamB.toURL()} style={styles.rtcVideo} />
        </View>
      </View>
      <View style={styles.videoContainer}>
        <View style={styles.video}>
          <RTCView streamURL={rStreamC.toURL()} style={styles.rtcVideo} />
        </View>
        <View style={styles.video}>
          <RTCView streamURL={lStream.toURL()} style={styles.rtcVideo} />
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