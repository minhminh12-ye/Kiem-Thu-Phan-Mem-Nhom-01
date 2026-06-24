import express from 'express';
import connection from '../../models/db.js';

const router = express.Router();

const generateNextBrandId = async () => {
  const [rows] = await connection.query('SELECT brand_id FROM brands');
  const numbers = rows
    .map((row) => Number(String(row.brand_id).replace(/^BR/i, '')))
    .filter(Number.isFinite);
  const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
  return `BR${String(maxNumber + 1).padStart(2, '0')}`;
};

// GET - Lấy tất cả thương hiệu kèm số lượng sản phẩm
router.get('/', async (req, res) => {
  try {
    const [rows] = await connection.query(
      `SELECT b.brand_id AS id, b.brand_name, COUNT(p.product_id) AS product_count
       FROM brands b
       LEFT JOIN products p ON b.brand_id = p.brand_id
       GROUP BY b.brand_id, b.brand_name
       ORDER BY b.brand_id DESC`
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
    const brandId = await generateNextBrandId();
    await connection.query(
      'INSERT INTO brands (brand_id, brand_name) VALUES (?, ?)',
      [brandId, brand_name.trim()]
    );
    res.json({ id: brandId, brand_name: brand_name.trim() });
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
      'UPDATE brands SET brand_name = ? WHERE brand_id = ?',
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
    const [[count]] = await connection.query(
      'SELECT COUNT(*) AS total FROM products WHERE brand_id = ?',
      [id]
    );

    if (count.total > 0) {
      return res.status(400).json({
        error: `Không thể xóa thương hiệu này vì có ${count.total} sản phẩm đang sử dụng`
      });
    }

    await connection.query('DELETE FROM brands WHERE brand_id = ?', [id]);
    res.json({ message: 'Xóa thương hiệu thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;