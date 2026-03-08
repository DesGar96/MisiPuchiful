export interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  precio_oferta?: number
  imagen: string
  categoria_id?: number
  categoria_nombre?: string
  stock: number
  activo: number
  puntuacion_media?: number
  total_resenas?: number
  destacado?: number 
  es_novedad?: number
}