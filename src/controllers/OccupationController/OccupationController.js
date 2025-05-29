const Occupation = require("../../models/adminModel/Occupation");

const createOccupation = async (req, res) => {
  try {
    const { occupation, language } = req.body;

    const existingOccupation = await Occupation.findOne({ occupation });
    if (existingOccupation) {
      return res.status(400).json({
        success: false,
        message: "Occupation already exists",
      });
    }
    const newOccupation = new Occupation({
      occupation,
      language,
      isActive: true,
    });
    await newOccupation.save();

    res.status(201).json({
      success: true,
      message: "Occupation created successfully",
      Occupation: newOccupation,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: err });
  }
};

const getAllOccupations = async (req, res) => {
  try {
    const { search, page, pageSize } = req.query;

    const filter = search
      ? {
          $or: [
            { occupation: { $regex: search.trim(), $options: "i" } },
            { language: { $regex: search.trim(), $options: "i" } },
          ],
        }
      : {};

    let occupations;
    let pagination = null;

    if (page && pageSize) {
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(pageSize);
      const skip = (pageNumber - 1) * limitNumber;

      const totalCount = await Occupation.countDocuments(filter);

      occupations = await Occupation.find(filter)
        .select("occupation language isActive")
        .limit(limitNumber)
        .skip(skip);

      pagination = {
        total: totalCount,
        page: pageNumber,
        pageSize: limitNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
      };
    } else {
      // Return all occupations without pagination
      occupations = await Occupation.find(filter).select("occupation language isActive");
    }

    if (!occupations?.length) {
      return res
        .status(404)
        .json({ success: false, message: "Occupation not found" });
    }

    res.status(200).json({
      success: true,
      data: occupations,
      ...(pagination && { pagination }),
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err });
  }
};


const updateOccupation = async (req, res) => {
  try {
    const { occupation, language } = req.body;
    const updatedOccupation = await Occupation.findByIdAndUpdate(
      req.params.id,
      { occupation, language },
      { new: true }
    );

    if (!updatedOccupation)
      return res
        .status(404)
        .json({ success: false, error: "Occupation not found" });

    res.status(200).json({
      success: true,
      message: "Occupation updated successfully",
      Occupation: updatedOccupation,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", error: err });
  }
};

const toggleOccupationStatus = async (req, res) => {
  try {
    const Occupation = await Occupation.findById(req.params.id);
    if (!Occupation)
      return res
        .status(404)
        .json({ success: false, error: "Occupation not found" });

    Occupation.isActive = !Occupation.isActive;
    await Occupation.save();

    res.status(200).json({
      success: true,
      message: `Occupation ${
        Occupation.isActive ? "activated" : "deactivated"
      } successfully`,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", error: err });
  }
};

const deleteOccupation = async (req, res) => {
  try {
    const deletedOccupation = await Occupation.findByIdAndDelete(req.params.id);

    if (!deletedOccupation) {
      return res
        .status(404)
        .json({ success: false, message: "Occupation not found" });
    }

    res.status(200).json({
      success: true,
      message: "Occupation deleted successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: err });
  }
};

module.exports = {
  createOccupation,
  getAllOccupations,
  updateOccupation,
  toggleOccupationStatus,
  deleteOccupation,
};
