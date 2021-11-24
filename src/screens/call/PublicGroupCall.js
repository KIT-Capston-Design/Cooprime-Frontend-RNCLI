import { Fab, NativeBaseProvider, Box, Icon } from "native-base";
import React, { useEffect, useState } from "react";
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

////
import { io } from "socket.io-client";
import { Value } from "react-native-reanimated";

////

const SERVER_DOMAIN = "http://192.168.0.9";
const SERVER_PORT = "3000";

let socket;

export const GroupCallList = () => {
	const [data, setData] = useState([]);
	const [offset, setOffSet] = useState(0);
	const [loading, setLoading] = useState(false);

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
			getData();

			console.log("socket initialized");

			// 방 목록 구독 요청
			socket.emit("ogc_observe_roomlist");
			console.log("emit ogc_observe_roomlist");

			// 소켓 이벤트 등록
			socket.on("ogc_roomlist", (roomInfList) => {
				roomInfList = JSON.parse(roomInfList);
				console.log("roomInfList", roomInfList);
				setData(roomInfList);
			});

			return () => {
				// unmount (화면 이탈 시)
				// 방 목록 구독 탈퇴 요청
				socket.emit("ogc_unobserve_roomlist");
				console.log("emit ogc_unobserve_roomlist");
			};
		})();

		//
	}, []);

	const getData = () => {
		setLoading(true);

		// setData([
		// 	{
		// 		id: 1,
		// 		title: "TEST",
		// 		count: 1,
		// 	},
		// ]);

		// 공개 채팅방 정보 읽어오기
		// fetch("http://jsonplaceholder.typicode.com/posts")
		//   .then((res) => res.json())
		//   .then((res) => setData(data.concat(res.slice(offset, offset + LIMIT))))
		//   .then(() => {
		//     setOffset(offset + LIMIT);
		//     setLoading(false);
		//   })
		//   .catch((e) => {
		//     setLoading(false);
		//   });
	};

	const roomItemTouchHandler = (item) => {
		//채팅방 입장
		socket.emit("ogc_enter_room", item.roomId, isSucc);
	};

	const isSucc = (val) => {
		if (val) {
			Alert.alert("채팅방 입장 성공");
			// 차후 대기화면으로 이동하여 webRTC 연결 설정하는 코드 필요
		} else {
			Alert.alert("채팅방 입장 실패");
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
				</View>
			</TouchableOpacity>
		);
	};

	const onEndReached = () => {
		if (loading) {
			return;
		} else {
			getData();
		}
	};

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

export default function PublicGroupCall() {
	// 신고 팝업창 활성화 변수
	const [showModal, setShowModal] = useState(false);

	const createGroupCall = () => {
		setShowModal((prev) => !prev);
		// Alert.alert("새로운 통화방 생성", "로직은 createGroupCall에 작성");
		// 통화방 이름 생성(= 사용자 이름, 사용자는 한 통화방만 생성할 수 있으니까)
		// 서버에 통화방 생성 요청
		// GroupCall 로직을 좀 읽어볼게요.. ㅠ
	};

	return (
		<NativeBaseProvider>
			<GroupCallList />
			<Box position="relative" h={0} w="100%">
				<Fab
					// colorScheme="violet" 이후에 색상 변경할게요
					colorScheme="indigo"
					onPress={createGroupCall}
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
				bd="이름"
				btn="생성"
				showModal={showModal}
				setShowModal={setShowModal}
			/>
		</NativeBaseProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 20,
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
