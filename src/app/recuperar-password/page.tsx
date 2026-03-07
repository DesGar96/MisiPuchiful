"use client";

import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import { RecuperarPasswordFormData } from '@/types/recuperar-password'; // 👈 IMPORTAMOS EL TIPO

export default function RecuperarPasswordPage() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1); // 1: solicitar datos, 2: cambiar contraseña
  const [formData, setFormData] = useState<RecuperarPasswordFormData>({
    email: '',
    telefono: '',
    nuevaPassword: '',
    confirmarPassword: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const verificarDatos = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validación básica
      if (!formData.email || !formData.telefono) {
        setError('Por favor completa todos los campos');
        setLoading(false);
        return;
      }

      // Aquí iría tu lógica de verificación con la API
      // Por ahora, simulamos verificación exitosa
      setTimeout(() => {
        setStep(2);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      setError('Error al verificar los datos');
      setLoading(false);
    }
  };

  const cambiarPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validar que las contraseñas coincidan
    if (formData.nuevaPassword !== formData.confirmarPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    // Validar longitud mínima
    if (formData.nuevaPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/recuperar-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          telefono: formData.telefono,
          nuevaPassword: formData.nuevaPassword
        })
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Contraseña actualizada correctamente');
        setTimeout(() => router.push('/'), 3000);
      } else {
        setError(result.error || 'Error al cambiar la contraseña');
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
                    🔐 Recuperar Contraseña
                  </h2>

                  {success && (
                    <Alert variant="success" style={{ backgroundColor: '#E8F5E9', borderColor: '#A8E6CF' }}>
                      {success}
                    </Alert>
                  )}

                  {error && <Alert variant="danger">{error}</Alert>}

                  {step === 1 ? (
                    <Form onSubmit={verificarDatos}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: '#6B5E4A' }}>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label style={{ color: '#6B5E4A' }}>Teléfono</Form.Label>
                        <Form.Control
                          type="tel"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                          required
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
                        {loading ? <Spinner animation="border" size="sm" /> : 'Verificar datos'}
                      </Button>
                    </Form>
                  ) : (
                    <Form onSubmit={cambiarPassword}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: '#6B5E4A' }}>Nueva contraseña</Form.Label>
                        <Form.Control
                          type="password"
                          name="nuevaPassword"
                          value={formData.nuevaPassword}
                          onChange={handleChange}
                          required
                          style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label style={{ color: '#6B5E4A' }}>Confirmar contraseña</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmarPassword"
                          value={formData.confirmarPassword}
                          onChange={handleChange}
                          required
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
                        {loading ? <Spinner animation="border" size="sm" /> : 'Cambiar contraseña'}
                      </Button>
                    </Form>
                  )}

                  <div className="text-center mt-4">
                    <Button 
                      variant="link" 
                      onClick={() => setShowLogin(true)}
                      style={{ color: '#2E7D32', textDecoration: 'none' }}
                    >
                      ← Volver al inicio de sesión
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