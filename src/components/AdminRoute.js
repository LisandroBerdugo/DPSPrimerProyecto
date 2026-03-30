"use client"; // Componente cliente

import { useEffect } from "react"; // Efectos secundarios
import { useRouter } from "next/navigation"; // Navegacion programatica
import { useAuth } from "../context/AuthContext"; // Contexto de autenticacion

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth(); // Estado de autenticacion
  const router = useRouter(); // Router de Next.js

  useEffect(() => {
    // Solo ejecuta logica cuando ya termino de cargar
    if (!loading) {
      if (!user) {
        router.push("/login"); 
        // Si no hay usuario redirige al login
      } else if (user.role !== "gerente") {
        router.push("/dashboard"); 
        // Si no es gerente redirige al dashboard
      }
    }
  }, [user, loading, router]); // Se ejecuta cuando cambian estos valores

  // Mientras carga el estado de autenticacion
  if (loading) {
    return <p className="text-center mt-5">Cargando...</p>;
  }

  // Si no hay usuario o no tiene permisos no renderiza nada
  if (!user || user.role !== "gerente") {
    return null;
  }

  // Si pasa todas las validaciones renderiza el contenido protegido
  return children;
}