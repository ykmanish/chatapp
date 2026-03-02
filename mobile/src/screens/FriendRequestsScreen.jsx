import React, { useState, useEffect, useCallback } from "react";
import { View, Text, SafeAreaView, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { friendAPI } from "../utils/api";
import FriendRequestCard from "../components/FriendRequestCard";

const FriendRequestsScreen = ({ navigation }) => {
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("received");

  const loadRequests = useCallback(async () => {
    try {
      const [receivedRes, sentRes] = await Promise.all([friendAPI.getReceivedRequests(), friendAPI.getSentRequests()]);
      setReceivedRequests(receivedRes.data); setSentRequests(sentRes.data);
    } catch (error) { console.error("Error loading requests:", error); }
  }, []);

  useEffect(() => { loadRequests(); }, [loadRequests]);
  useEffect(() => { const unsub = navigation.addListener("focus", loadRequests); return unsub; }, [navigation, loadRequests]);
  const onRefresh = async () => { setRefreshing(true); await loadRequests(); setRefreshing(false); };
  const handleAccept = async (requestId) => { try { await friendAPI.acceptRequest(requestId); loadRequests(); } catch (error) { console.error("Error accepting:", error); } };
  const handleReject = async (requestId) => { try { await friendAPI.rejectRequest(requestId); loadRequests(); } catch (error) { console.error("Error rejecting:", error); } };
  const data = activeTab === "received" ? receivedRequests : sentRequests;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8, backgroundColor: "#fff" }}>
        <Text style={{ fontSize: 30, fontWeight: "bold", color: "#1A1A2E", marginBottom: 16 }}>Requests</Text>
        <View style={{ flexDirection: "row", backgroundColor: "#f3f4f6", borderRadius: 16, padding: 4 }}>
          <TouchableOpacity style={{ flex: 1, paddingVertical: 8, borderRadius: 12, alignItems: "center", backgroundColor: activeTab === "received" ? "#fff" : "transparent" }} onPress={() => setActiveTab("received")}> <Text style={{ fontWeight: "600", color: activeTab === "received" ? "#6C63FF" : "#8E8E93" }}>Received ({receivedRequests.length})</Text></TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, paddingVertical: 8, borderRadius: 12, alignItems: "center", backgroundColor: activeTab === "sent" ? "#fff" : "transparent" }} onPress={() => setActiveTab("sent")}> <Text style={{ fontWeight: "600", color: activeTab === "sent" ? "#6C63FF" : "#8E8E93" }}>Sent ({sentRequests.length})</Text></TouchableOpacity>
        </View>
      </View>
      <FlatList data={data} keyExtractor={(item) => item._id} renderItem={({ item }) => (<FriendRequestCard request={item} type={activeTab} onAccept={() => handleAccept(item._id)} onReject={() => handleReject(item._id)} />)} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }} ListEmptyComponent={<View style={{ alignItems: "center", paddingVertical: 80 }}><Ionicons name="mail-open-outline" size={64} color="#D1D5DB" /><Text style={{ color: "#8E8E93", fontSize: 16, marginTop: 16 }}>{activeTab === "received" ? "No pending requests" : "No sent requests"}</Text></View>} />
    </SafeAreaView>
  );
};

export default FriendRequestsScreen;
