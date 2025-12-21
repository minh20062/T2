/*
 * FILE: routes/productRoutes.js
 * MÔ TẢ: API Sản phẩm (Week 11 + Week 12)
 */

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/authMiddleware');

// ✅ 1. LẤY DANH SÁCH SẢN PHẨM (FILTER + SORT + PAGINATION)
router.get('/', async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const products = await query;

    res.status(200).json({
      success: true,
      count: products.length,
      page: page,
      data: products
    });
  } catch (err) {
    next(err);
  }
});

// ✅ 2. LẤY CHI TIẾT 1 SẢN PHẨM
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Không tìm thấy sản phẩm');
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
});

// ✅ 3. TẠO SẢN PHẨM (Admin)
router.post('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data: newProduct
    });
  } catch (err) {
    next(err);
  }
});

// ✅ 4. CẬP NHẬT SẢN PHẨM (Admin)
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      res.status(404);
      throw new Error('Không tìm thấy sản phẩm');
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: product
    });
  } catch (err) {
    next(err);
  }
});

// ✅ 5. XÓA SẢN PHẨM (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Không tìm thấy sản phẩm');
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;