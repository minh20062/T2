const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ✅ Middleware 1: Bảo vệ route (kiểm tra token)
exports.protect = async (req, res, next) => {
  let token;

  // Kiểm tra header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Lấy token
      token = req.headers.authorization.split(' ')[1];

      // Xác minh token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy user từ token (trừ password)
      req.user = await User.findById(decoded.id).select('-password');

      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }
  }

  // Không có token
  if (!token) {
    return res.status(401).json({ message: 'Không có quyền truy cập, thiếu token' });
  }
};

// ✅ Middleware 2: Phân quyền (admin/user)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Không xác định được người dùng' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Vai trò '${req.user.role}' không có quyền thực hiện chức năng này`
      });
    }

    next();
  };
};