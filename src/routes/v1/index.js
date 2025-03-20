const express = require("express");
const adminRoute = require("./adminRoutes/adminRoute");
const userRoute = require("./userRoutes/userRoute");

const router = express.Router();

router.use("/admin", adminRoute);
router.use("/user", userRoute);

module.exports = router;
