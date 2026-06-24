import express from 'express';
import connection from '../../models/db.js';

const router = express.Router();

// GET tất cả users
router.get("/", async (req, res) => {
  try {
    const [results] = await connection.query(`
      SELECT u.user_id, u.user_name, u.email, u.roleid, r.role_name 
      FROM users u
      JOIN role r ON u.roleid = r.roleId
      ORDER BY u.user_id DESC
    `);
    
    // ✅ Trả về đúng format mà frontend mong đợi
    return res.json({
      success: true,
      users: results
    });
  } catch (err) {
    console.error("Get users error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// GET 1 user theo ID
router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const [results] = await connection.query(
      `SELECT 
          u.user_id, 
          u.user_name, 
          u.email, 
          u.roleid,
          r.role_name
        FROM users u
        JOIN role r ON u.roleid = r.id
        WHERE u.user_id = ?`, 
      [userId]
    );
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'User không tồn tại' });
    }
    
    return res.json({
      success: true,
      user: results[0]
    });
  } catch (err) {
    console.error("Get user error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// UPDATE user
router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { user_name, email, password, roleid } = req.body; // ✅ Thêm password

    // Kiểm tra user tồn tại
    const [existingUser] = await connection.query(
      "SELECT user_id FROM users WHERE user_id = ?",
      [userId]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User không tồn tại' });
    }

    // Kiểm tra email trùng
    const [emailCheck] = await connection.query(
      "SELECT user_id FROM users WHERE email = ? AND user_id != ?",
      [email, userId]
    );

    if (emailCheck.length > 0) {
      return res.status(400).json({ error: 'Email đã được sử dụng bởi user khác' });
    }

    // ✅ Update có hoặc không có password
    let query = '';
    let params = [];

    if (password && password.trim() !== '') {
      // Có password mới
      query = "UPDATE users SET user_name = ?, email = ?, password = ?, roleid = ? WHERE user_id = ?";
      params = [user_name, email, password, roleid, userId];
    } else {
      // Không update password
      query = "UPDATE users SET user_name = ?, email = ?, roleid = ? WHERE user_id = ?";
      params = [user_name, email, roleid, userId];
    }

    await connection.query(query, params);
    
    return res.json({ 
      success: true,
      message: "Cập nhật thành công" 
    });
  } catch (err) {
    console.error("Update user error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Kiểm tra user tồn tại
    const [existingUser] = await connection.query(
      "SELECT user_id FROM users WHERE user_id = ?",
      [userId]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User không tồn tại' });
    }

    // Xóa user
    await connection.query("DELETE FROM users WHERE user_id = ?", [userId]);

    return res.json({
      success: true,
      message: 'Xóa user thành công'
    });
  } catch (err) {
    console.error("Delete user error:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;