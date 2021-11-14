import React from "react";
import { Image } from "react-native";
import {
  InputToolbar,
  Actions,
  Composer,
  Send,
} from "react-native-gifted-chat";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export const renderInputToolbar = (props) => (
  <InputToolbar
    {...props}
    containerStyle={{
      backgroundColor: "#222B45",
      paddingTop: 6,
    }}
    primaryStyle={{ alignItems: "center" }}
  />
);

export const renderActions = (props) => (
  <Actions
    {...props}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 4,
      marginRight: 4,
      marginBottom: 0,
    }}
    icon={() => (
      <Image
        style={{ width: 32, height: 32 }}
        source={{
          uri: "https://cdn-icons.flaticon.com/png/512/2997/premium/2997933.png?token=exp=1636889124~hmac=d988048b6a1eec915b5568867ac0f96b",
        }}
      />
    )}
    options={{
      사진: () => {
        console.log("photo");
      },
      신고하기: () => {
        console.log("Choose From Library");
      },
      취소: () => {
        console.log("Cancel");
      },
    }}
    optionTintColor="#222B45"
  />
);

export const renderComposer = (props) => (
  <Composer
    {...props}
    textInputStyle={{
      color: "#222B45",
      backgroundColor: "#EDF1F7",
      borderWidth: 1,
      borderRadius: 5,
      borderColor: "#E4E9F2",
      paddingTop: 8.5,
      paddingHorizontal: 12,
      marginLeft: 0,
    }}
  />
);

export const renderSend = (props) => (
  <Send
    {...props}
    disabled={!props.text}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 4,
    }}
  >
    <Image
      style={{ width: 32, height: 32 }}
      source={{
        uri: "https://cdn-icons-png.flaticon.com/512/724/724954.png",
      }}
    />
  </Send>
);
