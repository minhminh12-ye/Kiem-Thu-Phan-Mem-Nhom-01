import express from "express";
import connection from "../../models/db.js";

const router = express.Router();

router.get("/", async (req, res)=> {
    try {
        const [[userCount]] = await connection.query(
            `SELECT COUNT(*) AS total_users FROM users`
        );
        const [[productCount]] = await connection.query(
            `SELECT COUNT(*) AS total_products FROM products`
        );
        const [[salesData]] = await connection.query(
            `SELECT SUM(total_price) AS total_sales FROM \`order\` WHERE status != 'cancelled'`
        );
        return res.json({ 
            total_users: userCount.total_users, 
            total_products: productCount.total_products,
            total_sales: salesData.total_sales || 0
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

export default router;