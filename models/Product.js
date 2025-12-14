const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },

  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },

  description: {
    type: String,
    trim: true,
    default: ''
  },

  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number']
  },

  stockQuantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock quantity cannot be negative'],
    default: 0
  },

  // Many-to-Many: Product thuộc nhiều Category
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],

  imageUrl: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);