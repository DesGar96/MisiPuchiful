export interface Contacto {
  id: number;
  nombre: string;
  email: string;
  telefono?: string | null;  
  mensaje: string;
  leido: boolean;  
  fecha_creacion: string;
}

// Tipo para crear nuevo contacto (sin id, leido, fecha_creacion)
export interface ContactoFormData {
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
}

// Tipo para respuesta API
export interface ContactoApiResponse {
  success: boolean;
  data?: Contacto | Contacto[];
  error?: string;
  message?: string;
}

// Tipo para actualizar contacto 
export interface ContactoUpdateData {
  leido: boolean;
}