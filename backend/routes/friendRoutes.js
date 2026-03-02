const express = require("express");
const router = express.Router();
const { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getReceivedRequests, getSentRequests, removeFriend } = require("../controllers/friendController");
const { protect } = require("../middleware/auth");

router.post("/request", protect, sendFriendRequest);
router.put("/accept/:requestId", protect, acceptFriendRequest);
router.put("/reject/:requestId", protect, rejectFriendRequest);
router.get("/requests/received", protect, getReceivedRequests);
router.get("/requests/sent", protect, getSentRequests);
router.delete("/remove/:friendId", protect, removeFriend);

module.exports = router;