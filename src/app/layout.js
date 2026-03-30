import "bootstrap/dist/css/bootstrap.min.css"; // Framework CSS (grid, botones, utilidades)
import "bootstrap-icons/font/bootstrap-icons.css"; // Libreria de iconos
import "./globals.css"; // Estilos globales personalizados

import { AuthProvider } from "../context/AuthContext"; 
// Contexto global de autenticación (disponible en toda la app)

export const metadata = {
  title: "Gestor de Proyectos", // Título de la aplicacion
  description: "Aplicación para gestionar proyectos y tareas", // Descripcion SEO
};

export default function RootLayout({ children }) {
  return (
    <html lang="es"> {/* Idioma del documento */}
      <body>
        {/* Proveedor global de autenticación */}
        <AuthProvider>
          {children} {/* Renderiza todas las páginas hijas */}
        </AuthProvider>
      </body>
    </html>
  );
}