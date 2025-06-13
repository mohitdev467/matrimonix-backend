const express = require("express");
const cors = require("cors");
const routes = require("./routes/v1");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
// Set view engine
app.set('view engine', 'ejs');

// Set views directory
app.set('views', path.join(__dirname, 'views'));

// Serve static files (if any CSS/JS/image assets are needed)
app.use(express.static(path.join(__dirname, 'public')));

// // Route
// app.get('/refund-policy', (req, res) => {
//   console.log("Refund policy page accessed");
//   res.render('refund-policy', {}, (err, html) => {
//     if (err) {
//       console.error("Error rendering EJS:", err);
//       return res.status(500).send("Error rendering page");
//     }
//     res.send(html);
//   });

// });
// app.get('/privacy-policy', (req, res) => {
//   console.log("Privacy policy page accessed");
//   res.render('privacy-policy', {}, (err, html) => {
//     if (err) {
//       console.error("Error rendering EJS:", err);
//       return res.status(500).send("Error rendering page");
//     }
//     res.send(html);
//   });
// });
// app.get('/terms-conditions', (req, res) => {
//   console.log("Terms and conditions page accessed");
//   res.render('terms-conditions', {}, (err, html) => {
//     if (err) {
//       console.error("Error rendering EJS:", err);
//       return res.status(500).send("Error rendering page");
//     }
//     res.send(html);
//   });
// });
app.options("*", cors());
app.use(cookieParser());
const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use("/api/v1", routes);

module.exports = app;
