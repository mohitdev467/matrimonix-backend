const { generateAccessToken } = require("../../helpers/authHelpers");
const upload = require("../../helpers/imageUploadHelper");
const UserSchema = require("../../models/adminModel/UserSchema");
const bcrypt = require("bcrypt");

module.exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ],
    };

    const users = await UserSchema.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await UserSchema.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total: total,
        page: parseInt(page),
        pageSize: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error fetching users", error });
  }
};

module.exports.addUser = async (req, res) => {
  try {
    const { email, password = "123456", confirmPassword = "123456" } = req.body;
    const existingUser = await UserSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedConfirmPassword = await bcrypt.hash(confirmPassword, salt);

    const newUser = new UserSchema({
      ...req.body,
      password: hashedPassword,
      confirmPassword: hashedConfirmPassword,
    });
    await newUser.save();

    const accessToken = await generateAccessToken({
      id: newUser._id,
      email: newUser.email,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
      accessToken: accessToken,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: err });
  }
};

// Change user status

module.exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await UserSchema.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: err });
  }
};

module.exports.changeUserStatus = async (req, res) => {
  try {
    const User = await UserSchema.findById(req.params.id);
    if (!User)
      return res.status(404).json({ success: false, error: "User not found" });

    User.isActive = !User.isActive;
    await User.save();

    res.status(200).json({
      success: true,
      message: `User ${
        Manglik.isActive ? "activated" : "deactivated"
      } successfully`,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", error: err });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserSchema.findById({ _id: id });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error fetching user", error });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await UserSchema.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ success: false, error: "User not found" });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      Manglik: updatedUser,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", error: err });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await UserSchema.findOne({ email });
    if (!userData) {
      return res.status(404).json({
        message: "User not found with the given credentials",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, userData.password);

    if (!isPasswordMatch) {
      return res.status(404).json({
        message: "Password does not match",
        success: false,
      });
    }

    const accessToken = await generateAccessToken(userData);

    res.status(200).json({
      success: true,
      message: "User login successfully",
      accessToken: accessToken,
      data: userData,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      error: error,
      message: "Internal Server Error",
    });
  }
};

module.exports.getRecentUsers = async (req, res) => {
  try {
    const userEmail = req.query.email;

    const recentUsers = await UserSchema.find({ email: { $ne: userEmail } })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      message: "Recently joined users fetched successfully",
      data: recentUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
