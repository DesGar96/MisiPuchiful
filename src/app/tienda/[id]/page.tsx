"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Form } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { useCarrito } from '@/context/CarritoContext';
import { useAuth } from '@/context/AuthContext';
import { FaStar } from 'react-icons/fa';

export default function ProductoPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { agregarAlCarrito } = useCarrito();
  
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/productos/${id}`);
        const result = await response.json();
        
        if (result.success) {
          setProducto(result.data);
        } else {
          setError('Error al cargar el producto');
        }
      } catch (err) {
        setError('Error de conexión al servidor');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProducto();
  }, [id]);

  const handleAgregarAlCarrito = () => {
    agregarAlCarrito({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio_oferta || producto.precio,
      imagen: producto.imagen
    }, cantidad);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Cargando producto...</p>
      </Container>
    );
  }

  if (error || !producto) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || 'Producto no encontrado'}</Alert>
      </Container>
    );
  }

  return (
    <div style={{ backgroundColor: '#F8F6F2', minHeight: '100vh', padding: '2rem 0' }}>
      <Container>
        <Link href="/tienda" style={{ color: '#2E7D32', textDecoration: 'none', marginBottom: '2rem', display: 'block' }}>
          ← Volver a la tienda
        </Link>

        <Row className="g-4">
          {/* IMAGEN DEL PRODUCTO */}
          <Col md={6}>
            <Card className="border-0 shadow-lg" style={{ borderRadius: '30px', overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: '500px', width: '100%' }}>
                <Image
                  src={producto.imagen || '/imagenes/placeholder.jpg'}
                  alt={producto.nombre}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
            </Card>
          </Col>

          {/* DETALLES DEL PRODUCTO */}
          <Col md={6}>
            <Card className="border-0 shadow-lg" style={{ borderRadius: '30px', padding: '2rem' }}>
              {/* BADGES - CATEGORÍA, OFERTA Y NOVEDAD */}
              <div className="d-flex justify-content-between align-items-start mb-3">
                <Badge style={{ 
                  backgroundColor: '#A8E6CF',
                  color: '#2E7D32',
                  padding: '0.5rem 1rem',
                  borderRadius: '30px'
                }}>
                  {producto.categoria_nombre}
                </Badge>
                
                {/* BADGES DE OFERTA Y NOVEDAD */}
                <div className="d-flex gap-2">
                  {/* Usamos == para aceptar tanto número 1 como string '1' */}
                  {(producto.es_oferta == 1 || producto.es_oferta === '1') && (
                    <Badge style={{ 
                      backgroundColor: '#FFD3B6',
                      color: '#6B5E4A',
                      padding: '0.5rem 1rem',
                      borderRadius: '30px'
                    }}>
                      🔥 OFERTA
                    </Badge>
                  )}
                  {(producto.es_novedad == 1 || producto.es_novedad === '1') && (
                    <Badge style={{ 
                      backgroundColor: '#A8E6CF',
                      color: '#2E7D32',
                      padding: '0.5rem 1rem',
                      borderRadius: '30px'
                    }}>
                      🌱 NOVEDAD
                    </Badge>
                  )}
                </div>
              </div>

              <h1 className="fw-bold mb-3" style={{ color: '#2E7D32', fontSize: '2.5rem' }}>
                {producto.nombre}
              </h1>

              <div className="d-flex align-items-center mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} style={{ color: '#FFD700', fontSize: '1.5rem' }}>
                    {star <= Math.round(producto.puntuacion_media) ? '★' : '☆'}
                  </span>
                ))}
                <span style={{ color: '#6B5E4A', marginLeft: '1rem' }}>
                  ({producto.total_resenas} reseñas)
                </span>
              </div>

              <p style={{ color: '#6B5E4A', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                {producto.descripcion}
              </p>

              <div className="mb-4">
                <h5 style={{ color: '#6B5E4A' }}>Stock disponible: {producto.stock} unidades</h5>
              </div>

              <Row className="align-items-end mb-4">
                <Col xs={4}>
                  <Form.Group>
                    <Form.Label style={{ color: '#6B5E4A' }}>Cantidad</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max={producto.stock}
                      value={cantidad}
                      onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                      style={{ borderRadius: '15px' }}
                    />
                  </Form.Group>
                </Col>
                <Col xs={8}>
                  <div className="text-end">
                    {producto.precio_oferta ? (
                      <>
                        <span style={{ 
                          textDecoration: 'line-through', 
                          color: '#9E9E9E',
                          fontSize: '1.2rem',
                          marginRight: '1rem'
                        }}>
                          {producto.precio}€
                        </span>
                        <span style={{ 
                          color: '#2E7D32', 
                          fontWeight: 'bold',
                          fontSize: '2.5rem'
                        }}>
                          {producto.precio_oferta}€
                        </span>
                      </>
                    ) : (
                      <span style={{ 
                        color: '#2E7D32', 
                        fontWeight: 'bold',
                        fontSize: '2.5rem'
                      }}>
                        {producto.precio}€
                      </span>
                    )}
                  </div>
                </Col>
              </Row>

              <Button
                onClick={handleAgregarAlCarrito}
                disabled={producto.stock === 0}
                style={{
                  backgroundColor: '#A8E6CF',
                  borderColor: '#A8E6CF',
                  color: '#2E7D32',
                  borderRadius: '30px',
                  padding: '1rem',
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
                }}
              >
                {producto.stock > 0 ? '🛒 Añadir al carrito' : '❌ Sin stock'}
              </Button>
            </Card>
          </Col>
        </Row>

        {/* SECCIÓN DE RESEÑAS - SOLO VISUALIZACIÓN */}
        <Row className="mt-5">
          <Col lg={8} className="mx-auto">
            <Card className="border-0 shadow-lg" style={{ borderRadius: '30px', padding: '2rem' }}>
              <h3 className="fw-bold mb-4" style={{ color: '#2E7D32' }}>📝 Reseñas de clientes</h3>

              {/* LISTA DE RESEÑAS */}
              {producto.resenas?.length > 0 ? (
                producto.resenas.map((resena) => (
                  <Card key={resena.id} className="mb-3 border-0" style={{ backgroundColor: '#F8F6F2' }}>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <strong style={{ color: '#2E7D32' }}>{resena.usuario_nombre}</strong>
                          <div className="d-flex gap-1 ms-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} style={{ color: '#FFD700' }}>
                                {star <= resena.puntuacion ? '★' : '☆'}
                              </span>
                            ))}
                          </div>
                        </div>
                        <small style={{ color: '#9E9E9E' }}>
                          {new Date(resena.fecha).toLocaleDateString('es-ES')}
                        </small>
                      </div>
                      <p style={{ color: '#6B5E4A', marginTop: '0.5rem' }}>{resena.comentario}</p>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p style={{ color: '#6B5E4A', textAlign: 'center' }}>No hay reseñas aún.</p>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}