const Manglik = require("../../models/adminModel/Manglik");

const createManglik = async (req, res) => {
  try {
    const { manglik, language } = req.body;

    const existingManglik = await Manglik.findOne({ manglik });
    if (existingManglik) {
      return res.status(400).json({
        success: false,
        message: "Manglik already exists",
      });
    }
    const newManglik = new Manglik({ manglik, language, isActive: true });
    await newManglik.save();

    res.status(201).json({
      success: true,
      message: "Manglik created successfully",
      Manglik: newManglik,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: err });
  }
};

const getAllMangliks = async (req, res) => {
  try {
    const { search, page = 1, pageSize = 10 } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(pageSize);
    const skip = (pageNumber - 1) * limitNumber;

    const filter = search
      ? {
          $or: [
            { manglik: { $regex: search.trim(), $options: "i" } },
            { language: { $regex: search.trim(), $options: "i" } },
          ],
        }
      : {};

    const totalCount = await Manglik.countDocuments(filter);

    const mangliks = await Manglik.find(filter)
      .select("manglik language isActive")
      .limit(limitNumber)
      .skip(skip);
    
    res.status(200).json({
      success: true,
      data: mangliks,
      pagination: {
        total: totalCount,
        page: pageNumber,
        pageSize: limitNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", error: err });
  }
};

const updateManglik = async (req, res) => {
  try {
    const { manglik, language } = req.body;
    const updatedManglik = await Manglik.findByIdAndUpdate(
      req.params.id,
      { manglik, language },
      { new: true }
    );

    if (!updatedManglik)
      return res
        .status(404)
        .json({ success: false, error: "Manglik not found" });

    res.status(200).json({
      success: true,
      message: "Manglik updated successfully",
      Manglik: updatedManglik,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", error: err });
  }
};

const toggleManglikStatus = async (req, res) => {
  try {
    const Manglik = await Manglik.findById(req.params.id);
    if (!Manglik)
      return res
        .status(404)
        .json({ success: false, error: "Manglik not found" });

    Manglik.isActive = !Manglik.isActive;
    await Manglik.save();

    res.status(200).json({
      success: true,
      message: `Manglik ${
        Manglik.isActive ? "activated" : "deactivated"
      } successfully`,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", error: err });
  }
};

const deleteManglik = async (req, res) => {
  try {
    const deletedManglik = await Manglik.findByIdAndDelete(req.params.id);

    if (!deletedManglik) {
      return res
        .status(404)
        .json({ success: false, message: "Manglik not found" });
    }

    res.status(200).json({
      success: true,
      message: "Manglik deleted successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: err });
  }
};

module.exports = {
  createManglik,
  getAllMangliks,
  updateManglik,
  toggleManglikStatus,
  deleteManglik,
};
