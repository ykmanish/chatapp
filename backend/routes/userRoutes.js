const express = require("express");
const router = express.Router();
const { searchUsers, getFriends, getOnlineFriends, getChatList, togglePinChat, getPinnedChats } = require("../controllers/userController");
const { protect } = require("../middleware/auth");

router.get("/search", protect, searchUsers);
router.get("/friends", protect, getFriends);
router.get("/online-friends", protect, getOnlineFriends);
router.get("/chats", protect, getChatList);
router.put("/pin/:userId", protect, togglePinChat);
router.get("/pinned", protect, getPinnedChats);

module.exports = router;