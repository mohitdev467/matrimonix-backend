const Caste = require("../../models/adminModel/Caste");

const createCaste = async (req, res) => {
  try {
    const { religion,caste, language } = req.body;

    const existingCaste = await Caste.findOne({ caste });
    if (existingCaste) {
      return res.status(400).json({
        success: false,
        message: "Caste already exists",
      });
    }
    const newCaste = new Caste({ religion,caste, language, isActive: true });
    await newCaste.save();

    res.status(201).json({
      success: true,
      message: "Caste created successfully",
      caste: newCaste,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: err });
  }
};

const getAllCastes = async (req, res) => {
  try {
    const { search, page, pageSize } = req.query;

    const filter = search
      ? {
          $or: [
            { religion: { $regex: search.trim(), $options: "i" } },
            { caste: { $regex: search.trim(), $options: "i" } },
            { language: { $regex: search.trim(), $options: "i" } },
          ],
        }
      : {};

    let castes;
    let pagination = null;

    if (page && pageSize) {
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(pageSize);
      const skip = (pageNumber - 1) * limitNumber;

      const totalCount = await Caste.countDocuments(filter);
      castes = await Caste.find(filter)
        .select("religion caste language isActive")
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
      castes = await Caste.find(filter).select("religion caste language isActive");
    }

    

    res.status(200).json({
      success: true,
      data: castes,
      ...(pagination && { pagination }),
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err });
  }
};

const updateCaste = async (req, res) => {
  try {
    const { religion, caste, language } = req.body;
    const updatedCaste = await Caste.findByIdAndUpdate(
      req.params.id,
      { religion, caste, language },
      { new: true }
    );

    if (!updatedCaste)
      return res.status(404).json({ success: false, error: "Caste not found" });

    res.status(200).json({
      success: true,
      message: "Caste updated successfully",
      caste: updatedCaste,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", error: err });
  }
};

const toggleCasteStatus = async (req, res) => {
  try {
    const caste = await Caste.findById(req.params.id);
    if (!caste)
      return res.status(404).json({ success: false, error: "Caste not found" });

    caste.isActive = !caste.isActive;
    await caste.save();

    res.status(200).json({
      success: true,
      message: `Caste ${
        caste.isActive ? "activated" : "deactivated"
      } successfully`,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", error: err });
  }
};

const deleteCaste = async (req, res) => {
  try {
    const deletedCaste = await Caste.findByIdAndDelete(req.params.id);

    if (!deletedCaste) {
      return res
        .status(404)
        .json({ success: false, message: "Caste not found" });
    }

    res.status(200).json({
      success: true,
      message: "Caste deleted successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: err });
  }
};

module.exports = {
  createCaste,
  getAllCastes,
  updateCaste,
  toggleCasteStatus,
  deleteCaste,
};
