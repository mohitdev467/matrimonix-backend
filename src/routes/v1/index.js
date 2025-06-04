const express = require("express");
const adminRoute = require("./adminRoutes/adminRoute");
const userRoute = require("./userRoutes/userRoute");
const viewRoutes = require('./view.routes');

const router = express.Router();

router.use("/admin", adminRoute);
router.use("/user", userRoute);
router.use('/views', viewRoutes);


module.exports = router;
