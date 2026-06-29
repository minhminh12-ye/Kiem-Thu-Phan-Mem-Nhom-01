import express from 'express';
import connection from '../models/db.js';

const router = express.Router();

// GET /api/orders - Lấy tất cả đơn hàng (admin)
router.get('/', async (req, res) => {
  try {
    const [orders] = await connection.query(
      `SELECT o.*, u.user_name, u.email as user_email
       FROM \`order\` o
       LEFT JOIN users u ON o.user_id = u.user_id
       ORDER BY o.created_at DESC`
    );
    res.json(orders);
  } catch (err) {
    console.error('Lỗi lấy danh sách đơn hàng:', err);
    res.status(500).json({ error: 'Lỗi server khi lấy danh sách đơn hàng' });
  }
});

// POST /api/orders/checkout
router.post('/checkout', async (req, res) => {
  const { user_id } = req.body; 
  if (!user_id) {
    return res.status(400).json({ error: 'Thiếu thông tin user_id' });
  }

  try {
    // 1. Lấy giỏ hàng - Khớp với bảng 'cartitem' và 'product_id' trong database
    const [cartRows] = await connection.query(
      `SELECT ci.*, c.user_id, p.price 
       FROM cart c 
       JOIN cartitem ci ON c.id = ci.cart_id 
       JOIN products p ON ci.product_id = p.product_id
       WHERE c.user_id = ?`,
      [user_id]
    );
    
    if (!cartRows.length) {
      return res.status(400).json({ error: 'Giỏ hàng rỗng' });
    }

    // Tính tổng tiền
    const total_price = cartRows.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // 2. Tạo đơn hàng - Khớp đúng các cột: user_id, address_id, total_price, status, created_at
    // Sử dụng address_id = 101 (giá trị có sẵn trong bảng dữ liệu mẫu của bạn)
    const [orderResult] = await connection.query(
      'INSERT INTO `order` (user_id, address_id, total_price, status, created_at) VALUES (?, ?, ?, ?, NOW())',
      [user_id, 101, total_price, 'Pending']
    );
    const order_id = orderResult.insertId;

    // 3. Tạo các chi tiết đơn hàng - Khớp với bảng 'orderitem' vừa tạo
    for (const item of cartRows) {
      await connection.query(
        'INSERT INTO orderitem (order_id, product_id, quantity, price_each) VALUES (?, ?, ?, ?)',
        [order_id, item.product_id, item.quantity, item.price]
      );
    }

    // 4. Xóa giỏ hàng - Khớp với bảng 'cartitem'
    const [carts] = await connection.query('SELECT id FROM cart WHERE user_id = ?', [user_id]);
    if (carts.length > 0) {
      await connection.query('DELETE FROM cartitem WHERE cart_id = ?', [carts[0].id]);
    }

    return res.json({ success: true, message: "Đặt hàng thành công", order_id });
  } catch (err) {
    console.error('Lỗi tạo đơn hàng:', err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;