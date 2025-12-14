const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Tên đăng nhập không được để trống'],
    unique: true,
    trim: true,
    minlength: [3, 'Tên đăng nhập phải có ít nhất 3 ký tự'],
    maxlength: [30, 'Tên đăng nhập không được quá 30 ký tự']
  },

  email: {
    type: String,
    required: [true, 'Email không được để trống'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Vui lòng nhập email hợp lệ'
    ]
  },

  passwordHash: {
    type: String,
    required: [true, 'Password không được để trống']
  },

  profile: {
    fullName: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' }
  },

  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  wishlist: { type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist' },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },

  role: {
    type: String,
    enum: {
      values: ['user', 'admin', 'moderator'],
      message: 'Vai trò "{VALUE}" không hợp lệ'
    },
    default: 'user'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);