import React, { useState, useEffect } from "react";
import {
	Button,
	Actionsheet,
	useDisclose,
	Text,
	Box,
	Center,
	NativeBaseProvider,
	HStack,
	Badge,
	Icon,
	IconButton,
	Input,
} from "native-base";
import { Alert } from "react-native";
import Fontisto from "react-native-vector-icons/Fontisto";

export default TagSetting = ({ isOpen, onClose, matchTags, setMatchTags, saveMatchTags }) => {
	const [curTag, setCurTag] = useState("");

	useEffect(() => {
		// 인기 태그들 서버로부터 불러오기
		// loadPopularTags;
	}, []);

	const addMatchTag = async (tagName) => {
		if (tagName === "") {
			return;
		}
		if (Object.keys(matchTags).length >= 5) {
			Alert.alert("태그 개수는 5개까지 가능합니다.");
			setCurTag("");
			return;
		}
		if (tagName.length > 10) {
			Alert.alert("태그는 10글자를 초과할 수 없습니다.");
			setCurTag("");
			return;
		}

		const newMatchTags = {
			...matchTags,
			// 뭘로 저장하지...
			[Date.now()]: { tagName: tagName },
		};

		setMatchTags(newMatchTags);
		await saveMatchTags(newMatchTags);
		setCurTag("");
	};

	const deleteMatchTag = async (key) => {
		const newMatchTags = { ...matchTags };
		delete newMatchTags[key];
		setMatchTags(newMatchTags);
		await saveMatchTags(newMatchTags);
	};

	return (
		<Actionsheet isOpen={isOpen} onClose={onClose}>
			<Actionsheet.Content>
				<Box w="100%" px={4} justifyContent="center">
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
							<Badge
								key={key}
								colorScheme="info"
								flexDirection="row"
								justifyContent="space-between"
							>
								<Text bold marginRight="1" fontSize="md">
									{matchTags[key].tagName}
								</Text>
								<IconButton
									onPress={() => deleteMatchTag(key)}
									padding="0.5"
									icon={<Icon as={Fontisto} name="close" />}
									borderRadius="full"
									_icon={{
										color: "red.500",
										size: "xs",
									}}
									_pressed={{
										_icon: {
											color: "red.600:alpha.30",
										},
									}}
								/>
							</Badge>
						))}
					</HStack>
				</Box>
				<Box
					w="100%"
					h={150}
					borderTopWidth="1"
					borderColor="gray.300"
					padding="3"
					marginTop="4"
				>
					<Text fontSize="lg" color="gray.500" bold>
						인기 태그
					</Text>
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
						{/* {Object.keys(popularTag).map((key) => (
						<Button
							colorScheme="info"
							flexDirection="row"
							justifyContent="space-between"
							variant="outline"
							onPress={addMatchTags(tagName)}
						>
							<Text bold marginRight="1">
								{popularTag[key].tagName}
							</Text>
						</Button>
					))} */}
					</HStack>
				</Box>
				<Box w="100%" h={150} borderTopWidth="1" borderColor="gray.300" padding="3">
					<Text fontSize="lg" color="gray.500" bold paddingBottom="3">
						직접 입력
					</Text>
					<HStack space={2}>
						<Input
							flex={1}
							onChangeText={(v) => setCurTag(v)}
							value={curTag}
							placeholder="태그 이름"
						/>
						<IconButton
							borderRadius="sm"
							variant="solid"
							icon={
								<Icon as={Fontisto} name="plus-a" size="sm" color="warmGray.50" />
							}
							onPress={() => {
								addMatchTag(curTag);
							}}
						/>
					</HStack>
				</Box>
			</Actionsheet.Content>
		</Actionsheet>
	);
};
