import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert("Error", "Please fill in all fields"); return; }
    setIsLoading(true);
    const result = await login(email.trim().toLowerCase(), password);
    setIsLoading(false);
    if (!result.success) Alert.alert("Login Failed", result.message);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 px-6 pt-8">
            <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-8" onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={20} color="#1A1A2E" /></TouchableOpacity>
            <View className="mb-10"><Text className="text-3xl font-bold text-dark mb-2">Welcome Back 👋</Text><Text className="text-muted text-base">Sign in to continue chatting with your friends</Text></View>
            <View className="mb-5">
              <Text className="text-dark font-semibold text-sm mb-2 ml-1">Email Address</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-1"><Ionicons name="mail-outline" size={20} color="#8E8E93" /><TextInput className="flex-1 ml-3 text-dark text-base py-3" placeholder="Enter your email" placeholderTextColor="#8E8E93" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} /></View>
            </View>
            <View className="mb-6">
              <Text className="text-dark font-semibold text-sm mb-2 ml-1">Password</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-1"><Ionicons name="lock-closed-outline" size={20} color="#8E8E93" /><TextInput className="flex-1 ml-3 text-dark text-base py-3" placeholder="Enter your password" placeholderTextColor="#8E8E93" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} /><TouchableOpacity onPress={() => setShowPassword(!showPassword)}><Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#8E8E93" /></TouchableOpacity></View>
            </View>
            <TouchableOpacity className="items-end mb-8"><Text className="text-primary font-semibold text-sm">Forgot Password?</Text></TouchableOpacity>
            <TouchableOpacity className={`w-full py-4 rounded-2xl items-center mb-6 ${isLoading ? "bg-primary/70" : "bg-primary"}`} onPress={handleLogin} disabled={isLoading}>{isLoading ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-lg font-bold">Sign In</Text>}</TouchableOpacity>
            <View className="flex-row items-center mb-6"><View className="flex-1 h-px bg-gray-200" /><Text className="mx-4 text-muted text-sm">or continue with</Text><View className="flex-1 h-px bg-gray-200" /></View>
            <View className="flex-row justify-center space-x-4 mb-8">
              <TouchableOpacity className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-2xl items-center justify-center"><Ionicons name="logo-google" size={22} color="#DB4437" /></TouchableOpacity>
              <TouchableOpacity className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-2xl items-center justify-center"><Ionicons name="logo-apple" size={22} color="#000" /></TouchableOpacity>
              <TouchableOpacity className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-2xl items-center justify-center"><Ionicons name="logo-facebook" size={22} color="#4267B2" /></TouchableOpacity>
            </View>
            <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Register")}><Text className="text-muted text-base">Don't have an account? <Text className="text-primary font-bold">Sign Up</Text></Text></TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;