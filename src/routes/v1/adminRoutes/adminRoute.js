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
  deleteCaste,
} = require("../../../controllers/CasteController/casteController");
const {
  authMiddleware,
  authorizeRole,
} = require("../../../middlewares/tokenVerification");
const categoryController = require("../../../controllers/CategoryController/categoryController");
const userController = require("../../../controllers/AdminController/userController");
const {
  createManglik,
  getAllMangliks,
  updateManglik,
  toggleManglikStatus,
  deleteManglik,
} = require("../../../controllers/ManglikController/ManglikController");
const {
  createOccupation,
  getAllOccupations,
  updateOccupation,
  toggleOccupationStatus,
  deleteOccupation,
} = require("../../../controllers/OccupationController/OccupationController");
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
adminRoute.delete(
  "/caste/:id",
  authMiddleware,
  authorizeRole(["admin"]),
  deleteCaste
);

// User Apis
adminRoute.get("/users", userController.getUsers);
adminRoute.post("/add-user", userController.addUser);
adminRoute.put("/users/status", userController.changeUserStatus);
adminRoute.delete("/users/:userId", userController.deleteUser);
adminRoute.put("/update-user/:userId", userController.updateUser);

// Category Apis

adminRoute.get("/categories", categoryController.getCategories);
adminRoute.get("/categories/:categoryId", categoryController.getCategoryById);
adminRoute.post("/categories", categoryController.addCategory);
adminRoute.put("/categories/:categoryId", categoryController.updateCategory);
adminRoute.delete("/categories/:categoryId", categoryController.deleteCategory);

// Manglik Routes

adminRoute.post(
  "/manglik",
  authMiddleware,
  authorizeRole(["admin"]),
  createManglik
);
adminRoute.get(
  "/manglik",
  authMiddleware,
  authorizeRole(["admin"]),
  getAllMangliks
);
adminRoute.put(
  "/manglik/:id",
  authMiddleware,
  authorizeRole(["admin"]),
  updateManglik
);
adminRoute.patch(
  "/manglik/:id/status",
  authMiddleware,
  authorizeRole(["admin"]),
  toggleManglikStatus
);
adminRoute.delete(
  "/manglik/:id",
  authMiddleware,
  authorizeRole(["admin"]),
  deleteManglik
);

// Occcupation Routes

adminRoute.post(
  "/occupation",
  authMiddleware,
  authorizeRole(["admin"]),
  createOccupation
);
adminRoute.get(
  "/occupation",
  authMiddleware,
  authorizeRole(["admin"]),
  getAllOccupations
);
adminRoute.put(
  "/occupation/:id",
  authMiddleware,
  authorizeRole(["admin"]),
  updateOccupation
);
adminRoute.patch(
  "/occupation/:id/status",
  authMiddleware,
  authorizeRole(["admin"]),
  toggleOccupationStatus
);
adminRoute.delete(
  "/occupation/:id",
  authMiddleware,
  authorizeRole(["admin"]),
  deleteOccupation
);

module.exports = adminRoute;
