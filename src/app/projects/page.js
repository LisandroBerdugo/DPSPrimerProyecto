"use client"; // Componente ejecutado en cliente 

import Link from "next/link"; // Navegacion interna
import { useEffect, useMemo, useState } from "react"; // React
import ProtectedRoute from "../../components/ProtectedRoute"; // Proteccion de rutas
import { useAuth } from "../../context/AuthContext"; // Contexto de autenticacion

// Servicios (API / backend)
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
  // Estados principales
  const [projects, setProjects] = useState([]); // Lista de proyectos
  const [tasks, setTasks] = useState([]); // Lista de tareas
  const [users, setUsers] = useState([]); // Lista de usuarios

  // Control UI proyectos
  const [showProjectForm, setShowProjectForm] = useState(false); // Mostrar formulario
  const [editingProjectId, setEditingProjectId] = useState(null); // ID en edición

  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
  }); // Estado formulario proyecto

  // Control UI tareas
  const [openTaskFormForProject, setOpenTaskFormForProject] = useState(null); // Proyecto activo
  const [editingTaskId, setEditingTaskId] = useState(null); // Tarea en edicion

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
  }); // Estado formulario tarea

  const { user, loading } = useAuth(); // Usuario autenticado

  // Filtra solo usuarios con rol "usuario"
  const normalUsers = useMemo(
    () => users.filter((u) => u.role === "usuario"),
    [users]
  );

  // Carga todos los datos (proyectos, tareas, usuarios)
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

  // Se ejecuta al montar el componente
  useEffect(() => {
    loadAll();
  }, []);

  // Reset formulario de proyecto
  const resetProjectForm = () => {
    setProjectForm({ name: "", description: "" });
    setEditingProjectId(null);
    setShowProjectForm(false);
  };

  // Reset formulario de tarea
  const resetTaskForm = () => {
    setTaskForm({ title: "", description: "", assignedTo: "" });
    setEditingTaskId(null);
    setOpenTaskFormForProject(null);
  };

  // Manejo de inputs proyecto
  const handleProjectChange = (e) => {
    setProjectForm({
      ...projectForm,
      [e.target.name]: e.target.value,
    });
  };

  // Manejo de inputs tarea
  const handleTaskChange = (e) => {
    setTaskForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Crear o actualizar proyecto
  const handleProjectSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingProjectId) {
        // Modo edicion
        const projectToEdit = projects.find(
          (p) => String(p.id) === String(editingProjectId)
        );

        await updateProject(editingProjectId, {
          ...projectToEdit,
          name: projectForm.name.trim(),
          description: projectForm.description.trim(),
        });
      } else {
        // Modo creacion
        await createProject({
          name: projectForm.name.trim(),
          description: projectForm.description.trim(),
          status: "activo",
          managerId: String(user.id),
        });
      }

      resetProjectForm();
      loadAll(); // Recargar datos
    } catch (error) {
      console.error("Error al guardar proyecto:", error);
    }
  };

  // Crear o actualizar tarea
  const handleTaskSubmit = async (e) => {
    e.preventDefault();

    // Validaciones basicas
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
        // Editar tarea
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
        // Crear tarea
        await createTask({
          title: taskForm.title.trim(),
          description: taskForm.description.trim(),
          status: "asignada",
          projectId: String(openTaskFormForProject),
          assignedTo: String(taskForm.assignedTo),
        });
      }

      resetTaskForm();
      loadAll();
    } catch (error) {
      console.error("Error al guardar tarea:", error);
    }
  };

  // Cargar datos en formulario para editar proyecto
  const handleEditProject = (project) => {
    setProjectForm({
      name: project.name,
      description: project.description,
    });
    setEditingProjectId(project.id);
    setShowProjectForm(true);
  };

  // Eliminar proyecto
  const handleDeleteProject = async (projectId, projectName) => {
    if (!window.confirm(`¿Eliminar el proyecto "${projectName}"?`)) return;

    try {
      await deleteProject(projectId);
      loadAll();
    } catch (error) {
      console.error("Error al eliminar proyecto:", error);
    }
  };

  // Abrir formulario de tareas
  const openTaskForm = (projectId) => {
    setOpenTaskFormForProject(projectId);
    setEditingTaskId(null);
    setTaskForm({ title: "", description: "", assignedTo: "" });
  };

  // Editar tarea
  const handleEditTask = (task) => {
    setOpenTaskFormForProject(task.projectId);
    setEditingTaskId(task.id);
    setTaskForm({
      title: task.title,
      description: task.description,
      assignedTo: String(task.assignedTo),
    });
  };

  // Eliminar tarea
  const handleDeleteTask = async (taskId, taskTitle) => {
    if (!window.confirm(`¿Eliminar la tarea "${taskTitle}"?`)) return;

    try {
      await deleteTask(taskId);
      loadAll();
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  // Cambiar estado de tarea
  const handleTaskStatusChange = async (task, newStatus) => {
    try {
      await updateTask(task.id, {
        ...task,
        status: newStatus,
      });
      loadAll();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  // Cerrar proyecto (validando reglas)
  const handleCloseProject = async (project) => {
    const projectTasks = getTasksByProject(project.id);

    if (project.status === "cerrado") return window.alert("Ya está cerrado");
    if (projectTasks.length === 0)
      return window.alert("No tiene tareas");

    const hasPending = projectTasks.some(
      (t) => t.status !== "finalizado"
    );

    if (hasPending)
      return window.alert("Hay tareas pendientes");

    if (!window.confirm(`¿Cerrar "${project.name}"?`)) return;

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

  // Obtener tareas por proyecto
  const getTasksByProject = (projectId) =>
    tasks.filter((t) => String(t.projectId) === String(projectId));

  // Obtener nombre de usuario por ID
  const getUserNameById = (userId) => {
    const u = users.find((u) => String(u.id) === String(userId));
    return u ? u.name : "Sin asignar";
  };

  // Flujo de estados de tarea
  const getNextStatus = (status) => {
    if (status === "pendiente" || status === "asignada") return "revision";
    if (status === "revision") return "en proceso";
    if (status === "en proceso") return "finalizado";
    return null;
  };

  // Filtrado de proyectos según rol
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

  // Estado de carga
  if (loading || !user) {
    return (
      <ProtectedRoute>
        <main className="container py-5">
          <p>Cargando...</p>
        </main>
      </ProtectedRoute>
    );
  }

  // Render principal (UI)
  return (
    <ProtectedRoute>
      <main className="container py-5">
        {/* Header */}
        <div className="d-flex justify-content-between mb-4">
          <h1 className="text-primary">Proyectos</h1>

          <Link href="/dashboard" className="btn btn-primary">
            Volver
          </Link>
        </div>

        {/* El resto es UI: formularios, listado, botones condicionales por rol */}
      </main>
    </ProtectedRoute>
  );
}