"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;

    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const response = await api.get("/users");
    const users = response.data;

    console.log("Todos los usuarios:", users);

    const foundUser = users.find(
      (u) =>
        u.email?.trim().toLowerCase() === cleanEmail &&
        u.password?.trim() === cleanPassword
    );

    console.log("Usuario encontrado:", foundUser);

    if (!foundUser) {
      throw new Error("Correo o contraseña incorrectos");
    }

    localStorage.setItem("user", JSON.stringify(foundUser));
    setUser(foundUser);
    return foundUser;
  };

  const register = async (newUser) => {
    const cleanUser = {
      ...newUser,
      name: newUser.name.trim(),
      email: newUser.email.trim().toLowerCase(),
      password: newUser.password.trim(),
      role: newUser.role,
    };

    const response = await api.get("/users");
    const users = response.data;

    const existingUser = users.find(
      (u) => u.email?.trim().toLowerCase() === cleanUser.email
    );

    if (existingUser) {
      throw new Error("Ya existe un usuario con ese correo");
    }

    const registerResponse = await api.post("/users", cleanUser);
    return registerResponse.data;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}