const Religion = require("../../models/adminModel/Religion");

const createReligion = async (req, res) => {
  try {
    const { religion, language } = req.body;

    const existingReligion = await Religion.findOne({ religion });
    if (existingReligion) {
      return res.status(400).json({
        success: false,
        message: "Religion already exists",
      });
    }
    const newReligion = new Religion({ religion, language, isActive: true });
    await newReligion.save();

    res.status(201).json({
      success: true,
      message: "Religion created successfully",
      religion: newReligion,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: err });
  }
};

const getAllReligions = async (req, res) => {
  try {
    const { search, page, pageSize } = req.query;

    const filter = search
      ? {
          $or: [
            { caste: { $regex: search.trim(), $options: "i" } },
            { language: { $regex: search.trim(), $options: "i" } },
          ],
        }
      : {};

    let religions;
    let pagination = null;

    if (page && pageSize) {
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(pageSize);
      const skip = (pageNumber - 1) * limitNumber;

      const totalCount = await Religion.countDocuments(filter);
      religions = await Religion.find(filter)
        .select("religion language isActive")
        .limit(limitNumber)
        .skip(skip);

      pagination = {
        total: totalCount,
        page: pageNumber,
        pageSize: limitNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
      };
    } else {
      // Return all castes without pagination
      religions = await Religion.find(filter).select("religion language isActive");
    }

    if (!religions?.length) {
      return res.status(404).json({
        success: false,
        message: "Religion not found",
      });
    }

    res.status(200).json({
      success: true,
      data: religions,
      ...(pagination && { pagination }),
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err });
  }
};

const updateReligion = async (req, res) => {
  try {
    const { religion, language } = req.body;
    const updatedReligion = await Religion.findByIdAndUpdate(
      req.params.id,
      { religion, language },
      { new: true }
    );

    if (!updatedReligion)
      return res.status(404).json({ success: false, error: "Religion not found" });

    res.status(200).json({
      success: true,
      message: "Religion updated successfully",
      religion: updatedReligion,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", error: err });
  }
};

const toggleReligionStatus = async (req, res) => {
  try {
    const religion = await Religion.findById(req.params.id);
    if (!religion)
      return res.status(404).json({ success: false, error: "Religion not found" });

    religion.isActive = !religion.isActive;
    await religion.save();

    res.status(200).json({
      success: true,
      message: `Religion ${
        religion.isActive ? "activated" : "deactivated"
      } successfully`,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", error: err });
  }
};

const deleteReligion = async (req, res) => {
  try {
    const deletedReligion = await Religion.findByIdAndDelete(req.params.id);

    if (!deletedReligion) {
      return res
        .status(404)
        .json({ success: false, message: "Caste not found" });
    }

    res.status(200).json({
      success: true,
      message: "Religion deleted successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: err });
  }
};

module.exports = {
    createReligion,
    getAllReligions,
    updateReligion,
    toggleReligionStatus,
    deleteReligion,
};
