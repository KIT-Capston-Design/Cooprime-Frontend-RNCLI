import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import database from "@react-native-firebase/database";
import {
  renderInputToolbar,
  renderActions,
  renderComposer,
  renderSend,
} from "../components/InputToolbar";
import { Alert } from "react-native";
import messaging from "@react-native-firebase/messaging";

/*
신고기능

알림기능
*/
export default function Chat() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [chatRoomName, setChatRoomName] = useState("");

  useEffect(() => {
    setMessages([]);

    // 디비에서 메세지 다불러오기
    const initMassages = [];
    database()
      .ref("/chat_room") // /chat_room/ + chatRoomName + / 으로 변경
      .orderByChild("createdAt")
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((item) => {
          const message = parse(item);
          initMassages.push(message);
        });
        initMassages.reverse();
        return initMassages;
      })
      .then((msg) => {
        renderMessage(msg);
      });

    // 새로운 메세지 출력
    database()
      .ref("/chat_room")
      .orderByChild("createdAt")
      .startAt(Date.now())
      .on("child_added", (snapshot) => {
        console.log(snapshot);
        renderMessage(parse(snapshot));
      });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
    });
    return unsubscribe;
  }, []);

  // snapshot to message json form
  const parse = (snapshot) => {
    const { createdAt, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const message = { _id, createdAt, text, user };
    return message;
  };

  // 메세지 보내기
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

  // 메세지 화면에 render
  const renderMessage = (messages = []) =>
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

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
