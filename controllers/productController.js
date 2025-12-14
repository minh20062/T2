const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ message: "Product created", data: product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('categories');
    res.status(200).json({ count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};