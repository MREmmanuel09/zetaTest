import bcrypt from 'bcryptjs';
import { getAuthConnection } from './connection';

// Función para iniciar sesión
export async function loginUser(email, password) {
  const connection = await getAuthConnection();
  
  // Buscar usuario por email
  const [rows] = await connection.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  
  if (rows.length === 0) {
    throw new Error('Usuario no encontrado');
  }
  
  const user = rows[0];
  
  // Verificar contraseña
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error('Contraseña incorrecta');
  }
  
  // Devolver datos seguros del usuario
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

// Función para registrar usuario
export async function registerUser(name, email, password) {
  const connection = await getAuthConnection();
  
  // Verificar si el email ya existe
  const [existing] = await connection.execute(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );
  
  if (existing.length > 0) {
    throw new Error('El email ya está registrado');
  }
  
  // Hashear contraseña
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Insertar nuevo usuario
  const [result] = await connection.execute(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, "user")',
    [name, email, hashedPassword]
  );
  
  return {
    id: result.insertId,
    name,
    email,
    role: 'user'
  };
}