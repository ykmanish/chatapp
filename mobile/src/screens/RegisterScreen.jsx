import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) { Alert.alert("Error", "Please fill in all fields"); return; }
    if (password !== confirmPassword) { Alert.alert("Error", "Passwords do not match"); return; }
    if (password.length < 6) { Alert.alert("Error", "Password must be at least 6 characters"); return; }
    setIsLoading(true);
    const result = await register(fullName, email.trim().toLowerCase(), password);
    setIsLoading(false);
    if (!result.success) Alert.alert("Registration Failed", result.message);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 px-6 pt-8">
            <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-8" onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={20} color="#1A1A2E" /></TouchableOpacity>
            <View className="mb-8"><Text className="text-3xl font-bold text-dark mb-2">Create Account ✨</Text><Text className="text-muted text-base">Join us and start chatting with people around the world</Text></View>
            <View className="mb-4"><Text className="text-dark font-semibold text-sm mb-2 ml-1">Full Name</Text><View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-1"><Ionicons name="person-outline" size={20} color="#8E8E93" /><TextInput className="flex-1 ml-3 text-dark text-base py-3" placeholder="Enter your full name" placeholderTextColor="#8E8E93" value={fullName} onChangeText={setFullName} autoCapitalize="words" /></View></View>
            <View className="mb-4"><Text className="text-dark font-semibold text-sm mb-2 ml-1">Email Address</Text><View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-1"><Ionicons name="mail-outline" size={20} color="#8E8E93" /><TextInput className="flex-1 ml-3 text-dark text-base py-3" placeholder="Enter your email" placeholderTextColor="#8E8E93" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} /></View></View>
            <View className="mb-4"><Text className="text-dark font-semibold text-sm mb-2 ml-1">Password</Text><View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-1"><Ionicons name="lock-closed-outline" size={20} color="#8E8E93" /><TextInput className="flex-1 ml-3 text-dark text-base py-3" placeholder="Create a password" placeholderTextColor="#8E8E93" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} /><TouchableOpacity onPress={() => setShowPassword(!showPassword)}><Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#8E8E93" /></TouchableOpacity></View></View>
            <View className="mb-8"><Text className="text-dark font-semibold text-sm mb-2 ml-1">Confirm Password</Text><View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-1"><Ionicons name="shield-checkmark-outline" size={20} color="#8E8E93" /><TextInput className="flex-1 ml-3 text-dark text-base py-3" placeholder="Confirm your password" placeholderTextColor="#8E8E93" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showPassword} /></View></View>
            <TouchableOpacity className={`w-full py-4 rounded-2xl items-center mb-6 ${isLoading ? "bg-primary/70" : "bg-primary"}`} onPress={handleRegister} disabled={isLoading}>{isLoading ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-lg font-bold">Create Account</Text>}</TouchableOpacity>
            <TouchableOpacity className="items-center mb-8" onPress={() => navigation.navigate("Login")}><Text className="text-muted text-base">Already have an account? <Text className="text-primary font-bold">Sign In</Text></Text></TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;