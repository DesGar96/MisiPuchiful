"use client";

import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Spinner, Alert, Modal, Form, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AdminBlogPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [postActual, setPostActual] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    resumen: '',
    imagen: '',
    categoria: 'general',
    activo: true
  });

  useEffect(() => {
    if (!user || !isAdmin()) {
      router.push('/');
    } else {
      fetchPosts();
    }
  }, [user, isAdmin, router]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/blog');
      const result = await response.json();
      if (result.success) {
        setPosts(result.data);
      } else {
        setError('Error al cargar los posts');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este post?')) return;
    
    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.success) {
        fetchPosts();
      } else {
        alert('Error al eliminar');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (post) => {
    setPostActual(post);
    setFormData({
      titulo: post.titulo,
      contenido: post.contenido,
      resumen: post.resumen || '',
      imagen: post.imagen || '',
      categoria: post.categoria || 'general',
      activo: post.activo === 1
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = postActual 
        ? `/api/admin/blog/${postActual.id}`
        : '/api/admin/blog';
      
      const method = postActual ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (result.success) {
        setShowModal(false);
        fetchPosts();
      } else {
        alert('Error al guardar');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // FUNCIÓN CORREGIDA PARA FORMATO DE FECHAS (usando fecha_publicacion)
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    
    try {
      const date = new Date(dateString);
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }
      
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleDateString('es-ES', options);
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return 'Fecha inválida';
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
        <h2 style={{ color: '#2E7D32' }}>📝 Posts del Blog</h2>
        <Button
          onClick={() => {
            setPostActual(null);
            setFormData({
              titulo: '',
              contenido: '',
              resumen: '',
              imagen: '',
              categoria: 'general',
              activo: true
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
          + Nuevo Post
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="bg-white rounded-4 shadow-sm p-4">
        <Table responsive hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Categoría</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>
                  <Link href={`/blog/${post.id}`} target="_blank" style={{ color: '#2E7D32', textDecoration: 'none' }}>
                    {post.titulo}
                  </Link>
                </td>
                <td>
                  <Badge style={{ 
                    backgroundColor: '#A8E6CF', 
                    color: '#2E7D32',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '20px'
                  }}>
                    {post.categoria || 'General'}
                  </Badge>
                </td>
                <td>{formatDate(post.fecha_publicacion)}</td> {/* CAMBIADO A fecha_publicacion */}
                <td>
                  {post.activo === 1 ? (
                    <Badge style={{ 
                      backgroundColor: '#A8E6CF', 
                      color: '#2E7D32',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '20px'
                    }}>
                      Activo
                    </Badge>
                  ) : (
                    <Badge style={{ 
                      backgroundColor: '#FFD3B6', 
                      color: '#6B5E4A',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '20px'
                    }}>
                      Inactivo
                    </Badge>
                  )}
                </td>
                <td>
                  <Button
                    size="sm"
                    onClick={() => handleEdit(post)}
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
                    onClick={() => handleDelete(post.id)}
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
            {postActual ? 'Editar Post' : 'Nuevo Post'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Resumen</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.resumen}
                onChange={(e) => setFormData({...formData, resumen: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contenido</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={formData.contenido}
                onChange={(e) => setFormData({...formData, contenido: e.target.value})}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                  >
                    <option value="general">General</option>
                    <option value="perros">Perros</option>
                    <option value="gatos">Gatos</option>
                    <option value="otras_especies">Otras especies</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>URL de la imagen</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.imagen}
                    onChange={(e) => setFormData({...formData, imagen: e.target.value})}
                    placeholder="/imagenes/blog/..."
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Check
              type="checkbox"
              label="Activo"
              checked={formData.activo}
              onChange={(e) => setFormData({...formData, activo: e.target.checked})}
              className="mb-3"
            />

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