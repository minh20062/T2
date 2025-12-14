const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },

  profile: {
    fullName: { type: String, default: '' },
    phone: { type: String, default: '' }
  },

  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  wishlist: { type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist' },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },

  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);