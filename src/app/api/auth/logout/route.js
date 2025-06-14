export async function POST() {
  const response = new Response(JSON.stringify({ 
    success: true,
    message: "Sesión cerrada"
  }), {
    status: 200
  });

  // Simplemente devolvemos una respuesta exitosa
  // El cliente deberá manejar la redirección
  return response;
}