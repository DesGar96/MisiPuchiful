"use client";

import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Spinner, Alert, Modal, Form, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminProductosPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productoActual, setProductoActual] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen: '',
    categoria_id: '',
    destacado: false,
    es_novedad: false,
    precio_oferta: ''  // Mantenemos precio_oferta pero sin checkbox
  });

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (!isAdmin()) {
      router.push('/');
    }
  }, [user, isAdmin, router]);

  useEffect(() => {
    if (user && isAdmin()) {
      fetchProductos();
    }
  }, [user]);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/productos');
      const result = await response.json();
      if (result.success) {
        setProductos(result.data);
      } else {
        setError('Error al cargar productos');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      const response = await fetch(`/api/admin/productos/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.success) {
        fetchProductos();
      } else {
        alert('Error al eliminar');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (producto) => {
    setProductoActual(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      stock: producto.stock,
      imagen: producto.imagen || '',
      categoria_id: producto.categoria_id || '',
      destacado: producto.destacado === 1,
      es_novedad: producto.es_novedad === 1,
      precio_oferta: producto.precio_oferta || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = productoActual 
        ? `/api/admin/productos/${productoActual.id}`
        : '/api/admin/productos';
      
      const method = productoActual ? 'PUT' : 'POST';

      // Ya no enviamos es_oferta, solo precio_oferta
      const dataToSend = {
        ...formData,
        // Si precio_oferta está vacío, lo enviamos como null
        precio_oferta: formData.precio_oferta || null
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      const result = await response.json();
      if (result.success) {
        setShowModal(false);
        fetchProductos();
      } else {
        alert('Error al guardar');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!user || !isAdmin()) {
    return null;
  }

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: '#2E7D32' }}>📦 Productos</h2>
        <Button
          onClick={() => {
            setProductoActual(null);
            setFormData({
              nombre: '', descripcion: '', precio: '', stock: '', imagen: '',
              categoria_id: '', destacado: false, es_novedad: false,
              precio_oferta: ''
            });
            setShowModal(true);
          }}
          style={{
            backgroundColor: '#A8E6CF',
            borderColor: '#A8E6CF',
            color: '#2E7D32',
            borderRadius: '30px',
            padding: '0.5rem 2rem',
            fontWeight: 'bold'
          }}
        >
          + Nuevo Producto
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="bg-white rounded-4 shadow-sm p-4">
        <Table responsive hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  {p.imagen ? (
                    <div style={{ width: '50px', height: '50px', position: 'relative' }}>
                      <Image
                        src={p.imagen}
                        alt={p.nombre}
                        fill
                        sizes="50px"
                        style={{ objectFit: 'cover', borderRadius: '10px' }}
                      />
                    </div>
                  ) : (
                    <div style={{ width: '50px', height: '50px', backgroundColor: '#E8F5E9', borderRadius: '10px' }} />
                  )}
                </td>
                <td>{p.nombre}</td>
                <td>
                  {p.precio_oferta ? (
                    <>
                      <span style={{ textDecoration: 'line-through', color: '#9E9E9E', marginRight: '0.5rem' }}>
                        {p.precio}€
                      </span>
                      <span style={{ color: '#2E7D32', fontWeight: 'bold' }}>
                        {p.precio_oferta}€
                      </span>
                    </>
                  ) : (
                    <span>{p.precio}€</span>
                  )}
                </td>
                <td>{p.stock}</td>
                <td>
                  {/* NOVEDAD */}
                  {p.es_novedad === 1 && (
                    <Badge 
                      className="me-2"
                      style={{ 
                        backgroundColor: '#A8E6CF', 
                        color: '#2E7D32',
                        padding: '0.5rem 1rem',
                        borderRadius: '30px',
                        fontWeight: 'bold'
                      }}
                    >
                      🌱 NOVEDAD
                    </Badge>
                  )}
                  {/* OFERTA - basada en precio_oferta */}
                  {p.precio_oferta && p.precio_oferta > 0 && (
                    <Badge 
                      style={{ 
                        backgroundColor: '#FFD3B6', 
                        color: '#6B5E4A',
                        padding: '0.5rem 1rem',
                        borderRadius: '30px',
                        fontWeight: 'bold'
                      }}
                    >
                      🔥 OFERTA
                    </Badge>
                  )}
                </td>
                <td>
                  <Button
                    size="sm"
                    onClick={() => handleEdit(p)}
                    style={{
                      backgroundColor: '#A8E6CF',
                      borderColor: '#A8E6CF',
                      color: '#2E7D32',
                      marginRight: '0.5rem',
                      borderRadius: '20px',
                      padding: '0.5rem 1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(p.id)}
                    style={{ 
                      borderRadius: '20px',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#FF8B94',
                      borderColor: '#FF8B94',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal de edición/creación */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        size="lg"
        restoreFocus={false}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#2E7D32' }}>
            {productoActual ? 'Editar Producto' : 'Nuevo Producto'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => setFormData({...formData, precio: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>URL de la imagen</Form.Label>
              <Form.Control
                type="text"
                value={formData.imagen}
                onChange={(e) => setFormData({...formData, imagen: e.target.value})}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Check
                  type="checkbox"
                  label="Destacado"
                  checked={formData.destacado}
                  onChange={(e) => setFormData({...formData, destacado: e.target.checked})}
                />
              </Col>
              <Col md={6}>
                <Form.Check
                  type="checkbox"
                  label="Novedad"
                  checked={formData.es_novedad}
                  onChange={(e) => setFormData({...formData, es_novedad: e.target.checked})}
                />
              </Col>
            </Row>

            <Form.Group className="mb-3 mt-3">
              <Form.Label>Precio de oferta (si está en oferta)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={formData.precio_oferta}
                onChange={(e) => setFormData({...formData, precio_oferta: e.target.value})}
                placeholder="Dejar vacío si no está en oferta"
              />
              <Form.Text className="text-muted">
                Si rellenas este campo, el producto se mostrará como "OFERTA"
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button type="submit" style={{
                backgroundColor: '#A8E6CF',
                borderColor: '#A8E6CF',
                color: '#2E7D32'
              }}>
                Guardar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}