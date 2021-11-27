import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, AsyncStorage } from "react-native";
import {
	Badge,
	HStack,
	useDisclose,
	Button,
	Icon,
	NativeBaseProvider,
	Box,
	VStack,
	IconButton,
} from "native-base";
import TagSetting from "../../components/TagSetting";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as Animatable from "react-native-animatable";
import LinearGradient from "react-native-linear-gradient";

const TAGS_STORAGE_KEY = "@matchTags";

const config = {
	dependencies: {
		"linear-gradient": require("react-native-linear-gradient").default,
	},
};

export default function Calling({ navigation }) {
	const [matchTags, setMatchTags] = useState({
		a123: { tagName: "낚시" },
		b456: { tagName: "게임" },
		c789: { tagName: "축구" },
	});
	// 태그 수정 화면 ON/OFF 변수 및 함수
	const { isOpen, onOpen, onClose } = useDisclose();

	const startOneToOneCall = () => {
		// 일대일 통화 시작
		navigation.navigate("OneToOne"); // 일대일 통화 페이지로 이동
	};

	const startGroupCall = () => {
		// 그룹 통화 시작
		navigation.navigate("Group"); // 그룹 통화 페이지로 이동
	};

	useEffect(() => {
		// console.log(matchTags);
		// Object.keys(matchTags).map((key) => {
		// 	console.log(matchTags[key]);
		// 	console.log(matchTags[key].tagName);
		// });
		// loadMatchTags();
		// const text = "awef";
		// setMatchTags({ ...matchTags, [Date.now()]: { text } });
	}, []);

	const loadMatchTags = async () => {
		try {
			const loadData = await AsyncStorage.getItem(TAGS_STORAGE_KEY);
			if (loadData) {
				setMatchTags(JSON.parse(loadData));
			}
		} catch (e) {
			console.log(e);
		}
	};

	const saveMatchTags = async (toSave) => {
		try {
			await AsyncStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(toSave));
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<NativeBaseProvider config={config}>
			<LinearGradient
				flex={1}
				colors={["#c084fc", "#9333ea", "#312e81"]}
				start={{ x: 0.5, y: 0 }}
				alignItems="center"
				justifyContent="center"
			>
				<Box
					width="90%"
					bg={{
						linearGradient: {
							colors: ["#f7abfc", "#a855f7", "#4338ca"],
							start: [0.5, 0],
							// end: [0, 0],
						},
					}}
					p="12"
					rounded="3xl"
					_text={{ fontSize: "md", fontWeight: "bold", color: "white" }}
					alignItems="center"
					justifyContent="center"
				>
					<Animatable.View animation="bounceInLeft">
						<Button
							height="100"
							w="80"
							bg="amber.300"
							borderRadius="lg"
							shadow="9"
							marginBottom="1/6"
						>
							<HStack space={10}>
								<Icon size="lg" as={Ionicons} name="md-person" />
								<Icon size="lg" as={FontAwesome5} name="arrows-alt-h" />
								<Icon size="lg" as={Ionicons} name="md-person" />
							</HStack>
						</Button>
					</Animatable.View>
					<Animatable.View animation="bounceInRight">
						<Button height="100" w="80" bg="yellow.300" borderRadius="lg" shadow="9">
							<HStack space={10}>
								<Icon size="lg" as={Ionicons} name="md-person" />
								<Icon size="lg" as={FontAwesome5} name="arrows-alt-h" />
								<Icon size="lg" as={Ionicons} name="md-people" />
							</HStack>
						</Button>
					</Animatable.View>
				</Box>
				<Box
					marginTop="10"
					width="80%"
					height="30%"
					alignItems="center"
					justifyContent="center"
				>
					<HStack
						space={{
							base: 3,
							md: 4,
						}}
						mx={{
							base: "auto",
							md: 0,
						}}
					>
						{Object.keys(matchTags).map((key) => (
							<Badge borderRadius="md" key={key} _text={{ fontSize: 15 }}>
								{matchTags[key].tagName}
							</Badge>
						))}
					</HStack>
					<Button
						marginTop="3"
						alignSelf="center"
						size="lg"
						onPress={onOpen}
						variant="subtle"
						colorScheme="violet"
						endIcon={<Icon as={MaterialIcons} name="edit" size="xs" />}
					>
						태그 변경
					</Button>
					{/* <TagSetting
						isOpen={isOpen}
						onClose={onClose}
						matchTags={matchTags}
						// setMatchTags={setMatchTags}
					/> */}
				</Box>
			</LinearGradient>
		</NativeBaseProvider>
	);
}

const styles = StyleSheet.create({
	callBtnContainer: {
		// flexDirection: "column",
		// paddingHorizontal: "4",
		alignItems: "center",
		justifyContent: "center",
	},
	container: {
		flex: 1,
		backgroundColor: "#c7d2fe",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
	},
	oneToOne: {
		width: 150,
		height: 300,
		borderRadius: 40,
		backgroundColor: "#fedcba",
		alignItems: "center",
		justifyContent: "center",
		margin: 10,
	},
	groupCall: {
		width: 150,
		height: 300,
		borderRadius: 40,
		backgroundColor: "#abcdef",
		alignItems: "center",
		justifyContent: "center",
		margin: 10,
	},
	innerText: {
		fontSize: 20,
		fontWeight: "bold",
	},
});
