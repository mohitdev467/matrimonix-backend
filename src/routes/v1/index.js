const express = require("express");
const adminRoute = require("./adminRoutes/adminRoute");

const router = express.Router();

router.use("/admin", adminRoute);

module.exports = router;
