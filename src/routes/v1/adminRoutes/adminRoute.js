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
const categoryController = require("../../../controllers/CategoryController/categoryController");
const userController = require("../../../controllers/AdminController/userController");
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
adminRoute.get("/users", userController.getUsers);
adminRoute.post("/add-user", userController.addUser);
adminRoute.put("/users/status", userController.changeUserStatus);
adminRoute.delete("/users/:userId", userController.deleteUser);
adminRoute.put("/update-user/:userId", userController.updateUser);

adminRoute.get("/categories", categoryController.getCategories);
adminRoute.get("/categories/:categoryId", categoryController.getCategoryById);
adminRoute.post("/categories", categoryController.addCategory);
adminRoute.put("/categories/:categoryId", categoryController.updateCategory);
adminRoute.delete("/categories/:categoryId", categoryController.deleteCategory);

module.exports = adminRoute;
