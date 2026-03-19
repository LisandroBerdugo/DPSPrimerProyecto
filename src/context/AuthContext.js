"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.get(`/users?email=${email}&password=${password}`);
    const foundUser = response.data[0];

    if (!foundUser) {
      throw new Error("Correo o contraseña incorrectos");
    }

    localStorage.setItem("user", JSON.stringify(foundUser));
    setUser(foundUser);
    return foundUser;
  };

  const register = async (newUser) => {
    const checkUser = await api.get(`/users?email=${newUser.email}`);

    if (checkUser.data.length > 0) {
      throw new Error("Ya existe un usuario con ese correo");
    }

    const response = await api.post("/users", newUser);
    return response.data;
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