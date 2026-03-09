"use client";

import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoginForm from '@/components/LoginForm';
import { RegistroFormData } from '@/types/registro'; 

export default function RegistroPage() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [formData, setFormData] = useState<RegistroFormData>({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    direccion: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Validación para teléfono (solo números, máximo 9 dígitos)
    if (name === 'telefono') {
      if (value === '' || /^\d{0,9}$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validar contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    // Validar teléfono (obligatorio)
    if (!formData.telefono || formData.telefono.length !== 9) {
      setError('El teléfono es obligatorio y debe tener 9 dígitos');
      setLoading(false);
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, introduce un email válido');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/registro', {
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
        setSuccess('¡Registro completado! Serás redirigido al inicio de sesión...');
        setTimeout(() => {
          setShowLogin(true); // Abre el modal de login después del registro
        }, 2000);
      } else {
        setError(result.error || 'Error al registrar usuario');
      }
    } catch (err) {
      setError('Error de conexión al servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ backgroundColor: '#F8F6F2', minHeight: '100vh', padding: '3rem 0' }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card style={{ borderRadius: '30px', border: 'none', padding: '2rem' }}>
                <Card.Body>
                  <h2 className="text-center mb-4" style={{ color: '#2E7D32' }}>
                    📝 Crear cuenta
                  </h2>

                  {success && (
                    <Alert variant="success" style={{ backgroundColor: '#E8F5E9', borderColor: '#A8E6CF' }}>
                      {success}
                    </Alert>
                  )}

                  {error && <Alert variant="danger">{error}</Alert>}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: '#6B5E4A' }}>
                        Nombre completo <span style={{ color: '#FF8B94' }}>*</span>
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
                      <Form.Label style={{ color: '#6B5E4A' }}>
                        Email <span style={{ color: '#FF8B94' }}>*</span>
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
                      <Form.Label style={{ color: '#6B5E4A' }}>
                        Contraseña <span style={{ color: '#FF8B94' }}>*</span>
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
                      <Form.Label style={{ color: '#6B5E4A' }}>
                        Confirmar contraseña <span style={{ color: '#FF8B94' }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
                      />
                      <Form.Text className="text-muted">
                        Repita la contraseña
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: '#6B5E4A' }}>
                        Teléfono <span style={{ color: '#FF8B94' }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                        maxLength={9}
                        style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
                      />
                      <Form.Text className="text-muted">
                        9 dígitos, solo números 
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label style={{ color: '#6B5E4A' }}>
                        Dirección <span style={{ color: '#9E9E9E' }}>(opcional)</span>
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
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
                      {loading ? <Spinner animation="border" size="sm" /> : 'Registrarse'}
                    </Button>
                  </Form>

                  <div className="text-center mt-4">
                    <span style={{ color: '#6B5E4A' }}>¿Ya tienes cuenta? </span>
                    <Button 
                      variant="link" 
                      onClick={() => setShowLogin(true)}
                      style={{ color: '#2E7D32', fontWeight: 'bold', textDecoration: 'none' }}
                    >
                      Inicia sesión aquí
                    </Button>
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