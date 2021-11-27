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
import Fontisto from "react-native-vector-icons/Fontisto";

export default TagSetting = ({ isOpen, onClose, matchTags, setMatchTags }) => {
	useEffect(() => {
		// 인기 태그들 서버로부터 불러오기
		// loadPopularTags;
	}, []);

	const addMatchTag = async (tagName) => {
		if (tagName === "") {
			return;
		}

		const newMatchTags = {
			...matchTags,
			// 뭘로 저장하지... [Date.now()]: { tagName }  ...?
		};

		setMatchTags(newMatchTags);
		// await saveMatchTags(newMatchTags);
	};
	const deleteMatchTag = async (key) => {
		const newMatchTags = { ...matchTags };
		delete newMatchTags[key];
		setMatchTags(newMatchTags);

		// AsyncStorage에 저장해야함
		// saveToDos(newMatchTags);
	};

	return (
		<Actionsheet isOpen={isOpen} onClose={onClose}>
			<Actionsheet.Content>
				<Box w="100%" h={60} px={4} justifyContent="center">
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
								<Text bold marginRight="1">
									{matchTags[key].tagName}
								</Text>
								<IconButton
									onPress={deleteMatchTag(key)}
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
				<Box w="100%" h={150} borderTopWidth="1" borderColor="gray.300" padding="3">
					<Text fontSize="16" color="gray.500" bold>
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
					<Text fontSize="16" color="gray.500" bold>
						직접 입력
					</Text>
					<HStack space={2}>
						<Input
							flex={1}
							// onChangeText={(v) => setInputValue(v)}
							// value={inputValue}
							placeholder="태그 이름"
						/>
						<IconButton
							borderRadius="sm"
							variant="solid"
							icon={
								<Icon as={Fontisto} name="plus-a" size="sm" color="warmGray.50" />
							}
							// onPress={() => {
							// 	// addItem(inputValue);
							// 	// setInputValue("");
							// }}
						/>
					</HStack>
				</Box>
			</Actionsheet.Content>
		</Actionsheet>
	);
};
