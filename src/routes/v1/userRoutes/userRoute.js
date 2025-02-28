const express = require("express");
const {
  getUsers,
} = require("../../../controllers/UserController/userController");
const {
  authMiddleware,
  authorizeRole,
} = require("../../../middlewares/tokenVerification");

const userRoute = express.Router();

userRoute.get("/", authMiddleware, authorizeRole(["admin"]), getUsers);

module.exports = userRoute;
