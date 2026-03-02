import React from "react";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import FriendsScreen from "../screens/FriendsScreen";
import FriendRequestsScreen from "../screens/FriendRequestsScreen";
import SearchUsersScreen from "../screens/SearchUsersScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({ tabBarIcon: ({ focused, color, size }) => { let iconName; if (route.name === "Chats") iconName = focused ? "chatbubbles" : "chatbubbles-outline"; else if (route.name === "Friends") iconName = focused ? "people" : "people-outline"; else if (route.name === "Requests") iconName = focused ? "person-add" : "person-add-outline"; else if (route.name === "Profile") iconName = focused ? "person-circle" : "person-circle-outline"; return <Ionicons name={iconName} size={size} color={color} />; }, tabBarActiveTintColor: "#6C63FF", tabBarInactiveTintColor: "#8E8E93", tabBarStyle: { backgroundColor: "#FFFFFF", borderTopWidth: 0.5, borderTopColor: "#E5E5E5", paddingBottom: 8, paddingTop: 8, height: 65, elevation: 20, shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 8 }, tabBarLabelStyle: { fontSize: 11, fontWeight: "600" }, headerShown: false })}>
      <Tab.Screen name="Chats" component={HomeScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="Requests" component={FriendRequestsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return (<View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}><ActivityIndicator size="large" color="#6C63FF" /></View>);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <><Stack.Screen name="Welcome" component={WelcomeScreen} /><Stack.Screen name="Login" component={LoginScreen} /><Stack.Screen name="Register" component={RegisterScreen} /></>
      ) : (
        <><Stack.Screen name="MainTabs" component={TabNavigator} /><Stack.Screen name="Chat" component={ChatScreen} options={{ animation: "slide_from_right" }} /><Stack.Screen name="SearchUsers" component={SearchUsersScreen} /></>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;