import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
export default function Alarm() {
  const testMsg = "테스트 메시지 입니다";

  return (
    <View style={styles.container}>
      {/* <Text style={{ fontSize: 50 }}>Alarm</Text> */}
      <ScrollView>
        <View style={styles.toDo}>
          <Text style={styles.toDoText}>{testMsg}</Text>
          <TouchableOpacity onPress={() => deleteToDo(key)}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={30}
              color="#999999"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.toDo}>
          <Text style={styles.toDoText}>{testMsg}</Text>
          <TouchableOpacity onPress={() => deleteToDo(key)}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={30}
              color="#999999"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.toDo}>
          <Text style={styles.toDoText}>{testMsg}</Text>
          <TouchableOpacity onPress={() => deleteToDo(key)}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={30}
              color="#999999"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.toDo}>
          <Text style={styles.toDoText}>{testMsg}</Text>
          <TouchableOpacity onPress={() => deleteToDo(key)}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={30}
              color="#999999"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.toDo}>
          <Text style={styles.toDoText}>{testMsg}</Text>
          <TouchableOpacity onPress={() => deleteToDo(key)}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={30}
              color="#999999"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.toDo}>
          <Text style={styles.toDoText}>{testMsg}</Text>
          <TouchableOpacity onPress={() => deleteToDo(key)}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={30}
              color="#999999"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.toDo}>
          <Text style={styles.toDoText}>{testMsg}</Text>
          <TouchableOpacity onPress={() => deleteToDo(key)}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={30}
              color="#999999"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.toDo}>
          <Text style={styles.toDoText}>{testMsg}</Text>
          <TouchableOpacity onPress={() => deleteToDo(key)}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={30}
              color="#999999"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.toDo}>
          <Text style={styles.toDoText}>{testMsg}</Text>
          <TouchableOpacity onPress={() => deleteToDo(key)}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={30}
              color="#999999"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.toDo}>
          <Text style={styles.toDoText}>{testMsg}</Text>
          <TouchableOpacity onPress={() => deleteToDo(key)}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={30}
              color="#999999"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.toDo}>
          <Text style={styles.toDoText}>{testMsg}</Text>
          <TouchableOpacity onPress={() => deleteToDo(key)}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={30}
              color="#999999"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeeeee",
    paddingTop: 5,
    // alignItems: "center",
    // justifyContent: "center",
  },
  toDo: {
    backgroundColor: "#555555",
    marginBottom: 20,
    marginHorizontal: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: { color: "white", fontSize: 16, fontWeight: "700" },
});
