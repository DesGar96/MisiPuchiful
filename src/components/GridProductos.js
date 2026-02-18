"use client";

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useCarrito } from '@/context/CarritoContext';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { agregarAlCarrito } = useCarrito();

  // Función para obtener productos de la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/productos');
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
  }, []);

  const handleAgregarAlCarrito = (producto) => {
    agregarAlCarrito(producto, 1);
  };

  // Mostrar spinner mientras carga
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando productos...</p>
      </Container>
    );
  }

  // Mostrar error si ocurre
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  // Mostrar mensaje si no hay productos
  if (products.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h3>No hay productos disponibles</h3>
        <p>Pronto añadiremos nuevos productos a nuestra tienda.</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Nuestros Productos</h2>
      
      {/* Grid responsive con Bootstrap */}
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {products.map((product) => (
          <Col key={product.id}>
            <Card className="h-100 shadow-sm hover-effect">
              <Card.Img 
                variant="top" 
                src={product.imagen || 'https://via.placeholder.com/300x200?text=Sin+imagen'} 
                alt={product.nombre}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{product.nombre}</Card.Title>
                <Card.Text className="text-muted small">
                  {product.categoria_nombre || 'Sin categoría'}
                </Card.Text>
                <Card.Text>
                  {product.descripcion ? product.descripcion.substring(0, 60) + '...' : 'Sin descripción'}
                </Card.Text>
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="text-primary mb-0">
                      {typeof product.precio === 'number' ? product.precio.toFixed(2) : product.precio} €
                    </h5>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleAgregarAlCarrito(product)}
                    >
                      Añadir
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductGrid;