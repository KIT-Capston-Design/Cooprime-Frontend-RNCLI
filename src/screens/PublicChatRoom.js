import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
// import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  Button,
  IconButton,
  Modal,
  Icon,
  Box,
  Divider,
  Heading,
  HStack,
  List,
  Switch,
  Text,
  useColorMode,
} from "native-base";
import ReportModal from "../components/ReportModal";

export default function PublicChatRoom() {
  const colorMode = "dark";
  return (
    <Box bg="black" pt={12}>
      <ScrollView contentContainerStyle={{ width: "100%" }}>
        <Heading p={3} mx={2}>
          NativeBase@3.0.0
        </Heading>
        <Divider opacity="0.4" />
        <HStack alignItems="center" space={6} py={4} px={3} mx={2}>
          <Ionicons name="moon-sharp" size={24} color="white" />
          <Text>Dark Mode</Text>
          <Switch
            ml="auto"
            onToggle={toggleColorMode}
            isChecked={colorMode === "dark"}
          />
        </HStack>
        <Divider opacity={colorMode == "dark" ? "0.4" : "1"} />
        <Divider mt={12} opacity={colorMode == "dark" ? "0.4" : "1"} />
        <List
          divider={
            <Divider ml={16} opacity={colorMode == "dark" ? "0.4" : "1"} />
          }
          px={3}
          // mt={12}
          py={0}
          // borderColor="red.200"
          borderWidth={0}
          borderRightWidth={0}
          w="100%"
        >
          {components.map((comp, index) => (
            <List.Item
              key={index}
              onPress={() =>
                navigation.navigate("component", { name: comp.name })
              }
              _hover={{ bg: "coolGray.300" }}
              장
            >
              <HStack space={3} py={1} alignItems="center" w="100%">
                <Box mr={4}>
                  <Entypo
                    name="circular-graph"
                    size={32}
                    color={colorMode === "dark" ? "white" : "black"}
                  />
                </Box>

                <Text>{comp.name}</Text>
                <Box ml="auto">
                  <Icon
                    mr={2}
                    size="sm"
                    as={<MaterialCommunityIcons name="chevron-right" />}
                    color="coolGray.500"
                  />
                </Box>
              </HStack>
            </List.Item>
          ))}
        </List>
      </ScrollView>
    </Box>
  );
}
