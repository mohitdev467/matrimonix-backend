const express = require("express");

const {
  createAdmin,
  loginAdmin,
} = require("../../../controllers/AdminController/adminController");

const adminRoute = express.Router();

adminRoute.post("/create", createAdmin);
adminRoute.post("/login", loginAdmin);

module.exports = adminRoute;
