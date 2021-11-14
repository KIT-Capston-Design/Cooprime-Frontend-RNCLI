import React, { useState, useCallback, useEffect } from "react";
import { Text, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import database from "@react-native-firebase/database";

export default function Chat() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // const reference = database().ref("/users/123");
    // console.log(reference);
    database()
      .ref("/users/123")
      .set({
        name: "Ada Lovelace",
        age: 31,
      })
      .then(() => console.log("Data set."));
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);

  const cb = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  const parse = (snapshot) => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);
    const message = { _id, timestamp, text, user };
    return message;
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  );
}
