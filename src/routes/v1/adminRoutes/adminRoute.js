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
const {
  createIncome,
  getAllIncomes,
  toggleIncomeStatus,
  updateIncome,
  deleteIncome,
} = require("../../../controllers/IncomeController/IncomeController");
const upload = require("../../../helpers/imageUploadHelper");

const uploadMiddleware = require("../../../helpers/imageUploadHelper");
const {
  createLanguage,
  getAllLanguages,
  updateLanguage,
  toggleLanguageStatus,
  deleteLanguage,
} = require("../../../controllers/LanguageController/LanguageController");

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
adminRoute.post(
  "/categories",
  uploadMiddleware.single("image"),
  categoryController.addCategory
);
adminRoute.put(
  "/categories/:categoryId",
  uploadMiddleware.single("image"),
  categoryController.updateCategory
);
adminRoute.patch(
  "/categories/:categoryId/status",
  categoryController.toggleCategoryStatus
);
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

// INcome Route

adminRoute.post(
  "/income",
  authMiddleware,
  authorizeRole(["admin"]),
  createIncome
);
adminRoute.get(
  "/income",
  authMiddleware,
  authorizeRole(["admin"]),
  getAllIncomes
);
adminRoute.put(
  "/income/:id",
  authMiddleware,
  authorizeRole(["admin"]),
  updateIncome
);
adminRoute.patch(
  "/income/:id/status",
  authMiddleware,
  authorizeRole(["admin"]),
  toggleIncomeStatus
);
adminRoute.delete(
  "/income/:id",
  authMiddleware,
  authorizeRole(["admin"]),
  deleteIncome
);

// Language Route

adminRoute.post(
  "/language",
  authMiddleware,
  authorizeRole(["admin"]),
  createLanguage
);
adminRoute.get(
  "/language",
  authMiddleware,
  authorizeRole(["admin"]),
  getAllLanguages
);
adminRoute.put(
  "/language/:id",
  authMiddleware,
  authorizeRole(["admin"]),
  updateLanguage
);
adminRoute.patch(
  "/language/:id/status",
  authMiddleware,
  authorizeRole(["admin"]),
  toggleLanguageStatus
);
adminRoute.delete(
  "/language/:id",
  authMiddleware,
  authorizeRole(["admin"]),
  deleteLanguage
);

module.exports = adminRoute;
