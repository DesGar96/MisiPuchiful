"use client";

import React, { useState, useEffect } from "react";
import CustomBadge from "@/components/CustomBadge";
import { useParams } from "next/navigation";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Spinner,
  Alert,
  Form,
} from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import { useCarrito } from "@/context/CarritoContext";
import { useAuth } from "@/context/AuthContext";
import { FaStar, FaRegStar } from "react-icons/fa";

export default function ProductoPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { agregarAlCarrito } = useCarrito();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [reseñaForm, setReseñaForm] = useState({
    puntuacion: 5,
    comentario: "",
  });
  const [enviandoReseña, setEnviandoReseña] = useState(false);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/productos/${id}`);
        const result = await response.json();

        if (result.success) {
          setProducto(result.data);
        } else {
          setError("Error al cargar el producto");
        }
      } catch (err) {
        setError("Error de conexión al servidor");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProducto();
  }, [id]);

  const handleAgregarAlCarrito = () => {
    agregarAlCarrito(
      {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio_oferta || producto.precio,
        imagen: producto.imagen,
      },
      cantidad,
    );
  };

  const handleEnviarReseña = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Debes iniciar sesión para dejar una reseña");
      return;
    }

    setEnviandoReseña(true);
    try {
      const response = await fetch(`/api/productos/${id}/reseñas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reseñaForm),
      });

      const result = await response.json();

      if (result.success) {
        // Recargar el producto para ver la nueva reseña
        const res = await fetch(`/api/productos/${id}`);
        const data = await res.json();
        if (data.success) {
          setProducto(data.data);
        }
        setReseñaForm({ puntuacion: 5, comentario: "" });
      } else {
        alert(result.error || "Error al enviar la reseña");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al enviar la reseña");
    } finally {
      setEnviandoReseña(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Cargando producto...</p>
      </Container>
    );
  }

  if (error || !producto) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || "Producto no encontrado"}</Alert>
      </Container>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#F8F6F2",
        minHeight: "100vh",
        padding: "2rem 0",
      }}
    >
      <Container>
        <Link
          href="/tienda"
          style={{
            color: "#2E7D32",
            textDecoration: "none",
            marginBottom: "2rem",
            display: "block",
          }}
        >
          ← Volver a la tienda
        </Link>

        <Row className="g-4">
          {/* IMAGEN DEL PRODUCTO */}
          <Col md={6}>
            <Card
              className="border-0 shadow-lg"
              style={{ borderRadius: "30px", overflow: "hidden" }}
            >
              <div
                style={{ position: "relative", height: "500px", width: "100%" }}
              >
                <Image
                  src={producto.imagen || "/imagenes/placeholder.jpg"}
                  alt={producto.nombre}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            </Card>
          </Col>

          {/* DETALLES DEL PRODUCTO */}
          <Col md={6}>
            <Card
              className="border-0 shadow-lg"
              style={{ borderRadius: "30px", padding: "2rem" }}
            >
              <div className="d-flex justify-content-between align-items-start mb-3">
                <Badge
                  style={{
                    backgroundColor: "#A8E6CF",
                    color: "#2E7D32",
                    padding: "0.5rem 1rem",
                    borderRadius: "30px",
                  }}
                >
                  {producto.categoria_nombre}
                </Badge>
                {producto.es_novedad && (
                  <CustomBadge
                    color="verde"
                    style={{ position: "absolute", top: "15px", right: "15px" }}
                  >
                    🌱 NOVEDAD
                  </CustomBadge>
                )}
              </div>

              <h1
                className="fw-bold mb-3"
                style={{ color: "#2E7D32", fontSize: "2.5rem" }}
              >
                {producto.nombre}
              </h1>

              <div className="d-flex align-items-center mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{ color: "#FFD700", fontSize: "1.5rem" }}
                  >
                    {star <= Math.round(producto.puntuacion_media) ? "★" : "☆"}
                  </span>
                ))}
                <span style={{ color: "#6B5E4A", marginLeft: "1rem" }}>
                  ({producto.total_reseñas} reseñas)
                </span>
              </div>

              <p
                style={{
                  color: "#6B5E4A",
                  fontSize: "1.1rem",
                  lineHeight: "1.8",
                  marginBottom: "2rem",
                }}
              >
                {producto.descripcion}
              </p>

              <div className="mb-4">
                <h5 style={{ color: "#6B5E4A" }}>
                  Stock disponible: {producto.stock} unidades
                </h5>
              </div>

              <Row className="align-items-end mb-4">
                <Col xs={4}>
                  <Form.Group>
                    <Form.Label style={{ color: "#6B5E4A" }}>
                      Cantidad
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max={producto.stock}
                      value={cantidad}
                      onChange={(e) =>
                        setCantidad(parseInt(e.target.value) || 1)
                      }
                      style={{ borderRadius: "15px" }}
                    />
                  </Form.Group>
                </Col>
                <Col xs={8}>
                  <div className="text-end">
                    {producto.precio_oferta ? (
                      <>
                        <span
                          style={{
                            textDecoration: "line-through",
                            color: "#9E9E9E",
                            fontSize: "1.2rem",
                            marginRight: "1rem",
                          }}
                        >
                          {producto.precio}€
                        </span>
                        <span
                          style={{
                            color: "#2E7D32",
                            fontWeight: "bold",
                            fontSize: "2.5rem",
                          }}
                        >
                          {producto.precio_oferta}€
                        </span>
                      </>
                    ) : (
                      <span
                        style={{
                          color: "#2E7D32",
                          fontWeight: "bold",
                          fontSize: "2.5rem",
                        }}
                      >
                        {producto.precio}€
                      </span>
                    )}
                  </div>
                </Col>
              </Row>

              <Button
                onClick={handleAgregarAlCarrito}
                disabled={producto.stock === 0}
                style={{
                  backgroundColor: "#A8E6CF",
                  borderColor: "#A8E6CF",
                  color: "#2E7D32",
                  borderRadius: "30px",
                  padding: "1rem",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                }}
              >
                {producto.stock > 0 ? "🛒 Añadir al carrito" : "❌ Sin stock"}
              </Button>
            </Card>
          </Col>
        </Row>

        {/* SECCIÓN DE RESEÑAS */}
        <Row className="mt-5">
          <Col lg={8} className="mx-auto">
            <Card
              className="border-0 shadow-lg"
              style={{ borderRadius: "30px", padding: "2rem" }}
            >
              <h3 className="fw-bold mb-4" style={{ color: "#2E7D32" }}>
                📝 Reseñas de clientes
              </h3>

              {/* FORMULARIO DE RESEÑA (solo para usuarios logueados) */}
              {user && (
                <Card
                  className="mb-4"
                  style={{
                    backgroundColor: "#F8F6F2",
                    border: "2px solid #A8E6CF",
                    borderRadius: "20px",
                  }}
                >
                  <Card.Body>
                    <h5 style={{ color: "#2E7D32" }}>Deja tu reseña</h5>
                    <Form onSubmit={handleEnviarReseña}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#6B5E4A" }}>
                          Puntuación
                        </Form.Label>
                        <div className="d-flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              onClick={() =>
                                setReseñaForm({
                                  ...reseñaForm,
                                  puntuacion: star,
                                })
                              }
                              style={{
                                cursor: "pointer",
                                fontSize: "2rem",
                                color:
                                  star <= reseñaForm.puntuacion
                                    ? "#FFD700"
                                    : "#E0E0E0",
                              }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#6B5E4A" }}>
                          Comentario
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={reseñaForm.comentario}
                          onChange={(e) =>
                            setReseñaForm({
                              ...reseñaForm,
                              comentario: e.target.value,
                            })
                          }
                          placeholder="Cuéntanos tu experiencia con este producto..."
                          style={{ borderRadius: "15px" }}
                          required
                        />
                      </Form.Group>

                      <Button
                        type="submit"
                        disabled={enviandoReseña}
                        style={{
                          backgroundColor: "#A8E6CF",
                          borderColor: "#A8E6CF",
                          color: "#2E7D32",
                          borderRadius: "30px",
                          padding: "0.75rem 2rem",
                          fontWeight: "bold",
                        }}
                      >
                        {enviandoReseña ? "Enviando..." : "Enviar reseña"}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              )}

              {/* LISTA DE RESEÑAS */}
              {producto.reseñas?.length > 0 ? (
                producto.reseñas.map((reseña) => (
                  <Card
                    key={reseña.id}
                    className="mb-3 border-0"
                    style={{ backgroundColor: "#F8F6F2" }}
                  >
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <strong style={{ color: "#2E7D32" }}>
                            {reseña.usuario_nombre}
                          </strong>
                          <div className="d-flex gap-1 ms-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} style={{ color: "#FFD700" }}>
                                {star <= reseña.puntuacion ? "★" : "☆"}
                              </span>
                            ))}
                          </div>
                        </div>
                        <small style={{ color: "#9E9E9E" }}>
                          {new Date(reseña.fecha).toLocaleDateString("es-ES")}
                        </small>
                      </div>
                      <p style={{ color: "#6B5E4A", marginTop: "0.5rem" }}>
                        {reseña.comentario}
                      </p>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p style={{ color: "#6B5E4A", textAlign: "center" }}>
                  No hay reseñas aún. ¡Sé el primero en opinar!
                </p>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
