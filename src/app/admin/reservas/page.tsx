"use client";

import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Spinner, Alert, Form } from 'react-bootstrap';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Reserva } from '@/types/reserva'; // 👈 IMPORTAMOS TU TIPO

// Extendemos la interfaz para incluir campos adicionales de la API
interface ReservaAdmin extends Reserva {
  usuario_nombre?: string;
  servicio_nombre?: string;
  mascota_nombre: string;
}

// Tipo para la notificación
interface Notificacion {
  tipo: 'success' | 'danger' | 'warning' | 'info';
  texto: string;
}

export default function AdminReservasPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [reservas, setReservas] = useState<ReservaAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<string>('todas');
  const [notificacion, setNotificacion] = useState<Notificacion | null>(null);

  useEffect(() => {
    if (!user || !isAdmin()) {
      router.push('/');
    } else {
      fetchReservas();
    }
  }, [user, isAdmin, router]);

  const fetchReservas = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/reservas');
      const result = await response.json();
      if (result.success) {
        setReservas(result.data);
      } else {
        setError('Error al cargar reservas');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (reservaId: number, nuevoEstado: string) => {
    try {
      const response = await fetch(`/api/admin/reservas/${reservaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          estado: nuevoEstado
        })
      });

      const result = await response.json();
      if (result.success) {
        setNotificacion({ tipo: 'success', texto: 'Estado actualizado correctamente' });
        fetchReservas();
        setTimeout(() => setNotificacion(null), 3000);
      } else {
        alert('Error al actualizar');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getColorEstado = (estado: string): string => {
    const colores: Record<string, string> = {
      pendiente: '#FFD3B6',
      confirmada: '#A8E6CF',
      completada: '#A8E6CF',
      cancelada: '#FFAAA5'
    };
    return colores[estado] || '#E8F5E9';
  };

  const getTextoEstado = (estado: string): string => {
    const textos: Record<string, string> = {
      pendiente: '⏳ Pendiente',
      confirmada: '✅ Confirmada',
      completada: '✨ Completada',
      cancelada: '❌ Cancelada'
    };
    return textos[estado] || estado;
  };

  const reservasFiltradas = reservas.filter(r => {
    if (filtro === 'todas') return true;
    return r.estado === filtro;
  });

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }

  return (
    <Container fluid>
      <h2 style={{ color: '#2E7D32' }} className="mb-4">📋 Gestión de Reservas</h2>

      {notificacion && (
        <Alert 
          variant={notificacion.tipo} 
          className="mb-4"
          style={{ borderRadius: '15px' }}
        >
          {notificacion.texto}
        </Alert>
      )}

      <div className="mb-4">
        <Form.Select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{ width: '200px', borderRadius: '30px' }}
        >
          <option value="todas">Todas las reservas</option>
          <option value="pendiente">Pendientes</option>
          <option value="confirmada">Confirmadas</option>
          <option value="completada">Completadas</option>
          <option value="cancelada">Canceladas</option>
        </Form.Select>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="bg-white rounded-4 shadow-sm p-4">
        <Table responsive hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Servicio</th>
              <th>Mascota</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservasFiltradas.map((reserva) => (
              <tr key={reserva.id}>
                <td>#{reserva.id}</td>
                <td>{reserva.usuario_nombre || 'N/A'}</td>
                <td>{reserva.servicio_nombre || 'N/A'}</td>
                <td>{reserva.mascota_nombre}</td>
                <td>{new Date(reserva.fecha_reserva).toLocaleDateString('es-ES')}</td>
                <td>{reserva.hora_reserva.substring(0,5)}</td>
                <td>
                  <Badge style={{
                    backgroundColor: getColorEstado(reserva.estado),
                    color: '#2E7D32',
                    padding: '0.5rem 1rem',
                    borderRadius: '30px'
                  }}>
                    {getTextoEstado(reserva.estado)}
                  </Badge>
                </td>
                <td>
                  <Form.Select
                    size="sm"
                    value={reserva.estado}
                    onChange={(e) => cambiarEstado(reserva.id, e.target.value)}
                    style={{ width: '130px', borderRadius: '20px' }}
                  >
                    <option value="pendiente">⏳ Pendiente</option>
                    <option value="confirmada">✅ Confirmada</option>
                    <option value="completada">✨ Completada</option>
                    <option value="cancelada">❌ Cancelada</option>
                  </Form.Select>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {reservasFiltradas.length === 0 && (
          <p className="text-center py-4 text-muted">No hay reservas para mostrar</p>
        )}
      </div>
    </Container>
  );
}