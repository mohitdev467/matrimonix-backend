const Language = require("../../models/adminModel/Language");
const PackageSchema = require("../../models/adminModel/PackageSchema");
const UserSchema = require("../../models/adminModel/UserSchema");

const getDashboardData = async (req, res) => {
  try {
    const totalPackages = await PackageSchema.countDocuments();
    const totalUsers = await UserSchema.countDocuments();
    const totalLanguages = await Language.countDocuments();
    const totalRevenue = await PackageSchema.aggregate([
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    const stats = [
      {
        icon: "UserOutlined",
        title: "Total Users",
        iconBg: "bg-light-red",
        progressBarColor: "#ff7676",
        value: totalUsers,
        progress: Math.min((totalUsers / 1000) * 100, 100),
      },
      {
        icon: "AppstoreOutlined",
        title: "Total Packages",
        iconBg: "bg-light-green",
        progressBarColor: "#53e69d",
        value: totalPackages,
        progress: Math.min((totalPackages / 1000) * 100, 100),
      },
      {
        icon: "GlobalOutlined",
        title: "Total Languages",
        iconBg: "bg-light-yellow",
        progressBarColor: "#ffc36d",
        value: totalLanguages,
        progress: Math.min((totalLanguages.length / 50) * 100, 100),
      },
      {
        icon: "DollarCircleOutlined",
        title: "Total Revenue",
        iconBg: "bg-light-blue",
        progressBarColor: "#2cabe3",
        value: `$${
          totalRevenue.length > 0
            ? (totalRevenue[0].total / 1000).toFixed(1) + "K"
            : "$0"
        }`,
        progress: Math.min(
          (totalRevenue?.length > 0 ? totalRevenue[0].total / 100000 : 0) * 100,
          100
        ),
      },
    ];

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getDashboardData };
