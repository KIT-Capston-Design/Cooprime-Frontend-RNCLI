import React, { useState, useRef } from "react";
import {
	Button,
	Modal,
	FormControl,
	Input,
	Box,
	Badge,
	HStack,
} from "native-base";
import { Alert } from "react-native";

export default function InputModal({
	hd,
	btn,
	showModal,
	setShowModal,
	sendRoomInfo,
}) {
	const [text, setText] = useState(""); // 공개 통화방 이름
	const [tags, setTags] = useState([]); // 공개 통화방 태그들
	const [curTag, setCurTag] = useState("");
	const initialRef = useRef(null); // 생성 화면에서 맨처음 커서가 가르키는 곳

	const addTag = () => {
		// 생성할 방의 태그 추가
		if (curTag === "") {
			Alert.alert("빈 태그", "빈 태그는 입력하실 수 없습니다.");
		} else {
			setTags([...tags, { key: new Date().getTime(), name: curTag }]);
			setCurTag("");
		}
	};

	const cancelCreateRoom = () => {
		// 공개통화방 생성 취소

		// 기존 데이터 초기화
		reset();

		// 공개통화방 목록 화면으로 전환
		setShowModal(false);
	};

	const createPublicCall = () => {
		console.log("공개 통화방 생성 시작");

		const tmpRoom = {
			name: text,
			count: 1,
			tags: tags,
		};
		// 상위 컴포넌트(PublicGroupCall.js)에게 사용자가 입력한 방 생성 정보 전달
		sendRoomInfo(tmpRoom);
		reset();
		setShowModal(!showModal); //

		console.log("공개 통화방 생성 종료");
	};

	const reset = () => {
		// 방 생성 정보 초기화
		setText("");
		setTags([]);
		setCurTag("");
	};

	return (
		<>
			{showModal ? (
				<Modal
					isOpen={showModal}
					onClose={() => setShowModal(!showModal)}
					initialFocusRef={initialRef}
				>
					<Modal.Content maxWidth="400px">
						<Modal.CloseButton />
						<Modal.Header>{hd}</Modal.Header>
						<Modal.Body>
							<FormControl mt="3">
								<FormControl.Label>방 이름</FormControl.Label>
								<Input
									ref={initialRef}
									onChangeText={(input) => {
										setText(input);
									}}
								/>
							</FormControl>
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
								{tags.map((tag) => (
									<Badge key={tag.key}>{tag.name}</Badge>
								))}
							</HStack>
							<Box>
								<FormControl mt="3">
									<FormControl.Label>태그 입력</FormControl.Label>
									<Input
										onChangeText={(input) => {
											setCurTag(input);
										}}
										value={curTag}
									/>
								</FormControl>
								<Button colorScheme="indigo" onPress={addTag}>
									추가
								</Button>
							</Box>
						</Modal.Body>
						<Modal.Footer>
							<Button.Group space={2}>
								<Button
									variant="ghost"
									colorScheme="warmGray"
									onPress={cancelCreateRoom}
								>
									취소
								</Button>
								<Button colorScheme="indigo" onPress={createPublicCall}>
									{btn}
								</Button>
							</Button.Group>
						</Modal.Footer>
					</Modal.Content>
				</Modal>
			) : null}
		</>
	);
}
