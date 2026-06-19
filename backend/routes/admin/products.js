import express from "express";
import connection from "../../models/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [result] = await connection.query(
        `SELECT 
            p.product_id AS id, 
            p.product_name, 
            p.category_id, 
            c.category_name, 
            p.brand_id, 
            b.brand_name, 
            p.price, 
            p.stock, 
            p.specs, 
            p.image_url
        FROM products p 
        JOIN category c ON p.category_id = c.category_id
        JOIN brands b ON p.brand_id = b.brand_id`
    );
    return res.json(result);
  } catch (err) {
    console.error("Lỗi SQL chi tiết:", err); // In lỗi ra Terminal để dễ theo dõi
    return res.status(500).json({ error: err.message });
  }
});

// Lấy product theo thể loại
router.get("/type/:type", async (req, res) => {
  try {
    const type = req.params.type;
    const [result] = await connection.query(
      `SELECT p.id, p.product_name, c.category_name, b.brand_name, p.price, p.stock, p.specs
       FROM products p 
       JOIN category c ON p.category_id = c.id
       JOIN brands b ON p.brand_id = b.id
       WHERE c.category_name = ?`, 
      [type]
    );
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST - Thêm sản phẩm mới
router.post("/", async (req, res) => {
  try {
    const { product_name, category_id, brand_id, price, stock, specs, image_url } = req.body;
    
    // Validation
    if (!product_name || !category_id || !brand_id || price === undefined || stock === undefined) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    // Chuyển specs thành JSON string nếu là object, hoặc null nếu rỗng
    let specsJson = null;
    if (specs && typeof specs === 'object') {
      // specs là object và không null
      specsJson = Object.keys(specs).length > 0 ? JSON.stringify(specs) : null;
    } else if (specs && typeof specs === 'string' && specs.trim() !== '') {
      // specs là string và không rỗng
      specsJson = specs;
    }
    // Nếu specs là null, undefined, empty string → specsJson = null

    const query = `
      INSERT INTO products (product_name, category_id, brand_id, price, stock, specs, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    console.log('📝 INSERT specs:', { raw: specs, type: typeof specs, specsJson });
    
    const [result] = await connection.query(query, [
      product_name,
      category_id,
      brand_id,
      price,
      stock,
      specsJson,
      req.body.image_url || null
    ]);

    return res.status(201).json({
      message: 'Thêm sản phẩm thành công',
      productId: result.insertId
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT - Cập nhật sản phẩm (partial update)
router.put("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = req.body;

    // Kiểm tra xem có data để update không
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Không có dữ liệu để cập nhật' });
    }

    const fields = [];
    const values = [];

    // Các field được phép update
    const allowedFields = ['product_name', 'category_id', 'brand_id', 'price', 'stock', 'specs', 'image_url'];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        // Xử lý specs field đặc biệt
        if (key === 'specs') {
          if (value && typeof value === 'object') {
            // Object không rỗng
            values.push(Object.keys(value).length > 0 ? JSON.stringify(value) : null);
          } else if (value && typeof value === 'string' && value.trim() !== '') {
            // String không rỗng
            values.push(value);
          } else {
            // null, undefined, empty → lưu null
            values.push(null);
          }
        } else {
          values.push(value);
        }
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'Không có field hợp lệ để cập nhật' });
    }

    // Thêm productId vào cuối mảng values
    values.push(productId);

    const query = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;

    const [result] = await connection.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }

    return res.json({ 
      message: 'Cập nhật sản phẩm thành công',
      productId: productId,
      updatedFields: Object.keys(updateData)
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE - Xóa sản phẩm
router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const query = "DELETE FROM products WHERE id = ?";
    
    const [result] = await connection.query(query, [productId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }

    return res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;