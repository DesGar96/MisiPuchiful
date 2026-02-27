"use client";

import React, { useState, useEffect } from "react";
import CustomBadge from "@/components/CustomBadge"
import { useParams } from "next/navigation";
import { Container, Row, Col, Badge, Spinner, Alert } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              src={post.imagen}
              alt={post.titulo}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          <div className="mb-4">
            <Badge bg="success" className="me-2">
              {post.categoria}
            </Badge>
            <Badge bg="light" text="dark"></Badge>
            <CustomBadge
              color="melocoton"
              style={{ position: "absolute", top: "15px", left: "15px" }}
            >
            </CustomBadge>
          </div>

          <h1 className="display-5 fw-bold mb-4">{post.titulo}</h1>

          <div className="d-flex align-items-center mb-4">
            <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
              <span className="text-success fw-bold">
                {post.autor?.charAt(0) || "M"}
              </span>
            </div>
            <div>
              <p className="mb-0 fw-bold">{post.autor}</p>
              <small className="text-muted">Misipuchiful</small>
            </div>
          </div>

          <div className="blog-content fs-5 lh-lg">
            {post.contenido.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
