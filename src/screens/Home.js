import React from "react";

import { StatusBar } from "react-native";
import { NativeBaseProvider } from "native-base";
import Navigator from "./Navigator";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { MainNavigator } from "./Navigator";

export default function Home() {
  return (
    <NativeBaseProvider>
      <StatusBar barStyle="default" />
      <MainNavigator />
    </NativeBaseProvider>
  );
}
