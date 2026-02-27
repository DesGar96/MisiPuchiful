"use client";

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Nav } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

const BlogNovedades = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoriaActual = searchParams.get('categoria') || '';
  
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reaccionesEnviando, setReaccionesEnviando] = useState({});
  const [modo, setModo] = useState('novedades');

  const categorias = [
    { id: 'perros', nombre: 'Perros', icono: '🐕' },
    { id: 'gatos', nombre: 'Gatos', icono: '🐈' },
    { id: 'otras_especies', nombre: 'Otras especies', icono: '🐾' }
  ];

  const emojisDisponibles = [
    { emoji: '👍', label: 'Me gusta' },
    { emoji: '❤️', label: 'Me encanta' },
    { emoji: '😄', label: 'Me divierte' },
    { emoji: '😮', label: 'Me sorprende' },
    { emoji: '😢', label: 'Me entristece' },
    { emoji: '😡', label: 'Me enfada' }
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
      if (modo === 'todos') {
        setFilteredPosts(posts);
      } else if (categoriaActual) {
        const filtrados = posts.filter(post => post.categoria === categoriaActual);
        setFilteredPosts(filtrados);
      } else {
        const soloNovedades = posts.filter(post => post.novedades === true);
        setFilteredPosts(soloNovedades);
      }
    }
  }, [categoriaActual, posts, modo]);

  useEffect(() => {
    const urlModo = searchParams.get('todos') ? 'todos' : 'novedades';
    setModo(urlModo);
  }, [searchParams]);

  const cambiarCategoria = (categoriaId) => {
    setModo('categoria');
    router.push(`/blog?categoria=${categoriaId}`);
  };

  const verTodosLosPosts = () => {
    setModo('todos');
    router.push('/blog?todos=true');
  };

  const verNovedades = () => {
    setModo('novedades');
    router.push('/blog');
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
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return { 
              ...post, 
              reacciones: result.reacciones,
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
        <p className="mt-3 fs-5" style={{ color: '#6B5E4A' }}>Cargando artículos...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-5 px-5">
        <Alert variant="success" style={{ backgroundColor: '#D4EDDA', borderColor: '#A8E6CF', color: '#6B5E4A' }}>
          <Alert.Heading>¡Ups! Algo no fue bien</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="blog-container" style={{ backgroundColor: '#F8F6F2' }}>
      
      {/* CABECERA */}
      <div style={{ 
        background: 'linear-gradient(135deg, #A8E6CF 0%, #B5EAD7 50%, #C7E9C0 100%)',
        color: '#6B5E4A',
        padding: '3rem 0',
        marginBottom: '2rem',
        borderRadius: '0 0 50px 50px'
      }}>
        <Container fluid className="px-5">
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="display-3 fw-bold mb-3" style={{ color: '#6B5E4A' }}>
                🌿 Blog de Misipuchiful
              </h1>
              <p className="lead fs-4" style={{ color: '#6B5E4A' }}>
                Consejos naturales para cuidar a tus peludos
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container fluid className="px-5">
        <Row>
          {/* SUBMENÚ LATERAL */}
          <Col lg={3} className="mb-4">
            <div className="sticky-top" style={{ top: '100px' }}>
              <Card className="border-0 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
                <Card.Header style={{ 
                  background: 'linear-gradient(135deg, #B5EAD7 0%, #C7E9C0 100%)',
                  color: '#6B5E4A',
                  border: 'none',
                  padding: '1.5rem'
                }}>
                  <h4 className="mb-0 fw-bold">🌱 Categorías</h4>
                </Card.Header>
                <Card.Body className="p-0">
                  <Nav className="flex-column">
                    
                    {/* NOVEDADES */}
                    <Nav.Link
                      onClick={verNovedades}
                      className="py-3 px-4 border-bottom d-flex align-items-center"
                      style={{
                        cursor: 'pointer',
                        backgroundColor: modo === 'novedades' && !categoriaActual ? '#E8F5E9' : 'white',
                        color: modo === 'novedades' && !categoriaActual ? '#2E7D32' : '#6B5E4A',
                        borderLeft: modo === 'novedades' && !categoriaActual ? '5px solid #A8E6CF' : 'none'
                      }}
                    >
                      <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>✨</span>
                      <span className="fw-bold">Novedades</span>
                    </Nav.Link>

                    {/* TODOS LOS POSTS */}
                    <Nav.Link
                      onClick={verTodosLosPosts}
                      className="py-3 px-4 border-bottom d-flex align-items-center"
                      style={{
                        cursor: 'pointer',
                        backgroundColor: modo === 'todos' ? '#E8F5E9' : 'white',
                        color: modo === 'todos' ? '#2E7D32' : '#6B5E4A',
                        borderLeft: modo === 'todos' ? '5px solid #A8E6CF' : 'none'
                      }}
                    >
                      <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>📚</span>
                      <span className="fw-bold">Todos los posts</span>
                    </Nav.Link>

                    {/* CATEGORÍAS */}
                    {categorias.map(cat => (
                      <Nav.Link
                        key={cat.id}
                        onClick={() => cambiarCategoria(cat.id)}
                        className="py-3 px-4 border-bottom d-flex align-items-center"
                        style={{
                          cursor: 'pointer',
                          backgroundColor: categoriaActual === cat.id ? '#E8F5E9' : 'white',
                          color: categoriaActual === cat.id ? '#2E7D32' : '#6B5E4A',
                          borderLeft: categoriaActual === cat.id ? '5px solid #A8E6CF' : 'none'
                        }}
                      >
                        <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>{cat.icono}</span>
                        <span className="fw-bold">{cat.nombre}</span>
                      </Nav.Link>
                    ))}
                  </Nav>
                </Card.Body>
              </Card>

              {/* Widget consejo del día */}
              <Card className="border-0 shadow-sm mt-4" style={{ 
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
                border: '2px solid #A8E6CF'
              }}>
                <Card.Body className="text-center p-4">
                  <span style={{ fontSize: '3rem' }}>🌿</span>
                  <h5 className="fw-bold mt-2" style={{ color: '#2E7D32' }}>Consejo del día</h5>
                  <p style={{ color: '#6B5E4A' }}>
                    "Pasear por la naturaleza reduce el estrés tanto en humanos como en mascotas."
                  </p>
                </Card.Body>
              </Card>
            </div>
          </Col>

          {/* CONTENIDO PRINCIPAL */}
          <Col lg={9}>
            <div className="d-flex align-items-center mb-4">
              <h2 className="fw-bold" style={{ color: '#2E7D32', fontSize: '2.2rem' }}>
                {modo === 'todos' ? '📚 Todos los posts' : 
                 categoriaActual ? categorias.find(c => c.id === categoriaActual)?.nombre : 
                 '✨ Novedades'}
              </h2>
              <Badge style={{ 
                backgroundColor: '#A8E6CF',
                color: '#2E7D32',
                fontSize: '1rem',
                marginLeft: '1rem',
                padding: '0.5rem 1rem',
                borderRadius: '30px'
              }}>
                {filteredPosts.length} artículo{filteredPosts.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            {filteredPosts.length > 0 ? (
              <Row xs={1} md={2} className="g-4">
                {filteredPosts.map((post) => (
                  <Col key={post.id}>
                    <Card className="border-0 shadow-sm hover-effect h-100" style={{ 
                      borderRadius: '25px',
                      overflow: 'hidden',
                      backgroundColor: '#FFFFFF'
                    }}>
                      <div style={{ position: 'relative', height: '200px', width: '100%' }}>
                        <Image
                          src={post.imagen || '/imagenes/blog-placeholder.jpg'}
                          alt={post.titulo}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          style={{ objectFit: 'cover' }}
                        />
                        {post.novedades && modo !== 'todos' && (
                          <Badge 
                            style={{ 
                              position: 'absolute',
                              top: '15px',
                              right: '15px',
                              backgroundColor: '#FFD3B6',
                              color: '#6B5E4A',
                              padding: '0.5rem 1rem',
                              borderRadius: '30px',
                              fontSize: '0.9rem',
                              fontWeight: 'bold'
                            }}
                          >
                            🌱 NOVEDAD
                          </Badge>
                        )}
                      </div>
                      
                      <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <Badge style={{ 
                            backgroundColor: '#A8E6CF',
                            color: '#2E7D32',
                            padding: '0.5rem 1rem',
                            borderRadius: '30px'
                          }}>
                            {post.categoria === 'perros' ? '🐕 Perros' : 
                             post.categoria === 'gatos' ? '🐈 Gatos' : '🐾 Otras especies'}
                          </Badge>
                          <small style={{ color: '#9E9E9E' }}>
                            {formatDate(post.fecha_creacion)}
                          </small>
                        </div>

                        {/* TÍTULO - FORZADO A VERDE OSCURO */}
                        <h3 className="fw-bold mb-3">
                          <Link href={`/blog/${post.id}`} style={{ 
                            textDecoration: 'none',
                            color: '#2E7D32'
                          }}>
                            {post.titulo}
                          </Link>
                        </h3>

                        <p style={{ color: '#6B5E4A' }}>
                          {post.resumen || post.contenido.substring(0, 100) + '...'}
                        </p>

                        {/* Reacciones */}
                        <div className="d-flex gap-3 mb-3">
                          {emojisDisponibles.slice(0, 4).map(({ emoji }) => {
                            const haReaccionado = post.misReacciones?.[emoji];
                            return (
                              <Button
                                key={emoji}
                                variant="link"
                                className="p-0"
                                style={{
                                  fontSize: '1.1rem',
                                  textDecoration: 'none',
                                  color: haReaccionado ? '#2E7D32' : '#9E9E9E',
                                  fontWeight: haReaccionado ? 'bold' : 'normal'
                                }}
                                onClick={() => handleReaccion(post.id, emoji)}
                                disabled={reaccionesEnviando[`${post.id}-${emoji}`]}
                              >
                                {emoji} {post.reacciones?.[emoji] || 0}
                              </Button>
                            );
                          })}
                        </div>

                        <div className="d-flex align-items-center mt-3">
                          <div style={{ 
                            backgroundColor: '#E8F5E9',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '10px'
                          }}>
                            <span style={{ color: '#2E7D32', fontWeight: 'bold' }}>
                              {post.autor?.charAt(0) || 'M'}
                            </span>
                          </div>
                          <div className="flex-grow-1">
                            <small style={{ color: '#9E9E9E' }}>Por</small>
                            <div style={{ color: '#2E7D32', fontWeight: 'bold' }}>{post.autor}</div>
                          </div>
                          <Link href={`/blog/${post.id}`} style={{ textDecoration: 'none' }}>
                            <Button style={{ 
                              backgroundColor: '#A8E6CF',
                              borderColor: '#A8E6CF',
                              color: '#2E7D32',
                              borderRadius: '30px',
                              padding: '0.5rem 1.5rem',
                              fontWeight: 'bold'
                            }}>
                              Leer
                            </Button>
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Card className="text-center py-5 border-0 shadow-sm" style={{ borderRadius: '25px', backgroundColor: '#FFFFFF' }}>
                <Card.Body>
                  <span style={{ fontSize: '4rem' }}>🌿</span>
                  <h4 className="mt-3" style={{ color: '#2E7D32' }}>No hay artículos</h4>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
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

export default BlogNovedades;