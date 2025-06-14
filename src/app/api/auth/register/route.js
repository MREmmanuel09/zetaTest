import { handleRegister } from '@/logicalogin/api';

export async function POST(request) {
  const response = await handleRegister(request);
  
  return new Response(JSON.stringify(response.body), {
    status: response.status,
    headers: { 'Content-Type': 'application/json' }
  });
}