const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ message: "Category created", data: category });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ count: categories.length, data: categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};