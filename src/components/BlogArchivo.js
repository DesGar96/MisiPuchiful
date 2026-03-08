"use client";

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Nav } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

const Blog = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoriaActual = searchParams.get('categoria') || 'perros';
  
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reaccionesEnviando, setReaccionesEnviando] = useState({});

  const categorias = [
    { id: 'perros', nombre: '🐕 Perros', icono: '🐕' },
    { id: 'gatos', nombre: '🐈 Gatos', icono: '🐈' },
    { id: 'otras_especies', nombre: '🐾 Otras especies', icono: '🐾' }
  ];

  const emojisDisponibles = [
    { emoji: '👍', label: 'Me gusta', color: '#0d6efd' },
    { emoji: '❤️', label: 'Me encanta', color: '#dc3545' },
    { emoji: '😄', label: 'Me divierte', color: '#ffc107' },
    { emoji: '😮', label: 'Me sorprende', color: '#0dcaf0' },
    { emoji: '😢', label: 'Me entristece', color: '#6c757d' },
    { emoji: '😡', label: 'Me enfada', color: '#862e2e' }
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/blog');
        const result = await response.json();
        
        if (result.success) {
          setPosts(result.data);
        } else {
          setError('Error al cargar los posts');
        }
      } catch (err) {
        setError('Error de conexión al servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      const filtrados = posts.filter(post => post.categoria === categoriaActual);
      setFilteredPosts(filtrados);
    }
  }, [categoriaActual, posts]);

  const cambiarCategoria = (categoriaId) => {
    router.push(`/blog?categoria=${categoriaId}`);
  };

  const handleReaccion = async (postId, emoji) => {
    if (reaccionesEnviando[`${postId}-${emoji}`]) return;
    
    setReaccionesEnviando(prev => ({ ...prev, [`${postId}-${emoji}`]: true }));
    
    try {
      const response = await fetch('/api/blog/reaccion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, emoji })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Actualizar el contador en el estado local
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return { 
              ...post, 
              reacciones: result.reacciones,
              // Actualizar misReacciones (toggle)
              misReacciones: {
                ...post.misReacciones,
                [emoji]: !post.misReacciones?.[emoji]
              }
            };
          }
          return post;
        }));
      }
    } catch (error) {
      console.error('Error al enviar reacción:', error);
    } finally {
      setReaccionesEnviando(prev => ({ ...prev, [`${postId}-${emoji}`]: false }));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (loading) {
    return (
      <Container fluid className="py-5 text-center px-5">
        <Spinner animation="border" variant="success" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3 fs-5">Cargando artículos del blog...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-5 px-5">
        <Alert variant="danger">
          <Alert.Heading>Error al cargar el blog</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="blog-container">
      {/* Cabecera  - CON FLUID Y PADDING */}
      <div className="bg-success text-white py-5 mb-4">
        <Container fluid className="px-5">
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="display-3 fw-bold mb-3">Blog de Misipuchiful</h1>
              <p className="lead fs-4">
                Consejos, historias y novedades de Misifú y Puchi para cuidar mejor a tus peludos
              </p>
            </Col>
            <Col md={4} className="text-center d-none d-md-block">
              <div style={{ fontSize: '8rem', lineHeight: 1 }}>🐾</div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Contenedor principal FLUID con padding */}
      <Container fluid className="px-5">
        <Row>
          {/* Submenú lateral de categorías */}
          <Col lg={3} className="mb-4" style= "z-index:1;">
            <div className="sticky-top" style={{ top: '100px' }}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-success text-white py-3">
                  <h4 className="mb-0 fw-bold">📋 Categorías</h4>
                </Card.Header>
                <Card.Body className="p-0">
                  <Nav className="flex-column">
                    {categorias.map(cat => (
                      <Nav.Link
                        key={cat.id}
                        onClick={() => cambiarCategoria(cat.id)}
                        active={categoriaActual === cat.id}
                        className={`py-3 px-4 border-bottom d-flex align-items-center ${
                          categoriaActual === cat.id ? 'bg-success bg-opacity-10 text-success fw-bold' : 'text-dark'
                        }`}
                        style={{ cursor: 'pointer' }}
                      >
                        <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>{cat.icono}</span>
                        {cat.nombre}
                        {categoriaActual === cat.id && (
                          <Badge bg="success" className="ms-auto">
                            {filteredPosts.length}
                          </Badge>
                        )}
                      </Nav.Link>
                    ))}
                  </Nav>
                </Card.Body>
              </Card>

              
            </div>
          </Col>

          {/* Grid de posts */}
          <Col lg={9}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold">
                {categorias.find(c => c.id === categoriaActual)?.nombre}
              </h2>
              <Badge bg="success" className="fs-6">
                {filteredPosts.length} artículo{filteredPosts.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            {filteredPosts.length > 0 ? (
              <Row xs={1} className="g-4">
                {filteredPosts.map((post) => (
                  <Col key={post.id}>
                    <Card className="border-0 shadow-sm hover-effect overflow-hidden">
                      <Row className="g-0">
                        <Col md={4}>
                          <div style={{ position: 'relative', height: '100%', minHeight: '250px' }}>
                            <Image
                              src={post.imagen || '/imagenes/blog-placeholder.jpg'}
                              alt={post.titulo}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                        </Col>
                        <Col md={8}>
                          <Card.Body className="p-4">
                            <div className="d-flex align-items-center mb-3">
                              <Badge bg="success" className="me-2">
                                {categorias.find(c => c.id === post.categoria)?.nombre || post.categoria}
                              </Badge>
                              <small className="text-muted">
                                <i className="bi bi-calendar3 me-1"></i>
                                {formatDate(post.fecha_creacion)}
                              </small>
                            </div>

                            <Card.Title className="fw-bold fs-3 mb-3">
                              <Link href={`/blog/${post.id}`} className="text-decoration-none text-dark hover:text-success">
                                {post.titulo}
                              </Link>
                            </Card.Title>

                            <Card.Text className="text-muted mb-3">
                              {post.resumen || post.contenido.substring(0, 150) + '...'}
                            </Card.Text>

                            {/* SECCIÓN DE REACCIONES - VERSIÓN COMPLETA CON TOGGLE */}
                        <div className="border-top pt-3 mt-3">
                        <div className="d-flex flex-wrap align-items-center gap-2">
                            {emojisDisponibles.map(({ emoji, label, color }) => {
                            const haReaccionado = post.misReacciones?.[emoji];
                            
                            return (
                                <Button
                                key={emoji}
                                variant="link"
                                className={`d-flex align-items-center gap-2 text-decoration-none reaccion-btn ${
                                    haReaccionado ? 'fw-bold' : ''
                                }`}
                                style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    padding: '0.25rem 0.5rem',
                                    color: haReaccionado ? color : '#6c757d'
                                }}
                                onClick={() => handleReaccion(post.id, emoji)}
                                disabled={reaccionesEnviando[`${post.id}-${emoji}`]}
                                >
                                <span style={{ fontSize: '1.2rem' }}>{emoji}</span>
                                <span>{post.reacciones?.[emoji] || 0}</span>
                                </Button>
                            );
                            })}
                        </div>
                        </div>

                            <div className="mt-3">
                              <Link href={`/blog/${post.id}`} className="text-decoration-none">
                                <Button variant="success" className="px-4">
                                  Leer artículo completo →
                                </Button>
                              </Link>
                            </div>
                          </Card.Body>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Card className="text-center py-5 border-0 shadow-sm">
                <Card.Body>
                  <div style={{ fontSize: '4rem' }}>📭</div>
                  <h4 className="mt-3">No hay artículos en esta categoría</h4>
                  <p className="text-muted">Pronto publicaremos nuevos contenidos sobre {categoriaActual}</p>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .hover-effect {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-effect:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        }
        .reaccion-btn {
          transition: all 0.2s ease;
        }
        .reaccion-btn:hover {
          transform: scale(1.1);
          background-color: #f8f9fa !important;
        }
        .reaccion-btn:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
};

export default Blog;