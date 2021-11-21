import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "./screens/login/Login";
import RegisterPhoneNumberScreen from "./screens/login/RegisterPhoneNumber";
import AuthPhoneNumberScreen from "./screens/login/AuthPhoneNumber";
import SplashScreen from "./screens/login/Splash";
import Home from "./screens/Home";
import PublicGroupCall from "./screens/call/PublicGroupCall";

const Stack = createStackNavigator();

const Auth = () => {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegisterPhoneNumberScreen"
        component={RegisterPhoneNumberScreen}
        options={{
          title: "휴대폰 인증", //Set Header Title
          headerStyle: {
            backgroundColor: "#307ecc", //Set Header color
          },
          headerTintColor: "#fff", //Set Header text color
          headerTitleStyle: {
            fontWeight: "bold", //Set Header text style
          },
        }}
      />
      <Stack.Screen
        name="AuthPhoneNumberScreen"
        component={AuthPhoneNumberScreen}
        options={{
          title: "휴대폰 인증 번호 입력", //Set Header Title
          headerStyle: {
            backgroundColor: "#307ecc", //Set Header color
          },
          headerTintColor: "#fff", //Set Header text color
          headerTitleStyle: {
            fontWeight: "bold", //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        // Hiding header
        screenOptions={{ headerShown: false }}
      >
        {/* SplashScreen which will come once for 5 Seconds */}
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        {/* Auth Navigator: Include Login and Signup */}
        <Stack.Screen name="Auth" component={Auth} />
        {/* Navigation Drawer as a landing page */}
        <Stack.Screen name="HomeScreen" component={Home} />
        {/* 공개 그룹 통화 테스트하려면  initialRouteName="PublicGroupCall"  로 변경*/}
        <Stack.Screen name="PublicGroupCall" component={PublicGroupCall} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
