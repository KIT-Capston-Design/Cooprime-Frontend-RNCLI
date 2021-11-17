import { StatusBar } from "react-native";
import React from "react";
import { NativeBaseProvider } from "native-base";
import Navigator from "./screens/Navigator";
import Chat from "./screens/Chat";

export default function App() {
  return (
    <NativeBaseProvider>
      <StatusBar barStyle="default" />
      <Navigator />
    </NativeBaseProvider>
  );
}
