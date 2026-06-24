import express from 'express';
import connection from '../../models/db.js';

const router = express.Router();

const generateNextCategoryId = async () => {
  const [rows] = await connection.query('SELECT category_id FROM category');
  const numbers = rows
    .map((row) => Number(String(row.category_id).replace(/^CAT/i, '')))
    .filter(Number.isFinite);
  const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
  return `CAT${String(maxNumber + 1).padStart(2, '0')}`;
};

// GET - Lấy tất cả danh mục kèm số lượng sản phẩm
router.get('/', async (req, res) => {
  try {
    const [rows] = await connection.query(
      `SELECT c.category_id AS id, c.category_name, COUNT(p.product_id) AS product_count
       FROM category c
       LEFT JOIN products p ON c.category_id = p.category_id
       GROUP BY c.category_id, c.category_name
       ORDER BY c.category_id DESC`
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
    const categoryId = await generateNextCategoryId();
    await connection.query(
      'INSERT INTO category (category_id, category_name) VALUES (?, ?)',
      [categoryId, category_name.trim()]
    );
    res.json({ id: categoryId, category_name: category_name.trim() });
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
      'UPDATE category SET category_name = ? WHERE category_id = ?',
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
    const [[count]] = await connection.query(
      'SELECT COUNT(*) AS total FROM products WHERE category_id = ?',
      [id]
    );

    if (count.total > 0) {
      return res.status(400).json({
        error: `Không thể xóa danh mục này vì có ${count.total} sản phẩm đang sử dụng`
      });
    }

    await connection.query('DELETE FROM category WHERE category_id = ?', [id]);
    res.json({ message: 'Xóa danh mục thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;