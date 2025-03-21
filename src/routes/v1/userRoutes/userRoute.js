const express = require("express");
const {
  loginUser,
  getRecentUsers,
} = require("../../../controllers/AdminController/userController");
const { authMiddleware } = require("../../../middlewares/tokenVerification");

const userRoute = express.Router();

userRoute.post("/login", loginUser);
userRoute.get("/recent-users", authMiddleware, getRecentUsers);

module.exports = userRoute;
