import { StatusBar } from "react-native";
import React from "react";
import Navigator from "./screens/Navigator";
import Chat from "./screens/Chat";

export default function App() {
  return (
    <>
      {/* <StatusBar barStyle="default" />
      <Navigator /> */}
      <Chat />
    </>
  );
}
