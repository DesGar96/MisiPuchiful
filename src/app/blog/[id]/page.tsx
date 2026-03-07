"use client";

import React, { useState, useEffect } from "react";
import CustomBadge from "@/components/CustomBadge";
import { useParams } from "next/navigation";
import { Container, Row, Col, Badge, Spinner, Alert } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/types/blog"; 

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blog/${id}`);
        const result = await response.json();

        if (result.success) {
          setPost(result.data);
        } else {
          setError("Error al cargar el artículo");
        }
      } catch (err) {
        setError("Error de conexión al servidor");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Cargando artículo...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Post no encontrado</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Link
            href="/blog"
            className="text-decoration-none text-success mb-4 d-inline-block"
          >
            ← Volver al blog
          </Link>

          <div
            style={{ position: "relative", height: "400px", width: "100%" }}
            className="mb-4 rounded-4 overflow-hidden"
          >
            <Image
              src={post.imagen || '/imagenes/blog-placeholder.jpg'}
              alt={post.titulo}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          <div className="mb-4">
            <Badge
              style={{
                backgroundColor: '#A8E6CF',
                color: '#2E7D32',
                padding: '0.5rem 1rem',
                borderRadius: '30px',
                marginRight: '0.5rem'
              }}
            >
              {post.categoria || 'General'}
            </Badge>
            <Badge
              style={{
                backgroundColor: '#F8F6F2',
                color: '#6B5E4A',
                padding: '0.5rem 1rem',
                borderRadius: '30px'
              }}
            >
              {formatDate(post.fecha_publicacion)}
            </Badge>
          </div>

          <h1 className="display-5 fw-bold mb-4" style={{ color: '#2E7D32' }}>
            {post.titulo}
          </h1>

          <div className="d-flex align-items-center mb-4">
            <div
              style={{
                backgroundColor: '#E8F5E9',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px'
              }}
            >
              <span style={{ color: '#2E7D32', fontWeight: 'bold', fontSize: '1.2rem' }}>
                {(post as any).autor?.charAt(0) || "M"}
              </span>
            </div>
            <div>
              <p className="mb-0 fw-bold" style={{ color: '#2E7D32' }}>
                {(post as any).autor || "Misifú y Puchi"}
              </p>
              <small style={{ color: '#9E9E9E' }}>Misipuchiful</small>
            </div>
          </div>

          <div
            className="blog-content fs-5 lh-lg"
            style={{ color: '#6B5E4A' }}
          >
            {post.contenido.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
}