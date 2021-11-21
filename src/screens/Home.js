import React from "react";

import { StatusBar } from "react-native";
import { NativeBaseProvider } from "native-base";
import Navigator from "./Navigator";

export default function Home() {
  return (
    <NativeBaseProvider>
      <StatusBar barStyle="default" />
      <Navigator />
    </NativeBaseProvider>
  );
}
