"use client";

import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import Image from 'next/image';
import { ContactoFormData } from '@/types/contacto';

export default function ContactoPage() {
  const [formData, setFormData] = useState<ContactoFormData>({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setFormData({ nombre: '', email: '', telefono: '', mensaje: '' });
      } else {
        setError(result.error || 'Error al enviar el mensaje');
      }
    } catch (err) {
      setError('Error de conexión al servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#F8F6F2', minHeight: '100vh', padding: 0 }}>
      
      {/* CABECERA */}
      <div style={{ 
        background: 'linear-gradient(135deg, #A8E6CF 0%, #B5EAD7 50%, #C7E9C0 100%)',
        color: '#6B5E4A',
        padding: '3rem 0',
        marginTop: 0,
        marginBottom: 0,
        borderRadius: '0 0 50px 50px',
        textAlign: 'center',
        width: '100%'
      }}>
        <Container>
          <h1 className="display-3 fw-bold mb-3" style={{ color: '#2E7D32' }}>
            📬 Contáctanos
          </h1>
          <p className="lead fs-4" style={{ color: '#6B5E4A' }}>
            ¿Tienes alguna pregunta o sugerencia? ¡Escríbenos!
          </p>
        </Container>
      </div>

      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="border-0 shadow-lg" style={{ 
              borderRadius: '30px',
              backgroundColor: '#FFFFFF',
              overflow: 'hidden'
            }}>
              <Row className="g-0">
                {/* Lado izquierdo - Información de contacto */}
                <Col md={5} style={{ 
                  background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
                  padding: '2rem'
                }}>
                  <div className="text-center mb-4">
                    <span style={{ fontSize: '4rem' }}>🐾</span>
                    <h3 className="fw-bold mt-3" style={{ color: '#2E7D32' }}>Misipuchiful</h3>
                    <p style={{ color: '#6B5E4A' }}>Cuidando a tus peludos con amor</p>
                  </div>

                  <div className="mt-5">
                    <div className="d-flex align-items-center mb-4">
                      <div style={{ 
                        backgroundColor: '#A8E6CF',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '15px'
                      }}>
                        <span style={{ fontSize: '1.5rem' }}>📍</span>
                      </div>
                      <div>
                        <small style={{ color: '#9E9E9E' }}>Dirección</small>
                        <p style={{ color: '#2E7D32', fontWeight: 'bold', margin: 0 }}>
                          Calle de las Mascotas, 123
                        </p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-4">
                      <div style={{ 
                        backgroundColor: '#A8E6CF',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '15px'
                      }}>
                        <span style={{ fontSize: '1.5rem' }}>📞</span>
                      </div>
                      <div>
                        <small style={{ color: '#9E9E9E' }}>Teléfono</small>
                        <p style={{ color: '#2E7D32', fontWeight: 'bold', margin: 0 }}>
                          +34 123 456 789
                        </p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-4">
                      <div style={{ 
                        backgroundColor: '#A8E6CF',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '15px'
                      }}>
                        <span style={{ fontSize: '1.5rem' }}>✉️</span>
                      </div>
                      <div>
                        <small style={{ color: '#9E9E9E' }}>Email</small>
                        <p style={{ color: '#2E7D32', fontWeight: 'bold', margin: 0 }}>
                          info@misipuchiful.com
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-5">
                    <span style={{ fontSize: '3rem', marginRight: '0.5rem' }}>🐕</span>
                    <span style={{ fontSize: '3rem', marginRight: '0.5rem' }}>🐈</span>
                    <span style={{ fontSize: '3rem' }}>🐇</span>
                  </div>
                </Col>

                {/* Lado derecho - Formulario */}
                <Col md={7} style={{ padding: '2rem' }}>
                  <h3 className="fw-bold mb-4" style={{ color: '#2E7D32' }}>
                    Envíanos un mensaje
                  </h3>

                  {success && (
                    <Alert style={{ 
                      backgroundColor: '#E8F5E9', 
                      borderColor: '#A8E6CF', 
                      color: '#2E7D32' 
                    }}>
                      ¡Mensaje enviado correctamente! Te responderemos pronto.
                    </Alert>
                  )}

                  {error && (
                    <Alert variant="danger">
                      {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: '#6B5E4A', fontWeight: 'bold' }}>
                        Nombre completo *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        style={{
                          borderRadius: '15px',
                          border: '2px solid #E8F5E9',
                          padding: '0.75rem',
                          backgroundColor: '#F8F6F2'
                        }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: '#6B5E4A', fontWeight: 'bold' }}>
                        Email *
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                          borderRadius: '15px',
                          border: '2px solid #E8F5E9',
                          padding: '0.75rem',
                          backgroundColor: '#F8F6F2'
                        }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: '#6B5E4A', fontWeight: 'bold' }}>
                        Teléfono
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        style={{
                          borderRadius: '15px',
                          border: '2px solid #E8F5E9',
                          padding: '0.75rem',
                          backgroundColor: '#F8F6F2'
                        }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label style={{ color: '#6B5E4A', fontWeight: 'bold' }}>
                        Mensaje *
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleChange}
                        required
                        rows={5}
                        style={{
                          borderRadius: '15px',
                          border: '2px solid #E8F5E9',
                          padding: '0.75rem',
                          backgroundColor: '#F8F6F2',
                          resize: 'vertical'
                        }}
                      />
                    </Form.Group>

                    <Button
                      type="submit"
                      disabled={loading}
                      style={{
                        backgroundColor: '#A8E6CF',
                        borderColor: '#A8E6CF',
                        color: '#2E7D32',
                        borderRadius: '30px',
                        padding: '0.75rem 2rem',
                        fontWeight: 'bold',
                        width: '100%'
                      }}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            style={{ marginRight: '0.5rem' }}
                          />
                          Enviando...
                        </>
                      ) : (
                        'Enviar mensaje ✨'
                      )}
                    </Button>
                  </Form>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}