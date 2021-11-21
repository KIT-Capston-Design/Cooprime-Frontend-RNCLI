import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Image,
  AsyncStorage,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const SplashScreen = ({ navigation }) => {
  //State for ActivityIndicator animation
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
      // token 삭제 테스트할떄 코드
      // AsyncStorage.removeItem("token");

      // check jwt token in Asyncstorage
      AsyncStorage.getItem("token").then((value) =>
        navigation.replace(value === null ? "Auth" : "HomeScreen")
      );
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/test.png")}
        style={{ width: wp(55), resizeMode: "contain", margin: 30 }}
      />
      {/* Loading bar */}
      <ActivityIndicator
        animating={animating}
        color="#6990F7"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  activityIndicator: {
    alignItems: "center",
    height: 80,
  },
});
