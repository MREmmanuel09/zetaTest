import mysql from 'serverless-mysql'

export const conn = mysql({
  config: {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    database: process.env.MYSQL_DATABASE || 'nextmysqlcrud',
    debug: true,
    multipleStatements: true
  }
})