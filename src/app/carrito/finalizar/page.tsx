"use client";

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useCarrito } from '@/context/CarritoContext';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import DireccionForm from '@/components/DireccionForm';
import { MetodoPago } from '@/types/pedido';

// Definición de tipos para el formulario
interface FormData {
  tipoVia: string;
  nombreVia: string;
  numeroVia: string;
  piso: string;
  codigoPostal: string;
  ciudad: string;
  telefono: string;
  email: string;
  observaciones: string;
  metodoPago: MetodoPago;
  nombreTarjeta: string;
  numeroTarjeta: string;
  fechaExpiracion: string;
  cvv: string;
}

interface UserData {
  telefono?: string;
  email?: string;
  tipo_via?: string;
  nombre_via?: string;
  numero_via?: string;
  piso?: string;
  codigo_postal?: string;
  ciudad?: string;
}

// Tipo para los items del carrito
interface CarritoItem {
  id: number;
  nombre: string;
  precio: number;
  imagen: string | null;
  cantidad: number;
}

export default function FinalizarCompraPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, total, vaciarCarrito } = useCarrito();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [pedidoId, setPedidoId] = useState<number | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState<number>(3);
  const [formData, setFormData] = useState<FormData>({
    tipoVia: '',
    nombreVia: '',
    numeroVia: '',
    piso: '',
    codigoPostal: '',
    ciudad: '',
    telefono: '',
    email: '',
    observaciones: '',
    metodoPago: 'contrareembolso',
    nombreTarjeta: '',
    numeroTarjeta: '',
    fechaExpiracion: '',
    cvv: ''
  });

  // Cargar datos del usuario si está logueado
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/usuarios/perfil');
      const result = await response.json();
      if (result.success) {
        setUserData(result.user);
        setFormData(prev => ({
          ...prev,
          telefono: result.user.telefono || '',
          email: result.user.email || '',
          tipoVia: result.user.tipo_via || '',
          nombreVia: result.user.nombre_via || '',
          numeroVia: result.user.numero_via || '',
          piso: result.user.piso || '',
          codigoPostal: result.user.codigo_postal || '',
          ciudad: result.user.ciudad || ''
        }));
      }
    } catch (error) {
      console.error('Error al cargar datos de usuario:', error);
    }
  };

  // Efecto para la redirección automática
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success && redirectCountdown > 0) {
      timer = setTimeout(() => {
        setRedirectCountdown(prev => prev - 1);
      }, 1000);
    } else if (success && redirectCountdown === 0) {
      router.push(user ? '/zonaPrivada/mis-pedidos' : '/');
    }
    return () => clearTimeout(timer);
  }, [success, redirectCountdown, user, router]);

  useEffect(() => {
    if (!user && items.length === 0 && !success) {
      router.push('/tienda');
    }
  }, [user, items, router, success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Validaciones específicas
    if (name === 'telefono') {
      if (value === '' || /^\d{0,9}$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'numeroVia') {
      if (value === '' || /^\d*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'codigoPostal') {
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
    setLoading(true);

    // Validar teléfono
    if (formData.telefono.length !== 9) {
      setError('El teléfono debe tener 9 dígitos');
      setLoading(false);
      return;
    }

    // Validar código postal
    if (formData.codigoPostal.length !== 5) {
      setError('El código postal debe tener 5 dígitos');
      setLoading(false);
      return;
    }

    // Validar dirección
    if (!formData.tipoVia || !formData.nombreVia || !formData.numeroVia || !formData.ciudad) {
      setError('Por favor completa todos los campos de dirección');
      setLoading(false);
      return;
    }

    // Validar según método de pago
    if (formData.metodoPago === 'tarjeta') {
      if (!formData.nombreTarjeta || !formData.numeroTarjeta || !formData.fechaExpiracion || !formData.cvv) {
        setError('Por favor completa todos los datos de la tarjeta');
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch('/api/carrito/finalizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          total,
          direccion: {
            tipoVia: formData.tipoVia,
            nombreVia: formData.nombreVia,
            numeroVia: formData.numeroVia,
            piso: formData.piso,
            codigoPostal: formData.codigoPostal,
            ciudad: formData.ciudad
          },
          telefono: formData.telefono,
          email: formData.email,
          observaciones: formData.observaciones,
          metodoPago: formData.metodoPago,
          esInvitado: !user
        })
      });

      const result = await response.json();

      if (result.success) {
        setPedidoId(result.pedidoId);
        setSuccess(true);
        vaciarCarrito();
      } else {
        setError(result.error || 'Error al procesar el pedido');
      }
    } catch (err) {
      setError('Error de conexión al servidor');
    } finally {
      setLoading(false);
    }
  };

  const construirDireccionCompleta = (): string => {
    const partes = [
      formData.tipoVia,
      formData.nombreVia,
      formData.numeroVia && `nº ${formData.numeroVia}`,
      formData.piso,
      formData.codigoPostal && `CP: ${formData.codigoPostal}`,
      formData.ciudad
    ].filter(Boolean);
    return partes.join(', ');
  };

  if (!user && items.length === 0) {
    return null;
  }

  if (success) {
    return (
      <Container className="py-5">
        <Card className="text-center border-0 shadow-lg" style={{ borderRadius: '30px', padding: '3rem' }}>
          <Card.Body>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ color: '#2E7D32' }}>¡Pedido realizado con éxito!</h2>
            <p style={{ color: '#6B5E4A' }}>Número de pedido: #{pedidoId}</p>
            <p style={{ color: '#6B5E4A' }}>Dirección de envío: {construirDireccionCompleta()}</p>
            
            <div className="mt-4">
              <p style={{ color: '#2E7D32' }}>
                Redirigiendo a {user ? 'tus pedidos' : 'la página principal'} en {redirectCountdown} segundos...
              </p>
              
              <Link href={user ? '/zonaPrivada/mis-pedidos' : '/'}>
                <Button style={{ 
                  backgroundColor: '#A8E6CF', 
                  borderColor: '#A8E6CF', 
                  color: '#2E7D32',
                  borderRadius: '30px',
                  padding: '0.75rem 2rem',
                  fontWeight: 'bold'
                }}>
                  {user ? 'Ver mis pedidos ahora' : 'Volver al inicio'}
                </Button>
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <div style={{ backgroundColor: '#F8F6F2', minHeight: '100vh', padding: '3rem 0' }}>
      <Container>
        <h1 className="fw-bold mb-4" style={{ color: '#2E7D32' }}>📦 Finalizar Compra</h1>

        {items.length === 0 ? (
          <Card className="text-center py-5 border-0 shadow-sm" style={{ borderRadius: '30px' }}>
            <Card.Body>
              <span style={{ fontSize: '4rem' }}>🛒</span>
              <h4 className="mt-3" style={{ color: '#2E7D32' }}>Tu carrito está vacío</h4>
              <Link href="/tienda">
                <Button style={{ backgroundColor: '#A8E6CF', borderColor: '#A8E6CF', color: '#2E7D32', marginTop: '1rem' }}>
                  Ir a la tienda
                </Button>
              </Link>
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-4">
            {/* Columna izquierda - Formulario */}
            <Col lg={8}>
              <Card className="border-0 shadow-sm" style={{ borderRadius: '30px', padding: '2rem' }}>
                {!user && (
                  <Alert variant="info" style={{ backgroundColor: '#E8F5E9', borderColor: '#A8E6CF', color: '#2E7D32' }}>
                    Estás realizando la compra como invitado. Los datos se guardarán temporalmente.
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <DireccionForm 
                    formData={formData} 
                    handleChange={handleChange} 
                    userData={userData}
                  />

                  <h4 style={{ color: '#2E7D32', marginBottom: '1.5rem', marginTop: '2rem' }}>💳 Método de pago</h4>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="radio"
                      label="💰 Contra reembolso (pago al recibir)"
                      name="metodoPago"
                      value="contrareembolso"
                      checked={formData.metodoPago === 'contrareembolso'}
                      onChange={handleChange}
                      style={{ marginBottom: '1rem', color: '#6B5E4A' }}
                    />
                    
                    <Form.Check
                      type="radio"
                      label="📱 Bizum"
                      name="metodoPago"
                      value="bizum"
                      checked={formData.metodoPago === 'bizum'}
                      onChange={handleChange}
                      style={{ marginBottom: '1rem', color: '#6B5E4A' }}
                    />
                    
                    <Form.Check
                      type="radio"
                      label="💳 Tarjeta de crédito/débito"
                      name="metodoPago"
                      value="tarjeta"
                      checked={formData.metodoPago === 'tarjeta'}
                      onChange={handleChange}
                      style={{ marginBottom: '1rem', color: '#6B5E4A' }}
                    />
                  </Form.Group>

                  {formData.metodoPago === 'tarjeta' && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <p style={{ color: '#2E7D32', fontWeight: 'bold', marginBottom: '1rem' }}>
                        💳 Datos de la tarjeta 
                      </p>
                      
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: '#6B5E4A' }}>Nombre en la tarjeta</Form.Label>
                        <Form.Control
                          type="text"
                          name="nombreTarjeta"
                          value={formData.nombreTarjeta}
                          onChange={handleChange}
                          required={formData.metodoPago === 'tarjeta'}
                          placeholder="Ej: JUAN PEREZ"
                          style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
                        />
                      </Form.Group>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label style={{ color: '#6B5E4A' }}>Número de tarjeta</Form.Label>
                            <Form.Control
                              type="text"
                              name="numeroTarjeta"
                              value={formData.numeroTarjeta}
                              onChange={(e) => {                                
                                const value = e.target.value.replace(/[^\d]/g, '');
                                const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                                setFormData({...formData, numeroTarjeta: formatted});
                              }}
                              required={formData.metodoPago === 'tarjeta'}
                              placeholder="4242 4242 4242 4242"
                              maxLength={19}
                              style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label style={{ color: '#6B5E4A' }}>Fecha exp.</Form.Label>
                            <Form.Control
                              type="text"
                              name="fechaExpiracion"
                              value={formData.fechaExpiracion}
                              onChange={(e) => {
                                let value = e.target.value.replace(/[^\d]/g, '');
                                if (value.length >= 2) {
                                  value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                }
                                setFormData({...formData, fechaExpiracion: value});
                              }}
                              required={formData.metodoPago === 'tarjeta'}
                              placeholder="MM/AA"
                              maxLength={5}
                              style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label style={{ color: '#6B5E4A' }}>CVV</Form.Label>
                            <Form.Control
                              type="text"
                              name="cvv"
                              value={formData.cvv}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^\d]/g, '').slice(0, 3);
                                setFormData({...formData, cvv: value});
                              }}
                              required={formData.metodoPago === 'tarjeta'}
                              placeholder="123"
                              maxLength={3}
                              style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  )}

                  {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                  <div className="d-grid gap-2 mt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      style={{
                        backgroundColor: '#A8E6CF',
                        borderColor: '#A8E6CF',
                        color: '#2E7D32',
                        borderRadius: '30px',
                        padding: '1rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {loading ? <Spinner animation="border" size="sm" /> : 'Confirmar pedido'}
                    </Button>
                  </div>
                </Form>
              </Card>
            </Col>

            {/* Columna derecha - Resumen del pedido */}
            <Col lg={4}>
              <Card className="border-0 shadow-sm" style={{ borderRadius: '30px', padding: '1.5rem', position: 'sticky', top: '100px' }}>
                <h4 style={{ color: '#2E7D32', marginBottom: '1.5rem' }}>🛒 Resumen del pedido</h4>
                
                {(items as CarritoItem[]).map((item) => (
                  <div key={item.id} className="d-flex align-items-center mb-3">
                    <div style={{ width: '50px', height: '50px', position: 'relative', marginRight: '10px' }}>
                      <Image
                        src={item.imagen || '/imagenes/placeholder.jpg'}
                        alt={item.nombre}
                        fill
                        sizes="50px"
                        style={{ objectFit: 'cover', borderRadius: '10px' }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <small style={{ color: '#2E7D32', fontWeight: 'bold' }}>{item.nombre}</small>
                      <br />
                      <small style={{ color: '#6B5E4A' }}>{item.cantidad} x {item.precio}€</small>
                    </div>
                  </div>
                ))}

                <hr />
                
                <div className="d-flex justify-content-between">
                  <strong style={{ color: '#6B5E4A' }}>Subtotal:</strong>
                  <strong style={{ color: '#2E7D32' }}>{total.toFixed(2)}€</strong>
                </div>
                
                <div className="d-flex justify-content-between mt-2">
                  <strong style={{ color: '#6B5E4A' }}>Gastos de envío:</strong>
                  <strong style={{ color: '#2E7D32' }}>Gratis</strong>
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between">
                  <strong style={{ color: '#6B5E4A', fontSize: '1.2rem' }}>Total:</strong>
                  <strong style={{ color: '#2E7D32', fontSize: '1.5rem' }}>{total.toFixed(2)}€</strong>
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}