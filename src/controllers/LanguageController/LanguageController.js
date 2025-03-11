const Language = require("../../models/adminModel/Language");

const createLanguage = async (req, res) => {
  try {
    const { language, languageCode } = req.body;
    const existingLanguage = await Language.findOne({ language });

    if (existingLanguage) {
      return res.status(400).json({
        success: false,
        message: "Language already exists",
      });
    }
    const newLanguage = new Language({
      language,
      languageCode,
      isActive: true,
    });
    await newLanguage.save();

    res.status(201).json({
      success: true,
      message: "Language created successfully",
      Language: newLanguage,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: err });
  }
};

const getAllLanguages = async (req, res) => {
  try {
    const { search, page = 1, pageSize = 10 } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(pageSize);
    const skip = (pageNumber - 1) * limitNumber;

    const filter = search
      ? {
          $or: [
            { language: { $regex: search.trim(), $options: "i" } },
            { languageCode: { $regex: search.trim(), $options: "i" } },
          ],
        }
      : {};

    const totalCount = await Language.countDocuments(filter);

    const Languages = await Language.find(filter)
      .select("language languageCode isActive")
      .limit(limitNumber)
      .skip(skip);
    if (!Languages?.length) {
      return res
        .status(404)
        .json({ success: false, message: "Language not found" });
    }
    res.status(200).json({
      success: true,
      data: Languages,
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

const updateLanguage = async (req, res) => {
  try {
    const { language, languageCode } = req.body;
    const updatedLanguage = await Language.findByIdAndUpdate(
      req.params.id,
      { language, languageCode },
      { new: true }
    );

    if (!updatedLanguage)
      return res
        .status(404)
        .json({ success: false, error: "Language not found" });

    res.status(200).json({
      success: true,
      message: "Language updated successfully",
      Language: updatedLanguage,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", error: err });
  }
};

const toggleLanguageStatus = async (req, res) => {
  try {
    const Language = await Language.findById(req.params.id);
    if (!Language)
      return res
        .status(404)
        .json({ success: false, error: "Language not found" });

    Language.isActive = !Language.isActive;
    await Language.save();

    res.status(200).json({
      success: true,
      message: `Language ${
        Language.isActive ? "activated" : "deactivated"
      } successfully`,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", error: err });
  }
};

const deleteLanguage = async (req, res) => {
  try {
    const deletedLanguage = await Language.findByIdAndDelete(req.params.id);

    if (!deletedLanguage) {
      return res
        .status(404)
        .json({ success: false, message: "Language not found" });
    }

    res.status(200).json({
      success: true,
      message: "Language deleted successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: err });
  }
};

module.exports = {
  createLanguage,
  getAllLanguages,
  updateLanguage,
  toggleLanguageStatus,
  deleteLanguage,
};
