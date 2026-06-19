import express from 'express';
import connection from '../../models/db.js';

const router = express.Router();

// GET - Lấy tất cả thương hiệu kèm số lượng sản phẩm
router.get('/', async (req, res) => {
  try {
    const [rows] = await connection.query(
      `SELECT b.id, b.brand_name, COUNT(p.id) as product_count
       FROM brands b
       LEFT JOIN products p ON b.id = p.brand_id
       GROUP BY b.id, b.brand_name
       ORDER BY b.id DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Thêm thương hiệu mới
router.post('/', async (req, res) => {
  const { brand_name } = req.body;
  if (!brand_name || !brand_name.trim()) {
    return res.status(400).json({ error: 'Tên thương hiệu không được để trống' });
  }

  try {
    const [result] = await connection.query(
      'INSERT INTO brands (brand_name) VALUES (?)',
      [brand_name.trim()]
    );
    res.json({ id: result.insertId, brand_name: brand_name.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - Cập nhật thương hiệu
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { brand_name } = req.body;
  
  if (!brand_name || !brand_name.trim()) {
    return res.status(400).json({ error: 'Tên thương hiệu không được để trống' });
  }

  try {
    await connection.query(
      'UPDATE brands SET brand_name = ? WHERE id = ?',
      [brand_name.trim(), id]
    );
    res.json({ message: 'Cập nhật thương hiệu thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Xóa thương hiệu (kiểm tra sản phẩm liên quan)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Kiểm tra có sản phẩm nào thuộc thương hiệu này không
    const [[count]] = await connection.query(
      'SELECT COUNT(*) as total FROM products WHERE brand_id = ?',
      [id]
    );

    if (count.total > 0) {
      return res.status(400).json({ 
        error: `Không thể xóa thương hiệu này vì có ${count.total} sản phẩm đang sử dụng` 
      });
    }

    await connection.query('DELETE FROM brands WHERE id = ?', [id]);
    res.json({ message: 'Xóa thương hiệu thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;