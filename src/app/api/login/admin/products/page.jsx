import { authMiddleware } from '@/libs/auth';

export default async function ProductsPage() {
  const auth = await authMiddleware('admin');
  if (auth.redirect) return auth.redirect;
  
  // Lógica existente del CRUD
}