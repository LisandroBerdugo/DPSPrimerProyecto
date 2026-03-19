"use client";

import { useRouter } from "next/navigation";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading || !user) {
    return (
      <ProtectedRoute>
        <main className="container py-5">
          <p>Cargando...</p>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="container py-5">
        <h1 className="mb-3">Dashboard</h1>

        <div className="alert alert-success">
          Bienvenido, <strong>{user.name}</strong> | Rol: <strong>{user.role}</strong>
        </div>

        <button className="btn btn-danger" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </main>
    </ProtectedRoute>
  );
}