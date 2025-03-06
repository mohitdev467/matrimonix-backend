const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel/Admin");
const dotenv = require("../config/dotenv");

dotenv();

const accessTokenSecret = process.env.JWT_SECRET_KEY;
const refreshTokenSecret = process.env.JWT_SECRET_KEY_REFRESH_TOKEN;

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }
  try {
    const token = jwt.verify(
      authHeader.replace("Bearer ", ""),
      process.env.JWT_SECRET_KEY
    );
    req.admin = token;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log("errorrrr", req.cookies);
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken)
        return res.status(403).json({ error: "Refresh token required" });

      try {
        const decodedRefresh = jwt.verify(refreshToken, refreshTokenSecret);
        const admin = await Admin.findById(decodedRefresh.id);

        if (!admin) {
          return res.status(403).json({ error: "Invalid refresh token" });
        }

        if (!admin || admin.refreshToken !== refreshToken) {
          return res.status(403).json({ error: "Invalid refresh token" });
        }

        const newAccessToken = jwt.sign(
          { id: admin._id, email: admin.email },
          accessTokenSecret,
          {
            expiresIn: "12h",
          }
        );
        if (!admin.refreshToken) {
          admin.refreshToken = refreshToken;
          await admin.save();
        }

        res.setHeader("Authorization", `Bearer ${newAccessToken}`);
        req.admin = decodedRefresh;
        next();
      } catch (refreshError) {
        console.log("refresh erorrr", refreshError);
        return res.status(403).json({ error: "Invalid refresh token" });
      }
    } else {
      return res.status(403).json({ error: "Invalid token" });
    }
  }
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ error: "Access denied." });
    }
    next();
  };
};

module.exports = { authMiddleware, authorizeRole };
