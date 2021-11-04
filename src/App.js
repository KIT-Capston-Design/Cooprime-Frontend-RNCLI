import { StatusBar } from "react-native";
import React from "react";
import Navigator from "./screens/Navigator";
import HeaderBar from "./layouts/HeaderBar.js";

export default function App() {
  return (
    <>
      <StatusBar barStyle="default" />
      <HeaderBar />
      <Navigator />
    </>
  );
}
