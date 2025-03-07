const jwt = require("jsonwebtoken");

const generateAccessToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      password: admin.password,
      role: admin.role,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "12h",
    }
  );
};

const generateRefreshToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      password: admin.password,
      role: admin.role,
    },
    process.env.JWT_SECRET_KEY_REFRESH_TOKEN,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
