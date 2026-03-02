import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, FlatList, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { userAPI, friendAPI } from "../utils/api";
import UserSearchCard from "../components/UserSearchCard";

const SearchUsersScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sentRequests, setSentRequests] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try { const res = await userAPI.searchUsers(query.trim()); setResults(res.data); } catch (error) { Alert.alert("Error", "Failed to search users"); }
    setLoading(false);
  };

  const handleSendRequest = async (receiverId) => {
    try { await friendAPI.sendRequest({ receiverId }); setSentRequests((prev) => [...prev, receiverId]); Alert.alert("Success", "Friend request sent!"); } catch (error) { Alert.alert("Error", error.response?.data?.message || "Failed to send request"); }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8, backgroundColor: "#fff" }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
          <TouchableOpacity style={{ width: 40, height: 40, backgroundColor: "#f3f4f6", borderRadius: 20, alignItems: "center", justifyContent: "center", marginRight: 16 }} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={20} color="#1A1A2E" /></TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#1A1A2E" }}>Find Friends</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#f3f4f6", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8 }}>
          <TextInput style={{ flex: 1, color: "#1A1A2E", fontSize: 16 }} placeholder="Search by name or email..." placeholderTextColor="#8E8E93" value={query} onChangeText={setQuery} onSubmitEditing={handleSearch} returnKeyType="search" />
          <TouchableOpacity onPress={handleSearch}>{loading ? <ActivityIndicator color="#6C63FF" /> : <Ionicons name="search" size={20} color="#6C63FF" />}</TouchableOpacity>
        </View>
      </View>
      <FlatList data={results} keyExtractor={(item) => item._id} renderItem={({ item }) => (<UserSearchCard user={item} onSendRequest={() => handleSendRequest(item._id)} requestSent={sentRequests.includes(item._id)} />)} contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }} ListEmptyComponent={query.length > 0 && !loading ? (<View style={{ alignItems: "center", paddingVertical: 80 }}><Ionicons name="search-outline" size={64} color="#D1D5DB" /><Text style={{ color: "#8E8E93", fontSize: 16, marginTop: 16 }}>No users found</Text></View>) : null} />
    </SafeAreaView>
  );
};

export default SearchUsersScreen;
