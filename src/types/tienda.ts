
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precio_oferta?: number | null;
  stock: number;
  imagen: string | null;
  categoria_id: number;
  categoria_nombre?: string;
  destacado: number; // 0 o 1
  es_novedad: number; // 0 o 1
  es_oferta: number; // 0 o 1
  fecha_creacion: string;
}

export interface ResenaProducto {
  id: number;
  producto_id: number;
  usuario_id: number;
  usuario_nombre: string;
  puntuacion: number;
  comentario: string;
  fecha: string;
}

export interface ProductoDetalle extends Producto {
  resenas: ResenaProducto[];
  puntuacion_media: number;
  total_resenas: number;
}

export interface ProductoApiResponse {
  success: boolean;
  data?: Producto | Producto[] | ProductoDetalle;
  error?: string;
  message?: string;
}

export interface ProductoCarrito {
  id: number;
  nombre: string;
  precio: number;
  imagen: string | null;
  cantidad: number;
}