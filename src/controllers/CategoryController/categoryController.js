const Category = require("../../models/adminModel/CategorySchema");

// Get all categories
module.exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error fetching categories", error });
  }
};

// Get category by ID
module.exports.getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error fetching category", error });
  }
};

module.exports.addCategory = async (req, res) => {
  try {
    const categoryData = req.body;
    if (req.file) {
      categoryData.image = req.file.path;
    }
    const category = new Category(categoryData);
    await category.save();
    res.status(201).json({
      success: true,
      message: "Category added successfully",
      category,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error adding category", error });
  }
};

// Update category
module.exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const categoryData = req.body;
    if (req.file) {
      categoryData.image = req.file.path;
    }
    const category = await Category.findByIdAndUpdate(
      categoryId,
      categoryData,
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(400).json({ message: "Error updating category", error });
  }
};

module.exports.toggleCategoryStatus = async (req, res) => {
  try {
    const Category = await Category.findById(req.params.id);
    if (!Category)
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });

    Category.isActive = !Category.isActive;
    await Category.save();

    res.status(200).json({
      success: true,
      message: `Category ${
        Category.isActive ? "activated" : "deactivated"
      } successfully`,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", error: err });
  }
};

// Delete category
module.exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error deleting category", error });
  }
};
