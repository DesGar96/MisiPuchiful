import { Pedido, EstadoPedido, MetodoPago } from './pedido';

export interface PedidoDetalleCompleto {
  id: number;
  producto_id: number;
  producto_nombre: string;
  producto_imagen: string | null;
  cantidad: number;
  precio_unitario: number;
}

export interface PedidoUsuario extends Pedido {
  detalles: PedidoDetalleCompleto[];
  seguimiento?: string;
  fecha_entrega?: string;
}

export interface PedidosApiResponse {
  success: boolean;
  data?: PedidoUsuario[];
  error?: string;
}

export interface PedidoExpandible extends PedidoUsuario {
  expandido?: boolean;
}