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

// PUT /api/orders/:id/status - Cập nhật trạng thái đơn hàng
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
  }

  try {
    await connection.query('UPDATE `order` SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Cập nhật trạng thái thành công' });
  } catch (err) {
    console.error('Lỗi cập nhật trạng thái:', err);
    res.status(500).json({ error: 'Lỗi server khi cập nhật trạng thái' });
  }
});

// POST /api/orders/checkout
router.post('/checkout', async (req, res) => {
  const { user_id, payment_method } = req.body;
  if (!user_id || !payment_method) {
    return res.status(400).json({ error: 'Thiếu thông tin user hoặc phương thức thanh toán' });
  }

  try {
    // 1. Lấy giỏ hàng - JOIN cart, cartItem và products để lấy giá
    const [cartRows] = await connection.query(
      `SELECT ci.*, c.user_id, p.price 
       FROM cart c 
       JOIN cartItem ci ON c.id = ci.cart_id 
       JOIN products p ON ci.product_id = p.id
       WHERE c.user_id = ?`,
      [user_id]
    );
    if (!cartRows.length) {
      return res.status(400).json({ error: 'Giỏ hàng rỗng' });
    }

    // Tính tổng tiền
    const total_price = cartRows.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // 2. Tạo đơn hàng
    const [orderResult] = await connection.query(
      'INSERT INTO `order` (user_id, total_price, payment_method, status, created_at) VALUES (?, ?, ?, ?, NOW())',
      [user_id, total_price, payment_method, 'pending']
    );
    const order_id = orderResult.insertId;

    // 3. Tạo các orderItem với price_each
    for (const item of cartRows) {
      await connection.query(
        'INSERT INTO orderItem (order_id, product_id, quantity, price_each) VALUES (?, ?, ?, ?)',
        [order_id, item.product_id, item.quantity, item.price]
      );
    }

    // 4. Xóa giỏ hàng - xóa từ cartItem dựa trên cart_id
    const [carts] = await connection.query('SELECT id FROM cart WHERE user_id = ?', [user_id]);
    if (carts.length > 0) {
      await connection.query('DELETE FROM cartItem WHERE cart_id = ?', [carts[0].id]);
    }

    res.json({ order_id });
  } catch (err) {
    console.error('Lỗi tạo đơn hàng:', err);
    res.status(500).json({ error: 'Lỗi server khi tạo đơn hàng' });
  }
});

export default router;
