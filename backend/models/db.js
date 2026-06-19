import mysql from 'mysql2/promise';

const connection = await mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: "",
    database: "webbanhang",
    port: 3306,
    charset: "utf8mb4"
});

console.log("Kết nối thành công đến MySQL");

export default connection;