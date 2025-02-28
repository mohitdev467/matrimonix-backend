const express = require("express");

const {
  createAdmin,
  loginAdmin,
} = require("../../../controllers/AdminController/adminController");
const {
  createCaste,
  getAllCastes,
  updateCaste,
  toggleCasteStatus,
} = require("../../../controllers/CasteController/casteController");
const {
  authMiddleware,
  authorizeRole,
} = require("../../../middlewares/tokenVerification");

const userController=require("../../../controllers/AdminController/userController")
const adminRoute = express.Router();

adminRoute.post("/create", createAdmin);
adminRoute.post("/login", loginAdmin);

// Caste Routes
adminRoute.post(
  "/caste",
  authMiddleware,
  authorizeRole(["admin"]),
  createCaste
);
adminRoute.get(
  "/caste",
  authMiddleware,
  authorizeRole(["admin"]),
  getAllCastes
);
adminRoute.put(
  "/caste/:id",
  authMiddleware,
  authorizeRole(["admin"]),
  updateCaste
);
adminRoute.patch(
  "/caste/:id/status",
  authMiddleware,
  authorizeRole(["admin"]),
  toggleCasteStatus
);

// User Apis 
adminRoute.get("/users",userController.getUsers);
adminRoute.post("/add-user", userController.addUser);
adminRoute.put('/users/status', userController.changeUserStatus);
adminRoute.delete('/users/:userId', userController.deleteUser);

module.exports = adminRoute;
