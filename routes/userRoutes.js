const express = require('express');
const router = express.Router();

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// ✅ CRUD ROUTES
router.post('/', createUser);        // Tạo user
router.get('/', getAllUsers);        // Lấy tất cả user
router.get('/:id', getUserById);     // Lấy user theo ID
router.put('/:id', updateUser);      // Cập nhật user
router.delete('/:id', deleteUser);   // Xóa user

module.exports = router;