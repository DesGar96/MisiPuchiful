export interface PedidoDetalle {
  producto_id: number
  producto_nombre?: string
  cantidad: number
  precio_unitario: number
}

export type MetodoPago = "contrareembolso" | "bizum" | "tarjeta"

export type EstadoPedido =
  | "pendiente"
  | "procesando"
  | "enviado"
  | "entregado"
  | "cancelado"

export interface Pedido {
  id: number
  usuario_id: number
  usuario_nombre?: string
  email?: string
  telefono?: string
  direccion_envio?: string

  metodo_pago: MetodoPago
  fecha_pedido: string
  estado: EstadoPedido

  total: number
  detalles?: PedidoDetalle[]
}