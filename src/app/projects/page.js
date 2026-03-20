"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";
import {
  getProjects,
  createProject,
  deleteProject,
} from "../../services/projectService";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const { user } = useAuth();

  const loadProjects = async () => {
    const data = await getProjects();
    setProjects(data);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    const newProject = {
      ...form,
      status: "activo",
      managerId: user.id,
    };

    await createProject(newProject);

    setForm({ name: "", description: "" });
    setShowForm(false);
    loadProjects();
  };

  return (
    <ProtectedRoute>
      <main className="container py-5">
        <h1 className="text-primary mb-4">Proyectos</h1>

        {user?.role === "gerente" && (
          <>
            <button
              className="btn btn-primary mb-3"
              onClick={() => setShowForm(!showForm)}
            >
              Crear proyecto
            </button>

            {showForm && (
              <form onSubmit={handleCreate} className="mb-4">
                <div className="mb-2">
                  <input
                    type="text"
                    name="name"
                    placeholder="Nombre del proyecto"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-2">
                  <textarea
                    name="description"
                    placeholder="Descripción"
                    className="form-control"
                    value={form.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button className="btn btn-success">
                  Guardar proyecto
                </button>
              </form>
            )}
          </>
        )}

        {user?.role === "gerente" && (
  <button
    className="btn btn-danger mt-2"
    onClick={async () => {
      await deleteProject(project.id);
      const updated = await getProjects();
      setProjects(updated);
    }}
  >
    Eliminar
  </button>
)}

        {projects.length === 0 ? (
          <p>No hay proyectos disponibles.</p>
        ) : (
          <div className="row">
            {projects.map((project) => (
              <div className="col-md-6 mb-3" key={project.id}>
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{project.name}</h5>
                    <p className="card-text">{project.description}</p>
                    <span className="badge bg-success">
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}