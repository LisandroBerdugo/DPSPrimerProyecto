"use client"; // Indica que el componente se ejecuta en el cliente 

import { useState } from "react"; // Hook para manejar estado local
import { useRouter } from "next/navigation"; // Navegacion programatica en Next.js
import { useAuth } from "../../context/AuthContext"; // Contexto de autenticacion

export default function LoginPage() {
  const router = useRouter(); // Instancia del router
  const { login } = useAuth(); // Función login desde el contexto

  const [form, setForm] = useState({
    email: "",
    password: "",
  }); // Estado del formulario

  const [error, setError] = useState(""); // Estado para mensajes de error

  const handleChange = (e) => {
    setForm({
      ...form, // Mantiene los valores actuales
      [e.target.name]: e.target.value, // Actualiza dinamicamente el campo (email/password)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita recarga de la página
    setError(""); // Limpia errores previos

    try {
      await login(form.email, form.password); // Intenta autenticar usuario
      router.push("/dashboard"); // Redirige si login es exitoso
    } catch (err) {
      setError(err.message); // Muestra error si falla el login
    }
  };

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="mb-4">Iniciar sesión</h1>

              {error && (
                <div className="alert alert-danger">
                  {error} {/* Mensaje de error dinamico */}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Correo</label>
                  <input
                    type="email"
                    name="email" 
                    className="form-control"
                    value={form.email} // Input controlado
                    onChange={handleChange} // Actualiza estado
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={form.password} // Input controlado
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Ingresar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}