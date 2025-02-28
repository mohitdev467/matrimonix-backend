const express = require("express");
const userRoute = require("./userRoutes/userRoute");
const adminRoute = require("./adminRoutes/adminRoute");

const router = express.Router();

router.use("/user", userRoute);
router.use("/admin", adminRoute);

module.exports = router;
