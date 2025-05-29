const PackageSchema = require("../../models/adminModel/PackageSchema");

const getPackages = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = search ? { title: { $regex: search, $options: "i" } } : {};

    const packages = await PackageSchema.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await PackageSchema.countDocuments(query);

    res.status(200).json({
      success: true,
      data: packages,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const createPackages = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      monthly_pay,
      language,
      subscriptionType,
      durationInDays,  
      features
    } = req.body;

    if (!durationInDays || typeof durationInDays !== "number" || durationInDays <= 0) {
      return res.status(400).json({ success: false, message: "Invalid or missing durationInDays" });
    }

    const newPackage = new PackageSchema({
      title,
      description,
      price,
      language,
      monthly_pay,
      subscriptionType,
      durationInDays, 
      isActive: true,
      features: features || [], 
    });

    await newPackage.save();

    res.status(201).json({
      success: true,
      message: "Package added successfully",
      data: newPackage,
    });
  } catch (error) {
    console.error("Error creating package:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const updatePackages = async (req, res) => {
  try {
    const { id } = req.params;
    const packagesData = req.body;
    const updatedPackage = await PackageSchema.findByIdAndUpdate(
      id,
      packagesData,
      {
        new: true,
      }
    );

    if (!updatedPackage) {
      return res
        .status(404)
        .json({ success: false, message: "Package not found" });
    }

    res.status(200).json({
      success: true,
      message: "Packages updated successfully",
      data: updatedPackage,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deletePackages = async (req, res) => {
  try {
    const { id } = req.query;
    await PackageSchema.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const togglePackageStatus = async (req, res) => {
  try {
    const Package = await PackageSchema.findById(req.params.id);
    if (!Package)
      return res
        .status(404)
        .json({ success: false, error: "Package not found" });

    Package.isActive = !Package.isActive;
    await Package.save();

    res.status(200).json({
      success: true,
      message: `Package ${
        Package.isActive ? "activated" : "deactivated"
      } successfully`,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", error: err });
  }
};

module.exports = {
  getPackages,
  createPackages,
  updatePackages,
  deletePackages,
  togglePackageStatus,
};
