import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import { GiftedChat } from "react-native-gifted-chat";
import database from "@react-native-firebase/database";
import {
  renderInputToolbar,
  renderActions,
  renderComposer,
  renderSend,
} from "../components/InputToolbar";

export default function Chat() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [chatRoomName, setChatRoomName] = useState("");

  const renderMessage = (messages = []) =>
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

  useEffect(() => {
    setMessages([]);
    const initMassages = [];
    // database()
    //   .ref("/chat_room")
    //   .once("value")
    //   .then((snapshot) => {
    //     snapshot.forEach((item) => {
    //       const itemVal = item.val();
    //       const { createdAt, text, user } = item.val();
    //       const { key: _id } = item;
    //       const message = { _id, createdAt, text, user };
    //       initMassages.push(message);
    //     });
    //     renderMessage(initMassages);
    //   });

    const onChildAdd = database()
      .ref("/chat_room")
      .on("child_added", (snapshot) => {
        console.log(snapshot);
        renderMessage(parse(snapshot));
      });
  }, []);

  const parse = (snapshot) => {
    const { createdAt, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const message = { _id, createdAt, text, user };
    return message;
  };

  const onSend = useCallback((messages = []) => {
    const reference = database().ref("/chat_room");
    const { text, user } = messages[0];
    const message = {
      text,
      user,
      createdAt: new Date().getTime(),
    };
    reference.push(message).then(() => console.log("Data set."));
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      // user info로 변경해야함
      user={{
        _id: 1,
        name: "Aaron",
        avatar: "https://placeimg.com/150/150/any",
      }}
      scrollToBottom
      renderAvatarOnTop
      text={text}
      onInputTextChanged={setText}
      renderInputToolbar={renderInputToolbar}
      renderActions={renderActions}
      renderComposer={renderComposer}
      renderSend={renderSend}
    />
  );
}
