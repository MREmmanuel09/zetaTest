// src/components/Navbar.jsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/user');
        const data = await res.json();
        if (res.ok) setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <nav className="bg-zinc-900 text-white py-3 mb-2">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <h3 className="text-3xl">NextMySQL</h3>
        </Link>

        <div className="flex items-center space-x-4">
          {}
          <Link href="/new" className="text-sky-500 hover:text-sky-400">
            New
          </Link>

          {/* Menú de autenticación */}
          <div className="flex space-x-4">
            {user ? (
              <>
                <span className="text-yellow-400">Hola, {user.name}</span>
                <form action="/api/auth/logout" method="POST">
                  <button 
                    type="submit" 
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                  >
                    Cerrar sesión
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="text-green-500 hover:text-green-400">
                  Login
                </Link>
                <Link href="/register" className="text-blue-400 hover:text-blue-300">
                  Registro
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}