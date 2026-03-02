"use client";

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Form } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { FaStar, FaEdit } from 'react-icons/fa';
import Notificacion from '@/components/Notificacion';

export default function MisResenasPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [resenas, setResenas] = useState({ escritas: [], pendientes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(null);
  const [editandoResena, setEditandoResena] = useState(null);
  const [formResena, setFormResena] = useState({ puntuacion: 5, comentario: '' });
  const [enviando, setEnviando] = useState(false);
  
  // Estados para la notificación
  const [notificacion, setNotificacion] = useState({
    mostrar: false,
    tipo: 'exito',
    mensaje: ''
  });

  const mostrarNotificacion = (tipo, mensaje) => {
    setNotificacion({
      mostrar: true,
      tipo,
      mensaje
    });
  };

  const ocultarNotificacion = () => {
    setNotificacion(prev => ({ ...prev, mostrar: false }));
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchResenas = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/usuarios/resenas');
        const result = await response.json();
        
        if (result.success) {
          setResenas(result.data);
        } else {
          setError('Error al cargar las reseñas');
        }
      } catch (err) {
        setError('Error de conexión al servidor');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchResenas();
    }
  }, [user]);

  const enviarResena = async (productoId) => {
    setEnviando(true);
    try {
      const response = await fetch(`/api/productos/${productoId}/resenas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formResena,
          editando: editandoResena !== null
        })
      });

      const result = await response.json();

      if (result.success) {
        setMostrarFormulario(null);
        setEditandoResena(null);
        setFormResena({ puntuacion: 5, comentario: '' });
        
        // Recargar reseñas
        const res = await fetch('/api/usuarios/resenas');
        const data = await res.json();
        if (data.success) {
          setResenas(data.data);
        }
        
        mostrarNotificacion(
          'exito', 
          result.editada ? '✨ ¡Reseña actualizada correctamente!' : '✨ ¡Reseña añadida correctamente!'
        );
      } else {
        mostrarNotificacion('error', result.error || 'Error al enviar la reseña');
      }
    } catch (error) {
      console.error('Error:', error);
      mostrarNotificacion('error', 'Error al conectar con el servidor');
    } finally {
      setEnviando(false);
    }
  };

  const abrirFormularioEdicion = (resena) => {
    setEditandoResena(resena.id);
    setFormResena({
      puntuacion: resena.puntuacion,
      comentario: resena.comentario
    });
    setMostrarFormulario(resena.producto_id);
  };

  const abrirFormularioNuevo = (productoId) => {
    setEditandoResena(null);
    setFormResena({ puntuacion: 5, comentario: '' });
    setMostrarFormulario(productoId);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(null);
    setEditandoResena(null);
    setFormResena({ puntuacion: 5, comentario: '' });
  };

  if (authLoading || loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Cargando reseñas...</p>
      </Container>
    );
  }

  return (
    <div style={{ backgroundColor: '#F8F6F2', minHeight: '100vh', padding: '3rem 0' }}>
      <Container>
        <h1 className="fw-bold mb-4" style={{ color: '#2E7D32' }}>⭐ Mis Reseñas</h1>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* RESEÑAS PENDIENTES */}
        {resenas.pendientes?.length > 0 && (
          <>
            <h3 className="mb-3" style={{ color: '#2E7D32' }}>Productos pendientes de reseñar</h3>
            <Row className="g-4 mb-5">
              {resenas.pendientes.map((item) => (
                <Col md={6} key={`${item.producto_id}`}>
                  <Card className="border-0 shadow-sm" style={{ borderRadius: '20px' }}>
                    <Card.Body>
                      <div className="d-flex align-items-center">
                        <div style={{ width: '80px', height: '80px', position: 'relative', marginRight: '15px' }}>
                          <Image
                            src={item.producto_imagen || '/imagenes/placeholder.jpg'}
                            alt={item.producto_nombre}
                            fill
                            sizes="80px"
                            style={{ objectFit: 'cover', borderRadius: '15px' }}
                          />
                        </div>
                        <div className="flex-grow-1">
                          <h5 style={{ color: '#2E7D32' }}>{item.producto_nombre}</h5>
                          <Button
                            onClick={() => abrirFormularioNuevo(item.producto_id)}
                            style={{
                              backgroundColor: '#A8E6CF',
                              borderColor: '#A8E6CF',
                              color: '#2E7D32',
                              borderRadius: '30px',
                              padding: '0.5rem 1rem',
                              marginTop: '0.5rem'
                            }}
                          >
                            Dejar reseña
                          </Button>
                        </div>
                      </div>

                      {mostrarFormulario === item.producto_id && !editandoResena && (
                        <Form className="mt-3">
                          <Form.Group className="mb-3">
                            <Form.Label style={{ color: '#6B5E4A' }}>Puntuación</Form.Label>
                            <div className="d-flex gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                  key={star}
                                  size={30}
                                  style={{
                                    cursor: 'pointer',
                                    color: star <= formResena.puntuacion ? '#FFD700' : '#E0E0E0'
                                  }}
                                  onClick={() => setFormResena({ ...formResena, puntuacion: star })}
                                />
                              ))}
                            </div>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label style={{ color: '#6B5E4A' }}>Comentario</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={formResena.comentario}
                              onChange={(e) => setFormResena({ ...formResena, comentario: e.target.value })}
                              style={{ borderRadius: '15px' }}
                            />
                          </Form.Group>

                          <div className="d-flex gap-2">
                            <Button
                              onClick={() => enviarResena(item.producto_id)}
                              disabled={enviando}
                              style={{
                                backgroundColor: '#A8E6CF',
                                borderColor: '#A8E6CF',
                                color: '#2E7D32',
                                borderRadius: '30px'
                              }}
                            >
                              {enviando ? 'Enviando...' : 'Enviar reseña'}
                            </Button>
                            <Button
                              variant="outline-secondary"
                              onClick={cerrarFormulario}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </Form>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}

        {/* RESEÑAS ESCRITAS */}
        <h3 className="mb-3" style={{ color: '#2E7D32' }}>Tus reseñas</h3>
        {resenas.escritas?.length === 0 ? (
          <Card className="text-center py-5 border-0 shadow-sm" style={{ borderRadius: '25px' }}>
            <Card.Body>
              <span style={{ fontSize: '4rem' }}>📝</span>
              <h4 className="mt-3" style={{ color: '#2E7D32' }}>No has escrito ninguna reseña aún</h4>
              {resenas.pendientes?.length === 0 && (
                <p className="text-muted">¡Compra algún producto para poder reseñarlo!</p>
              )}
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-4">
            {resenas.escritas.map((resena) => (
              <Col md={6} key={resena.id}>
                <Card className="border-0 shadow-sm" style={{ borderRadius: '20px' }}>
                  <Card.Body>
                    <div className="d-flex align-items-start mb-3">
                      <div style={{ width: '60px', height: '60px', position: 'relative', marginRight: '15px' }}>
                        <Image
                          src={resena.producto_imagen || '/imagenes/placeholder.jpg'}
                          alt={resena.producto_nombre}
                          fill
                          sizes="60px"
                          style={{ objectFit: 'cover', borderRadius: '10px' }}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <Link href={`/tienda/${resena.producto_id}`} style={{ color: '#2E7D32', textDecoration: 'none' }}>
                            <h5>{resena.producto_nombre}</h5>
                          </Link>
                          <Button
                            variant="link"
                            onClick={() => abrirFormularioEdicion(resena)}
                            style={{ color: '#2E7D32', padding: 0 }}
                          >
                            <FaEdit size={20} />
                          </Button>
                        </div>
                        <div className="d-flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              color={star <= resena.puntuacion ? '#FFD700' : '#E0E0E0'}
                            />
                          ))}
                        </div>
                        {resena.editada && (
                          <Badge style={{ backgroundColor: '#A8E6CF', color: '#2E7D32', marginTop: '0.5rem' }}>
                            ✏️ Editada
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p style={{ color: '#6B5E4A' }}>{resena.comentario}</p>
                    <div className="d-flex justify-content-between">
                      <small style={{ color: '#9E9E9E' }}>
                        Publicada: {new Date(resena.fecha).toLocaleDateString('es-ES')}
                      </small>
                      {resena.fecha_edicion && (
                        <small style={{ color: '#9E9E9E' }}>
                          Editada: {new Date(resena.fecha_edicion).toLocaleDateString('es-ES')}
                        </small>
                      )}
                    </div>

                    {mostrarFormulario === resena.producto_id && editandoResena === resena.id && (
                      <Form className="mt-3 border-top pt-3">
                        <Form.Group className="mb-3">
                          <Form.Label style={{ color: '#6B5E4A' }}>Puntuación</Form.Label>
                          <div className="d-flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                size={30}
                                style={{
                                  cursor: 'pointer',
                                  color: star <= formResena.puntuacion ? '#FFD700' : '#E0E0E0'
                                }}
                                onClick={() => setFormResena({ ...formResena, puntuacion: star })}
                              />
                            ))}
                          </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label style={{ color: '#6B5E4A' }}>Comentario</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={formResena.comentario}
                            onChange={(e) => setFormResena({ ...formResena, comentario: e.target.value })}
                            style={{ borderRadius: '15px' }}
                          />
                        </Form.Group>

                        <div className="d-flex gap-2">
                          <Button
                            onClick={() => enviarResena(resena.producto_id)}
                            disabled={enviando}
                            style={{
                              backgroundColor: '#A8E6CF',
                              borderColor: '#A8E6CF',
                              color: '#2E7D32',
                              borderRadius: '30px'
                            }}
                          >
                            {enviando ? 'Guardando...' : 'Guardar cambios'}
                          </Button>
                          <Button
                            variant="outline-secondary"
                            onClick={cerrarFormulario}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* COMPONENTE DE NOTIFICACIÓN */}
        <Notificacion
          tipo={notificacion.tipo}
          mensaje={notificacion.mensaje}
          mostrar={notificacion.mostrar}
          onClose={ocultarNotificacion}
          duracion={3000}
        />
      </Container>
    </div>
  );
}