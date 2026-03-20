"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "gerente") {
        router.push("/dashboard");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <p className="text-center mt-5">Cargando...</p>;
  }

  if (!user || user.role !== "gerente") {
    return null;
  }

  return children;
}