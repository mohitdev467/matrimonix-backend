const express = require("express");
const cors = require("cors");
const routes = require("./routes/v1");
const cookieParser = require("cookie-parser");
const fs = require("fs");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.options("*", cors());
app.use(cookieParser());
const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use("/api/v1", routes);

module.exports = app;
