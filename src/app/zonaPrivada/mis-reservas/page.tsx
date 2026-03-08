"use client";

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ModalConfirmacion from '@/components/ModalConfirmacion';
import { 
  ReservaUsuario, 
  ReservaApiResponse, 
  CancelarReservaResponse,
  MensajeNotificacion,
  EstadoReserva,
  TipoServicio,
  TipoMascota
} from '@/types/reserva';

export default function MisReservasPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [reservas, setReservas] = useState<ReservaUsuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<ReservaUsuario | null>(null);
  const [mensaje, setMensaje] = useState<MensajeNotificacion | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/usuarios/reservas');
        const result: ReservaApiResponse = await response.json();
        if (result.success && result.data) {
         const reservasOrdenadas = [...result.data].sort((a, b) => {
          return new Date(b.fecha_reserva).getTime() - new Date(a.fecha_reserva).getTime();
        });
        setReservas(reservasOrdenadas);
      } else {
        setError('Error al cargar las reservas');
      }
      } catch (err) {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReservas();
    }
  }, [user]);

  const getColorEstado = (estado: EstadoReserva): string => {
    const colores: Record<EstadoReserva, string> = {
      pendiente: '#FFD3B6',
      confirmada: '#A8E6CF',
      completada: '#A8E6CF',
      cancelada: '#FFAAA5',
      modificada: '#FDFD97'
    };
    return colores[estado] || '#E8F5E9';
  };

  const getTextoEstado = (estado: EstadoReserva): string => {
    const textos: Record<EstadoReserva, string> = {
      pendiente: '⏳ Pendiente',
      confirmada: '✅ Confirmada',
      completada: '✨ Completada',
      cancelada: '❌ Cancelada',
      modificada: '🔄 Modificada'
    };
    return textos[estado] || estado;
  };

  const getNombreServicio = (tipo: TipoServicio): string => {
    return tipo === 'peluqueria' ? '🐕 Peluquería' : '🏥 Veterinario';
  };

  const getNombreMascota = (tipo: TipoMascota): string => {
    const nombres: Record<TipoMascota, string> = {
      perro: 'Perro',
      gato: 'Gato',
      otro: 'Otras especies'
    };
    return nombres[tipo] || tipo;
  };

  const handleCancelarClick = (reserva: ReservaUsuario) => {
    setReservaSeleccionada(reserva);
    setShowConfirmModal(true);
  };

  const handleCancelarConfirm = async () => {
    if (!reservaSeleccionada) return;

    try {
      const response = await fetch(`/api/reservas/${reservaSeleccionada.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          accion: 'cancelar'
        })
      });

      const result: CancelarReservaResponse = await response.json();
      
      if (result.success) {
        setMensaje({ tipo: 'success', texto: 'Reserva cancelada correctamente' });
        // Recargar reservas
        const res = await fetch('/api/usuarios/reservas');
        const data: ReservaApiResponse = await res.json();
        if (data.success && data.data) {
          setReservas(data.data);
        }
      } else {
        setMensaje({ tipo: 'danger', texto: result.error || 'Error al cancelar la reserva' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje({ tipo: 'danger', texto: 'Error de conexión' });
    } finally {
      setShowConfirmModal(false);
      setReservaSeleccionada(null);
    }
  };

  if (authLoading || loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }

  return (
    <div style={{ backgroundColor: '#F8F6F2', minHeight: '100vh', padding: '3rem 0' }}>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold" style={{ color: '#2E7D32' }}>📅 Mis Reservas</h1>
          <Link href="/reservas" passHref>
            <Button style={{ backgroundColor: '#A8E6CF', borderColor: '#A8E6CF', color: '#2E7D32' }}>
              + Nueva reserva
            </Button>
          </Link>
        </div>

        {mensaje && (
          <Alert 
            variant={mensaje.tipo} 
            className="mb-4"
            onClose={() => setMensaje(null)}
            dismissible
            style={{ borderRadius: '15px' }}
          >
            {mensaje.texto}
          </Alert>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {reservas.length === 0 ? (
          <Card className="text-center py-5 border-0 shadow-sm" style={{ borderRadius: '25px' }}>
            <Card.Body>
              <span style={{ fontSize: '4rem' }}>📅</span>
              <h4 className="mt-3" style={{ color: '#2E7D32' }}>No tienes reservas</h4>
              <Link href="/reservas" passHref>
                <Button style={{ backgroundColor: '#A8E6CF', borderColor: '#A8E6CF', color: '#2E7D32', marginTop: '1rem' }}>
                  Reservar ahora
                </Button>
              </Link>
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-4">
            {reservas.map((reserva) => (
              <Col md={6} key={reserva.id}>
                <Card className="border-0 shadow-sm" style={{ borderRadius: '20px' }}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 style={{ color: '#2E7D32' }}>#{reserva.id}</h5>
                        <p className="mb-1">
                          <strong>Servicio:</strong> {getNombreServicio(reserva.tipo_servicio)}
                        </p>
                        <p className="mb-1">
                          <strong>Mascota:</strong> {reserva.mascota_nombre} 
                          {reserva.tipo_mascota && ` (${getNombreMascota(reserva.tipo_mascota)})`}
                        </p>
                        <p className="mb-1">
                          <strong>Fecha:</strong> {new Date(reserva.fecha_reserva).toLocaleDateString('es-ES')}
                        </p>
                        <p className="mb-1">
                          <strong>Hora:</strong> {reserva.hora_reserva?.substring(0, 5)}
                        </p>
                      </div>
                      <Badge style={{
                        backgroundColor: getColorEstado(reserva.estado),
                        color: '#2E7D32',
                        padding: '0.5rem 1rem',
                        borderRadius: '30px'
                      }}>
                        {getTextoEstado(reserva.estado)}
                      </Badge>
                    </div>

                    {reserva.observaciones && (
                      <p className="mt-3 p-2" style={{ backgroundColor: '#F8F6F2', borderRadius: '10px' }}>
                        <small>📝 {reserva.observaciones}</small>
                      </p>
                    )}

                    {reserva.estado !== 'completada' && reserva.estado !== 'cancelada' && (
                      <div className="d-flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleCancelarClick(reserva)}
                          style={{ borderColor: '#FF8B94', color: '#FF8B94', borderRadius: '20px' }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Modal de confirmación para cancelar reserva */}
        <ModalConfirmacion
          show={showConfirmModal}
          onHide={() => {
            setShowConfirmModal(false);
            setReservaSeleccionada(null);
          }}
          onConfirm={handleCancelarConfirm}
          titulo="Cancelar reserva"
          mensaje={reservaSeleccionada ? 
            `¿Estás seguro de cancelar la reserva de ${getNombreServicio(reservaSeleccionada.tipo_servicio).toLowerCase()} para ${reservaSeleccionada.mascota_nombre}?` 
            : '¿Estás seguro de cancelar esta reserva?'}
          icono={reservaSeleccionada?.tipo_servicio === 'peluqueria' ? '✂️' : '🏥'}
        />
      </Container>
    </div>
  );
}