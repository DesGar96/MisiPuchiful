export interface Resena {
  id: number;
  usuario_id: number;
  producto_id: number;
  comentario: string;
  puntuacion: number;
  fecha: string; 
  editada?: boolean; 
  fecha_edicion?: string; 
}

// Tipo  producto pendiente de reseñar
export interface ProductoPendiente {
  producto_id: number;
  producto_nombre: string;
  producto_imagen: string | null;
  precio: number;
  precio_oferta?: number | null;
  es_oferta?: number;
  es_novedad?: number;
  puede_reseniar: boolean;
}

// Tipo reseña escrita (con datos del producto)
export interface ResenaEscrita extends Resena {
  producto_nombre: string;
  producto_imagen: string | null;
  precio: number;
  precio_oferta?: number | null;
  es_oferta?: number;
  es_novedad?: number;
}

// Tipo estado de reseñas
export interface ResenasEstado {
  escritas: ResenaEscrita[];
  pendientes: ProductoPendiente[];
}

// Tipo formulario de reseña
export interface ResenaFormData {
  puntuacion: number;
  comentario: string;
}

// Tipo respuesta  API
export interface ResenasApiResponse {
  success: boolean;
  data?: ResenasEstado;
  error?: string;
  message?: string;
  editada?: boolean;
}

// Tipo respuesta al enviar una reseña
export interface EnviarResenaResponse {
  success: boolean;
  message?: string;
  error?: string;
  editada?: boolean;
  id?: number;
}