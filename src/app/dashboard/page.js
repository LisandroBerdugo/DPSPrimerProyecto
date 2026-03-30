"use client"; // Este componente se ejecuta en el cliente

import Link from "next/link"; // Navegacion interna sin recargar
import { useRouter } from "next/navigation"; // Navegacion programatica
import ProtectedRoute from "../../components/ProtectedRoute"; // Protege rutas privadas
import { useAuth } from "../../context/AuthContext"; // Contexto de autenticacion

export default function DashboardPage() {
  const { user, logout, loading } = useAuth(); // Estado global de auth
  const router = useRouter(); // Router de Next.js

  const handleLogout = () => {
    logout(); // Cierra sesión (limpia estado/token)
    router.push("/login"); // Redirige al login
  };

  if (loading || !user) {
    return (
      <ProtectedRoute>
        <main className="container py-5">
          <p>Cargando...</p> {/* Estado de carga */}
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="container py-5">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0">Dashboard</h1>

          <button className="btn btn-danger" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i> {/* Icono */}
            Cerrar sesión
          </button>
        </div>

        <div className="alert alert-success">
          Bienvenido, <strong>{user.name}</strong> | Rol:{" "}
          <strong>{user.role}</strong> {/* Datos del usuario */}
        </div>

        <div className="d-flex justify-content-center gap-4 mt-4 flex-wrap">

          <div className="col-md-4">
            <Link href="/projects" className="btn btn-primary w-100 py-3">
              <i className="bi bi-kanban-fill me-2"></i>
              Ir a Proyectos
            </Link>
          </div>

          {user.role === "gerente" && ( // Render condicional por rol
            <div className="col-md-4">
              <Link href="/register" className="btn btn-success w-100 py-3">
                <i className="bi bi-person-plus-fill me-2"></i>
                Agregar usuarios
              </Link>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}