const ProfileView = require("../../models/adminModel/ProfileView");

module.exports.storeProfileView = async (req, res) => {
  try {
    const { viewerId, viewedUserId } = req.body;

    if (!viewerId || !viewedUserId) {
      return res.status(400).json({
        success: false,
        message: "Both viewerId and viewedUserId are required",
      });
    }

    if (viewerId === viewedUserId) {
      return res.status(400).json({
        success: false,
        message: "Users cannot view their own profile",
      });
    }

    const lastView = await ProfileView.findOne({
      viewerId,
      viewedUserId,
      viewedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    if (!lastView) {
      await ProfileView.create({ viewerId, viewedUserId });
    }

    res.status(200).json({ success: true, message: "Profile view recorded" });
  } catch (error) {
    console.error("Error storing profile view:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
