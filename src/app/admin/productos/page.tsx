"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Badge,
  Spinner,
  Alert,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Producto } from "@/types/producto";

export default function AdminProductosPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [productoActual, setProductoActual] = useState<Producto | null>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagen: "",
    categoria_id: "",
    precio_oferta: "",
    destacado: false,
    es_novedad: false,
  });

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else if (!isAdmin()) {
      router.push("/");
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
      const response = await fetch("/api/admin/productos");
      const result = await response.json();

      if (result.success) {
        setProductos(result.data);
      } else {
        setError("Error al cargar productos");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const response = await fetch(`/api/admin/productos/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        fetchProductos();
      } else {
        alert("Error al eliminar");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (producto: Producto) => {
    setProductoActual(producto);

    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || "",
      precio: String(producto.precio),
      stock: String(producto.stock),
      imagen: producto.imagen || "",
      categoria_id: producto.categoria_id
        ? String(producto.categoria_id)
        : "",
      precio_oferta: producto.precio_oferta
        ? String(producto.precio_oferta)
        : "",
       destacado: producto.destacado === 1, 
      es_novedad: producto.es_novedad === 1,
    });

    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = productoActual
        ? `/api/admin/productos/${productoActual.id}`
        : "/api/admin/productos";

      
      const method = productoActual ? "PUT" : "POST";

      // Determinar es_oferta basado en precio_oferta
    const tieneOferta = formData.precio_oferta && parseFloat(formData.precio_oferta) > 0;

      const dataToSend = {
       nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock),
      imagen: formData.imagen || null,
      categoria_id: formData.categoria_id ? parseInt(formData.categoria_id) : null,
      precio_oferta: tieneOferta ? parseFloat(formData.precio_oferta) : null,
      destacado: formData.destacado ? 1 : 0,        // Checkbox Destacado
      es_novedad: formData.es_novedad ? 1 : 0,       // Checkbox Novedad
      es_oferta: tieneOferta ? 1 : 0,                 // Automatico basado en precio_oferta
    };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (result.success) {
        setShowModal(false);
        fetchProductos();// Recargar la lista
      } else {
        alert("Error al guardar");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!user || !isAdmin()) return null;

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
        <h2 style={{ color: "#2E7D32" }}>📦 Productos</h2>

        <Button
          onClick={() => {
            setProductoActual(null);
            setFormData({
              nombre: "",
              descripcion: "",
              precio: "",
              stock: "",
              imagen: "",
              categoria_id: "",
              precio_oferta: "",
              destacado: false,
              es_novedad: false,
            });
            setShowModal(true);
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
            {productos.map((p: Producto) => (
              <tr key={p.id}>
                <td>{p.id}</td>

                <td>
                  {p.imagen ? (
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        position: "relative",
                      }}
                    >
                      <Image
                        src={p.imagen}
                        alt={p.nombre}
                        fill
                        sizes="50px"
                        style={{
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: "#E8F5E9",
                        borderRadius: "10px",
                      }}
                    />
                  )}
                </td>

                <td>{p.nombre}</td>

                <td>
                  {p.precio_oferta ? (
                    <>
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "#9E9E9E",
                          marginRight: "0.5rem",
                        }}
                      >
                        {p.precio}€
                      </span>

                      <span
                        style={{
                          color: "#2E7D32",
                          fontWeight: "bold",
                        }}
                      >
                        {p.precio_oferta}€
                      </span>
                    </>
                  ) : (
                    <span>{p.precio}€</span>
                  )}
                </td>

                <td>{p.stock}</td>

                
                  {/* OFERTA - se activa por es_oferta O precio_oferta */}
                   <td>
                    <div className="d-flex gap-2 flex-wrap">
                      {p.precio_oferta && p.precio_oferta > 0 && (
                        <Badge bg="warning" text="dark">🔥 OFERTA</Badge>
                      )}
                {/* NOVEDAD - campo es_novedad */}
                {p.es_novedad === 1 && (
                  <Badge style={{ backgroundColor: '#A8E6CF', color: '#2E7D32' }}>🌱 NOVEDAD</Badge>
                )}
                
                {/* DESTACADO - (solo informativo, sin badge) */}
                {p.destacado === 1 && (
                  <Badge bg="info">⭐ DESTACADO</Badge>
                )}
                </div>
                </td>

                 {/* CELDA DE ACCIONES - SOLO LOS BOTONES */}
                  <td>
                  <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(p)}
                  >
                    Editar
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(p.id)}
                  >
                    Eliminar
                  </Button>
                 </div>
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
             {/* Campos básicos */}
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
                placeholder="/imagenes/placeholder.jpg"
              />
            </Form.Group>

             {/* SELECTOR DE CATEGORÍA */}
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                value={formData.categoria_id}
                onChange={(e) => setFormData({...formData, categoria_id: e.target.value})}
                required
              >
                <option value="">Selecciona una categoría</option>
                <option value="5">Alimentación</option>
                <option value="6">Juguetes</option>
                <option value="7">Higiene</option>
                <option value="8">Camas y Accesorios</option>
              </Form.Select>
            </Form.Group>

             {/* CHECKBOX DE NOVEDAD */}
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="🌱 Novedad"
                  checked={formData.es_novedad}
                  onChange={(e) => setFormData({...formData, es_novedad: e.target.checked})}
                />
              </Form.Group>

              {/* CHECKBOX DE DESTACADO */}
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="⭐ Destacado "
                  checked={formData.destacado}
                  onChange={(e) => setFormData({...formData, destacado: e.target.checked})}
                />
              </Form.Group>

             {/* PRECIO DE OFERTA - activa automáticamente la etiqueta OFERTA */}
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
                Si rellenas este campo, el producto se mostrará como "🔥 OFERTA"
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