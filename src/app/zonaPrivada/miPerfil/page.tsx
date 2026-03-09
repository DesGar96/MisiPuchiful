"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { useAuth } from '@/context/AuthContext';
import { UsuarioPerfil, PerfilFormData, PerfilApiResponse } from '@/types/perfil'; 

export default function PerfilPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<UsuarioPerfil | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [cambiandoPassword, setCambiandoPassword] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<PerfilFormData>({
    nombre: '',
    email: '',
    telefono: '',
    tipo_via: '',
    nombre_via: '',
    numero_via: '',
    piso: '',
    codigo_postal: '',
    ciudad: '',
    direccion: '',
    password: '',
    nuevaPassword: '',
    confirmarPassword: ''
  });

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
      const response = await fetch('/api/usuarios/perfil');
      const data: PerfilApiResponse = await response.json();
      
      if (data.success && data.user) {
        setUserData(data.user);
        setFormData({
          nombre: data.user.nombre || '',
          email: data.user.email || '',
          telefono: data.user.telefono || '',
          tipo_via: data.user.tipo_via || '',
          nombre_via: data.user.nombre_via || '',
          numero_via: data.user.numero_via || '',
          piso: data.user.piso || '',
          codigo_postal: data.user.codigo_postal || '',
          ciudad: data.user.ciudad || '',
          direccion: data.user.direccion || '',
          password: '',
          nuevaPassword: '',
          confirmarPassword: ''
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Validaciones específicas
    if (name === 'telefono') {
      if (value === '' || /^\d{0,9}$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'numero_via') {
      if (value === '' || /^\d*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'codigo_postal') {
      if (value === '' || /^\d{0,5}$/.test(value)) {
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
    
    // Validar contraseñas si se está cambiando
    if (cambiandoPassword) {
      if (formData.nuevaPassword !== formData.confirmarPassword) {
        setError('Las contraseñas nuevas no coinciden');
        return;
      }
      if (formData.nuevaPassword.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }
    }

    // Validar teléfono 
    if (formData.telefono && formData.telefono.length !== 9) {
      setError('El teléfono debe tener 9 dígitos');
      return;
    }

    // Validar código postal si se proporciona
    if (formData.codigo_postal && formData.codigo_postal.length !== 5) {
      setError('El código postal debe tener 5 dígitos');
      return;
    }

    try {
      const response = await fetch('/api/usuarios/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          telefono: formData.telefono,
          tipo_via: formData.tipo_via,
          nombre_via: formData.nombre_via,
          numero_via: formData.numero_via,
          piso: formData.piso,
          codigo_postal: formData.codigo_postal,
          ciudad: formData.ciudad,
          direccion: formData.direccion,
          passwordActual: cambiandoPassword ? formData.password : undefined,
          nuevaPassword: cambiandoPassword ? formData.nuevaPassword : undefined
        })
      });
      
      const data = await response.json();

      if (data.success) {
        setSuccess('Datos actualizados correctamente');
        setEditMode(false);
        setCambiandoPassword(false);
        fetchUserData();
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
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }

  return (
    <div style={{ backgroundColor: '#F8F6F2', minHeight: '100vh', padding: '3rem 0' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="border-0 shadow-lg" style={{ borderRadius: '30px', padding: '2rem' }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ color: '#2E7D32' }}>👤 Mi Perfil</h2>
                {!editMode && (
                  <Button
                    onClick={() => setEditMode(true)}
                    style={{
                      backgroundColor: '#A8E6CF',
                      borderColor: '#A8E6CF',
                      color: '#2E7D32',
                      borderRadius: '30px',
                      padding: '0.5rem 1.5rem'
                    }}
                  >
                    Editar Perfil
                  </Button>
                )}
              </div>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              {!editMode ? (
                // MODO VISUALIZACIÓN
                <div>
                  <div className="text-center mb-4">
                    <div style={{
                      backgroundColor: '#E8F5E9',
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}>
                      <span style={{ fontSize: '3rem', color: '#2E7D32' }}>
                        {userData?.nombre?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="mt-3" style={{ color: '#2E7D32' }}>{userData?.nombre}</h3>
                    <Badge style={{
                      backgroundColor: userData?.rol === 'admin' ? '#A8E6CF' : '#FFD3B6',
                      color: '#2E7D32',
                      padding: '0.5rem 1rem',
                      borderRadius: '30px'
                    }}>
                      {userData?.rol === 'admin' ? 'Administrador' : 'Usuario'}
                    </Badge>
                  </div>

                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <small style={{ color: '#9E9E9E' }}>Email</small>
                        <p style={{ color: '#2E7D32', fontWeight: 'bold' }}>{userData?.email}</p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <small style={{ color: '#9E9E9E' }}>Teléfono</small>
                        <p style={{ color: '#2E7D32' }}>{userData?.telefono || 'No especificado'}</p>
                      </div>
                    </Col>
                  </Row>

                  <div className="mb-3">
                    <small style={{ color: '#9E9E9E' }}>Dirección</small>
                    {userData?.tipo_via && userData?.nombre_via ? (
                      <p style={{ color: '#2E7D32' }}>
                        {userData.tipo_via} {userData.nombre_via}, nº {userData.numero_via}
                        {userData.piso && `, ${userData.piso}`}
                        {userData.codigo_postal && `, CP: ${userData.codigo_postal}`}
                        {userData.ciudad && `, ${userData.ciudad}`}
                      </p>
                    ) : (
                      <p style={{ color: '#2E7D32' }}>{userData?.direccion || 'No especificada'}</p>
                    )}
                  </div>
                </div>
              ) : (
                // MODO EDICIÓN
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#6B5E4A' }}>Nombre completo</Form.Label>
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
                    <Form.Label style={{ color: '#6B5E4A' }}>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      style={{ borderRadius: '15px', backgroundColor: '#F8F6F2' }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#6B5E4A' }}>Teléfono</Form.Label>
                    <Form.Control
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      maxLength={9}
                      placeholder="600123456"
                      style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
                    />
                    <Form.Text className="text-muted">9 dígitos, solo números</Form.Text>
                  </Form.Group>

                  <h5 style={{ color: '#2E7D32', marginTop: '2rem', marginBottom: '1rem' }}>Dirección</h5>

                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: '#6B5E4A' }}>Tipo de vía</Form.Label>
                        <Form.Select
                          name="tipo_via"
                          value={formData.tipo_via}
                          onChange={handleChange}
                          style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
                        >
                          <option value="">Selecciona...</option>
                          <option value="Calle">Calle</option>
                          <option value="Avenida">Avenida</option>
                          <option value="Plaza">Plaza</option>
                          <option value="Paseo">Paseo</option>
                          <option value="Ronda">Ronda</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={5}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: '#6B5E4A' }}>Nombre de la vía</Form.Label>
                        <Form.Control
                          type="text"
                          name="nombre_via"
                          value={formData.nombre_via}
                          onChange={handleChange}
                          style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: '#6B5E4A' }}>Número</Form.Label>
                        <Form.Control
                          type="text"
                          name="numero_via"
                          value={formData.numero_via}
                          onChange={handleChange}
                          style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: '#6B5E4A' }}>Piso / Puerta</Form.Label>
                        <Form.Control
                          type="text"
                          name="piso"
                          value={formData.piso}
                          onChange={handleChange}
                          placeholder="Ej: 3º B"
                          style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: '#6B5E4A' }}>Código Postal</Form.Label>
                        <Form.Control
                          type="text"
                          name="codigo_postal"
                          value={formData.codigo_postal}
                          onChange={handleChange}
                          maxLength={5}
                          placeholder="28001"
                          style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: '#6B5E4A' }}>Ciudad</Form.Label>
                        <Form.Control
                          type="text"
                          name="ciudad"
                          value={formData.ciudad}
                          onChange={handleChange}
                          style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Cambiar contraseña"
                      checked={cambiandoPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCambiandoPassword(e.target.checked)}
                    />
                  </div>

                  {cambiandoPassword && (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: '#6B5E4A' }}>Contraseña actual</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
                        />
                      </Form.Group>

                      <Row>
                        <Col md={6}>
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
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
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
                        </Col>
                      </Row>
                    </>
                  )}

                  <div className="d-flex gap-2 mt-4">
                    <Button
                      type="submit"
                      style={{
                        backgroundColor: '#A8E6CF',
                        borderColor: '#A8E6CF',
                        color: '#2E7D32',
                        borderRadius: '30px',
                        padding: '0.75rem 2rem',
                        flex: 1
                      }}
                    >
                      Guardar cambios
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => {
                        setEditMode(false);
                        setCambiandoPassword(false);
                        fetchUserData();
                      }}
                      style={{ borderRadius: '30px', padding: '0.75rem 2rem' }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </Form>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}