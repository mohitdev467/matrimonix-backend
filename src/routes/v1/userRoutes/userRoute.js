const express = require("express");
const {
  loginUser,
  getRecentUsers,
} = require("../../../controllers/AdminController/userController");
const { authMiddleware } = require("../../../middlewares/tokenVerification");
const {
  sendMessage,
  getMessages,
  getConversations,
} = require("../../../controllers/MessageController/MessageController");

const userRoute = express.Router();

userRoute.post("/login", loginUser);
userRoute.get("/recent-users", authMiddleware, getRecentUsers);
// chatss
userRoute.post("/send/:id", authMiddleware, sendMessage);
userRoute.post("/messages/:id", authMiddleware, getMessages);
userRoute.get("/conversations/:userId", authMiddleware, getConversations);

module.exports = userRoute;
