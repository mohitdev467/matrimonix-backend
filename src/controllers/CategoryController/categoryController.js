const Category = require("../../models/adminModel/CategorySchema");

module.exports.getCategories = async (req, res) => {
  try {
    const { search, page = 1, pageSize = 10 } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(pageSize);
    const skip = (pageNumber - 1) * limitNumber;

    const filter = search
      ? {
          $or: [
            { cat_name: { $regex: search.trim(), $options: "i" } },
            { description: { $regex: search.trim(), $options: "i" } },
          ],
        }
      : {};

    const totalCount = await Category.countDocuments(filter);

    const categories = await Category.find(filter)
      .select("cat_name image description isActive")
      .limit(limitNumber)
      .skip(skip);
    if (!categories?.length) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({
      success: true,
      data: categories,
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
