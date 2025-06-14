// src/libs/auth.js
import { cookies } from 'next/headers';
import { getAuthConnection } from './auth-mysql';
import crypto from 'crypto';

// Crear secreto para JWT usando la clave del entorno
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

export function createToken(user) {
  const header = JSON.stringify({ typ: 'JWT', alg: 'HS256' });
  const payload = JSON.stringify({
    userId: user.id,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 // 1 hora
  });

  const base64Header = Buffer.from(header).toString('base64url');
  const base64Payload = Buffer.from(payload).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${base64Header}.${base64Payload}`)
    .digest('base64url');

  return `${base64Header}.${base64Payload}.${signature}`;
}

export function verifyToken(token) {
  try {
    const [header, payload, signature] = token.split('.');
    
    const checkSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');
    
    if (signature !== checkSignature) return null;
    
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString());
    
    // Verificar expiración
    if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return decodedPayload;
  } catch (error) {
    return null;
  }
}

export async function getAuthUser() {
  const token = cookies().get('authToken')?.value;
  if (!token) return null;
  
  const decoded = verifyToken(token);
  if (!decoded) return null;
  
  const connection = await getAuthConnection();
  const [users] = await connection.execute(
    "SELECT id, name, email, role FROM users WHERE id = ?",
    [decoded.userId]
  );
  
  return users[0] || null;
}

export async function authMiddleware(requiredRole = null) {
  const user = await getAuthUser();
  
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return {
      redirect: {
        destination: '/unauthorized',
        permanent: false
      }
    };
  }
  
  return { user };
}