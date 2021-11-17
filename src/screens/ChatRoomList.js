import React, { useState, useEffect } from "react";
import {
  View,
  // Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  Avatar,
  Text,
  HStack,
  Center,
  VStack,
  Pressable,
  Box,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const STORAGE_KEY = "@chatRooms";

export default function ChatRoomList({ navigation }) {
  const [chatRooms, setChatRooms] = useState({});

//   useEffect(() => {
//     loadChatRooms();
//   }, []);

//   const loadChatRooms = async () => {
//     try {
//       const loadData = await AsyncStorage.getItem(STORAGE_KEY);
//       if (loadData) {
//         setChatRooms(JSON.parse(loadData));
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   const deleteChatRoom = async (key) => {
//     Alert.alert(
//       "채팅방에서 나가시겠습니까?",
//       "대화내용이 삭제되고\n채탱목록에서도 삭제됩니다.",
//       [
//         { text: "아니요" },
//         {
//           text: "예",
//           style: "destructive",
//           onPress: () => {
//             const newChatRooms = { ...chatRooms };
//             delete newChatRooms[key];
//             setChatRooms(newChatRooms);
//             saveChatRooms(newChatRooms);
//           },
//         },
//       ]
//     );
//   };

//   const saveChatRooms = async (toSave) => {
//     try {
//       await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
//     } catch (e) {
//       console.log(e);
//     }
//   };

  const enterChatRoom = () => {
    // console.log("????????");
    navigation.navigate("ChatRoom");
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {Object.keys(chatRooms).map((key) => (
          <View style={styles.chatRoom}>
            {/* <Icon style={styles.profileImage}/> 프로필 사진 */}
            <TouchableOpacity style={chatRoomInfo}>
              <View style={styles.chatLog} key={key}>
                <Text style={styles.chatRoomName}>
                  {chatRooms[key].chatRoomName}
                </Text>
                <Text></Text>
                <Text sytle={styles.lastChatTime}>
                  {chatRooms[key].lastChatTime}
                </Text>
              </View>
              <Text style={styles.lastChat}>{chatRooms[key].lastChat}</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.chatRoom}>
          <Pressable style={styles.profile}>
            <Avatar size="lg" bg="violet.300">
              sdf
            </Avatar>
          </Pressable>
          <Pressable style={styles.chat} onPress={enterChatRoom}>
            <Box p={3}>
              <VStack>
                <Text bold fontSize={"xl"}>
                  홍길동
                </Text>
                <Text color={"coolGray.400"} fontSize={"sm"}>
                  오늘 점심 뭐 드세요?
                </Text>
              </VStack>
            </Box>
            <Center paddingRight="2">
              <Text color={"coolGray.400"}>시간</Text>
            </Center>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dddddd",
  },
  chatRoom: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
  },
  profile: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 5,
    paddingLeft: 5,
  },
  chat: {
    flex: 5,
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
