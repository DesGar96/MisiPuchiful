"use client";

import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function CrearAdminPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    direccion: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Verificar que es admin
  if (!user || !isAdmin()) {
    router.push('/');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validar contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/crear-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password,
          telefono: formData.telefono,
          direccion: formData.direccion
        })
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(`Administrador creado correctamente con ID: ${result.id}`);
        setFormData({
          nombre: '',
          email: '',
          password: '',
          confirmPassword: '',
          telefono: '',
          direccion: ''
        });
      } else {
        setError(result.error || 'Error al crear administrador');
      }
    } catch (err) {
      setError('Error de conexión al servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#F8F6F2', minHeight: '100vh', padding: '3rem 0' }}>
      <Container>
        <div style={{ 
          background: 'linear-gradient(135deg, #A8E6CF 0%, #B5EAD7 50%, #C7E9C0 100%)',
          color: '#6B5E4A',
          padding: '2rem 0',
          marginBottom: '2rem',
          borderRadius: '0 0 50px 50px',
          textAlign: 'center'
        }}>
          <h1 className="display-4 fw-bold mb-3" style={{ color: '#2E7D32' }}>
            👑 Crear Nuevo Administrador
          </h1>
          <p className="lead fs-4" style={{ color: '#6B5E4A' }}>
            Solo los administradores pueden crear nuevas cuentas de admin
          </p>
        </div>

        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="border-0 shadow-lg" style={{ borderRadius: '30px', padding: '2rem' }}>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

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
                      style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
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
                      style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#6B5E4A', fontWeight: 'bold' }}>
                      Contraseña *
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
                    />
                    <Form.Text className="text-muted">
                      Mínimo 6 caracteres
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#6B5E4A', fontWeight: 'bold' }}>
                      Confirmar contraseña *
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#6B5E4A' }}>
                      Teléfono
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label style={{ color: '#6B5E4A' }}>
                      Dirección
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
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
                      padding: '0.75rem',
                      width: '100%',
                      fontWeight: 'bold'
                    }}
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : 'Crear Administrador'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}