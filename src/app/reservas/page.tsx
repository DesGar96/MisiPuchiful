"use client";

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Notificacion from '@/components/Notificacion';
import LoginForm from '@/components/LoginForm'; // ← IMPORTANTE: AÑADIDO

export default function ReservasPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [showLogin, setShowLogin] = useState(false); // ← AÑADIDO
  const [formData, setFormData] = useState({
    tipo_servicio: '',
    tipo_mascota: '',
    fecha: '',
    hora: '',
    mascota_nombre: '',
    observaciones: ''
  });
  
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reservaId, setReservaId] = useState(null);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);
  
  // Estado para la notificación
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
      console.log('Usuario no autenticado');
    }
  }, [user, authLoading, router]);

  // Cargar horarios disponibles cuando se selecciona fecha y servicio
  useEffect(() => {
    if (formData.fecha && formData.tipo_servicio) {
      fetchHorariosDisponibles();
    } else {
      setHorariosDisponibles([]);
    }
  }, [formData.fecha, formData.tipo_servicio]);

  const fetchHorariosDisponibles = async () => {
    setCargandoHorarios(true);
    setHorariosDisponibles([]);
    try {
      const response = await fetch(
        `/api/reservas/disponibilidad?fecha=${formData.fecha}&tipo_servicio=${formData.tipo_servicio}`
      );
      const data = await response.json();
      
      if (data.success) {
        setHorariosDisponibles(data.horarios || []);
      } else {
        setHorariosDisponibles([]);
      }
    } catch (error) {
      console.error('Error al cargar horarios:', error);
      setHorariosDisponibles([]);
    } finally {
      setCargandoHorarios(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'fecha' || name === 'tipo_servicio') {
      setFormData(prev => ({ ...prev, hora: '' }));
      setHorariosDisponibles([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validación: no permitir reservas para hoy
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const fechaSeleccionada = new Date(formData.fecha);
    fechaSeleccionada.setHours(0, 0, 0, 0);
    
    if (fechaSeleccionada <= hoy) {
      mostrarNotificacion('error', 'No puedes reservar para hoy. Elige una fecha a partir de mañana.');
      setLoading(false);
      return;
    }

    if (!formData.hora) {
      mostrarNotificacion('error', 'Debes seleccionar una hora disponible');
      setLoading(false);
      return;
    }

    if (!formData.tipo_mascota) {
      mostrarNotificacion('error', 'Debes seleccionar el tipo de mascota');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setReservaId(result.reservaId);
        mostrarNotificacion('exito', `¡Reserva #${result.reservaId} creada con éxito!`);
        setFormData({
          tipo_servicio: '',
          tipo_mascota: '',
          fecha: '',
          hora: '',
          mascota_nombre: '',
          observaciones: ''
        });
      } else {
        mostrarNotificacion('error', result.error || 'Error al crear la reserva');
      }
    } catch (err) {
      mostrarNotificacion('error', 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // Calcular la fecha mínima (mañana)
  const getMinDate = () => {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    return manana.toISOString().split('T')[0];
  };

  if (authLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }

  if (!user) {
    return (
      <>
        <div style={{ backgroundColor: '#F8F6F2', minHeight: '100vh', padding: '3rem 0' }}>
          <Container>
            <div style={{ 
              background: 'linear-gradient(135deg, #A8E6CF 0%, #B5EAD7 50%, #C7E9C0 100%)',
              color: '#6B5E4A',
              padding: '3rem 0',
              marginBottom: '3rem',
              borderRadius: '0 0 50px 50px',
              textAlign: 'center'
            }}>
              <h1 className="display-4 fw-bold mb-3" style={{ color: '#2E7D32' }}>
                📅 Reserva tu cita
              </h1>
              <p className="lead fs-4" style={{ color: '#6B5E4A' }}>
                Peluquería y consultas veterinarias para tus peludos
              </p>
            </div>

            <Row className="justify-content-center">
              <Col md={8} lg={6}>
                <Card className="border-0 shadow-lg text-center" style={{ borderRadius: '30px', padding: '3rem' }}>
                  <Card.Body>
                    <span style={{ fontSize: '5rem', display: 'block', marginBottom: '1rem' }}>🔒</span>
                    
                    <h2 style={{ color: '#2E7D32', marginBottom: '1.5rem' }}>
                      Acceso restringido
                    </h2>
                    
                    <p style={{ color: '#6B5E4A', fontSize: '1.2rem', marginBottom: '2rem' }}>
                      Para poder realizar una reserva necesitas tener una cuenta en Misipuchiful.
                    </p>
                    
                    <p style={{ color: '#6B5E4A', marginBottom: '2rem' }}>
                      Si ya tienes cuenta, inicia sesión. Si no, regístrate en unos segundos.
                    </p>
                    
                    <div className="d-flex gap-3 justify-content-center">
                      <Button
                        onClick={() => setShowLogin(true)} // ← CORREGIDO
                        style={{
                          backgroundColor: '#A8E6CF',
                          borderColor: '#A8E6CF',
                          color: '#2E7D32',
                          borderRadius: '30px',
                          padding: '0.75rem 2rem',
                          fontWeight: 'bold'
                        }}
                      >
                        Iniciar Sesión
                      </Button>
                      
                      <Link href="/registro" passHref>
                        <Button
                          style={{
                            backgroundColor: 'white',
                            borderColor: '#A8E6CF',
                            color: '#2E7D32',
                            borderRadius: '30px',
                            padding: '0.75rem 2rem',
                            fontWeight: 'bold'
                          }}
                        >
                          Crear cuenta
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="mt-4 p-3" style={{ backgroundColor: '#E8F5E9', borderRadius: '15px' }}>
                      <p className="mb-0" style={{ color: '#6B5E4A' }}>
                        📞 También puedes llamarnos al <strong>123 456 789</strong> para reservar por teléfono.
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>

        {/* Modal de Login */}
        <LoginForm show={showLogin} onHide={() => setShowLogin(false)} />
      </>
    );
  }

  return (
    <div style={{ backgroundColor: '#F8F6F2', minHeight: '100vh', padding: '3rem 0' }}>
      <Container>
        <div style={{ 
          background: 'linear-gradient(135deg, #A8E6CF 0%, #B5EAD7 50%, #C7E9C0 100%)',
          color: '#6B5E4A',
          padding: '3rem 0',
          marginBottom: '3rem',
          borderRadius: '0 0 50px 50px',
          textAlign: 'center'
        }}>
          <h1 className="display-4 fw-bold mb-3" style={{ color: '#2E7D32' }}>
            📅 Reserva tu cita
          </h1>
          <p className="lead fs-4" style={{ color: '#6B5E4A' }}>
            Peluquería y consultas veterinarias para tus peludos
          </p>
        </div>
        
        <Row className="g-4">
          <Col lg={7}>
            <Card className="border-0 shadow-lg" style={{ borderRadius: '30px', overflow: 'hidden' }}>
              <Card.Header style={{ 
                background: 'linear-gradient(135deg, #B5EAD7 0%, #C7E9C0 100%)',
                border: 'none',
                padding: '1.5rem'
              }}>
                <h3 className="fw-bold mb-0" style={{ color: '#2E7D32' }}>📋 Formulario de reserva</h3>
              </Card.Header>
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label style={{ color: '#6B5E4A', fontWeight: 'bold' }}>
                          Tipo de servicio *
                        </Form.Label>
                        <Form.Select
                          name="tipo_servicio"
                          value={formData.tipo_servicio}
                          onChange={handleChange}
                          required
                          style={{ 
                            borderRadius: '15px', 
                            border: '2px solid #E8F5E9',
                            padding: '0.75rem'
                          }}
                        >
                          <option value="">Selecciona un servicio</option>
                          <option value="peluqueria">🐕 Peluquería (2 horas)</option>
                          <option value="veterinario">🏥 Veterinario (1 hora)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label style={{ color: '#6B5E4A', fontWeight: 'bold' }}>
                          Tipo de mascota *
                        </Form.Label>
                        <Form.Select
                          name="tipo_mascota"
                          value={formData.tipo_mascota}
                          onChange={handleChange}
                          required
                          style={{ 
                            borderRadius: '15px', 
                            border: '2px solid #E8F5E9',
                            padding: '0.75rem'
                          }}
                        >
                          <option value="">Selecciona tipo</option>
                          <option value="perro">🐕 Perro</option>
                          <option value="gato">🐈 Gato</option>
                          <option value="otro">🐾 Otras especies</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label style={{ color: '#6B5E4A', fontWeight: 'bold' }}>
                          Fecha *
                        </Form.Label>
                        <Form.Control
                          type="date"
                          name="fecha"
                          value={formData.fecha}
                          onChange={handleChange}
                          min={getMinDate()}
                          required
                          style={{ 
                            borderRadius: '15px', 
                            border: '2px solid #E8F5E9',
                            padding: '0.75rem'
                          }}
                        />
                        <Form.Text className="text-muted">
                          Mínimo 24 horas de antelación
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label style={{ color: '#6B5E4A', fontWeight: 'bold' }}>
                          Hora *
                        </Form.Label>
                        {cargandoHorarios ? (
                          <div className="text-center py-2">
                            <Spinner animation="border" size="sm" variant="success" />
                            <span className="ms-2 text-muted">Cargando horarios...</span>
                          </div>
                        ) : (
                          <Form.Select
                            name="hora"
                            value={formData.hora}
                            onChange={handleChange}
                            required
                            disabled={!formData.fecha || !formData.tipo_servicio}
                            style={{ 
                              borderRadius: '15px', 
                              border: '2px solid #E8F5E9',
                              padding: '0.75rem'
                            }}
                          >
                            <option value="">
                              {!formData.fecha || !formData.tipo_servicio 
                                ? 'Primero selecciona fecha y servicio' 
                                : horariosDisponibles.length === 0 
                                  ? 'No hay horas disponibles' 
                                  : 'Selecciona una hora'}
                            </option>
                            {horariosDisponibles.map(hora => (
                              <option key={hora} value={hora}>{hora}</option>
                            ))}
                          </Form.Select>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label style={{ color: '#6B5E4A', fontWeight: 'bold' }}>
                      Nombre de la mascota *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="mascota_nombre"
                      value={formData.mascota_nombre}
                      onChange={handleChange}
                      placeholder="Ej: Max"
                      required
                      style={{ 
                        borderRadius: '15px', 
                        border: '2px solid #E8F5E9',
                        padding: '0.75rem'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label style={{ color: '#6B5E4A', fontWeight: 'bold' }}>
                      Observaciones
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleChange}
                      placeholder="Alguna indicación especial sobre tu mascota..."
                      style={{ 
                        borderRadius: '15px', 
                        border: '2px solid #E8F5E9',
                        padding: '0.75rem'
                      }}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={loading || !formData.hora}
                    style={{
                      backgroundColor: '#A8E6CF',
                      borderColor: '#A8E6CF',
                      color: '#2E7D32',
                      borderRadius: '30px',
                      padding: '1rem',
                      width: '100%',
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }}
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : 'Confirmar reserva'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={5}>
            <Card className="border-0 shadow-lg" style={{ borderRadius: '30px', overflow: 'hidden' }}>
              <Card.Header style={{ 
                background: 'linear-gradient(135deg, #FFD3B6 0%, #FFE5D0 100%)',
                border: 'none',
                padding: '1.5rem'
              }}>
                <h3 className="fw-bold mb-0" style={{ color: '#2E7D32' }}>ℹ️ Información útil</h3>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="mb-4">
                  <h5 style={{ color: '#2E7D32' }}>🕒 Horarios disponibles:</h5>
                  <p style={{ color: '#6B5E4A' }}>Lunes a Viernes: 9:00 - 14:00 | 16:00 - 20:00</p>
                  <p style={{ color: '#6B5E4A' }}>Sábados: 10:00 - 14:00</p>
                </div>

                <div className="mb-4">
                  <h5 style={{ color: '#2E7D32' }}>⏱️ Duración de los servicios:</h5>
                  <ul style={{ color: '#6B5E4A' }}>
                    <li>🐕 Peluquería: 2 horas por mascota</li>
                    <li>🏥 Veterinario: 1 hora por consulta</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h5 style={{ color: '#2E7D32' }}>📞 Contacto directo:</h5>
                  <p style={{ color: '#6B5E4A' }}>Teléfono: 123 456 789</p>
                  <p style={{ color: '#6B5E4A' }}>Email: reservas@misipuchiful.com</p>
                </div>

                <div className="mt-4 p-3" style={{ backgroundColor: '#E8F5E9', borderRadius: '15px' }}>
                  <p className="mb-2" style={{ color: '#2E7D32', fontWeight: 'bold' }}>📝 Importante:</p>
                  <ul className="mb-0" style={{ color: '#6B5E4A' }}>
                    <li>Solo usuarios registrados pueden reservar online</li>
                    <li>No se admiten reservas para el mismo día</li>
                    <li>Las reservas están sujetas a disponibilidad</li>
                  </ul>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Notificación flotante */}
        <Notificacion
          tipo={notificacion.tipo}
          mensaje={notificacion.mensaje}
          mostrar={notificacion.mostrar}
          onClose={ocultarNotificacion}
          duracion={4000}
        />
      </Container>
    </div>
  );
}