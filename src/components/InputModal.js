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
  const [text, setText] = useState("");
  const [tags, setTags] = useState([]);
  const [curTag, setCurTag] = useState("");
  const initialRef = useRef(null);

  const addTag = () => {
    // 새로운 방의 태그 추가
    if (curTag === "") {
      Alert.alert("빈 태그", "빈 태그는 입력하실 수 없습니다.");
    } else {
      setTags([...tags, { key: new Date().getTime(), name: curTag }]);
      setCurTag("");
    }
  };

  const cancelCreateRoom = () => {
    reset();
    setShowModal(false);
  };

  const createPublicCall = () => {
    console.log("공개 채팅방 만들기 시작 - " + text);

    const tmpRoom = {
      name: text,
      count: 1,
      tags: tags,
    };
    sendRoomInfo(tmpRoom);
    reset();
    setShowModal(!showModal);

    console.log("공개 채팅방 만들기 종료");
  };

  const reset = () => {
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
