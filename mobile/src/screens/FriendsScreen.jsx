import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, FlatList, RefreshControl, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSocket } from "../context/SocketContext";
import { userAPI, friendAPI } from "../utils/api";
import { getInitials } from "../utils/helpers";

const FriendsScreen = ({ navigation }) => {
  const { onlineUsers } = useSocket();
  const [friends, setFriends] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadFriends = useCallback(async () => { try { const res = await userAPI.getFriends(); setFriends(res.data); } catch (error) { console.error("Error loading friends:", error); } }, []);

  useEffect(() => { loadFriends(); }, [loadFriends]);
  useEffect(() => { const unsub = navigation.addListener("focus", loadFriends); return unsub; }, [navigation, loadFriends]);
  const onRefresh = async () => { setRefreshing(true); await loadFriends(); setRefreshing(false); };

  const handleRemoveFriend = (friendId, friendName) => {
    Alert.alert("Remove Friend", "Are you sure you want to remove " + friendName + "?", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: async () => { try { await friendAPI.removeFriend(friendId); loadFriends(); } catch (error) { Alert.alert("Error", "Failed to remove friend"); } } },
    ]);
  };

  const renderFriend = ({ item }) => {
    const isOnline = onlineUsers[item._id]?.isOnline;
    return (
      <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, marginHorizontal: 24 }} onPress={() => navigation.navigate("Chat", { userId: item._id, user: item })} onLongPress={() => handleRemoveFriend(item._id, item.fullName)}>
        <View style={{ width: 48, height: 48, backgroundColor: "rgba(108,99,255,0.2)", borderRadius: 24, alignItems: "center", justifyContent: "center" }}><Text style={{ color: "#6C63FF", fontWeight: "bold", fontSize: 18 }}>{getInitials(item.fullName)}</Text>{isOnline && <View style={{ position: "absolute", bottom: 0, right: 0, width: 14, height: 14, backgroundColor: "#22c55e", borderRadius: 7, borderWidth: 2, borderColor: "#fff" }} />}</View>
        <View style={{ flex: 1, marginLeft: 16 }}><Text style={{ color: "#1A1A2E", fontWeight: "600", fontSize: 16 }}>{item.fullName}</Text><Text style={{ color: "#8E8E93", fontSize: 14 }}>{item.about || "Hey there!"}</Text></View>
        <TouchableOpacity style={{ width: 40, height: 40, backgroundColor: "rgba(108,99,255,0.1)", borderRadius: 20, alignItems: "center", justifyContent: "center" }} onPress={() => navigation.navigate("Chat", { userId: item._id, user: item })}><Ionicons name="chatbubble-outline" size={18} color="#6C63FF" /></TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8, backgroundColor: "#fff", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 30, fontWeight: "bold", color: "#1A1A2E" }}>Friends</Text>
        <TouchableOpacity style={{ width: 40, height: 40, backgroundColor: "#f3f4f6", borderRadius: 20, alignItems: "center", justifyContent: "center" }} onPress={() => navigation.navigate("SearchUsers")}><Ionicons name="person-add-outline" size={20} color="#1A1A2E" /></TouchableOpacity>
      </View>
      <FlatList data={friends} keyExtractor={(item) => item._id} renderItem={renderFriend} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }} ListEmptyComponent={<View style={{ alignItems: "center", paddingVertical: 80 }}><Ionicons name="people-outline" size={64} color="#D1D5DB" /><Text style={{ color: "#8E8E93", fontSize: 16, marginTop: 16 }}>No friends yet</Text><TouchableOpacity style={{ marginTop: 16, backgroundColor: "#6C63FF", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16 }} onPress={() => navigation.navigate("SearchUsers")}><Text style={{ color: "#fff", fontWeight: "600" }}>Find Friends</Text></TouchableOpacity></View>} />
    </SafeAreaView>
  );
};

export default FriendsScreen;
