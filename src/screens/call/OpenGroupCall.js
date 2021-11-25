import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FlashMessage, { showMessage } from "react-native-flash-message";
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
	HStack,
	Stagger,
	IconButton,
	Icon,
	useDisclose,
	Badge,
} from "native-base";

// 서버 : "http://kitcapstone.codns.com"
// PC  : "http://localhost"
// 로컬 : "http://192.168.0.9"
// 승형PC : "aitta.iptime.org"

const SERVER_DOMAIN = "aitta.iptime.org";
const SERVER_PORT = "3000";

let socket;
let roomId;
let myRoleNum;

export default function OpenGroupCall({ navigation, route }) {
	const [isLoading, setIsLoading] = useState(true);
	const iconSize = 60;
	const [onMic, setOnMic] = useState(false);
	const [onVideo, setOnVideo] = useState(true);

	// 현재 방 인원수를 나타내는 state // 통화방에 입장/퇴장할 때 변경하면 될 것 같음
	const [numOfUser, setNumOfUser] = useState(1);

	// "..." 단추 클릭시 메뉴 ON/OFF
	const { isOpen, onToggle } = useDisclose();

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
	}

	const toggleMic = () => {
		setOnMic(!onMic);
	};

	const toggleVideo = () => {
		setOnVideo(!onVideo);
	};

	const handleDisconnectBtn = () => {
		// 피어간 연결 종료 후 이전 화면으로
		finalize();
	};

	useEffect(() => {
		console.log("-------OpenGroupCall useEffect-------");
		roomId = route.params.roomId;
		socket = route.params.socket;
		setNumOfUser(route.params.numOfUser + 1);
		// 화면에 사용자 입장/퇴장 메시지 출력
		popUpMessage("HELLOHELLO");
		socket.onAny(popUpMessage);

		socket.on("ogc_user_joins", (userSocketId, numOfUser) => {
			setNumOfUser(numOfUser + 1);
		});
		socket.on("ogc_user_leaves", (userSocketId, numOfUser) => {
			setNumOfUser(numOfUser - 1);
		});

		return () => {};
	}, []);

	const finalize = () => {
		//퇴장 처리
		console.log("emit ogc_exit_room");
		socket.emit("ogc_exit_room", roomId);

		console.log("exit");
		console.log("emit ogc_observe_roomlist");
		socket.emit("ogc_observe_roomlist");

		// 이벤트 제거
		socket.removeAllListeners("ogc_user_joins");
		socket.removeAllListeners("ogc_user_leaves");
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
						<RTCView streamURL={null} style={styles.rtcVideo} />
					</Box>
					<Box flex="1" rounded="lg" borderColor="gray.200" borderWidth="1">
						<RTCView streamURL={null} style={styles.rtcVideo} />
					</Box>
				</HStack>
				<HStack flex="1">
					<Box flex="1" rounded="lg" borderColor="gray.200" borderWidth="1">
						<RTCView streamURL={null} style={styles.rtcVideo} />
					</Box>
					<Box flex="1" rounded="lg" borderColor="gray.200" borderWidth="1">
						<RTCView streamURL={null} style={styles.rtcVideo} />
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
