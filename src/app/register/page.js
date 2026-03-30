"use client"; // Componente del lado cliente

import { useState } from "react"; // Manejar estado
import Link from "next/link"; // Navegacion interna
import { useRouter } from "next/navigation"; // Navegacion programatica
import AdminRoute from "../../components/AdminRoute"; // Protege acceso solo a admins/gerentes
import { useAuth } from "../../context/AuthContext"; // Contexto de autenticación

export default function RegisterPage() {
  const router = useRouter(); // Router para redireccion
  const { register } = useAuth(); // Funcion para registrar usuarios

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "usuario", // Valor por defecto
  }); // Estado del formulario

  const [error, setError] = useState(""); // Estado para errores

  // Maneja cambios en inputs (dinámico por name)
  const handleChange = (e) => {
    setForm({
      ...form, // Mantiene valores existentes
      [e.target.name]: e.target.value, // Actualiza campo específico
    });
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita recarga
    setError(""); // Limpia errores previos

    try {
      await register(form); // Envía datos al backend
      router.push("/dashboard"); // Redirige al dashboard
    } catch (err) {
      setError(err.message); // Muestra error si falla
    }
  };

  return (
    <AdminRoute> {/* Solo accesible por usuarios autorizados */}
      <main className="container py-5">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0">Agregar usuario</h1>

          <Link href="/dashboard" className="btn btn-primary">
            <i className="bi bi-arrow-left me-2"></i>
            Volver
          </Link>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">

                {/* Mensaje de error */}
                {error && (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  {/* Nombre */}
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={form.name} // Input controlado
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label">Correo</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Rol */}
                  <div className="mb-3">
                    <label className="form-label">Rol</label>
                    <select
                      name="role"
                      className="form-select"
                      value={form.role} // Controlado por estado
                      onChange={handleChange}
                    >
                      <option value="usuario">Usuario</option>
                      <option value="gerente">Gerente</option>
                    </select>
                  </div>

                  {/* Botón submit */}
                  <button type="submit" className="btn btn-success w-100">
                    <i className="bi bi-person-plus-fill me-2"></i>
                    Guardar usuario
                  </button>
                </form>

              </div>
            </div>
          </div>
        </div>
      </main>
    </AdminRoute>
  );
}