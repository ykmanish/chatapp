import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.1.100:5000/api";

const api = axios.create({ baseURL: API_URL, headers: { "Content-Type": "application/json" } });

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  updateProfile: (data) => api.put("/auth/profile", data),
};

export const userAPI = {
  searchUsers: (query) => api.get(`/users/search?query=${query}`),
  getFriends: () => api.get("/users/friends"),
  getOnlineFriends: () => api.get("/users/online-friends"),
  getChatList: () => api.get("/users/chats"),
  togglePinChat: (userId) => api.put(`/users/pin/${userId}`),
  getPinnedChats: () => api.get("/users/pinned"),
};

export const friendAPI = {
  sendRequest: (data) => api.post("/friends/request", data),
  acceptRequest: (requestId) => api.put(`/friends/accept/${requestId}`),
  rejectRequest: (requestId) => api.put(`/friends/reject/${requestId}`),
  getReceivedRequests: () => api.get("/friends/requests/received"),
  getSentRequests: () => api.get("/friends/requests/sent"),
  removeFriend: (friendId) => api.delete(`/friends/remove/${friendId}`),
};

export const messageAPI = {
  getMessages: (userId, page = 1) => api.get(`/messages/${userId}?page=${page}`),
  sendMessage: (data) => api.post("/messages", data),
  markAsRead: (userId) => api.put(`/messages/read/${userId}`),
  reactToMessage: (messageId, emoji) => api.put(`/messages/react/${messageId}`, { emoji }),
  deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),
};

export default api;
