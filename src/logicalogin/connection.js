import mysql from 'mysql2/promise';

// Configuración para la base de datos de autenticación
const authDbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: 'auth_system',
  port: parseInt(process.env.MYSQL_PORT || '3306')
};

// Conexión única reutilizable
let authConnection;

export async function getAuthConnection() {
  if (!authConnection) {
    authConnection = await mysql.createConnection(authDbConfig);
  }
  return authConnection;
}