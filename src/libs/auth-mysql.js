import mysql from 'mysql2/promise';

export async function getAuthConnection() {
  return await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: 'auth_system', 
    port: parseInt(process.env.MYSQL_PORT)
  });
}