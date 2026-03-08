// Tipos para el Blog
export interface BlogPost {
  id: number;
  titulo: string;
  contenido: string;
  resumen?: string;
  imagen?: string;
  categoria?: string;
  activo: number; // 1 = activo, 0 = inactivo
  fecha_creacion: string;
  autor?: string; 
  autor_id?: number; 
}

export interface BlogFormData {
  titulo: string;
  contenido: string;
  resumen: string;
  imagen: string;
  categoria: string;
  activo: boolean; // true = activo, false = inactivo
}

// Tipos para la API de blog
export interface BlogApiResponse {
  success: boolean;
  data?: BlogPost | BlogPost[];
  error?: string;
  message?: string;
}

// Tipos para el listado de posts (admin)
export interface BlogAdminPost extends BlogPost {
  autor_nombre?: string;
  total_comentarios?: number;
 // fecha_creacion?: string; viene de blogPost
}

// Tipos para el formulario de creación/edición (admin)
export interface BlogAdminFormData extends BlogFormData {
  id?: number;
  autor_id?: number;
  destacado?: boolean;
  novedades?: boolean;
}