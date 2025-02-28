const bcrypt = require("bcrypt");
const Admin = require("../../models/adminModel/Admin");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../helpers/authHelpers");

const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exisitingAdmin = await Admin.findOne({
      $or: [{ email }],
    });
    if (exisitingAdmin) {
      return res.status(404).send({
        success: false,
        message: "Admin already exist",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newData = await new Admin({
      name: name,
      email: email,
      password: hashedPassword,
      role: "admin",
    });

    await newData.save();

    if (!newData) {
      return res.status(404).send({
        message: "Admin creation failed",
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin Created successfully",
      userData: newData,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
      message: "Internal Server Error",
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminData = await Admin.findOne({ email });
    if (!adminData) {
      return res.status(404).json({
        message: "Admin not found with the given credentials",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, adminData.password);

    if (!isPasswordMatch) {
      return res.status(404).json({
        message: "Password does not match",
        success: false,
      });
    }

    const accessToken = await generateAccessToken(adminData);
    const refreshToken = await generateRefreshToken(adminData);
    adminData.refreshToken = refreshToken;
    await adminData.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({
      message: "User login successfully",
      accessToken: accessToken,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
      message: "Internal Server Error",
    });
  }
};

module.exports = { createAdmin, loginAdmin };
