const { default: mongoose } = require("mongoose");
const { generateAccessToken } = require("../../helpers/authHelpers");
const upload = require("../../helpers/imageUploadHelper");
const Shortlist = require("../../models/adminModel/Shortlist");
const UserSchema = require("../../models/adminModel/UserSchema");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

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
    const deletedUser = await UserSchema.findByIdAndDelete(req.params.userId);

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
        User.isActive ? "activated" : "deactivated"
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
    const { userId } = req.params;
    const user = await UserSchema.findById({ _id: userId });
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
      { _id: req.params.userId },
      { ...req.body },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ success: false, error: "User not found" });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
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

module.exports.getMatchesUsers = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Valid User ID is required",
      });
    }

    const loggedInUser = await UserSchema.findById(userId);
    if (!loggedInUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const gender = loggedInUser.gender?.toLowerCase();
    const oppositeGender = gender === "male" ? "female" : "male";

    const parseArray = (str) =>
      str && typeof str === "string"
        ? str.split(",").map((s) => s.trim().toLowerCase())
        : [];

    const userHobbies = parseArray(loggedInUser.hobbies);
    const userInterests = parseArray(loggedInUser.interests);
    const userCity = loggedInUser.city?.toLowerCase().trim();
    const userState = loggedInUser.state?.toLowerCase().trim();

    const oppositeGenderUsers = await UserSchema.find({
      gender: oppositeGender,
      isActive: true,
      _id: { $ne: loggedInUser._id },
    }).select("-password -confirmPassword");

    const matchedUsers = oppositeGenderUsers.map((user) => {
      let matchScore = 0;
      let totalCriteria = 0;

      const matchArray = (arr1, arr2) =>
        arr1.filter((item) => arr2.includes(item)).length > 0;

      const checkMatch = (a, b) =>
        a && b && a.toLowerCase() === b.toLowerCase();

      const hobbies = parseArray(user.hobbies);
      const interests = parseArray(user.interests);

      if (userHobbies.length && hobbies.length) {
        totalCriteria++;
        if (matchArray(userHobbies, hobbies)) matchScore++;
      }

      if (userInterests.length && interests.length) {
        totalCriteria++;
        if (matchArray(userInterests, interests)) matchScore++;
      }

      if (userCity && user.city) {
        totalCriteria++;
        if (checkMatch(userCity, user.city)) matchScore++;
      }

      if (userState && user.state) {
        totalCriteria++;
        if (checkMatch(userState, user.state)) matchScore++;
      }

      const matchPercentage =
        totalCriteria > 0 ? Math.round((matchScore / totalCriteria) * 100) : 0;

      return {
        ...user.toObject(),
        matchPercentage,
      };
    });

    matchedUsers.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.status(200).json({ success: true, data: matchedUsers });
  } catch (error) {
    console.error("Error in getMatchesUsers:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports.handleShortlistUser = async (req, res) => {
  try {
    const { userId, addedBy } = req.body;

    const existingShortlist = await Shortlist.findOne({ userId, addedBy });

    if (existingShortlist) {
      await Shortlist.deleteOne({ userId, addedBy });

      return res.status(200).json({
        success: true,
        isShortlist: false,
        message: "User removed from shortlist",
      });
    }

    const newShortlist = new Shortlist({ userId, addedBy });
    await newShortlist.save();

    return res.status(201).json({
      success: true,
      isShortlist: true,
      message: "User shortlisted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error,
    });
  }
};

module.exports.getShortlistedUsers = async (req, res) => {
  try {
    const loggedInUserId = req.params.id;

    if (!loggedInUserId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const shortlistedProfiles = await Shortlist.aggregate([
      {
        $match: { addedBy: new mongoose.Types.ObjectId(loggedInUserId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 1,
          "userDetails.name": 1,
          "userDetails.email": 1,
          "userDetails.phone_no": 1,
          "userDetails.occupation": 1,
          "userDetails.image": 1,
          userId: 1,
          addedBy: 1,
          createdAt: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data: shortlistedProfiles });
  } catch (error) {
    console.error("Error fetching shortlisted users:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

module.exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserSchema.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset token generated successfully",
      resetToken: resetToken,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await UserSchema.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};
