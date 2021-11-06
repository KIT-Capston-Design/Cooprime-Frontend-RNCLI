import { StatusBar } from "react-native";
import React from "react";
import Navigator from "./screens/Navigator";

export default function App() {
  return (
    <>
      <StatusBar barStyle="default" />
      <Navigator />
    </>
  );
}
