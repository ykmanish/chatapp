import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, RefreshControl, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { userAPI } from "../utils/api";
import ChatListItem from "../components/ChatListItem";
import PinnedChatCard from "../components/PinnedChatCard";
import OnlineAvatarRow from "../components/OnlineAvatarRow";

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { onlineUsers } = useSocket();
  const [chatList, setChatList] = useState([]);
  const [pinnedChats, setPinnedChats] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [chatsRes, pinnedRes, onlineRes] = await Promise.all([userAPI.getChatList(), userAPI.getPinnedChats(), userAPI.getOnlineFriends()]);
      setChatList(chatsRes.data); setPinnedChats(pinnedRes.data); setOnlineFriends(onlineRes.data);
    } catch (error) { console.error("Error loading data:", error); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { const unsubscribe = navigation.addListener("focus", loadData); return unsubscribe; }, [navigation, loadData]);
  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };
  const filteredChats = chatList.filter((chat) => chat.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()));
  const handlePinToggle = async (userId) => { try { await userAPI.togglePinChat(userId); loadData(); } catch (error) { console.error("Error toggling pin:", error); } };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 pt-4 pb-2 bg-white">
        <View className="flex-row items-center justify-between mb-4"><Text className="text-3xl font-bold text-dark">Messages</Text><TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center" onPress={() => navigation.navigate("SearchUsers")}><Ionicons name="create-outline" size={20} color="#1A1A2E" /></TouchableOpacity></View>
        {onlineFriends.length > 0 && <OnlineAvatarRow friends={onlineFriends} onPress={(friend) => navigation.navigate("Chat", { userId: friend._id, user: friend })} />}
        <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-2 mt-3 mb-2"><TextInput className="flex-1 text-dark text-base" placeholder="Search or start of message" placeholderTextColor="#8E8E93" value={searchQuery} onChangeText={setSearchQuery} /><Ionicons name="search" size={20} color="#8E8E93" /></View>
      </View>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} showsVerticalScrollIndicator={false}>
        {pinnedChats.length > 0 && (<View className="px-6 mt-4"><View className="flex-row items-center mb-3"><Ionicons name="pin" size={16} color="#1A1A2E" /><Text className="text-dark font-bold text-base ml-2">Pinned Chats</Text></View><ScrollView horizontal showsHorizontalScrollIndicator={false}>{pinnedChats.map((pinned) => <PinnedChatCard key={pinned._id} user={pinned} isOnline={onlineUsers[pinned._id]?.isOnline} onPress={() => navigation.navigate("Chat", { userId: pinned._id, user: pinned })} onUnpin={() => handlePinToggle(pinned._id)} />)}</ScrollView></View>) }
        <View className="px-6 mt-4">
          <View className="flex-row items-center mb-3"><Ionicons name="chatbubbles" size={16} color="#1A1A2E" /><Text className="text-dark font-bold text-base ml-2">All Chats</Text></View>
          {filteredChats.length === 0 ? (<View className="items-center py-16"><Ionicons name="chatbubbles-outline" size={64} color="#D1D5DB" /><Text className="text-muted text-base mt-4">No conversations yet</Text><TouchableOpacity className="mt-4 bg-primary px-6 py-3 rounded-2xl" onPress={() => navigation.navigate("SearchUsers")}><Text className="text-white font-semibold">Start Chatting</Text></TouchableOpacity></View>) : (filteredChats.map((chat) => <ChatListItem key={chat.user?._id} chat={chat} isOnline={onlineUsers[chat.user?._id]?.isOnline} onPress={() => navigation.navigate("Chat", { userId: chat.user?._id, user: chat.user })} onLongPress={() => handlePinToggle(chat.user?._id)} />))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;