import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "Gestor de Proyectos",
  description: "Aplicación para gestionar proyectos y tareas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}