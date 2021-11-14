// import React from "react";
// import { View, Text, StyleSheet, Dimensions } from "react-native";

// const height = Dimensions.get("window").height;
// const width = Dimensions.get("window").width;

// export default function HeaderBar() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.headerText}>Cooprime</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 0.15,
//     borderBottomColor: "#aaaaaa",
//     borderBottomWidth: 0.5,
//     // alignItems: "center",
//     justifyContent: "center",
//   },
//   headerText: {
//     paddingTop: width / 10,
//     paddingLeft: width / 20,
//     fontSize: width / 10,
//     fontFamily: "DancingScript-Bold",
//   },
// });

import React from "react";
import {
  VStack,
  HStack,
  Button,
  IconButton,
  Icon,
  Text,
  NativeBaseProvider,
  Center,
  Box,
  StatusBar,
} from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function () {
  return (
    <>
      <StatusBar backgroundColor="#3700B3" barStyle="light-content" />

      <Box safeAreaTop backgroundColor="#6200ee" />

      <HStack
        bg="#6200ee"
        px="1"
        py="3"
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack space="4" alignItems="center">
          <Center width={{ base: 100 }}>
            <Text color="white" fontSize="20" fontWeight="bold">
              서로소
            </Text>
          </Center>
        </HStack>
        <HStack space="2">
          <IconButton
            icon={
              <Icon
                as={<MaterialIcons name="history" />}
                size="md"
                color="white"
              />
            }
          />
          <IconButton
            icon={
              <Icon
                as={<MaterialIcons name="more-vert" />}
                size="md"
                color="white"
              />
            }
          />
        </HStack>
      </HStack>
    </>
  );
}
