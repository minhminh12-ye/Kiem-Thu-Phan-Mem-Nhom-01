import express from "express";
import connection from "../models/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const {user_id} = req.query;
    if (!user_id) {
        return res.status(400).json({ error: "Thiếu user_id" });
    }

    try {
        const [cart] = await connection.query("SELECT * FROM cart WHERE user_id = ?", [user_id]);
        if (!cart.length) {
            return res.json({ items: [], total: 0 });
        }

        const cartId = cart[0].id;
        const [items] = await connection.query(
            `SELECT ci.id, ci.product_id, p.product_name, p.price, p.image_url, ci.quantity
             FROM cartItem ci
             JOIN products p ON ci.product_id = p.product_id
             WHERE ci.cart_id = ?`,
            [cartId]
        );
        const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        res.json({ items, total });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.post("/add", async (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    if (!user_id || !product_id || !quantity) {
        return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
    }

    try {
        // Kiểm tra giỏ hàng của user
        const [products] = await connection.query("SELECT * FROM products WHERE product_id = ?", [product_id]);

        if (!products.length) {
            return res.status(404).json({ error: "Sản phẩm không tồn tại" });
        }
        const product = products[0];

        if (product.stock < quantity) {
            return res.status(400).json({ error: "Số lượng trong kho không đủ" });
        }

        let [carts] = await connection.query("SELECT * FROM cart WHERE user_id = ?", [user_id]);
        let cartId;

        if (!carts.length) {
            const [result] = await connection.query("INSERT INTO cart (user_id) VALUES (?)", [user_id]);
            cartId = result.insertId;
        } else {
            cartId = carts[0].id;
        }

        const [existing] = await connection.query(
            "SELECT * FROM cartItem WHERE cart_id = ? AND product_id = ?",
            [cartId, product_id]
        );

        if (existing.length) {
            const newQty = existing[0].quantity + quantity;
            if (newQty > product.stock) return res.status(400).json({ error: "Số lượng trong kho không đủ" });
            await connection.query("UPDATE cartItem SET quantity = ? WHERE id = ?", [newQty, existing[0].id]);
        } else {
            await connection.query("INSERT INTO cartItem (cart_id, product_id, quantity) VALUES (?, ?, ?)", [cartId, product_id, quantity]);
        }
        res.json({ message: "Thêm vào giỏ hàng thành công" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.put("/item/:id", async (req, res) => {
  const cartItemId = req.params.id;
  const { quantity } = req.body;
  if (quantity === undefined) return res.status(400).json({ error: "Thiếu quantity" });

  try {
    const [items] = await connection.query(
      "SELECT ci.*, p.stock, p.price FROM cartItem ci JOIN products p ON ci.product_id = p.product_id WHERE ci.id = ?",
      [cartItemId]
    );
    if (!items.length) return res.status(404).json({ error: "Item không tồn tại" });

    const item = items[0];
    if (quantity === 0) {
      await connection.query("DELETE FROM cartItem WHERE id = ?", [cartItemId]);
    } else if (quantity > item.stock) {
      return res.status(400).json({ error: "Vượt quá tồn kho" });
    } else {
      await connection.query("UPDATE cartItem SET quantity = ? WHERE id = ?", [quantity, cartItemId]);
    }

    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Xóa sản phẩm khỏi giỏ ---
router.delete("/item/:id", async (req, res) => {
  const cartItemId = req.params.id;
  try {
    await connection.query("DELETE FROM cartItem WHERE id = ?", [cartItemId]);
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Xóa toàn bộ giỏ ---
router.delete("/", async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: "user_id required" });

  try {
    const [carts] = await connection.query("SELECT * FROM cart WHERE user_id = ?", [user_id]);
    if (!carts.length) return res.json({ message: "Giỏ trống" });

    await connection.query("DELETE FROM cartItem WHERE cart_id = ?", [carts[0].id]);
    res.json({ message: "Xóa toàn bộ giỏ thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;