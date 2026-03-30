import api from "./api"; // Instancia de axios configurada

// Obtener todos los usuarios
export const getUsers = async () => {
  const response = await api.get("/users"); 
  // Peticion GET al endpoint /users

  return response.data; 
  // Retorna unicamente los datos (evita exponer estructura de axios)
};