"use client";

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Carousel, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import { useCarrito } from '@/context/CarritoContext';

const CarruselProductos = () => {
  const [novedades, setNovedades] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('/api/productos');
        const result = await response.json();
        
        if (result.success) {
          // Filtrar novedades y ofertas
          const novedadesFiltradas = result.data.filter(p => p.es_novedad);
          const ofertasFiltradas = result.data.filter(p => p.es_oferta);
          
          setNovedades(novedadesFiltradas);
          setOfertas(ofertasFiltradas);
        }
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Función para dividir array en grupos de 3
  const chunkArray = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  const renderCarousel = (productos, titulo, tipo) => {
    if (productos.length === 0) return null;
    
    const chunks = chunkArray(productos, 3); // 3 productos por slide
    
    return (
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold">{titulo}</h3>
          <Link href="/tienda" className="text-decoration-none">
            Ver todos <span aria-hidden="true">→</span>
          </Link>
        </div>
        
        <Carousel 
          indicators={chunks.length > 1} 
          controls={chunks.length > 1}
          interval={4000}
          pause="hover"
          prevIcon={<span className="carousel-control-prev-icon bg-dark rounded-circle p-3" />}
          nextIcon={<span className="carousel-control-next-icon bg-dark rounded-circle p-3" />}
        >
          {chunks.map((chunk, idx) => (
            <Carousel.Item key={idx}>
              <Row xs={1} sm={2} md={3} className="g-4"> {/* 3 columnas */}
                {chunk.map(producto => (
                  <Col key={producto.id}>
                    <Card className="h-100 shadow-sm hover-effect border-0">
                      <div className="position-relative">
                        <Card.Img 
                          variant="top" 
                          src={producto.imagen || 'https://via.placeholder.com/300x200?text=Producto'} 
                          alt={producto.nombre}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        {producto.es_novedad && (
                          <span className="position-absolute top-0 start-0 badge bg-success m-2">
                            NUEVO
                          </span>
                        )}
                        {producto.es_oferta && (
                          <span className="position-absolute top-0 end-0 badge bg-danger m-2">
                            -{Math.round((1 - producto.precio_oferta/producto.precio) * 10) * 10}%
                          </span>
                        )}
                      </div>
                      <Card.Body>
                        <Card.Title className="h6">{producto.nombre}</Card.Title>
                        <Card.Text className="text-muted small">
                          {producto.categoria_nombre || 'Categoría'}
                        </Card.Text>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            {producto.es_oferta && producto.precio_oferta ? (
                              <>
                                <span className="text-muted text-decoration-line-through me-2 small">
                                  {producto.precio}€
                                </span>
                                <span className="text-danger fw-bold">
                                  {producto.precio_oferta}€
                                </span>
                              </>
                            ) : (
                              <span className="fw-bold text-primary">{producto.precio}€</span>
                            )}
                          </div>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => agregarAlCarrito(producto, 1)}
                          >
                            Añadir
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
        
        {/* ELIMINADO: el contador de páginas que estaba aquí */}
      </div>
    );
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando productos destacados...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {novedades.length > 0 && (
        renderCarousel(novedades, '🔥 Últimas Novedades', 'novedad')
      )}
      
      {ofertas.length > 0 && (
        renderCarousel(ofertas, '⚡ Ofertas Especiales', 'oferta')
      )}
      
      {novedades.length === 0 && ofertas.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">No hay productos destacados en este momento.</p>
        </div>
      )}
    </Container>
  );
};

export default CarruselProductos;