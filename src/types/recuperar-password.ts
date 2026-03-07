
// Datos para verificar la identidad 
export interface VerificarDatos {
  email: string;
  telefono: string;
}

// Datos para cambiar la contraseña 
export interface CambiarPasswordData {
  email: string;
  telefono: string;
  nuevaPassword: string;
}

// Formulario completo 
export interface RecuperarPasswordFormData {
  email: string;
  telefono: string;
  nuevaPassword: string;
  confirmarPassword: string;
}

// Respuesta de la API
export interface RecuperarPasswordApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Props para el componente 
export interface RecuperarPasswordProps {
  // Por ahora vacío, pero puede crecer
}