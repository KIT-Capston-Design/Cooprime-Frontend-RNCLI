import React, { useEffect, useState } from "react";
import { Fab, NativeBaseProvider, Box, Icon, Badge, HStack } from "native-base";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	FlatList,
	Alert,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";
import InputModal from "../../components/InputModal";

import { mediaDevices } from "react-native-webrtc";
////
import { io } from "socket.io-client";
import { Value } from "react-native-reanimated";
import { ControlledPropUpdatedSelectedItem } from "native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types";
////
import { SERVER_DOMAIN, SERVER_PORT } from "../../../env";

let socket;
let myStream;

export const OpenGroupCallList = (prop) => {
	const [data, setData] = useState([]);

	useEffect(() => {
		//Initialize Socket
		(async () => {
			socket = await io(SERVER_DOMAIN + ":" + SERVER_PORT, {
				cors: { origin: "*" },
			});

			//socket code
			socket.onAny((event) => {
				console.log("receive", event);
			});

			console.log("socket initialized");

			// 방 목록 구독 요청
			socket.emit("ogc_observe_roomlist");
			console.log("emit ogc_observe_roomlist");

			// 소켓 이벤트 등록
			socket.on("ogc_roomlist", (roomInfList) => {
				roomInfList = roomInfList;
				console.log("set room list");
				setData(roomInfList);
			});

			// return () => {
			// 	// unmount (화면 이탈 시)
			// 	// 방 목록 구독 탈퇴 요청
			// 	socket.emit("ogc_unobserve_roomlist");
			// 	console.log("emit ogc_unobserve_roomlist");
			// };
		})();

		//
	}, []);

	const roomItemTouchHandler = async (item) => {
		// 채팅방 입장
		// await (async () => {
		// 	const stream = await mediaDevices.getUserMedia({
		// 		audio: true,
		// 		video: {
		// 			width: { min: 1024, ideal: 1280, max: 1920 },
		// 			height: { min: 776, ideal: 720, max: 1080 },
		// 			minFrameRate: 15,
		// 			facingMode: "user",
		// 		},
		// 	});
		// 	socket.myStream = stream;
		// })();
		socket.emit("ogc_enter_room", item.roomId, isSucc);
	};

	const isSucc = (roomId, cnt) => {
		if (roomId) {
			console.log("roomId", roomId);
			prop.enterOGCRoom(roomId, cnt);
		} else {
		}
	};

	const renderItem = ({ item }) => {
		return (
			<TouchableOpacity
				style={styles.card}
				onPress={() => {
					roomItemTouchHandler(item);
				}}
			>
				<View style={styles.cardContent}>
					<Text style={styles.title}>{item.roomName}</Text>
					<Text style={styles.count}>{item.cnt} / 4</Text>
					<HStack
						style={{ marginTop: 5 }}
						space={{
							base: 2,
							md: 4,
						}}
						mx={{
							base: "auto",
							md: 0,
						}}
					>
						{item.tags.map((tag, idx) => (
							<Badge key={idx}>{tag}</Badge>
						))}
					</HStack>
				</View>
			</TouchableOpacity>
		);
	};

	const onEndReached = () => {};

	return (
		<LinearGradient
			colors={["#a78bfa", "#ddd6fe", "#f5f3ff"]}
			style={styles.container}
		>
			<FlatList
				style={styles.contentList}
				data={data}
				renderItem={renderItem}
				keyExtractor={(item) => String(item.roomId)}
				onEndReachedThreshold={0.8}
				onEndReached={onEndReached}
			/>
		</LinearGradient>
	);
};

export default function OpenGroupCall({ navigation }) {
	//공개통화방 display 변수
	const [showModal, setShowModal] = useState(false);

	//공개통화방 생성 로직 (방정보 입력 시 호출됨)
	const createOGCRoom = (roomInfo) => {
		console.log("emit ogc_room_create");
		socket.emit("ogc_room_create", JSON.stringify(roomInfo), (roomId) => {
			console.log("방 생성 후 입장 완료");
			enterOGCRoom(roomId, 0);
		});
	};

	const enterOGCRoom = async (roomId, numOfUser) => {
		socket.emit("ogc_unobserve_roomlist");

		await (async () => {
			const stream = await mediaDevices.getUserMedia({
				audio: true,
				video: {
					width: { min: 1024, ideal: 1280, max: 1920 },
					height: { min: 776, ideal: 720, max: 1080 },
					minFrameRate: 15,
					facingMode: "user",
				},
			});
			socket.myStream = stream;
		})();

		navigation.navigate("OpenGroupCall", {
			socket: socket,
			roomId: roomId,
			numOfUser: numOfUser,
		});
	};

	return (
		<NativeBaseProvider>
			<OpenGroupCallList enterOGCRoom={enterOGCRoom} />
			<Box position="relative" h={0} w="100%">
				<Fab
					// colorScheme="violet" 이후에 색상 변경할게요
					colorScheme="indigo"
					onPress={() => {
						setShowModal((prev) => !prev);
					}}
					position="absolute"
					size="sm"
					icon={
						<Icon
							color="white"
							as={<MaterialCommunityIcons name="plus" />}
							size="sm"
						/>
					}
				/>
			</Box>
			<InputModal
				hd="통화방 생성"
				btn="생성"
				showModal={showModal}
				setShowModal={setShowModal}
				sendRoomInfo={createOGCRoom}
			/>
		</NativeBaseProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	contentList: {
		flex: 1,
	},
	cardContent: {
		marginLeft: 15,
		marginVertical: 5,
	},
	card: {
		shadowColor: "#00000021",
		shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowOpacity: 0.37,
		shadowRadius: 7.49,
		elevation: 12,

		marginLeft: 20,
		marginRight: 20,
		marginTop: 20,
		backgroundColor: "white",
		padding: 10,
		flexDirection: "row",
		borderRadius: 30,
	},
	title: {
		fontSize: 18,
		flex: 1,
		alignSelf: "center",
		color: "#3399ff",
		fontWeight: "bold",
	},
	count: {
		fontSize: 14,
		flex: 1,
		color: "#6666ff",
	},
});
