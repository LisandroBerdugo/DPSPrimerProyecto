"use client"; // Componente cliente

import { useEffect } from "react"; // Efectos secundarios
import { useRouter } from "next/navigation"; // Navegacion programatica
import { useAuth } from "../context/AuthContext"; // Contexto de autenticacion

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth(); // Estado de autenticacion
  const router = useRouter(); // Router de Next.js

  useEffect(() => {
    // Si ya terminó de cargar y no hay usuario autenticado
    if (!loading && !user) {
      router.push("/login"); 
      // Redirige al login si no está autenticado
    }
  }, [user, loading, router]); // Se ejecuta cuando cambia el estado

  // Mientras se esta resolviendo la autenticacion
  if (loading) {
    return <p className="text-center mt-5">Cargando...</p>;
  }

  // Si no hay usuario no renderiza el contenido protegido
  if (!user) {
    return null;
  }

  // Usuario autenticado renderiza contenido protegido
  return children;
}