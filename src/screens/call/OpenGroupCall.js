import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FlashMessage, { showMessage } from "react-native-flash-message";
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
	HStack,
	Stagger,
	IconButton,
	Icon,
	useDisclose,
	Badge,
} from "native-base";

import InCallManager from "react-native-incall-manager";

import { LogBox } from "react-native";
LogBox.ignoreLogs(["new NativeEventEmitter"]);
LogBox.ignoreLogs(["Non-serializable values"]);

let socket;
let roomId;
let llocalStream;

let rStreamsStatus = { rStreamA: false, rStreamB: false, rStreamC: false };
let trueOnMic = true; // State의 상식 밖 동작으로 인한 전역변수

export default function OpenGroupCall({ navigation, route }) {
	const [localStream, setLocalStream] = useState({ toURL: () => null });
	const [rStreamA, setrStreamA] = useState({ toURL: () => null });
	const [rStreamB, setrStreamB] = useState({ toURL: () => null });
	const [rStreamC, setrStreamC] = useState({ toURL: () => null });

	const myPeerConnections = [];

	const [onMic, setOnMic] = useState(true);
	const onVideo = useRef(true);

	// 현재 방 인원수를 나타내는 state // 통화방에 입장/퇴장할 때 변경하면 될 것 같음
	const [numOfUser, setNumOfUser] = useState(1);

	// "..." 단추 클릭시 메뉴 ON/OFF
	const { isOpen, onToggle } = useDisclose();

	const toggleMic = () => {
		trueOnMic = !trueOnMic;
		setOnMic(!trueOnMic);

		llocalStream.getAudioTracks().forEach((track) => {
			track.enabled = trueOnMic;
		});
	};

	const toggleVideo = () => {
		onVideo.current = !onVideo.current;

		onVideo.current
			? setLocalStream(llocalStream)
			: setLocalStream({ toURL: () => null });

		llocalStream.getVideoTracks().forEach((track) => {
			track.enabled = onVideo.current;
		});

		// myPeerConnections.forEach((conn) => {
		// 	conn.getLocalStreams()[0].getVideoTracks()[0].enabled = onVideo.current;
		// });
	};

	const handleDisconnectBtn = () => {
		// 피어간 연결 종료 후 이전 화면으로
		finalize();
	};
	const getMedia = async () => {
		console.log("getMedia() Start");

		const stream = await mediaDevices.getUserMedia({
			audio: true,
			video: {
				width: { min: 1024, ideal: 1280, max: 1920 },
				height: { min: 776, ideal: 720, max: 1080 },
				minFrameRate: 15,
				facingMode: "user",
			},
		});
		setLocalStream(stream);
		llocalStream = stream;
		console.log("setted LocalStream", stream);
		console.log("getMedia() End");
	};

	useEffect(() => {
		console.log("-------OpenGroupCall useEffect-------");

		InCallManager.start({ media: "audio" });
		InCallManager.setForceSpeakerphoneOn(true);

		getMedia();

		roomId = route.params.roomId;
		socket = route.params.socket;
		setNumOfUser(route.params.numOfUser + 1);
		// 화면에 사용자 입장/퇴장 메시지 출력
		popUpMessage("HELLO :)");

		socket.onAny(popUpMessage);

		const createNewPeerConnection = async (userSocketId) => {
			const curMyPC = new RTCPeerConnection({
				iceServers: [
					{
						urls: "stun:20.78.169.27:3478",
					},
					// {
					// 	urls: "stun:stun.l.google.com:19302",
					// },
				],
			});

			myPeerConnections.push(curMyPC);

			curMyPC.userSocketId = userSocketId;

			if (!rStreamsStatus.rStreamA) {
				rStreamsStatus.rStreamA = true;
				curMyPC.usedStream = "A";
				curMyPC.setRemoteStream = setrStreamA;
			} else if (!rStreamsStatus.rStreamB) {
				rStreamsStatus.rStreamB = true;
				curMyPC.usedStream = "B";
				curMyPC.setRemoteStream = setrStreamB;
			} else {
				rStreamsStatus.rStreamC = true;
				curMyPC.usedStream = "C";
				curMyPC.setRemoteStream = setrStreamC;
			}

			console.log("localStream added", llocalStream.toURL());
			curMyPC.addStream(llocalStream);

			curMyPC.onicecandidate = (data) => {
				console.log("fire candidate");
				socket.emit("ogc_ice", data.candidate, curMyPC.userSocketId);
			};

			curMyPC.onaddstream = async (data) => {
				console.log("On Add Stream");
				await curMyPC.setRemoteStream(data.stream);

				data.stream.getVideoTracks()[0].onunmute = () => {
					curMyPC.setRemoteStream(data.stream);
				};
				data.stream.getVideoTracks()[0].onmute = () => {
					curMyPC.setRemoteStream({ toURL: () => null });
				};
			};

			return curMyPC;
		};
		socket.on("ogc_user_joins", async (userSocketId, numOfUser) => {
			setNumOfUser(numOfUser + 1);

			// 들어오는 유저에 대한 RTCPeerConnection push & setting

			const curMyPC = await createNewPeerConnection(userSocketId);

			// offer
			console.log("create offer");
			const offer = await curMyPC.createOffer();

			await curMyPC.setLocalDescription(offer);

			console.log("sent the ogc_offer");

			socket.emit("ogc_offer", offer, userSocketId);
		});

		socket.on("ogc_offer", async (offer, userSocketId) => {
			// 받은 offer를 통해 Connection, RTCPeerConnection 생성

			const curMyPC = await createNewPeerConnection(userSocketId);

			await curMyPC.setRemoteDescription(new RTCSessionDescription(offer));
			console.log("create answer");
			const answer = await curMyPC.createAnswer();
			curMyPC.setLocalDescription(answer);
			socket.emit("ogc_answer", answer, userSocketId);
			console.log("sent the ogc_answer");
		});

		socket.on("ogc_answer", async (answer, userSocketId) => {
			myPeerConnections.forEach(async (conn) => {
				if (conn.userSocketId === userSocketId) {
					await conn.setRemoteDescription(new RTCSessionDescription(answer));
					console.log("set the answer");
					return false;
				}
			});
		});

		socket.on("ogc_ice", (ice, userSocketId) => {
			myPeerConnections.forEach((conn) => {
				if (conn.userSocketId === userSocketId) {
					conn.addIceCandidate(ice);
					console.log("added ice");
					return false;
				}
			});
		});

		socket.on("ogc_user_leaves", (userSocketId, numOfUser) => {
			setNumOfUser(numOfUser - 1);

			myPeerConnections.forEach((conn, index) => {
				if (conn.userSocketId === userSocketId) {
					conn.setRemoteStream({ toURL: () => null });

					if (conn.usedStream === "A") {
						rStreamsStatus.rStreamA = false;
					} else if (conn.usedStream === "B") {
						rStreamsStatus.rStreamB = false;
					} else {
						rStreamsStatus.rStreamC = false;
					}

					conn.close();
					myPeerConnections.splice(index, 1);
				}
			});
		});

		return () => {
			InCallManager.stop();
		};
	}, []);

	const finalize = () => {
		//퇴장 처리
		console.log("emit ogc_exit_room");
		socket.emit("ogc_exit_room", roomId);

		console.log("exit");
		console.log("emit ogc_observe_roomlist");
		socket.emit("ogc_observe_roomlist");

		llocalStream.getTracks().forEach((track) => {
			track.stop();
		});

		myPeerConnections.forEach((conn) => {
			conn.close();
		});

		// 이벤트 제거
		socket.removeAllListeners("ogc_user_joins");
		socket.removeAllListeners("ogc_user_leaves");
		socket.removeAllListeners("ogc_offer");
		socket.removeAllListeners("ogc_answer");
		socket.removeAllListeners("ogc_ice");
		socket.offAny();

		navigation.pop();
	};

	const popUpMessage = (message) => {
		console.log("popUpMessage()", message);
		/*화면에 메시지 출력*/
		showMessage({
			message: message,
			backgroundColor: "#c4b5fd",
			color: "#ffffff",
		});
	};

	return (
		<NativeBaseProvider flex="1">
			<Badge position="absolute" variant="subtle" alignSelf="center" zIndex="1">
				<Text>{numOfUser} / 4</Text>
			</Badge>
			<Box flex="1">
				<HStack flex="1">
					<Box flex="1" rounded="lg" borderColor="gray.200" borderWidth="1">
						<RTCView streamURL={rStreamA.toURL()} style={styles.rtcVideo} />
					</Box>
					<Box flex="1" rounded="lg" borderColor="gray.200" borderWidth="1">
						<RTCView streamURL={rStreamB.toURL()} style={styles.rtcVideo} />
					</Box>
				</HStack>
				<HStack flex="1">
					<Box flex="1" rounded="lg" borderColor="gray.200" borderWidth="1">
						<RTCView streamURL={rStreamC.toURL()} style={styles.rtcVideo} />
					</Box>
					<Box flex="1" rounded="lg" borderColor="gray.200" borderWidth="1">
						<RTCView streamURL={localStream.toURL()} style={styles.rtcVideo} />
					</Box>
				</HStack>
			</Box>
			<Box position="absolute" bottom="5" right="5">
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
									_dark={{
										color: "warmGray.50",
									}}
									color="warmGray.50"
								/>
							}
						/>
						<IconButton
							mb="4"
							variant="solid"
							bg="yellow.400"
							colorScheme="yellow"
							borderRadius="full"
							onPress={toggleMic}
							icon={
								<Icon
									as={MaterialCommunityIcons}
									_dark={{
										color: "warmGray.50",
									}}
									size="6"
									name="microphone"
									color="warmGray.50"
								/>
							}
						/>
						<IconButton
							mb="4"
							variant="solid"
							bg="teal.400"
							colorScheme="teal"
							borderRadius="full"
							onPress={toggleVideo}
							icon={
								<Icon
									as={MaterialCommunityIcons}
									_dark={{
										color: "warmGray.50",
									}}
									size="6"
									name="video"
									color="warmGray.50"
								/>
							}
						/>
						<IconButton
							mb="4"
							variant="solid"
							bg="red.500"
							colorScheme="red"
							borderRadius="full"
							icon={
								<Icon
									as={MaterialIcons}
									size="6"
									name="report"
									_dark={{
										color: "warmGray.50",
									}}
									color="warmGray.50"
								/>
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
			<FlashMessage />
		</NativeBaseProvider>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#f5f3ff" },
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
