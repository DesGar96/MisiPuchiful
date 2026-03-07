"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Nav, Badge } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCarrito } from '@/context/CarritoContext';

// Componente interno que usa useSearchParams
function ProductGridContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoriaActual = searchParams.get('categoria') || 'todos';
  const tipoActual = searchParams.get('tipo') || 'todos';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { agregarAlCarrito } = useCarrito();

  // Categorías principales (de la BD)
  const categoriasPrincipales = [
    { id: 'todos', nombre: '🐾 Todos los productos', icono: '🐾' },
    { id: 'Alimentacion', nombre: '🍖 Alimentacion', icono: '🍖' },
    { id: 'Juguetes', nombre: '🧸 Juguetes', icono: '🧸' },
    { id: 'Camas y Accesorios', nombre: '🛏️ Camas y Accesorios', icono: '🛏️' },
    { id: 'Higiene', nombre: '🧼 Higiene', icono: '🧼' }
  ];

  // Tipos de mascotas
  const tiposMascota = [
    { id: 'todos', nombre: 'Todos', icono: '🐾' },
    { id: 'perros', nombre: 'Perros', icono: '🐕' },
    { id: 'gatos', nombre: 'Gatos', icono: '🐈' },
    { id: 'otras', nombre: 'Otras especies', icono: '🐇' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        
        let url = '/api/productos?';
        const params = [];
        
        if (categoriaActual !== 'todos') {
          params.push(`categoria=${encodeURIComponent(categoriaActual)}`);
        }
        
        if (tipoActual !== 'todos') {
          params.push(`tipo=${encodeURIComponent(tipoActual)}`);
        }
        
        url += params.join('&');
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success) {
          setProducts(result.data);
        } else {
          setError('Error al cargar los productos');
        }
      } catch (err) {
        setError('Error de conexión al cargar los productos');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoriaActual, tipoActual]);

  const cambiarCategoria = (categoriaId) => {
    router.push(`/tienda?categoria=${categoriaId}&tipo=${tipoActual}`);
  };

  const cambiarTipo = (tipoId) => {
    router.push(`/tienda?categoria=${categoriaActual}&tipo=${tipoId}`);
  };

  const handleAgregarAlCarrito = (producto, e) => {
    e.preventDefault();
    e.stopPropagation();
    agregarAlCarrito({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio_oferta || producto.precio,
      imagen: producto.imagen
    }, 1);
  };

  if (loading) {
    return (
      <Container fluid className="py-5 text-center px-5">
        <Spinner animation="border" variant="success" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3 fs-5" style={{ color: '#6B5E4A' }}>Cargando productos...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-5 px-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <>
      {/* CABECERA - Solo el título*/}
      <div className="mb-4">
        <h2 className="fw-bold" style={{ color: '#2E7D32', fontSize: '2rem' }}>
          {categoriaActual === 'todos' ? 'Todos los productos' : categoriaActual}
          {tipoActual !== 'todos' && ` para ${tiposMascota.find(t => t.id === tipoActual)?.nombre}`}
        </h2>
        <Badge style={{ 
          backgroundColor: '#A8E6CF',
          color: '#2E7D32',
          fontSize: '1rem',
          marginLeft: '0.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '30px'
        }}>
          {products.length} producto{products.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* FILA DE CATEGORÍAS PRINCIPALES */}
      <div className="mb-4">
        <h5 style={{ color: '#2E7D32', marginBottom: '1rem' }}>Categorías:</h5>
        <div style={{ overflowX: 'auto' }}>
          <Nav className="flex-nowrap gap-2 pb-2" style={{ 
            display: 'flex',
            flexWrap: 'nowrap',
            minWidth: 'min-content'
          }}>
            {categoriasPrincipales.map(cat => (
              <Nav.Link
                key={cat.id}
                onClick={() => cambiarCategoria(cat.id)}
                active={categoriaActual === cat.id}
                style={{
                  cursor: 'pointer',
                  backgroundColor: categoriaActual === cat.id ? '#A8E6CF' : 'white',
                  color: categoriaActual === cat.id ? '#2E7D32' : '#6B5E4A',
                  border: '2px solid #A8E6CF',
                  borderRadius: '30px',
                  padding: '0.75rem 1.5rem',
                  whiteSpace: 'nowrap',
                  fontWeight: categoriaActual === cat.id ? 'bold' : 'normal',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ marginRight: '0.5rem' }}>{cat.icono}</span>
                {cat.nombre}
              </Nav.Link>
            ))}
          </Nav>
        </div>
      </div>

      {/* FILA DE TIPOS DE MASCOTA */}
      <div className="mb-5">
        <h5 style={{ color: '#2E7D32', marginBottom: '1rem' }}>Para:</h5>
        <div style={{ overflowX: 'auto' }}>
          <Nav className="flex-nowrap gap-2 pb-2" style={{ 
            display: 'flex',
            flexWrap: 'nowrap',
            minWidth: 'min-content'
          }}>
            {tiposMascota.map(tipo => (
              <Nav.Link
                key={tipo.id}
                onClick={() => cambiarTipo(tipo.id)}
                active={tipoActual === tipo.id}
                style={{
                  cursor: 'pointer',
                  backgroundColor: tipoActual === tipo.id ? '#A8E6CF' : 'white',
                  color: tipoActual === tipo.id ? '#2E7D32' : '#6B5E4A',
                  border: '2px solid #A8E6CF',
                  borderRadius: '30px',
                  padding: '0.75rem 1.5rem',
                  whiteSpace: 'nowrap',
                  fontWeight: tipoActual === tipo.id ? 'bold' : 'normal',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ marginRight: '0.5rem' }}>{tipo.icono}</span>
                {tipo.nombre}
              </Nav.Link>
            ))}
          </Nav>
        </div>
      </div>

      {/* GRID DE PRODUCTOS */}
      {products.length > 0 ? (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {products.map((product) => (
            <Col key={product.id}>
              <Card className="h-100 shadow-sm hover-effect" style={{ 
                borderRadius: '25px',
                overflow: 'hidden',
                border: 'none'
              }}>
                <Link href={`/tienda/${product.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ position: 'relative', height: '200px', width: '100%' }}>
                    <Image
                      src={product.imagen || '/imagenes/placeholder.jpg'}
                      alt={product.nombre}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                    {/* OFERTA - basada en precio_oferta */}
                    {product.precio_oferta && product.precio_oferta > 0 && (
                      <div style={{ 
                        position: 'absolute',
                        top: '15px',
                        left: '15px',
                        backgroundColor: '#FFD3B6',
                        color: '#6B5E4A',
                        padding: '0.5rem 1rem',
                        borderRadius: '30px',
                        zIndex: 2,
                        fontWeight: 'bold'
                      }}>
                        🔥 OFERTA
                      </div>
                    )}
                    {/* NOVEDAD */}
                    {product.es_novedad == 1 && (
                      <div style={{ 
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        backgroundColor: '#A8E6CF',
                        color: '#2E7D32',
                        padding: '0.5rem 1rem',
                        borderRadius: '30px',
                        zIndex: 2,
                        fontWeight: 'bold'
                      }}>
                        🌱 NOVEDAD
                      </div>
                    )}
                  </div>
                </Link>
                
                <Card.Body className="p-3">
                  <Link href={`/tienda/${product.id}`} style={{ textDecoration: 'none' }}>
                    <Card.Title style={{ color: '#2E7D32', fontSize: '1.1rem', fontWeight: 'bold' }}>
                      {product.nombre}
                    </Card.Title>
                    
                    <Card.Text style={{ color: '#6B5E4A', fontSize: '0.9rem' }}>
                      {product.descripcion ? product.descripcion.substring(0, 50) + '...' : ''}
                    </Card.Text>
                  </Link>

                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <div>
                      {product.precio_oferta ? (
                        <>
                          <span style={{ 
                            textDecoration: 'line-through', 
                            color: '#9E9E9E',
                            fontSize: '0.9rem',
                            marginRight: '0.5rem'
                          }}>
                            {product.precio}€
                          </span>
                          <span style={{ 
                            color: '#2E7D32', 
                            fontWeight: 'bold',
                            fontSize: '1.2rem'
                          }}>
                            {product.precio_oferta}€
                          </span>
                        </>
                      ) : (
                        <span style={{ 
                          color: '#2E7D32', 
                          fontWeight: 'bold',
                          fontSize: '1.2rem'
                        }}>
                          {product.precio}€
                        </span>
                      )}
                    </div>
                    
                    <div className="d-flex gap-2">
                      <Link href={`/tienda/${product.id}`} passHref>
                        <Button 
                          variant="outline-success"
                          size="sm"
                          style={{
                            borderColor: '#A8E6CF',
                            color: '#2E7D32',
                            borderRadius: '30px',
                            padding: '0.4rem 1rem',
                            fontWeight: 'bold'
                          }}
                        >
                          Ver más
                        </Button>
                      </Link>
                      <Button 
                        variant="primary"
                        size="sm"
                        onClick={(e) => handleAgregarAlCarrito(product, e)}
                        style={{
                          backgroundColor: '#A8E6CF',
                          borderColor: '#A8E6CF',
                          color: '#2E7D32',
                          borderRadius: '30px',
                          padding: '0.4rem 1rem',
                          fontWeight: 'bold'
                        }}
                      >
                        🛒
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card className="text-center py-5 border-0 shadow-sm" style={{ borderRadius: '25px' }}>
          <Card.Body>
            <span style={{ fontSize: '4rem' }}>🛒</span>
            <h4 className="mt-3" style={{ color: '#2E7D32' }}>No hay productos en esta categoría</h4>
          </Card.Body>
        </Card>
      )}
    </>
  );
}

// Componente principal 
const ProductGrid = () => {
  return (
    <div style={{ backgroundColor: '#F8F6F2', minHeight: '100vh', padding: 0 }}>
      
      {/* CABECERA*/}
      <div style={{ 
        background: 'linear-gradient(135deg, #A8E6CF 0%, #B5EAD7 50%, #C7E9C0 100%)',
        color: '#6B5E4A',
        padding: '3rem 0',
        marginTop: 0,
        marginBottom: 0,
        borderRadius: '0 0 50px 50px',
        textAlign: 'center'
      }}>
        <h1 className="display-3 fw-bold mb-3" style={{ color: '#2E7D32' }}>
          🛍️ Nuestra Tienda
        </h1>
        <p className="lead fs-4" style={{ color: '#6B5E4A' }}>
          Todo lo que necesitas para consentir a tus peludos
        </p>
      </div>

      {/* CONTENIDO DENTRO DE CONTAINER */}
      <Container fluid className="px-5">
        <Suspense fallback={
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
            <p className="mt-3">Cargando tienda...</p>
          </div>
        }>
          <ProductGridContent />
        </Suspense>
      </Container>

      <style jsx>{`
        .hover-effect:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(168, 230, 207, 0.3) !important;
        }
      `}</style>
    </div>
  );
};

export default ProductGrid;