const User = require('../models/User');

// ✅ CREATE USER (POST /api/v1/users)
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    res.status(201).json({
      message: "Tạo User thành công",
      data: newUser
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ GET ALL USERS (GET /api/v1/users)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET USER BY ID (GET /api/v1/users/:id)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "Không tìm thấy User" });

    res.status(200).json({ data: user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ UPDATE USER (PUT /api/v1/users/:id)
exports.updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy User để cập nhật" });

    res.status(200).json({
      message: `Cập nhật User ID ${req.params.id} thành công`,
      data: updated
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ DELETE USER (DELETE /api/v1/users/:id)
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy User để xóa" });

    res.status(204).send(); // No Content
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};