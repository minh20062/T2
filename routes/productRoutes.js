const express = require('express');
const router = express.Router();

const { createProduct, getAllProducts, deleteProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

// ✅ 1. LẤY DANH SÁCH SẢN PHẨM (Public)
router.get('/', getAllProducts);

// ✅ 2. TẠO SẢN PHẨM (Admin only)
router.post('/', protect, authorize('admin'), createProduct);

// ✅ 3. XÓA SẢN PHẨM (Admin only)
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;