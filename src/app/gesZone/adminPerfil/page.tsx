"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '@/context/AuthContext';

// Definir la interfaz para los datos del usuario
interface UserData {
  id: number;
  nombre: string;
  email: string;
  rol: 'usuario' | 'admin';
}

export default function PerfilPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  
  // Formulario de edición
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  });

  // Cargar datos del usuario
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
    
    if (user) {
      fetchUserData();
    }
  }, [user, authLoading, router]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/usuariosnp/perfil'); 
      const data = await response.json();
      
      if (data.success) {
        setUserData(data.user);
        setFormData({
          nombre: data.user.nombre || '',
          email: data.user.email || '',
          telefono: data.user.telefono || '',
          direccion: data.user.direccion || ''
        });
      } else {
        setError('Error al cargar los datos del perfil');
      }
    } catch (error) {
      setError('Error de conexión al servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/api/usuarios/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          telefono: formData.telefono,
          direccion: formData.direccion
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Datos actualizados correctamente');
        setEditMode(false);
        fetchUserData(); // Recargar datos
      } else {
        setError(data.error || 'Error al actualizar');
      }
    } catch (error) {
      setError('Error de conexión al servidor');
    }
  };

  if (authLoading || loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando perfil...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white border-0 pt-4">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="fw-bold mb-0">Mi Perfil</h3>
                {!editMode && (
                  <Button 
                    variant="outline-primary" 
                    onClick={() => setEditMode(true)}
                  >
                    Editar Perfil
                  </Button>
                )}
              </div>
            </Card.Header>
            
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              {!editMode ? (
                // MODO VISUALIZACIÓN
                <div>
                  <div className="mb-4 text-center">
                    <div className="bg-success bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
                         style={{ width: '100px', height: '100px' }}>
                      <span className="fs-1 text-success">
                        {userData?.nombre?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <h4>{userData?.nombre}</h4>
                  </div>
                  
                  <Row>
                    <Col sm={4} className="text-muted">Email:</Col>
                    <Col sm={8} className="fw-bold">{userData?.email}</Col>
                  </Row>
                  <hr />
                  
                  <Row>
                    <Col sm={4} className="text-muted">Rol:</Col>
                    <Col sm={8}>
                      <span className={`badge ${userData?.rol === 'admin' ? 'bg-danger' : 'bg-success'}`}>
                        {userData?.rol === 'admin' ? 'Administrador' : 'Usuario'}
                      </span>
                    </Col>
                  </Row>
                </div>
              ) : (
                // MODO EDICIÓN
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre completo</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled // El email no se puede cambiar
                    />
                    <Form.Text className="text-muted">
                      El email no se puede modificar
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="Ej: 600 123 456"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      placeholder="Tu dirección completa"
                    />
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button variant="success" type="submit">
                      Guardar Cambios
                    </Button>
                    <Button variant="outline-secondary" onClick={() => setEditMode(false)}>
                      Cancelar
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}