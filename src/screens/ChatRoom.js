import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@chatRoom";

export default function ChatRoom() {
  const [chatLogs, setChatLogs] = useState({});

  useEffect(() => {
    loadChatLogs();
    return () => {
      // 채팅 적을 때마다 saveChatLogs 하지 않고, 화면 바뀌면 여기서 한번에 저장하면 어떨까?
      // 갑자기 어플 강제 종료되면 채팅 로그 다 날아가나..ㅎㅎ
      // cleanup something;
    };
  }, []);

  const loadChatLogs = async () => {
    try {
      const loadData = await AsyncStorage.getItem(STORAGE_KEY);
      if (loadData) {
        setChatLogs(JSON.parse(loadData));
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View>
      <ScrollView>
        {Object.keys(chatLogs).map((key) => (
          <View>
            <Text>ChatRoom</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
