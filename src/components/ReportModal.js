import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
// import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Octicons from "react-native-vector-icons/Octicons";
import { io } from "socket.io-client";
import {
  Button,
  IconButton,
  Modal,
  Icon,
  Select,
  VStack,
  CheckIcon,
  Center,
  NativeBaseProvider,
} from "native-base";

export default function ReportModal({ showModal, setShowModal }) {
  const [service, setService] = useState("");

  const sendReport = () => {
    console.log("신고하기 - " + service);
    setShowModal(!showModal);
  };

  return (
    <>
      {showModal ? (
        <Modal isOpen={showModal} onClose={() => setShowModal(!showModal)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>신고하기</Modal.Header>
            <Modal.Body>
              <VStack alignItems="center" space={4}>
                <Select
                  selectedValue={service}
                  minWidth="200"
                  accessibilityLabel="Choose Report"
                  placeholder="신고 항목 선택"
                  _selectedItem={{
                    bg: "coolGray.300",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  mt={1}
                  onValueChange={(itemValue) => setService(itemValue)}
                >
                  <Select.Item label="욕설" value="curse" />
                  <Select.Item label="비매너" value="badManner" />
                  <Select.Item label="혐오 발언" value="hateSpeech" />
                  <Select.Item label="성희롱" value="sexualHarassment" />
                </Select>
              </VStack>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="warmGray"
                  onPress={() => setShowModal(false)}
                >
                  취소
                </Button>
                <Button colorScheme="danger" onPress={sendReport}>
                  신고
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      ) : null}
    </>
  );
}
