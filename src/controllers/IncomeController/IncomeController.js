const Income = require("../../models/adminModel/Income");

const createIncome = async (req, res) => {
  try {
    const { income, language } = req.body;

    const existingIncome = await Income.findOne({ income });
    if (existingIncome) {
      return res.status(400).json({
        success: false,
        message: "Income already exists",
      });
    }
    const newIncome = new Income({
      income,
      language,
      isActive: true,
    });
    await newIncome.save();

    res.status(201).json({
      success: true,
      message: "Income created successfully",
      Income: newIncome,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: err });
  }
};

const getAllIncomes = async (req, res) => {
  try {
    const { search, page, pageSize } = req.query;

    const filter = search
      ? {
          $or: [
            { income: { $regex: search.trim(), $options: "i" } },
            { language: { $regex: search.trim(), $options: "i" } },
          ],
        }
      : {};

    let incomes;
    let pagination = null;

    if (page && pageSize) {
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(pageSize);
      const skip = (pageNumber - 1) * limitNumber;

      const totalCount = await Income.countDocuments(filter);

      incomes = await Income.find(filter)
        .select("income language isActive")
        .limit(limitNumber)
        .skip(skip);

      pagination = {
        total: totalCount,
        page: pageNumber,
        pageSize: limitNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
      };
    } else {
      // Return all if pagination not provided
      incomes = await Income.find(filter).select("income language isActive");
    }

    if (!incomes?.length) {
      return res
        .status(404)
        .json({ success: false, message: "Income not found" });
    }

    res.status(200).json({
      success: true,
      data: incomes,
      ...(pagination && { pagination }),
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err });
  }
};


const updateIncome = async (req, res) => {
  try {
    const { income, language } = req.body;
    const updatedIncome = await Income.findByIdAndUpdate(
      req.params.id,
      { income, language },
      { new: true }
    );

    if (!updatedIncome)
      return res
        .status(404)
        .json({ success: false, error: "Income not found" });

    res.status(200).json({
      success: true,
      message: "Income updated successfully",
      Income: updatedIncome,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", error: err });
  }
};

const toggleIncomeStatus = async (req, res) => {
  try {
    const Income = await Income.findById(req.params.id);
    if (!Income)
      return res
        .status(404)
        .json({ success: false, error: "Income not found" });

    Income.isActive = !Income.isActive;
    await Income.save();

    res.status(200).json({
      success: true,
      message: `Income ${
        Income.isActive ? "activated" : "deactivated"
      } successfully`,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", error: err });
  }
};

const deleteIncome = async (req, res) => {
  try {
    const deletedIncome = await Income.findByIdAndDelete(req.params.id);

    if (!deletedIncome) {
      return res
        .status(404)
        .json({ success: false, message: "Income not found" });
    }

    res.status(200).json({
      success: true,
      message: "Income deleted successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: err });
  }
};

module.exports = {
  createIncome,
  getAllIncomes,
  updateIncome,
  toggleIncomeStatus,
  deleteIncome,
};
