import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function testAuth() {
  try {
    // 1. Probar conexión a auth_system
    const authConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'app_user',
      password: '1234',
      database: 'auth_system',
      port: 3306
    });
    
    console.log('✅ Conexión exitosa a auth_system');
    
    // 2. Obtener usuario admin
    const [users] = await authConnection.execute(
      'SELECT * FROM users WHERE email = ?', 
      ['admin@example.com']
    );
    
    if (users.length === 0) {
      console.log(' Usuario admin no encontrado');
      return;
    }
    
    const admin = users[0];
    console.log('Usuario admin encontrado:', admin);
    
    // 3. Verificar contraseña
    const passwordMatch = await bcrypt.compare('admin123', admin.password);
    console.log(passwordMatch ? ' Contraseña válida' : 'Contraseña inválida');
    
    await authConnection.end();
    
  } catch (error) {
    console.error(' Error:', error);
  }
}

testAuth();