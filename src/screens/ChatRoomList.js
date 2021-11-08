import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@chatRooms";

export default function ChatRoomList() {
  const [chatRooms, setChatRooms] = useState({});

  useEffect(() => {
    loadChatRooms();
  }, []);

  const loadChatRooms = async () => {
    try {
      const loadData = await AsyncStorage.getItem(STORAGE_KEY);
      if (loadData) {
        setChatRooms(JSON.parse(loadData));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const deleteChatRoom = async (key) => {
    Alert.alert(
      "채팅방에서 나가시겠습니까?",
      "대화내용이 삭제되고\n채탱목록에서도 삭제됩니다.",
      [
        { text: "아니요" },
        {
          text: "예",
          style: "destructive",
          onPress: () => {
            const newChatRooms = { ...chatRooms };
            delete newChatRooms[key];
            setChatRooms(newChatRooms);
            saveChatRooms(newChatRooms);
          },
        },
      ]
    );
  };

  const saveChatRooms = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.log(e);
    }
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dddddd",
    paddingHorizontal: 20,
  },
  chatRoom: {
    backgroundColor: "#ff0000",
    marginBottom: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileImage: {},
  chatRoomInfo: {},
  chatLog: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chatRoomName: { color: "black", fontSize: 15 },
  lastChatTime: { color: "#aaaaaa", fontSize: 10 },
  lastChat: { color: "#aaaaaa", fontSize: 10 },
});
