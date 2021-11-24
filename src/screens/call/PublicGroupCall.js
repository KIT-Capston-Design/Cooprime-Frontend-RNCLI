import { Fab, NativeBaseProvider, Box, Icon } from "native-base";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";
import InputModal from "../../components/InputModal";

export const GroupCallList = () => {
  const [data, setData] = useState([
    {
      id: 1,
      title: "아무나 들어오세요",
      count: 1,
    },
    {
      id: 2,
      title: "재밌게 노실 분만",
      count: 2,
    },
    {
      id: 3,
      title: "선착순",
      count: 4,
    },
    {
      id: 4,
      title: "고3 모여라",
      count: 3,
    },
    {
      id: 5,
      title: "대학생 모여라",
      count: 2,
    },
    {
      id: 6,
      title: "커피 좋아하는 사람~!",
      count: 1,
    },
  ]);

  const [offset, setOffSet] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setLoading(true);
    // 공개 채팅방 정보 읽어오기
    // fetch("http://jsonplaceholder.typicode.com/posts")
    //   .then((res) => res.json())
    //   .then((res) => setData(data.concat(res.slice(offset, offset + LIMIT))))
    //   .then(() => {
    //     setOffset(offset + LIMIT);
    //     setLoading(false);
    //   })
    //   .catch((e) => {
    //     setLoading(false);
    //   });
  };

  const clickEventListener = (item) => {
    // 채팅방 접속 로직
    Alert.alert(
      "이제 채팅방으로 들어가면 됩니다.",
      "디비 접속해서 공개채팅방 정보 읽어오기 등의 로직은 내일부터 또 짜겠습니다.\n - " +
        item.title
    );
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          clickEventListener(item);
        }}
      >
        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.count}>{item.count} / 4</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const onEndReached = () => {
    if (loading) {
      return;
    } else {
      getData();
    }
  };

  return (
    <LinearGradient
      colors={["#a78bfa", "#ddd6fe", "#f5f3ff"]}
      style={styles.container}
    >
      <FlatList
        style={styles.contentList}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        onEndReachedThreshold={0.8}
        onEndReached={onEndReached}
      />
    </LinearGradient>
  );
};

export default function PublicGroupCall() {
  // 신고 팝업창 활성화 변수
  const [showModal, setShowModal] = useState(false);
  // + 버튼 클릭 후, 만든 자신의 공개 통화방
  const [myRoom, setMyRoom] = useState({
    name: "",
    count: 0,
    tags: [],
  });

  const createGroupCall = () => {
    setShowModal((prev) => !prev);
    // Alert.alert("새로운 통화방 생성", "로직은 createGroupCall에 작성");
    // 통화방 이름 생성(= 사용자 이름, 사용자는 한 통화방만 생성할 수 있으니까)
    // 서버에 통화방 생성 요청
    // GroupCall 로직을 좀 읽어볼게요.. ㅠ
  };

  const getRoomInfo = (roomInfo) => {
    console.log("getRoomInfo() 시작");

    console.log(roomInfo);
    setMyRoom(roomInfo);

    console.log("getRoomInfo() 종료");
  };

  return (
    <NativeBaseProvider>
      <GroupCallList />
      <Box position="relative" h={0} w="100%">
        <Fab
          // colorScheme="violet" 이후에 색상 변경할게요
          colorScheme="indigo"
          onPress={createGroupCall}
          position="absolute"
          size="sm"
          icon={
            <Icon
              color="white"
              as={<MaterialCommunityIcons name="plus" />}
              size="sm"
            />
          }
        />
      </Box>
      <InputModal
        hd="통화방 생성"
        btn="생성"
        showModal={showModal}
        setShowModal={setShowModal}
        sendRoomInfo={getRoomInfo}
      />
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  contentList: {
    flex: 1,
  },
  cardContent: {
    marginLeft: 15,
    marginVertical: 5,
  },
  card: {
    shadowColor: "#00000021",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,

    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    backgroundColor: "white",
    padding: 10,
    flexDirection: "row",
    borderRadius: 30,
  },
  title: {
    fontSize: 18,
    flex: 1,
    alignSelf: "center",
    color: "#3399ff",
    fontWeight: "bold",
  },
  count: {
    fontSize: 14,
    flex: 1,
    color: "#6666ff",
  },
});
