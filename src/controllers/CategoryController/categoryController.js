const upload = require("../../helpers/imageUploadHelper");
const Category = require("../../models/adminModel/CategorySchema");

// Get all categories
module.exports.getCategories = async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching categories', error });
    }
  };
  
  // Get category by ID
  module.exports.getCategoryById = async (req, res) => {
    try {
      const { categoryId } = req.params;
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching category', error });
    }
  };
  
  // Add a new category
  module.exports.addCategory = [
    upload.single('image'),
    async (req, res) => {
      try {
        const categoryData = req.body;
        if (req.file) {
          categoryData.image = req.file.path;
        }
        const category = new Category(categoryData);
        await category.save();
        res.status(201).json({ message: 'Category added successfully', category });
      } catch (error) {
        res.status(400).json({ message: 'Error adding category', error });
      }
    }
  ];
  
  // Update category
  module.exports.updateCategory = [
    upload.single('image'),
    async (req, res) => {
      try {
        const { categoryId } = req.params;
        const categoryData = req.body;
        if (req.file) {
          categoryData.image = req.file.path;
        }
        const category = await Category.findByIdAndUpdate(categoryId, categoryData, { new: true });
        if (!category) {
          return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category updated successfully', category });
      } catch (error) {
        res.status(400).json({ message: 'Error updating category', error });
      }
    }
  ];
  
  // Delete category
  module.exports.deleteCategory = async (req, res) => {
    try {
      const { categoryId } = req.params;
      const category = await Category.findByIdAndDelete(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error deleting category', error });
    }
  };