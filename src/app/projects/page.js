"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";
import {
  getProjects,
  createProject,
  deleteProject,
  updateProject,
} from "../../services/projectService";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../services/taskService";
import { getUsers } from "../../services/userService";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);

  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
  });

  const [openTaskFormForProject, setOpenTaskFormForProject] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
  });

  const { user, loading } = useAuth();

  const normalUsers = useMemo(
    () => users.filter((u) => u.role === "usuario"),
    [users]
  );

  const loadAll = async () => {
    try {
      const [projectsData, tasksData, usersData] = await Promise.all([
        getProjects(),
        getTasks(),
        getUsers(),
      ]);

      setProjects(projectsData);
      setTasks(tasksData);
      setUsers(usersData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const resetProjectForm = () => {
    setProjectForm({
      name: "",
      description: "",
    });
    setEditingProjectId(null);
    setShowProjectForm(false);
  };

  const resetTaskForm = () => {
    setTaskForm({
      title: "",
      description: "",
      assignedTo: "",
    });
    setEditingTaskId(null);
    setOpenTaskFormForProject(null);
  };

  const handleProjectChange = (e) => {
    setProjectForm({
      ...projectForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleTaskChange = (e) => {
    setTaskForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingProjectId) {
        const projectToEdit = projects.find(
          (p) => String(p.id) === String(editingProjectId)
        );

        await updateProject(editingProjectId, {
          ...projectToEdit,
          name: projectForm.name.trim(),
          description: projectForm.description.trim(),
        });
      } else {
        await createProject({
          name: projectForm.name.trim(),
          description: projectForm.description.trim(),
          status: "activo",
          managerId: String(user.id),
        });
      }

      resetProjectForm();
      loadAll();
    } catch (error) {
      console.error("Error al guardar proyecto:", error);
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();

    if (!openTaskFormForProject) {
      window.alert("No se pudo identificar el proyecto.");
      return;
    }

    if (!taskForm.title.trim() || !taskForm.description.trim()) {
      window.alert("Completa el título y la descripción de la tarea.");
      return;
    }

    if (!taskForm.assignedTo) {
      window.alert("Debes seleccionar un usuario.");
      return;
    }

    try {
      if (editingTaskId) {
        const taskToEdit = tasks.find(
          (task) => String(task.id) === String(editingTaskId)
        );

        await updateTask(editingTaskId, {
          ...taskToEdit,
          title: taskForm.title.trim(),
          description: taskForm.description.trim(),
          assignedTo: String(taskForm.assignedTo),
        });
      } else {
        const newTask = {
          title: taskForm.title.trim(),
          description: taskForm.description.trim(),
          status: "asignada",
          projectId: String(openTaskFormForProject),
          assignedTo: String(taskForm.assignedTo),
        };

        await createTask(newTask);
      }

      resetTaskForm();
      loadAll();
    } catch (error) {
      console.error("Error al guardar tarea:", error);
    }
  };

  const handleEditProject = (project) => {
    setProjectForm({
      name: project.name,
      description: project.description,
    });
    setEditingProjectId(project.id);
    setShowProjectForm(true);
  };

  const handleDeleteProject = async (projectId, projectName) => {
    const confirmDelete = window.confirm(
      `¿Eliminar el proyecto "${projectName}"?`
    );

    if (!confirmDelete) return;

    try {
      await deleteProject(projectId);
      loadAll();
    } catch (error) {
      console.error("Error al eliminar proyecto:", error);
    }
  };

  const openTaskForm = (projectId) => {
    setOpenTaskFormForProject(projectId);
    setEditingTaskId(null);
    setTaskForm({
      title: "",
      description: "",
      assignedTo: "",
    });
  };

  const handleEditTask = (task) => {
    setOpenTaskFormForProject(task.projectId);
    setEditingTaskId(task.id);
    setTaskForm({
      title: task.title,
      description: task.description,
      assignedTo: String(task.assignedTo),
    });
  };

  const handleDeleteTask = async (taskId, taskTitle) => {
    const confirmDelete = window.confirm(
      `¿Eliminar la tarea "${taskTitle}"?`
    );

    if (!confirmDelete) return;

    try {
      await deleteTask(taskId);
      loadAll();
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  const handleTaskStatusChange = async (task, newStatus) => {
    try {
      await updateTask(task.id, {
        ...task,
        status: newStatus,
      });
      loadAll();
    } catch (error) {
      console.error("Error al actualizar estado de tarea:", error);
    }
  };

  const handleCloseProject = async (project) => {
    const projectTasks = getTasksByProject(project.id);

    if (project.status === "cerrado") {
      window.alert("Este proyecto ya está cerrado.");
      return;
    }

    if (projectTasks.length === 0) {
      window.alert("No puedes cerrar el proyecto porque no tiene tareas.");
      return;
    }

    const hasPendingTasks = projectTasks.some(
      (task) => task.status !== "finalizado"
    );

    if (hasPendingTasks) {
      window.alert("Aún hay tareas pendientes de finalizar en este proyecto.");
      return;
    }

    const confirmClose = window.confirm(
      `¿Cerrar el proyecto "${project.name}"?`
    );

    if (!confirmClose) return;

    try {
      await updateProject(project.id, {
        ...project,
        status: "cerrado",
      });
      loadAll();
    } catch (error) {
      console.error("Error al cerrar proyecto:", error);
    }
  };

  const getTasksByProject = (projectId) => {
    return tasks.filter(
      (task) => String(task.projectId) === String(projectId)
    );
  };

  const getUserNameById = (userId) => {
    const foundUser = users.find((u) => String(u.id) === String(userId));
    return foundUser ? foundUser.name : "Sin asignar";
  };

  const getNextStatus = (currentStatus) => {
    if (currentStatus === "pendiente") return "revision";
    if (currentStatus === "asignada") return "revision";
    if (currentStatus === "revision") return "en proceso";
    if (currentStatus === "en proceso") return "finalizado";
    return null;
  };

  const visibleProjects =
    user?.role === "gerente"
      ? projects
      : projects.filter((project) =>
          tasks.some(
            (task) =>
              String(task.projectId) === String(project.id) &&
              String(task.assignedTo) === String(user?.id)
          )
        );

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
        <h1 className="text-primary mb-4">Proyectos</h1>

        {user?.role === "gerente" && (
          <>
            <button
              className="btn btn-primary mb-3"
              onClick={() => {
                if (showProjectForm && !editingProjectId) {
                  resetProjectForm();
                } else {
                  setShowProjectForm(true);
                  setEditingProjectId(null);
                  setProjectForm({ name: "", description: "" });
                }
              }}
            >
              {showProjectForm && !editingProjectId
                ? "Cancelar"
                : "Crear proyecto"}
            </button>

            {showProjectForm && (
              <form
                onSubmit={handleProjectSubmit}
                className="card p-3 mb-4 shadow-sm"
              >
                <div className="mb-3">
                  <label className="form-label">Nombre del proyecto</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={projectForm.name}
                    onChange={handleProjectChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="3"
                    value={projectForm.description}
                    onChange={handleProjectChange}
                    required
                  />
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-success">
                    {editingProjectId ? "Guardar cambios" : "Guardar proyecto"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetProjectForm}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {visibleProjects.length === 0 ? (
          <p>No hay proyectos disponibles.</p>
        ) : (
          <div className="row">
            {visibleProjects.map((project) => {
              const projectTasks = getTasksByProject(project.id);

              return (
                <div className="col-12 mb-4" key={project.id}>
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h4 className="card-title">{project.name}</h4>
                      <p className="card-text">{project.description}</p>

                      <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
                        <span
                          className={`badge ${
                            project.status === "cerrado"
                              ? "bg-dark"
                              : "bg-success"
                          }`}
                        >
                          {project.status}
                        </span>

                        {user?.role === "gerente" && (
                          <>
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => handleEditProject(project)}
                              disabled={project.status === "cerrado"}
                            >
                              Editar
                            </button>

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                handleDeleteProject(project.id, project.name)
                              }
                            >
                              Eliminar
                            </button>

                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() =>
                                openTaskFormForProject === project.id
                                  ? resetTaskForm()
                                  : openTaskForm(project.id)
                              }
                              disabled={project.status === "cerrado"}
                            >
                              {openTaskFormForProject === project.id &&
                              !editingTaskId
                                ? "Cancelar tarea"
                                : "Crear tarea"}
                            </button>

                            <button
                              className="btn btn-dark btn-sm"
                              onClick={() => handleCloseProject(project)}
                            >
                              Cerrar proyecto
                            </button>
                          </>
                        )}
                      </div>

                      {user?.role === "gerente" &&
                        openTaskFormForProject === project.id &&
                        project.status !== "cerrado" && (
                          <form
                            onSubmit={handleTaskSubmit}
                            className="card p-3 mb-3 bg-light"
                          >
                            <div className="mb-2">
                              <label className="form-label">
                                Título de la tarea
                              </label>
                              <input
                                type="text"
                                name="title"
                                className="form-control"
                                value={taskForm.title}
                                onChange={handleTaskChange}
                                required
                              />
                            </div>

                            <div className="mb-2">
                              <label className="form-label">Descripción</label>
                              <textarea
                                name="description"
                                className="form-control"
                                rows="2"
                                value={taskForm.description}
                                onChange={handleTaskChange}
                                required
                              />
                            </div>

                            <div className="mb-3">
                              <label className="form-label">
                                Asignar a usuario
                              </label>
                              <select
                                name="assignedTo"
                                className="form-select"
                                value={taskForm.assignedTo}
                                onChange={handleTaskChange}
                                required
                              >
                                <option value="">Selecciona un usuario</option>
                                {normalUsers.map((u) => (
                                  <option key={u.id} value={u.id}>
                                    {u.name} - {u.email}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="d-flex gap-2">
                              <button type="submit" className="btn btn-success">
                                {editingTaskId ? "Guardar tarea" : "Crear tarea"}
                              </button>

                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={resetTaskForm}
                              >
                                Cancelar
                              </button>
                            </div>
                          </form>
                        )}

                      <h6 className="mt-3">Tareas</h6>

                      {projectTasks.length === 0 ? (
                        <p className="text-muted mb-0">
                          No hay tareas para este proyecto.
                        </p>
                      ) : (
                        <div className="list-group">
                          {projectTasks
                            .filter((task) =>
                              user?.role === "gerente"
                                ? true
                                : String(task.assignedTo) === String(user.id)
                            )
                            .map((task) => {
                              const nextStatus = getNextStatus(task.status);

                              return (
                                <div
                                  key={task.id}
                                  className="list-group-item d-flex justify-content-between align-items-start"
                                >
                                  <div>
                                    <strong>{task.title}</strong>
                                    <div>{task.description}</div>
                                    <small>
                                      Asignado a: {getUserNameById(task.assignedTo)}
                                    </small>
                                  </div>

                                  <div className="text-end">
                                    <span className="badge bg-secondary d-block mb-2">
                                      {task.status}
                                    </span>

                                    {user?.role === "gerente" && (
                                      <div className="d-flex gap-2 justify-content-end">
                                        <button
                                          className="btn btn-warning btn-sm"
                                          onClick={() => handleEditTask(task)}
                                          disabled={project.status === "cerrado"}
                                        >
                                          Editar tarea
                                        </button>

                                        <button
                                          className="btn btn-danger btn-sm"
                                          onClick={() =>
                                            handleDeleteTask(task.id, task.title)
                                          }
                                        >
                                          Eliminar tarea
                                        </button>
                                      </div>
                                    )}

                                    {user?.role === "usuario" &&
                                      String(task.assignedTo) === String(user.id) &&
                                      nextStatus &&
                                      project.status !== "cerrado" && (
                                        <button
                                          className="btn btn-sm btn-primary mt-2"
                                          onClick={() =>
                                            handleTaskStatusChange(
                                              task,
                                              nextStatus
                                            )
                                          }
                                        >
                                          Pasar a {nextStatus}
                                        </button>
                                      )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}