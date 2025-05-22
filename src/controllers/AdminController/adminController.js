const bcrypt = require("bcrypt");
const Admin = require("../../models/adminModel/Admin");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../helpers/authHelpers");

const createAdmin = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
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
      avatar: avatar,
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
      success: false,
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
    await adminData.save({ validateBeforeSave: false });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: "User login successfully",
      accessToken: accessToken,
      user: {
        name: adminData.name,
        email: adminData.email,
        role: adminData.role,
      },
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      error: error,
      message: "Internal Server Error",
    });
  }
};

const updateAdminProfile = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { name, email, password, avatar } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (email && email !== admin.email) {
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use",
        });
      }
      admin.email = email;
    }

    if (name) admin.name = name;
    if (avatar) admin.avatar = avatar;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
    }

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        name: admin.name,
        email: admin.email,
        avatar: admin.avatar,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

const getAdminDetails = async (req, res) => {
  try {
    const adminData = await Admin.find();
    if (!adminData) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.status(200).json({
      success: true,
      data: adminData,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error fetching admin", error });
  }
};

module.exports = {
  createAdmin,
  loginAdmin,
  updateAdminProfile,
  getAdminDetails,
};
