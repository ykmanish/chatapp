import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-dark">
      <View className="flex-1 items-center justify-center px-8">
        <View className="absolute top-20 left-8 bg-white/10 rounded-2xl p-4">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-primary rounded-full items-center justify-center"><Text className="text-white font-bold">D</Text></View>
            <View className="ml-3"><Text className="text-white font-semibold text-sm">Daniel Garcia</Text><Text className="text-white/60 text-xs">Hi, guys! 👋</Text></View>
          </View>
        </View>
        <View className="absolute top-44 right-8 bg-white/10 rounded-2xl p-4">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-secondary rounded-full items-center justify-center"><Text className="text-white font-bold">L</Text></View>
            <View className="ml-3"><Text className="text-white font-semibold text-sm">Lana Rodkevych</Text><Text className="text-white/60 text-xs">I working on my garden 🌿</Text></View>
            <View className="ml-2 bg-red-500 w-6 h-6 rounded-full items-center justify-center"><Text className="text-white text-xs font-bold">3</Text></View>
          </View>
        </View>
        <View className="absolute top-72 left-12 bg-white/10 rounded-2xl p-4">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-warning rounded-full items-center justify-center"><Text className="text-white font-bold">E</Text></View>
            <View className="ml-3"><Text className="text-white font-semibold text-sm">Eric Solomon</Text><Text className="text-white/60 text-xs">What's up? 👋</Text></View>
            <View className="ml-2 bg-green-500 w-6 h-6 rounded-full items-center justify-center"><Text className="text-white text-xs font-bold">1</Text></View>
          </View>
        </View>
        <View className="mb-8 mt-32">
          <View className="w-20 h-20 bg-white/10 rounded-3xl items-center justify-center"><Ionicons name="mail-outline" size={40} color="#fff" /></View>
        </View>
        <Text className="text-white text-4xl font-bold text-center mb-2">Chatting,</Text>
        <Text className="text-white text-4xl font-bold text-center mb-4">Made Simple.</Text>
        <Text className="text-white/60 text-base text-center mb-12 px-4">Communicate with family and friends{"\n"}quickly and easily</Text>
        <View className="flex-row items-center space-x-4 mb-10">
          <TouchableOpacity className="w-14 h-14 bg-white/10 rounded-full items-center justify-center"><Ionicons name="logo-apple" size={24} color="#fff" /></TouchableOpacity>
          <TouchableOpacity className="w-14 h-14 bg-white/10 rounded-full items-center justify-center"><Ionicons name="logo-google" size={24} color="#fff" /></TouchableOpacity>
          <TouchableOpacity className="w-14 h-14 bg-white/10 rounded-full items-center justify-center"><Ionicons name="logo-discord" size={24} color="#fff" /></TouchableOpacity>
          <TouchableOpacity className="w-14 h-14 bg-primary rounded-full items-center justify-center" onPress={() => navigation.navigate("Login")}><Ionicons name="arrow-forward" size={24} color="#fff" /></TouchableOpacity>
        </View>
        <View className="w-full space-y-3">
          <TouchableOpacity className="w-full bg-primary py-4 rounded-2xl items-center" onPress={() => navigation.navigate("Register")}><Text className="text-white text-lg font-bold">Get Started</Text></TouchableOpacity>
          <TouchableOpacity className="w-full py-4 rounded-2xl items-center" onPress={() => navigation.navigate("Login")}><Text className="text-white/70 text-base">Already have an account? <Text className="text-primary font-bold">Sign In</Text></Text></TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;