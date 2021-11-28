import React from "react";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// // LoginTabs
// import Login from "./login/Login";

// HomeTabs
import Header from "../layouts/Header";
import OneToOneCall from "./call/OneToOneCall";
import GroupCall from "./call/GroupCall";
import Calling from "./call/Calling";
import Profile from "./Profile";
import Alarm from "./Alarm";

// ChatStacks
import ChatRoomList from "./chat/ChatRoomList";
import ChatRoom from "./chat/ChatRoom";

const HomeTab = createBottomTabNavigator();
const ChatStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();

function ChatStacks() {
	return (
		<>
			<ChatStack.Navigator>
				<ChatStack.Screen
					name="ChatRoomList"
					component={ChatRoomList}
					options={{ headerShown: false }}
				></ChatStack.Screen>
				<ChatStack.Screen name="ChatRoom" component={ChatRoom}></ChatStack.Screen>
			</ChatStack.Navigator>
		</>
	);
}

function HomeTabs() {
	return (
		<>
			<Header />
			<HomeTab.Navigator
				screenOptions={({ route }) => ({
					tabBarIcon: ({ focused, color, size }) => {
						let iconName;
						size = 30;
						if (route.name === "Calling") {
							iconName = focused ? "home" : "home-outline";
						} else if (route.name === "Chat") {
							iconName = focused ? "chat" : "chat-outline";
						} else if (route.name === "Alarm") {
							iconName = focused ? "bell" : "bell-outline";
						} else if (route.name === "Profile") {
							iconName = focused ? "account-box" : "account-box-outline";
						}

						// You can return any component that you like here!
						return <Icon name={iconName} size={size} color={color} />;
					},
					tabBarActiveTintColor: "black",
					tabBarInactiveTintColor: "black",
					headerShown: false,
					tabBarShowLabel: false,
				})}
			>
				<HomeTab.Screen name="Calling" component={Calling} />
				<HomeTab.Screen name="Chat" component={ChatStacks} />
				<HomeTab.Screen name="Profile" component={Profile} />
				<HomeTab.Screen name="Alarm" component={Alarm} />
			</HomeTab.Navigator>
		</>
	);
}

export default function Navigator() {
	return (
		<Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Home" component={HomeTabs} />
			<Stack.Screen name="OneToOne" component={OneToOneCall} />
			<Stack.Screen name="Group" component={GroupCall} />
		</Stack.Navigator>
	);
}
