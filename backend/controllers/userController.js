const User = require("../models/User");
const Message = require("../models/Message");

const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Search query is required" });
    const users = await User.find({ _id: { $ne: req.user._id }, $or: [{ fullName: { $regex: query, $options: "i" } }, { email: { $regex: query, $options: "i" } }] }).select("fullName email avatar about isOnline lastSeen");
    res.json(users);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("friends", "fullName email avatar about isOnline lastSeen");
    res.json(user.friends);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getOnlineFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({ path: "friends", match: { isOnline: true }, select: "fullName email avatar about isOnline" });
    res.json(user.friends);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getChatList = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Message.aggregate([
      { $match: { $or: [{ sender: userId }, { receiver: userId }], isDeleted: false } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: { $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"] }, lastMessage: { $first: "$$ROOT" }, unreadCount: { $sum: { $cond: [{ $and: [{ $eq: ["$receiver", userId] }, { $eq: ["$isRead", false] }] }, 1, 0] } } },
      { $sort: { "lastMessage.createdAt": -1 } }
    ]);
    const chatList = await User.populate(conversations, { path: "_id", select: "fullName email avatar about isOnline lastSeen" });
    const formatted = chatList.map((chat) => ({ user: chat._id, lastMessage: chat.lastMessage, unreadCount: chat.unreadCount }));
    res.json(formatted);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const togglePinChat = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const targetId = req.params.userId;
    const index = user.pinnedChats.indexOf(targetId);
    if (index > -1) { user.pinnedChats.splice(index, 1); } else { user.pinnedChats.push(targetId); }
    await user.save();
    res.json({ pinnedChats: user.pinnedChats });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getPinnedChats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("pinnedChats", "fullName email avatar about isOnline lastSeen");
    res.json(user.pinnedChats);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { searchUsers, getFriends, getOnlineFriends, getChatList, togglePinChat, getPinnedChats };