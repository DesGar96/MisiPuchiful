"use client";

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Table, Button } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function MisPedidosPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandido, setExpandido] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/usuarios/pedidos');
        const result = await response.json();
        
        if (result.success) {
          setPedidos(result.data);
        } else {
          setError('Error al cargar los pedidos');
        }
      } catch (err) {
        setError('Error de conexión al servidor');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPedidos();
    }
  }, [user]);

  const getEstadoBadge = (estado) => {
    const colores = {
      pendiente: { bg: '#FFD3B6', text: '#6B5E4A', label: 'Pendiente' },
      procesando: { bg: '#FDFD97', text: '#6B5E4A', label: 'Procesando' },
      enviado: { bg: '#A8E6CF', text: '#2E7D32', label: 'Enviado' },
      entregado: { bg: '#A8E6CF', text: '#2E7D32', label: 'Entregado' },
      cancelado: { bg: '#FFAAA5', text: '#6B5E4A', label: 'Cancelado' }
    };
    const color = colores[estado] || colores.pendiente;
    
    return (
      <Badge style={{ 
        backgroundColor: color.bg, 
        color: color.text, 
        padding: '0.5rem 1rem', 
        borderRadius: '30px',
        fontSize: '0.9rem'
      }}>
        {color.label}
      </Badge>
    );
  };

  const getMetodoPagoLabel = (metodo) => {
    const metodos = {
      contrareembolso: '💰 Contra reembolso',
      bizum: '📱 Bizum',
      tarjeta: '💳 Tarjeta'
    };
    return metodos[metodo] || metodo;
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (authLoading || loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Cargando pedidos...</p>
      </Container>
    );
  }

  return (
    <div style={{ backgroundColor: '#F8F6F2', minHeight: '100vh', padding: '3rem 0' }}>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold" style={{ color: '#2E7D32' }}>📦 Mis Pedidos</h1>
          <Link href="/tienda">
            <Button style={{ backgroundColor: '#A8E6CF', borderColor: '#A8E6CF', color: '#2E7D32' }}>
              Seguir comprando
            </Button>
          </Link>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {pedidos.length === 0 ? (
          <Card className="text-center py-5 border-0 shadow-sm" style={{ borderRadius: '25px' }}>
            <Card.Body>
              <span style={{ fontSize: '4rem' }}>🛒</span>
              <h4 className="mt-3" style={{ color: '#2E7D32' }}>No tienes pedidos aún</h4>
              <p className="text-muted">¡Realiza tu primera compra en nuestra tienda!</p>
              <Link href="/tienda">
                <Button style={{ backgroundColor: '#A8E6CF', borderColor: '#A8E6CF', color: '#2E7D32', marginTop: '1rem' }}>
                  Ir a la tienda
                </Button>
              </Link>
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-4">
            {pedidos.map((pedido) => (
              <Col xs={12} key={pedido.id}>
                <Card className="border-0 shadow-sm" style={{ borderRadius: '20px' }}>
                  <Card.Body>
                    {/* Cabecera del pedido */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h5 style={{ color: '#2E7D32' }}>
                          Pedido #{pedido.id}
                          <small className="ms-2" style={{ color: '#9E9E9E', fontSize: '0.9rem' }}>
                            {formatDate(pedido.fecha_pedido)}
                          </small>
                        </h5>
                        <p style={{ color: '#6B5E4A', margin: 0 }}>
                          <small>Método de pago: {getMetodoPagoLabel(pedido.metodo_pago)}</small>
                        </p>
                      </div>
                      {getEstadoBadge(pedido.estado)}
                    </div>

                    {/* Dirección de envío */}
                    {pedido.direccion_envio && (
                      <div className="mb-3 p-3" style={{ backgroundColor: '#F8F6F2', borderRadius: '15px' }}>
                        <small style={{ color: '#6B5E4A', display: 'block' }}>
                          <strong>Dirección de envío:</strong> {pedido.direccion_envio}
                        </small>
                      </div>
                    )}

                    {/* Botón para ver detalles */}
                    <Button
                      variant="link"
                      onClick={() => setExpandido(expandido === pedido.id ? null : pedido.id)}
                      style={{ color: '#2E7D32', textDecoration: 'none', padding: 0 }}
                    >
                      {expandido === pedido.id ? '▲ Ocultar detalles' : '▼ Ver detalles del pedido'}
                    </Button>

                    {/* Detalles expandibles */}
                    {expandido === pedido.id && (
                      <div className="mt-3">
                        <Table responsive style={{ fontSize: '0.9rem' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#E8F5E9' }}>
                              <th>Producto</th>
                              <th>Cantidad</th>
                              <th>Precio</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pedido.detalles?.map((detalle) => (
                              <tr key={detalle.id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    {detalle.producto_imagen && (
                                      <div style={{ width: '40px', height: '40px', position: 'relative', marginRight: '10px' }}>
                                        <Image
                                          src={detalle.producto_imagen}
                                          alt={detalle.producto_nombre}
                                          fill
                                          sizes="40px"
                                          style={{ objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                      </div>
                                    )}
                                    <Link href={`/tienda/${detalle.producto_id}`} style={{ color: '#2E7D32', textDecoration: 'none' }}>
                                      {detalle.producto_nombre}
                                    </Link>
                                  </div>
                                </td>
                                <td>{detalle.cantidad}</td>
                                <td>{detalle.precio_unitario}€</td>
                                <td>{(detalle.cantidad * detalle.precio_unitario).toFixed(2)}€</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                              <td><strong style={{ color: '#2E7D32' }}>{pedido.total}€</strong></td>
                            </tr>
                          </tfoot>
                        </Table>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}