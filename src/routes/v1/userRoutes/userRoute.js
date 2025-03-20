const express = require("express");
const {
  loginUser,
} = require("../../../controllers/AdminController/userController");

const userRoute = express.Router();

userRoute.post("/login", loginUser);

module.exports = userRoute;
