const express = require("express");
const router = express.Router();
const { getMessages, sendMessage, markAsRead, reactToMessage, deleteMessage } = require("../controllers/messageController");
const { protect } = require("../middleware/auth");

router.get(":userId", protect, getMessages);
router.post("/", protect, sendMessage);
router.put("/read/:userId", protect, markAsRead);
router.put("/react/:messageId", protect, reactToMessage);
router.delete(":messageId", protect, deleteMessage);

module.exports = router;