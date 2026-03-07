"use client";

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ResultadoBusqueda } from '@/types/buscar';
import { Suspense } from 'react';

// Componente que usa useSearchParams
function BuscarContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [resultados, setResultados] = useState<ResultadoBusqueda[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<any>(null);

  useEffect(() => {
    const fetchResultados = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/buscar?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Resultados:', result);
        
        if (result.success) {
          setResultados(result.data || []);
        } else {
          setError(result.error || 'Error al realizar la búsqueda');
          setDebug(result);
        }
      } catch (err) {
        console.error('Error en búsqueda:', err);
        setError('Error de conexión al servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchResultados();
  }, [query]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Buscando...</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ 
        background: 'linear-gradient(135deg, #A8E6CF 0%, #B5EAD7 50%, #C7E9C0 100%)',
        color: '#6B5E4A',
        padding: '2rem 0',
        marginBottom: '2rem',
        borderRadius: '0 0 50px 50px',
        textAlign: 'center'
      }}>
        <h1 className="display-4 fw-bold mb-3" style={{ color: '#2E7D32' }}>
          🔍 Resultados de búsqueda
        </h1>
        <p className="lead fs-4" style={{ color: '#6B5E4A' }}>
          {query ? `Buscando: "${query}"` : 'Introduce un término de búsqueda'}
        </p>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {debug && (
        <Alert variant="warning" className="mb-4">
          <pre>{JSON.stringify(debug, null, 2)}</pre>
        </Alert>
      )}

      {!query ? (
        <Card className="text-center py-5 border-0 shadow-sm" style={{ borderRadius: '25px' }}>
          <Card.Body>
            <span style={{ fontSize: '4rem' }}>🔍</span>
            <h4 className="mt-3" style={{ color: '#2E7D32' }}>No has buscado nada</h4>
            <p className="text-muted">Utiliza el buscador del menú para encontrar productos y artículos</p>
          </Card.Body>
        </Card>
      ) : resultados.length === 0 ? (
        <Card className="text-center py-5 border-0 shadow-sm" style={{ borderRadius: '25px' }}>
          <Card.Body>
            <span style={{ fontSize: '4rem' }}>😕</span>
            <h4 className="mt-3" style={{ color: '#2E7D32' }}>No se encontraron resultados</h4>
            <p className="text-muted">Prueba con otros términos de búsqueda</p>
          </Card.Body>
        </Card>
      ) : (
        <>
          <div className="mb-4">
            <Badge style={{ 
              backgroundColor: '#A8E6CF',
              color: '#2E7D32',
              fontSize: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: '30px'
            }}>
              {resultados.length} resultado{resultados.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {resultados.map((item, index) => {
              const key = `${item.tipo}-${item.id || index}`;
              
              return item.tipo === 'producto' ? (
                <Col key={key}>
                  <Link href={`/tienda/${item.id}`} style={{ textDecoration: 'none' }}>
                    <Card className="h-100 shadow-sm hover-effect" style={{ 
                      borderRadius: '25px',
                      overflow: 'hidden',
                      border: 'none'
                    }}>
                      <div style={{ position: 'relative', height: '150px', width: '100%' }}>
                        <Image
                          src={item.imagen || '/imagenes/placeholder.jpg'}
                          alt={item.nombre}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          style={{ objectFit: 'cover' }}
                        />
                        {item.precio_oferta && item.precio_oferta > 0 && (
                          <div style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            backgroundColor: '#FFD3B6',
                            color: '#6B5E4A',
                            padding: '0.3rem 0.8rem',
                            borderRadius: '30px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                          }}>
                            🔥 OFERTA
                          </div>
                        )}
                        {item.es_novedad === 1 && (
                          <div style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            backgroundColor: '#A8E6CF',
                            color: '#2E7D32',
                            padding: '0.3rem 0.8rem',
                            borderRadius: '30px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                          }}>
                            🌱 NOVEDAD
                          </div>
                        )}
                      </div>
                      <Card.Body>
                        <Card.Title style={{ color: '#2E7D32', fontSize: '1rem' }}>
                          {item.nombre}
                        </Card.Title>
                        <Card.Text style={{ color: '#6B5E4A', fontSize: '0.8rem' }}>
                          {item.descripcion?.substring(0, 60)}...
                        </Card.Text>
                        <div className="d-flex justify-content-between align-items-center">
                          <span style={{ color: '#2E7D32', fontWeight: 'bold' }}>
                            {item.precio}€
                          </span>
                          <Badge style={{ 
                            backgroundColor: '#E8F5E9',
                            color: '#2E7D32'
                          }}>
                            Producto
                          </Badge>
                        </div>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              ) : (
                <Col key={key}>
                  <Link href={`/blog/${item.id}`} style={{ textDecoration: 'none' }}>
                    <Card className="h-100 shadow-sm hover-effect" style={{ 
                      borderRadius: '25px',
                      overflow: 'hidden',
                      border: 'none'
                    }}>
                      <div style={{ position: 'relative', height: '150px', width: '100%' }}>
                        <Image
                          src={item.imagen || '/imagenes/blog-placeholder.jpg'}
                          alt={item.nombre}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <Card.Body>
                        <Card.Title style={{ color: '#2E7D32', fontSize: '1rem' }}>
                          {item.nombre}
                        </Card.Title>
                        <Card.Text style={{ color: '#6B5E4A', fontSize: '0.8rem' }}>
                          {item.descripcion?.substring(0, 60)}...
                        </Card.Text>
                        <Badge style={{ 
                          backgroundColor: '#FFD3B6',
                          color: '#6B5E4A'
                        }}>
                          📝 Blog
                        </Badge>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              );
            })}
          </Row>
        </>
      )}

      <style jsx>{`
        .hover-effect:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(168, 230, 207, 0.3) !important;
        }
      `}</style>
    </>
  );
}

// Componente principal con Suspense
export default function BuscarPage() {
  return (
    <div style={{ backgroundColor: '#F8F6F2', minHeight: '100vh', padding: '3rem 0' }}>
      <Container>
        <Suspense fallback={
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
            <p className="mt-3">Cargando...</p>
          </div>
        }>
          <BuscarContent />
        </Suspense>
      </Container>
    </div>
  );
}