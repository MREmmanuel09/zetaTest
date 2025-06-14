import { handleLogin } from '@/logicalogin/api';

export async function POST(request) {
  const response = await handleLogin(request);
  
  return new Response(JSON.stringify(response.body), {
    status: response.status,
    headers: { 'Content-Type': 'application/json' }
  });
}
