import React, { useState, useRef } from "react";
import { Button, Modal, FormControl, Input } from "native-base";

export default function InputModal({ hd, bd, btn, showModal, setShowModal }) {
  const [text, setText] = useState("");
  const initialRef = useRef(null);

  const createPublicCall = () => {
    console.log("공개 채팅방 만들기 - " + text);
    setShowModal(!showModal);
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
                <FormControl.Label>{bd}</FormControl.Label>
                <Input
                  ref={initialRef}
                  onChangeText={(input) => {
                    setText(input);
                  }}
                />
              </FormControl>
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
