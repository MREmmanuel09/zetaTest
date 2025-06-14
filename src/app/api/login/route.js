import { getAuthConnection } from '@/libs/auth-mysql';
import bcrypt from 'bcryptjs';
import { createToken } from '@/libs/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const connection = await getAuthConnection();
    
    // Buscar usuario
    const [users] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    
    if (users.length === 0) {
      return new Response(JSON.stringify({ message: "Credenciales inválidas" }), {
        status: 401
      });
    }
    
    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return new Response(JSON.stringify({ message: "Credenciales inválidas" }), {
        status: 401
      });
    }
    
    const token = createToken(user);
    const userData = { id: user.id, name: user.name, email: user.email, role: user.role };
    
    const response = new Response(JSON.stringify({ 
      message: "Inicio de sesión exitoso",
      token,
      user: userData,
      redirect: user.role === 'admin' ? '/products' : '/public/user.html'
    }), {
      status: 200
    });
    
    // Establecer cookie
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60,
      path: '/',
    });
    
    return response;
  } catch (error) {
    return new Response(JSON.stringify({ 
      message: "Error en el servidor",
      error: error.message 
    }), {
      status: 500
    });
  }
}