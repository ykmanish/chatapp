const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");

const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user._id;
    if (senderId.toString() === receiverId) return res.status(400).json({ message: "Cannot send friend request to yourself" });
    const sender = await User.findById(senderId);
    if (sender.friends.includes(receiverId)) return res.status(400).json({ message: "Already friends" });
    const existingRequest = await FriendRequest.findOne({ $or: [{ sender: senderId, receiver: receiverId }, { sender: receiverId, receiver: senderId }], status: "pending" });
    if (existingRequest) return res.status(400).json({ message: "Friend request already exists" });
    const friendRequest = await FriendRequest.create({ sender: senderId, receiver: receiverId, message: message || "" });
    const populated = await friendRequest.populate("sender receiver", "fullName email avatar");
    const io = req.app.get("io");
    const receiverUser = await User.findById(receiverId);
    if (receiverUser.socketId) { io.to(receiverUser.socketId).emit("friend-request-received", populated); }
    res.status(201).json(populated);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: "Friend request already sent" });
    res.status(500).json({ message: error.message });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ message: "Friend request not found" });
    if (request.receiver.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not authorized" });
    request.status = "accepted";
    await request.save();
    await User.findByIdAndUpdate(request.sender, { $addToSet: { friends: request.receiver } });
    await User.findByIdAndUpdate(request.receiver, { $addToSet: { friends: request.sender } });
    const io = req.app.get("io");
    const senderUser = await User.findById(request.sender);
    if (senderUser.socketId) { io.to(senderUser.socketId).emit("friend-request-accepted", { requestId: request._id, user: req.user }); }
    res.json({ message: "Friend request accepted", request });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const rejectFriendRequest = async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ message: "Friend request not found" });
    if (request.receiver.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not authorized" });
    request.status = "rejected";
    await request.save();
    res.json({ message: "Friend request rejected" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getReceivedRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({ receiver: req.user._id, status: "pending" }).populate("sender", "fullName email avatar about").sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getSentRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({ sender: req.user._id, status: "pending" }).populate("receiver", "fullName email avatar about").sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user._id;
    await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });
    await FriendRequest.findOneAndDelete({ $or: [{ sender: userId, receiver: friendId }, { sender: friendId, receiver: userId }] });
    res.json({ message: "Friend removed successfully" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getReceivedRequests, getSentRequests, removeFriend };