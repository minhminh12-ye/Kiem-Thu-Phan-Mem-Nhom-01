import mysql from 'mysql2/promise';

const passwords = ['', '123456', '12345678', 'root', '1234', 'admin', 'password', 'mysql'];
for (const pw of passwords) {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: pw
    });
    console.log(`FOUND_PASSWORD:${pw}`);
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.log(`FAILED_PASSWORD:${pw} - ${err.message}`);
  }
}
console.log('PASSWORD_NOT_FOUND');
process.exit(1);
