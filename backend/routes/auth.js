import express from 'express';
import connection from '../models/db.js';

const router = express.Router();

// Đăng ký
router.post("/register", async (req, res) => {
  try {
    const { user_name, email, password } = req.body;

    // Validation cơ bản
    if (!user_name || !email || !password) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }

    // Kiểm tra email đã tồn tại chưa
    const [existingUser] = await connection.query(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email đã được sử dụng' });
    }

    // Thêm user mới
    const [result] = await connection.query(
      "INSERT INTO users (user_name, email, password, roleid) VALUES (?, ?, ?, ?)",
      [user_name, email, password, 2] // roleid = 2 (customer mặc định)
    );

    return res.status(201).json({
      message: 'Đăng ký thành công',
      userId: result.insertId
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Vui lòng điền email và mật khẩu' });
    }

    // Tìm user với JOIN role
    const [users] = await connection.query(
      `SELECT u.user_id, u.user_name, u.email, u.roleid, r.role_name
       FROM users u
       JOIN role r ON u.roleid = r.roleId
       WHERE u.email = ? AND u.password = ?`,
      [email, password]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    const user = users[0];

    // ✅ Trả về đúng format cho frontend
    return res.json({
      message: 'Đăng nhập thành công',
      user: {
        id: user.user_id,
        name: user.user_name,
        email: user.email,
        role: user.role_name.toLowerCase(),
        roleId: user.roleId
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;