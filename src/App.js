import { StatusBar } from "react-native";
import React from "react";
import { NativeBaseProvider } from "native-base";
import Navigator from "./screens/Navigator";
import Calling from "./screens/Calling";
import CallButton from "./screens/CallButton";
import PublicChatRoom from "./screens/PublicChatRoom";

export default function App() {
  return (
    <NativeBaseProvider>
      <StatusBar barStyle="default" />
      {/* <PublicChatRoom /> */}
      <Navigator />
      {/* <CallButton /> */}
      {/* <Calling /> */}
    </NativeBaseProvider>
  );
}
