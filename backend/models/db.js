import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: "webbanhang",
    port: 3306,
    charset: "utf8mb4"
});

console.log("Kết nối thành công đến MySQL");

export default connection;