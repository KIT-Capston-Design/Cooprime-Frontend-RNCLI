import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Friends from "../components/Friends";
import {
  Box,
  Text,
  Pressable,
  v3CompatibleTheme,
  Avatar,
  HStack,
  VStack,
  Spacer,
  Center,
} from "native-base";

export default function Profile() {
  return (
    <Box style={styles.container}>
      <Box style={styles.profile}>
        <Box style={styles.profileInfo}>
          <Box pl="4" pr="5" py="2">
            <HStack alignItems="center" space={3}>
              <Avatar size="xl" bg="violet.300" />
              <VStack>
                <Text fontSize="2xl" color="coolGray.800" bold>
                  사용자 이름
                </Text>
                <Text color="coolGray.600">자기소개</Text>
              </VStack>
              {/* <Spacer /> */}
            </HStack>
          </Box>
        </Box>
        {/* <Center style={styles.modifyProfileBtn}> */}
        <Pressable bg="coolGray.500" style={styles.modifyProfileBtn}>
          <Text bold color="white">
            회원정보 수정
          </Text>
        </Pressable>
        {/* </Center> */}
      </Box>
      <Friends />
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeeeee",
    // alignItems: "center",
    // justifyContent: "center",
  },
  profile: {
    flex: 0.4,
    borderColor: "#cccccc",
    borderBottomWidth: 2,
    // backgroundColor: "#00ffff",
  },
  friendList: {
    flex: 0.6,
    // backgroundColor: "#ffff00",
  },
  profileInfo: {
    flex: 4,
    // backgroundColor: "#ff0000",
  },
  modifyProfileBtn: {
    flex: 1,
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 50,
    borderRadius: 15,
    // width: "50%",
    justifyContent: "center",
  },
});
