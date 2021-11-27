import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	Badge,
	HStack,
	useDisclose,
	Button,
	Icon,
	NativeBaseProvider,
	Box,
	Center,
	Text,
} from "native-base";
import TagSetting from "../../components/TagSetting";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const TAGS_STORAGE_KEY = "@matchTags";
export default function Calling({ navigation }) {
	const [matchTags, setMatchTags] = useState({
		a: { tagName: "낚시" },
		b: { tagName: "게임" },
		3: { tagName: "축구" },
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
		// loadMatchTags();
		// setMatchTags({ ...matchTags, d: { tagName: "코딩" } });
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
		<NativeBaseProvider>
			<View style={styles.container}>
				<TouchableOpacity style={styles.oneToOne} onPress={startOneToOneCall}>
					<Text style={styles.innerText}>One To One</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.groupCall} onPress={startGroupCall}>
					<Text style={styles.innerText}>Group Call</Text>
				</TouchableOpacity>
				{/*
				여기에 사용자의 저장된 태그 보여주는 화면
				*/}
			</View>
			<Box flex={0.3} h="auto" justifyContent="center" margin="5">
				<HStack
					space={{
						base: 2,
						md: 4,
					}}
					mx={{
						base: "auto",
						md: 0,
					}}
					flexWrap="wrap"
				>
					{Object.keys(matchTags).map((key) => (
						<Badge>
							<Text fontSize="md">{matchTags[key].tagName}</Text>
						</Badge>
					))}
				</HStack>
				<Button
					marginTop="3"
					alignSelf="center"
					size="md"
					onPress={onOpen}
					variant="subtle"
					colorScheme="indigo"
					endIcon={<Icon as={MaterialIcons} name="edit" size="xs" />}
				>
					태그 변경
				</Button>
				<TagSetting
					isOpen={isOpen}
					onClose={onClose}
					matchTags={matchTags}
					setMatchTags={setMatchTags}
					saveMatchTags={saveMatchTags}
				/>
			</Box>
		</NativeBaseProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#eeeeee",
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
