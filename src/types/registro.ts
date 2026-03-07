
export interface RegistroFormData {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
  telefono: string;
  direccion?: string;
}

export interface RegistroApiData {
  nombre: string;
  email: string;
  password: string;
  telefono: string;
  direccion?: string;
}

export interface RegistroApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  userId?: number;
}

export interface RegistroProps {
  // Vacío por ahora
}