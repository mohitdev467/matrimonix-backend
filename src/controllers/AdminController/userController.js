const { default: mongoose } = require("mongoose");
const { generateAccessToken } = require("../../helpers/authHelpers");
const upload = require("../../helpers/imageUploadHelper");
const Shortlist = require("../../models/adminModel/Shortlist");
const UserSchema = require("../../models/adminModel/UserSchema");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const PaymentHistory = require("../../models/adminModel/PaymentHistory");
const { calculateAge } = require("../../utils/commonUtils");

module.exports.getUsers = async (req, res) => {
  try {
    const { search, page, pageSize } = req.query;

    const filter = search
      ? {
          $or: [
            { name: { $regex: search.trim(), $options: "i" } },
            { email: { $regex: search.trim(), $options: "i" } },
            { mobile: { $regex: search.trim(), $options: "i" } },
          ],
        }
      : {};

    let users;
    let pagination = null;

    if (page && pageSize) {
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(pageSize);
      const skip = (pageNumber - 1) * limitNumber;

      const total = await UserSchema.countDocuments(filter);

      users = await UserSchema.find(filter)
        .populate("subscription")
        .skip(skip)
        .limit(limitNumber);

      pagination = {
        total,
        page: pageNumber,
        pageSize: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      };
    } else {
      users = await UserSchema.find(filter).populate("subscription");
    }

    if (!users?.length) {
      return res.status(404).json({
        success: false,
        message: "Users not found",
      });
    }

    res.status(200).json({
      success: true,
      data: users,
      ...(pagination && { pagination }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
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


module.exports.bulkAddUsers = async (req, res) => {
  try {
    const users = req.body.users;

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty users array",
      });
    }

    const createdUsers = [];
    const skippedUsers = [];

    for (const userData of users) {
      const { email, password = "123456" } = userData;

      const existingUser = await UserSchema.findOne({ email });
      if (existingUser) {
        skippedUsers.push({ email, reason: "User already exists" });
        continue;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new UserSchema({
        ...userData,
        password: hashedPassword,
        confirmPassword: hashedPassword, // optional: you might remove this field from schema entirely
      });

      await newUser.save();

      const accessToken = await generateAccessToken({
        id: newUser._id,
        email: newUser.email,
        role: "user",
      });

      createdUsers.push({
        _id: newUser._id,
        email: newUser.email,
        accessToken,
      });
    }

    res.status(201).json({
      success: true,
      message: "Bulk user creation completed",
      createdUsers,
      skippedUsers,
    });
  } catch (err) {
    console.error("Bulk add error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
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
    const user = await UserSchema.findById(userId).populate("subscription");
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
    const { country_code, mobile, password } = req.body;

    if (!country_code || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Country code, mobile number, and password are required",
      });
    }


    const userData = await UserSchema.findOne({
      country_code: country_code.trim(),
      mobile: mobile.trim(),
    });

    if (!userData) {
      return res.status(404).json({
        message: "User not found with the given mobile number",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, userData.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Password does not match",
        success: false,
      });
    }

    const accessToken = await generateAccessToken(userData);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      accessToken,
      data: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
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

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID",
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
    if (!gender || (gender !== "male" && gender !== "female")) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing gender information",
      });
    }

    const oppositeGender = gender === "male" ? "female" : "male";

    const matchedUsers = await UserSchema.find({
      gender: { $regex: new RegExp(`^${oppositeGender}$`, "i") }, 
      isActive: true,
      _id: { $ne: loggedInUser._id },
    }).select("-password -confirmPassword"); 

    res.status(200).json({
      success: true,
      data: matchedUsers,
    });

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


module.exports.getPaymentHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId" });
    }

    const payments = await PaymentHistory.find({ customer: userId })
      .populate("customer") 
      .populate("packages") 
      .sort({ timestamp: -1 });

    return res.json({ success: true, data: payments });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};



module.exports.filterUsers = async (req, res) => {
  try {
    const { gender, minAge, maxAge, city, caste, language } = req.query;
    const filters = {};

    if (gender && gender != "All") filters.gender = gender;
    if (city) filters.city = city;
    if (caste) filters.caste = caste;
    let users = await UserSchema.find(filters);

    if (minAge || maxAge) {
      users = users?.filter((user) => {
        if (!user.dob) return false;

        const age = calculateAge(user.dob);
        if (minAge && age < parseInt(minAge)) return false;
        if (maxAge && age > parseInt(maxAge)) return false;
        if (language && !user.languages?.includes(language)) return false;
        return true;
      });
    }

    res.status(200).json({
      success: true,
      message: "Filtered users retrieved successfully",
      total: users?.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};