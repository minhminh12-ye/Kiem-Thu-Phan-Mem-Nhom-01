import express from 'express';
import connection from '../../models/db.js';

const router = express.Router();

// GET - Lấy tất cả danh mục kèm số lượng sản phẩm
router.get('/', async (req, res) => {
  try {
    const [rows] = await connection.query(
      `SELECT c.id, c.category_name, COUNT(p.id) as product_count
       FROM category c
       LEFT JOIN products p ON c.id = p.category_id
       GROUP BY c.id, c.category_name
       ORDER BY c.id DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Thêm danh mục mới
router.post('/', async (req, res) => {
  const { category_name } = req.body;
  if (!category_name || !category_name.trim()) {
    return res.status(400).json({ error: 'Tên danh mục không được để trống' });
  }

  try {
    const [result] = await connection.query(
      'INSERT INTO category (category_name) VALUES (?)',
      [category_name.trim()]
    );
    res.json({ id: result.insertId, category_name: category_name.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - Cập nhật danh mục
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { category_name } = req.body;
  
  if (!category_name || !category_name.trim()) {
    return res.status(400).json({ error: 'Tên danh mục không được để trống' });
  }

  try {
    await connection.query(
      'UPDATE category SET category_name = ? WHERE id = ?',
      [category_name.trim(), id]
    );
    res.json({ message: 'Cập nhật danh mục thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Xóa danh mục (kiểm tra sản phẩm liên quan)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Kiểm tra có sản phẩm nào thuộc danh mục này không
    const [[count]] = await connection.query(
      'SELECT COUNT(*) as total FROM products WHERE category_id = ?',
      [id]
    );

    if (count.total > 0) {
      return res.status(400).json({ 
        error: `Không thể xóa danh mục này vì có ${count.total} sản phẩm đang sử dụng` 
      });
    }

    await connection.query('DELETE FROM category WHERE id = ?', [id]);
    res.json({ message: 'Xóa danh mục thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;