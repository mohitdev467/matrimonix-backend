const express = require("express");

const {
  createAdmin,
  loginAdmin,
  updateAdminProfile,
  getAdminDetails,
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
const {
  createServiceProvider,
  getServiceProviders,
  updateServiceProvider,
  deleteServiceProvider,
  getServiceProviderById,
} = require("../../../controllers/ServiceProviderController/ServiceProviderController");
const {
  createPackages,
  getPackages,
  updatePackages,
  deletePackages,
  togglePackageStatus,
} = require("../../../controllers/PackagesController/PackagesController");
const {
  getDashboardData,
  getUserStats,
  getEntities,
} = require("../../../controllers/CommonController/commonController");
const {
  getNews,
  getNewsById,
  addNews,
  updateNews,
  toggleNewsStatus,
  deleteNews,
} = require("../../../controllers/NewsController/NewsController");
const uploadImage = require("../../../controllers/ImageController/ImageController");
const { getAllPaymentHistory, deletePaymentHistory } = require("../../../controllers/PaymentController/PaymentController");
const { createTestimonial, getAllTestimonials, getTestimonialById, updateTestimonial, deleteTestimonial } = require("../../../controllers/TestimonialController/TestimonialController");
const { createCity, getCities, updateCity, deleteCity, seedCities } = require("../../../controllers/CitiesController/CitiesController");
const { createState, getStates, updateState, deleteState, seedStates } = require("../../../controllers/StateController/StateController");
const { createSupportRequest, getAllSupportRequests, getSupportRequestById, updateSupportRequest, deleteSupportRequest, toggleSupportRequestStatus } = require("../../../controllers/SupportRequestController/SupportRequestController");
const { addContactDetails, getContactDetails } = require("../../../controllers/ContactDetailsController/contactDetailsController");
const { createReligion, getAllReligions, updateReligion, toggleReligionStatus, deleteReligion } = require("../../../controllers/ReligionController/ReligionController");
const { createDeleteRequest, getAllDeleteRequests, getDeleteRequestById, updateDeleteRequest, deleteRequest } = require("../../../controllers/DeleteRequestController/DeleteRequestController");
const adminRoute = express.Router();

adminRoute.post("/create", createAdmin);
adminRoute.post("/login", loginAdmin);
adminRoute.get(
  "/admin-details",
  authMiddleware,
  authorizeRole(["admin"]),
  getAdminDetails
);
adminRoute.post(
  "/update/:adminId",
  authMiddleware,
  authorizeRole(["admin"]),
  updateAdminProfile
);

// Religion
adminRoute.post(
  "/religion",
  authMiddleware,
  authorizeRole(["admin"]),
  createReligion
);
adminRoute.get(
  "/religion",
  // authMiddleware,
  // authorizeRole(["admin"]),
  getAllReligions
);
adminRoute.put(
  "/religion/:id",
  authMiddleware,
  authorizeRole(["admin"]),
  updateReligion
);
adminRoute.patch(
  "/religion/:id/status",
  authMiddleware,
  authorizeRole(["admin"]),
  toggleReligionStatus
);
adminRoute.delete(
  "/religion/:id",
  authMiddleware,
  authorizeRole(["admin"]),
  deleteReligion
);


// Caste Routes
adminRoute.post(
  "/caste",
  authMiddleware,
  authorizeRole(["admin"]),
  createCaste
);
adminRoute.get(
  "/caste",
  // authMiddleware,
  // authorizeRole(["admin"]),
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
adminRoute.get("/users", authMiddleware, userController.getUsers);
adminRoute.get(
  "/matched/user/:userId",
  authMiddleware,
  userController.getMatchesUsers
);
adminRoute.post("/add-user", userController.addUser);
adminRoute.post("/add/bulk-user", userController.bulkAddUsers);

adminRoute.get("/users/:userId", userController.getUserById);
adminRoute.patch(
  "/users/:userId/status",
  authMiddleware,
  userController.changeUserStatus
);
adminRoute.delete("/users/:userId", authMiddleware, userController.deleteUser);
adminRoute.put("/users/:userId", authMiddleware, userController.updateUser);

adminRoute.post("/request-password-reset", userController.requestPasswordReset);
adminRoute.post("/reset-password/:token", userController.resetPassword);
// Common API

adminRoute.get(
  "/dashboard",
  authMiddleware,
  authorizeRole(["admin"]),
  getDashboardData
);
adminRoute.get("/stats-data/:userId", authMiddleware, getUserStats);
adminRoute.get("/entities", authMiddleware, getEntities);

adminRoute.post(
  "/shortlisted",
  authMiddleware,
  userController.handleShortlistUser
);
adminRoute.get(
  "/shortlisted/:id",
  authMiddleware,
  userController.getShortlistedUsers
);

adminRoute.post("/upload", uploadMiddleware.single("file"), uploadImage);

// Category Apis

adminRoute.get(
  "/categories",
  authMiddleware,
  authorizeRole(["admin"]),
  categoryController.getCategories
);
adminRoute.get(
  "/categories/:categoryId",
  authMiddleware,
  authorizeRole(["admin"]),
  categoryController.getCategoryById
);
adminRoute.post(
  "/categories",
  authMiddleware,
  authorizeRole(["admin"]),
  categoryController.addCategory
);
adminRoute.put(
  "/categories/:categoryId",
  authMiddleware,
  authorizeRole(["admin"]),
  categoryController.updateCategory
);
adminRoute.patch(
  "/categories/:categoryId/status",
  authMiddleware,
  authorizeRole(["admin"]),
  categoryController.toggleCategoryStatus
);
adminRoute.delete(
  "/categories/:categoryId",
  authMiddleware,
  authorizeRole(["admin"]),
  categoryController.deleteCategory
);

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
  // authMiddleware,
  // authorizeRole(["admin"]),
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
  // authMiddleware,
  // authorizeRole(["admin"]),
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

// Service Providers routes
adminRoute.post(
  "/service-providers",
  authMiddleware,
  authorizeRole(["admin"]),
  createServiceProvider
);
adminRoute.get("/service-providers", authMiddleware, getServiceProviders);
adminRoute.get(
  "/service-providers/:id",
  authMiddleware,
  getServiceProviderById
);

adminRoute.put(
  "/service-providers/:id",
  authMiddleware,
  authorizeRole(["admin"]),
  updateServiceProvider
);
adminRoute.delete(
  "/service-providers/:id",
  authMiddleware,
  authorizeRole(["admin"]),
  deleteServiceProvider
);

// Service Providers routes
adminRoute.post(
  "/packages",
  authMiddleware,
  authorizeRole(["admin"]),
  createPackages
);
adminRoute.get(
  "/packages",
  //  authMiddleware,
  getPackages
);
adminRoute.put(
  "/packages/:id",
  authMiddleware,
  authorizeRole(["admin"]),
  updatePackages
);
adminRoute.delete(
  "/packages/:id",
  authMiddleware,
  authorizeRole(["admin"]),
  deletePackages
);
adminRoute.patch(
  "/packages/:id/status",
  authMiddleware,
  authorizeRole(["admin"]),
  togglePackageStatus
);

// News APIS

adminRoute.get("/news", authMiddleware, getNews);
adminRoute.get("/news/:newsId", authMiddleware, getNewsById);
adminRoute.post("/news", authMiddleware, authorizeRole(["admin"]), addNews);
adminRoute.put(
  "/news/:newsId",
  authMiddleware,
  authorizeRole(["admin"]),
  updateNews
);
adminRoute.patch(
  "/news/:newsId/status",
  authMiddleware,
  authorizeRole(["admin"]),
  toggleNewsStatus
);
adminRoute.delete(
  "/news/:newsId",
  authMiddleware,
  authorizeRole(["admin"]),
  deleteNews
);

// Payments History
adminRoute.get(
  "/payment/history",
  authMiddleware,
  authorizeRole(["admin"]),
  getAllPaymentHistory
);
adminRoute.delete(
  "/payment/history/:id",
  authMiddleware,
  authorizeRole(["admin"]),
  deletePaymentHistory
);

// Testimonials

adminRoute.post("/testimonials", createTestimonial);
adminRoute.get("/testimonials", getAllTestimonials);
adminRoute.get("/testimonials/:id", getTestimonialById);
adminRoute.put(
  "/testimonials/:id",
  authMiddleware,
  authorizeRole(["admin"]),
  updateTestimonial
);
adminRoute.delete(
  "/testimonials/:id",
  authMiddleware,
  authorizeRole(["admin"]),
  deleteTestimonial
);

// Cities

adminRoute.post(
  "/cities",
  authMiddleware,
  authorizeRole(["admin"]),
  createCity
);
adminRoute.get("/cities", getCities);
adminRoute.put(
  "/cities/:id",
  authMiddleware,
  authorizeRole(["admin"]),
  updateCity
);
adminRoute.delete(
  "/cities/:id",
  authMiddleware,
  authorizeRole(["admin"]),
  deleteCity
);

// Cities

adminRoute.post('/states',authMiddleware,authorizeRole(["admin"]), createState);
adminRoute.get('/states', getStates);
adminRoute.put('/states/:id',authMiddleware,authorizeRole(["admin"]), updateState);
adminRoute.delete('/states/:id', authMiddleware,authorizeRole(["admin"]),deleteState);


// Support Request Schema

adminRoute.post("/support-request", createSupportRequest);
adminRoute.get("/support-request", authMiddleware,authorizeRole(["admin"]),getAllSupportRequests);
adminRoute.get("/support-request/:id",authMiddleware,authorizeRole(["admin"]), getSupportRequestById);
adminRoute.put("/support-request/:id", updateSupportRequest);
adminRoute.delete("/support-request/:id",authMiddleware,authorizeRole(["admin"]), deleteSupportRequest);


// Delete Request Schema

adminRoute.post("/delete-request", createDeleteRequest);
adminRoute.get("/delete-request", authMiddleware,authorizeRole(["admin"]),getAllDeleteRequests);
adminRoute.get("/delete-request/:id",authMiddleware,authorizeRole(["admin"]), getDeleteRequestById);
adminRoute.put("/delete-request/:id", authMiddleware,authorizeRole(["admin"]),updateDeleteRequest);
adminRoute.delete("/delete-request/:id",authMiddleware,authorizeRole(["admin"]), deleteRequest);



// conatctDetails
adminRoute.post(
  "/contact-details",
  // authMiddleware,  
  // authorizeRole(["admin"]),
  addContactDetails
);
adminRoute.get("/contact-details", getContactDetails);
module.exports = adminRoute;
