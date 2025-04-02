const express = require("express");
const {
  loginUser,
  getRecentUsers,
} = require("../../../controllers/AdminController/userController");
const { authMiddleware } = require("../../../middlewares/tokenVerification");
const {
  getAllConversations,
  getAllMessages,
  sendMessages,
} = require("../../../controllers/MessageController/MessageController");

const userRoute = express.Router();

userRoute.post("/login", loginUser);
userRoute.get("/recent-users", authMiddleware, getRecentUsers);
// chatss

userRoute.get("/conversations/:userId", getAllConversations);
userRoute.post("/conversations", getAllConversations);
userRoute.get("/messages/:conversationId", getAllMessages);
userRoute.post("/messages", sendMessages);

module.exports = userRoute;
