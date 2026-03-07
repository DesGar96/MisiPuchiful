export type TipoServicio = 'peluqueria' | 'veterinario';
export type TipoMascota = 'perro' | 'gato' | 'otro';
export type EstadoReserva = 'pendiente' | 'confirmada' | 'completada' | 'cancelada' | 'modificada';

export interface Reserva {
  id: number;
  usuario_id: number;
  
  // Datos reserva
  tipo_servicio: TipoServicio;
  tipo_mascota: TipoMascota;
  mascota_nombre: string;
  fecha_reserva: string;
  hora_reserva: string;
  hora_fin?: string;
  observaciones?: string;
  
  // Estado
  estado: EstadoReserva;
  fecha_creacion: string;
  fecha_modificacion?: string;
  
  // Relaciones (para la API)
  usuario_nombre?: string;
  servicio_nombre?: string;
}

// Tipo específico para la página de Mis Reservas 
export interface ReservaUsuario extends Reserva {
  // Campos adicionales que puede devolver la API
  tipo_mascota_nombre?: string; 
}

export interface ReservaFormData {
  tipo_servicio: TipoServicio | '';
  tipo_mascota: TipoMascota | '';
  mascota_nombre: string;
  fecha: string;
  hora: string;
  observaciones: string;
}

export interface ReservaApiResponse {
  success: boolean;
  data?: ReservaUsuario[];
  reservaId?: number; 
  error?: string;
  message?: string;
}

export interface CancelarReservaResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface DisponibilidadResponse {
  success: boolean;
  horarios: string[];
  error?: string;
}

// Tipo para el mensaje de notificación
export interface MensajeNotificacion {
  tipo: 'success' | 'danger' | 'warning' | 'info';
  texto: string;
}