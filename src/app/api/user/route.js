// src/app/api/auth/user/route.js
import { getAuthUser } from '@/libs/auth';

export async function GET() {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return new Response(JSON.stringify({ user: null }), {
        status: 200
      });
    }
    
    // Devuelve solo datos seguros (no password)
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    
    return new Response(JSON.stringify({ user: safeUser }), {
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      message: "Error obteniendo usuario",
      error: error.message 
    }), {
      status: 500
    });
  }
}