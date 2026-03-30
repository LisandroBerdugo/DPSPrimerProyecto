import axios from "axios"; // Librería HTTP para hacer peticiones al backend

// Instancia personalizada de axios
const api = axios.create({
  baseURL: "http://localhost:3001", 
  // URL base del backend (todas las peticiones usaran este prefijo)
});

export default api; // Exporta la instancia para usarla en toda la app