import { Fab, NativeBaseProvider, Box, Icon } from "native-base";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  ScrollView,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";

export const GroupCallList = () => {
  const [data, setData] = useState([
    {
      id: 1,
      name: "Comunity",
      image: "https://img.icons8.com/clouds/100/000000/groups.png",
      count: 124.711,
    },
    {
      id: 2,
      name: "Housing",
      image: "https://img.icons8.com/color/100/000000/real-estate.png",
      count: 234.722,
    },
    {
      id: 3,
      name: "Jobs",
      image: "https://img.icons8.com/color/100/000000/find-matching-job.png",
      count: 324.723,
    },
    {
      id: 4,
      name: "Personal",
      image: "https://img.icons8.com/clouds/100/000000/employee-card.png",
      count: 154.573,
    },
    {
      id: 5,
      name: "For sale",
      image: "https://img.icons8.com/color/100/000000/land-sales.png",
      count: 124.678,
    },
    {
      id: 6,
      name: "asdfasdf asdf",
      image: "https://img.icons8.com/clouds/100/000000/groups.png",
      count: 124.123123,
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
    Alert.alert(
      "이제 채팅방으로 들어가면 됩니다.",
      "디비 접속해서 공개채팅방 정보 읽어오기 등의 로직은 내일부터 또 짜겠습니다." +
        item.name
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
        {/* <Image style={styles.image} source={{ uri: item.image }} /> */}
        <View style={styles.cardContent}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.count}>{item.count}</Text>
          {/* <TouchableOpacity
            style={styles.followButton}
            onPress={() => clickEventListener(item)}
          >
            <Text style={styles.followButtonText}>Explore now</Text>
          </TouchableOpacity> */}
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
      colors={["#f5f3ff", "#ddd6fe", "#a78bfa"]}
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
      r
    </LinearGradient>
  );
};

export default function PublicGroupCall() {
  const createGroupCall = () => {
    console.log("??");
    Alert.alert("새로운 통화방 생성", "로직은 createGroupCall 에");
    // 통화방 이름 생성(= 사용자 이름, 사용자는 한 통화방만 생성할 수 있으니까)
    // 서버에 통화방 생성 요청
    // GroupCall 로직을 좀 읽어볼게요.. ㅠ
  };

  return (
    <NativeBaseProvider>
      <GroupCallList />
      <Box position="relative" h={0} w="100%">
        <Fab
          // colorScheme="violet" 이후에 색상 변경할게요
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
    marginLeft: 20,
    marginTop: 10,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#ebf0f7",
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

  name: {
    fontSize: 18,
    flex: 1,
    alignSelf: "center",
    color: "#3399ff",
    fontWeight: "bold",
  },
  count: {
    fontSize: 14,
    flex: 1,
    alignSelf: "center",
    color: "#6666ff",
  },
  followButton: {
    marginTop: 10,
    height: 35,
    width: 100,
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#dcdcdc",
  },
  followButtonText: {
    color: "#dcdcdc",
    fontSize: 12,
  },
});
