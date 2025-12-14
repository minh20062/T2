/*
 * FILE: routes/productRoutes.js
 * MÔ TẢ: API Sản phẩm (Week 11: Filtering, Sorting, Pagination)
 */

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/authMiddleware');

// ✅ 1. LẤY DANH SÁCH SẢN PHẨM (FILTER + SORT + PAGINATION)
router.get('/', async (req, res) => {
  try {
    // --- A. FILTERING ---
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    // --- B. SORTING ---
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // --- C. FIELD LIMITING ---
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // --- D. PAGINATION ---
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // --- E. EXECUTE QUERY ---
    const products = await query;

    res.status(200).json({
      success: true,
      count: products.length,
      page: page,
      data: products
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ 2. LẤY CHI TIẾT 1 SẢN PHẨM
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ 3. TẠO SẢN PHẨM (Admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data: newProduct
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ✅ 4. CẬP NHẬT SẢN PHẨM (Admin)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: product
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ✅ 5. XÓA SẢN PHẨM (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }

    res.status(204).send(); // No Content
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;