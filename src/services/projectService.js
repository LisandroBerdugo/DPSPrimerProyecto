import api from "./api"; // Instancia de axios configurada

// Obtener todos los proyectos
export const getProjects = async () => {
  const response = await api.get("/projects"); 
  // Petición GET al endpoint /projects

  return response.data; 
  // Retorna solo los datos
};

// Crear un nuevo proyecto
export const createProject = async (project) => {
  const response = await api.post("/projects", project); 
  // Envía el objeto project al backend

  return response.data; 
  // Devuelve el proyecto creado (respuesta del servidor)
};

// Eliminar un proyecto por ID
export const deleteProject = async (id) => {
  await api.delete(`/projects/${id}`); 
  // Petición DELETE al endpoint con ID dinamico
  // No retorna nada porque no se usa la respuesta
};

// Actualizar un proyecto existente
export const updateProject = async (id, updatedProject) => {
  const response = await api.put(`/projects/${id}`, updatedProject); 
  // PUT para reemplazar/actualizar el recurso completo

  return response.data; 
  // Devuelve el proyecto actualizado
};