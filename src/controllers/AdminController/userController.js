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

module.exports.addUser = [
  upload.single("user_avtar"),
  async (req, res) => {
    try {
      const { password, ...userData } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = new UserSchema({
        ...userData,
        password: hashedPassword,
        user_avtar: req.file ? req.file.path : "",
      });
      await user.save();
      res
        .status(201)
        .json({ success: true, message: "User added successfully", user });
    } catch (error) {
      res
        .status(400)
        .json({ success: false, message: "Error adding user", error });
    }
  },
];

// Change user status
module.exports.changeUserStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;
    const user = await UserSchema.findByIdAndUpdate(
      userId,
      { status: status },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      user,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error updating user status", error });
  }
};

// Delete user
module.exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserSchema.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error deleting user", error });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserSchema.findById(userId);
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

module.exports.updateUser = [
  upload.single("user_avtar"),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { password, ...userData } = req.body;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(password, salt);
      }
      if (req.file) {
        userData.user_avtar = req.file.path;
      }
      const user = await UserSchema.findByIdAndUpdate(userId, userData, {
        new: true,
      });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      res
        .status(200)
        .json({ success: true, message: "User updated successfully", user });
    } catch (error) {
      res
        .status(400)
        .json({ success: false, message: "Error updating user", error });
    }
  },
];
