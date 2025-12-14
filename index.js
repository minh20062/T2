// 1. Import thư viện Express và dotenv
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const qs = require('qs');


// 2. Đọc biến môi trường từ file .env
dotenv.config();

// 3. Kết nối MongoDB Atlas
connectDB();

// 4. Khởi tạo ứng dụng Express
const app = express();
const PORT = process.env.PORT || 3000;



// 5. IMPORT Router
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');



// 6. MIDDLEWARE: Đọc Body JSON từ Request
app.use(express.json());
app.set('query parser', str => qs.parse(str));

// 7. ĐỊNH TUYẾN GỐC
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/orders', orderRoutes);



// 8. API chào mừng
app.get('/', (req, res) => {
  res.json({ message: "Chào mừng đến với API Dữ liệu Người dùng!" });
});

// 9. API kiểm tra trạng thái
app.get('/api/v1/status', (req, res) => {
  res.json({
    service: "User Data API",
    version: "1.0",
    health: "Good",
    message: "Server hoạt động bình thường!",
    timestamp: new Date().toISOString()
  });
});

// 10. Lắng nghe yêu cầu tại cổng đã định nghĩa
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
