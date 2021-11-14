import { StatusBar } from "react-native";
import React from "react";
import { NativeBaseProvider } from "native-base";
import Navigator from "./screens/Navigator";

export default function App() {
  return (
    <NativeBaseProvider>
      <StatusBar barStyle="default" />
      <Navigator />
    </NativeBaseProvider>
  );
}
