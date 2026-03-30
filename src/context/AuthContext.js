"use client"; // Necesario para usar hooks y localStorage

import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api"; // Cliente HTTP (Axios)

const AuthContext = createContext(); // Contexto global de autenticacion

export function AuthProvider({ children }) {
  // Inicializa usuario desde localStorage
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null; // Evita errores en SSR

    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null; // Recupera usuario si existe
  });

  const [loading, setLoading] = useState(true); // Estado de carga inicial

  // Simula carga inicial
  useEffect(() => {
    setLoading(false);
  }, []);

  // LOGIN
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase(); // Normaliza email
    const cleanPassword = password.trim(); // Limpia espacios

    const response = await api.get("/users"); // Obtiene todos los usuarios
    const users = response.data;

    console.log("Todos los usuarios:", users);

    // Busca usuario que coincida con email y password
    const foundUser = users.find(
      (u) =>
        u.email?.trim().toLowerCase() === cleanEmail &&
        u.password?.trim() === cleanPassword
    );

    console.log("Usuario encontrado:", foundUser);

    if (!foundUser) {
      throw new Error("Correo o contraseña incorrectos");
    }

    // Guarda sesion en localStorage
    localStorage.setItem("user", JSON.stringify(foundUser));

    setUser(foundUser); // Actualiza estado global
    return foundUser;
  };

  // REGISTRO
  const register = async (newUser) => {
    // Limpieza de datos
    const cleanUser = {
      ...newUser,
      name: newUser.name.trim(),
      email: newUser.email.trim().toLowerCase(),
      password: newUser.password.trim(),
      role: newUser.role,
    };

    const response = await api.get("/users"); // Obtiene usuarios existentes
    const users = response.data;

    // Verifica si el email ya existe
    const existingUser = users.find(
      (u) => u.email?.trim().toLowerCase() === cleanUser.email
    );

    if (existingUser) {
      throw new Error("Ya existe un usuario con ese correo");
    }

    // Crea nuevo usuario
    const registerResponse = await api.post("/users", cleanUser);
    return registerResponse.data;
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("user"); // Elimina sesion
    setUser(null); // Limpia estado
  };

  return (
    <AuthContext.Provider
      value={{
        user, // Usuario actual
        loading, // Estado de carga
        login, // Funcion login
        register, // Funcion registro
        logout, // Funcion logout
        isAuthenticated: !!user, // Booleano útil
      }}
    >
      {children} {/* Hace disponible el contexto a toda la app */}
    </AuthContext.Provider>
  );
}

// Hook personalizado para consumir el contexto
export function useAuth() {
  return useContext(AuthContext);
}