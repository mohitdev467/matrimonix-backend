const Joi = require("joi");
const Caste = require("../../models/adminModel/Caste");

const casteSchema = Joi.object({
  caste: Joi.string().required(),
  language: Joi.string().required(),
});

const createCaste = async (req, res) => {
  try {
    const { error } = casteSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });

    const { caste, language } = req.body;
    const newCaste = new Caste({ caste, language, isActive: true });
    await newCaste.save();

    res.status(201).json({
      success: true,
      message: "Caste created successfully",
      caste: newCaste,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const getAllCastes = async (req, res) => {
  try {
    const castes = await Caste.find().select("caste language isActive");
    if (!castes?.length) {
      return res
        .status(404)
        .json({ success: false, message: "Caste not found" });
    }
    res.status(200).json({ success: true, data: castes });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateCaste = async (req, res) => {
  try {
    const { error } = casteSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });

    const { caste, language } = req.body;
    const updatedCaste = await Caste.findByIdAndUpdate(
      req.params.id,
      { caste, language },
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
    res.status(500).json({ success: false, error: "Internal Server Error" });
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
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  createCaste,
  getAllCastes,
  updateCaste,
  toggleCasteStatus,
};
