// routes/userRoutes.js

const express = require('express');
const router = express.Router(); 

// 1. ENDPOINT: Lấy Danh sách Người dùng (READ All)
// Phương thức: GET  | Đường dẫn cuối cùng: /api/v1/users/
router.get('/', (req, res) => {
    // GIẢ LẬP: Trả về một mảng dữ liệu người dùng ảo.
    const userList = [ { id: 1, username: "Alice" }, { id: 2, username: "Bob" } ];
    
    // Luôn trả về 200 OK khi đọc thành công
    res.status(200).json({ 
        message: "Lấy danh sách người dùng thành công (200 OK)",
        data: userList
    }); 
});

// 2. ENDPOINT: Tạo Người dùng Mới (CREATE)
// Phương thức: POST | Đường dẫn cuối cùng: /api/v1/users/
router.post('/', (req, res) => {
    // Dữ liệu người dùng được gửi từ Client nằm trong req.body (nhờ app.use(express.json()))
    const userData = req.body; 

    // Luôn trả về 201 Created khi tạo mới thành công
    res.status(201).json({ 
        message: "Người dùng đã được tạo thành công (201 Created)",
        receivedData: userData 
    });
});

// ----------------------------------------------------
// 3. ENDPOINT: Lấy Chi tiết Người dùng (READ One)
// Phương thức: GET  | Đường dẫn cuối cùng: /api/v1/users/:id
router.get('/:id', (req, res) => {
    // Trích xuất ID từ URL (req.params.id)
    const userId = req.params.id; 
    
    // [LOGIC ẢO]: Giả định ID hợp lệ là 1, các ID khác trả về lỗi 404
    if (userId === '1') {
        res.status(200).json({ 
            message: `GET: Chi tiết người dùng ID: ${userId} thành công`,
            data: { id: userId, username: "Alice", status: "active", email: "alice@dev.com" }
        });
    } else {
        // Trả về 404 NOT FOUND nếu không tìm thấy User
        res.status(404).json({ 
            message: `GET: Không tìm thấy người dùng có ID: ${userId}`
        });
    }
});

// ----------------------------------------------------
// 4. ENDPOINT: Cập nhật Người dùng (UPDATE)
// Phương thức: PUT/PATCH | Đường dẫn cuối cùng: /api/v1/users/:id
router.put('/:id', (req, res) => {
    const userId = req.params.id; // ID người dùng cần cập nhật
    const updateData = req.body;   // Dữ liệu cần cập nhật (từ Body JSON)

    // [LOGIC ẢO]: Giả định luôn thành công nếu ID được gửi lên.
    res.status(200).json({ 
        message: `PUT: Cập nhật người dùng ID ${userId} thành công (200 OK)`,
        updatedData: updateData
    });
});

// ----------------------------------------------------
// 5. ENDPOINT: Xóa Người dùng (DELETE)
// Phương thức: DELETE | Đường dẫn cuối cùng: /api/v1/users/:id
router.delete('/:id', (req, res) => {
    const userId = req.params.id; // ID người dùng cần xóa

    // [LOGIC ẢO]: Giả định luôn xóa thành công nếu ID được gửi lên.
    // Trả về 204 No Content là chuẩn mực RESTful cho lệnh DELETE thành công
    res.status(204).send(); 
});


module.exports = router;