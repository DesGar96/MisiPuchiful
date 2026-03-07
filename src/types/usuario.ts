export interface Usuario {
  id: number
  nombre: string
  email: string
  telefono?: string
  direccion?: string
  tipo: "cliente" | "admin"
  fecha_registro?: string
}