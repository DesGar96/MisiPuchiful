
export interface ResultadoProducto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  precio_oferta?: number;
  imagen?: string;
  es_oferta?: number;
  es_novedad?: number;
  tipo: 'producto';
  categoria_nombre?: string;
}

export interface ResultadoBlog {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  tipo: 'blog';
  fecha_creacion?: string;
}

export type ResultadoBusqueda = ResultadoProducto | ResultadoBlog;

export interface BuscarApiResponse {
  success: boolean;
  data: ResultadoBusqueda[];
  query?: string;
  total?: number;
  error?: string;
}