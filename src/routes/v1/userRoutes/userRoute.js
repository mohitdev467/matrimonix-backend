const express = require("express");
const {
  loginUser,
  getRecentUsers,
  savePaymentHistory,
  filterUsers,
  getPaymentHistory,
  getUserById
} = require("../../../controllers/AdminController/userController");
const { authMiddleware } = require("../../../middlewares/tokenVerification");
const {
  getAllConversations,
  getAllMessages,
  sendMessages,
} = require("../../../controllers/MessageController/MessageController");
const { createNewOrder, checkPaymentStatus, deleteUserPaymentHistory } = require("../../../controllers/PaymentController/PaymentController");
const { generateVideoCallToken } = require("../../../controllers/videoCallController/videoCallController");

const userRoute = express.Router();

userRoute.post("/login", loginUser);
userRoute.get("/recent-users", authMiddleware, getRecentUsers);
// chatss

userRoute.get("/conversations/:userId", getAllConversations);
userRoute.post("/conversations", getAllConversations);
userRoute.get("/messages/:conversationId", getAllMessages);
userRoute.post("/messages", sendMessages);


userRoute.get('/filter-users', filterUsers);
userRoute.get('/user/:userId', getUserById);
userRoute.post("/order", createNewOrder);
userRoute.get("/status/:orderid", checkPaymentStatus);
userRoute.get("/payment/history/:userId", getPaymentHistory);
userRoute.delete("/payment/history/:userId/:paymentId", deleteUserPaymentHistory);

userRoute.post('/video-call/token', generateVideoCallToken);


module.exports = userRoute;
