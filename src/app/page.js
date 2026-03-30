"use client"; // Indica que el componente se ejecuta en el cliente 

import { useEffect } from "react"; // Hook para efectos secundarios
import { useRouter } from "next/navigation"; // Navegacion programatica

export default function HomePage() {
  const router = useRouter(); // Instancia del router

  useEffect(() => {
    router.replace("/login"); 
    // Redirige automáticamente a /login
    // replace() evita que el usuario pueda volver atrás con el botón "back"
  }, [router]); // Se ejecuta al montar el componente

  return (
    <main className="container py-5">
      <p>Redirigiendo...</p> {/* Mensaje temporal mientras ocurre la redireccion */}
    </main>
  );
}