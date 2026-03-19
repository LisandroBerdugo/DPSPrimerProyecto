"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { getProjects } from "../../services/projectService";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error al cargar proyectos:", error);
      }
    };

    loadProjects();
  }, []);

  return (
    <ProtectedRoute>
      <main className="container py-5">
        <h1 className="text-primary mb-4">Proyectos</h1>

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
                    <span className="badge bg-success">{project.status}</span>
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