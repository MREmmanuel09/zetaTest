"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // Redirigir según el rol
      router.push(data.redirect);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-zinc-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
        >
          Iniciar Sesión
        </button>
      </form>
      <div className="mt-4 text-center">
        <p>
          ¿No tienes cuenta?{' '}
          <a href="/register" className="text-sky-400 hover:underline">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
}