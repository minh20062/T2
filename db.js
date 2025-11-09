const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 MONGO_URI đang dùng là:', process.env.MONGO_URI);

const connectDB = async () => {
  try {
    console.log('🔌 Đang cố gắng kết nối tới MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully!');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose đã kết nối tới MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('🚨 Lỗi kết nối Mongoose:', err.message);
});

module.exports = connectDB;