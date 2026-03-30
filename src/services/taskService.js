import api from "./api"; // Instancia de axios configurada

// Obtener todas las tareas
export const getTasks = async () => {
  const response = await api.get("/tasks"); 
  // Petición GET al endpoint /tasks

  return response.data; 
  // Retorna solo los datos de la respuesta
};

// Crear una nueva tarea
export const createTask = async (task) => {
  const response = await api.post("/tasks", task); 
  // Envía el objeto task al backend

  return response.data; 
  // Devuelve la tarea creada
};

// Actualizar una tarea existente
export const updateTask = async (id, updatedTask) => {
  const response = await api.put(`/tasks/${id}`, updatedTask); 
  // PUT para actualizar completamente la tarea por ID

  return response.data; 
  // Devuelve la tarea actualizada
};

// Eliminar una tarea por ID
export const deleteTask = async (id) => {
  await api.delete(`/tasks/${id}`); 
  // Petición DELETE al endpoint con ID dinámico
  // No retorna datos porque no se utiliza la respuesta
};