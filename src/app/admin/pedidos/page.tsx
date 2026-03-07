"use client";

import React, { useState, useEffect } from "react";
import {Container,Table,Badge,Button,Spinner,Alert,Form,Modal,
} from "react-bootstrap";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Pedido, EstadoPedido } from "@/types/pedido";

export default function AdminPedidosPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actualizando, setActualizando] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(
    null
  );

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else if (!isAdmin()) {
      router.push("/");
    }
  }, [user, isAdmin, router]);

  useEffect(() => {
    if (user && isAdmin()) {
      fetchPedidos();
    }
  }, [user]);

  const fetchPedidos = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/pedidos");
      const result = await response.json();

      if (result.success) {
        setPedidos(result.data);
      } else {
        setError("Error al cargar pedidos");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (pedidoId: number, nuevoEstado: EstadoPedido) => {
    setActualizando(pedidoId);

    try {
      const response = await fetch(`/api/admin/pedidos/${pedidoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      const result = await response.json();

      if (result.success) {
        fetchPedidos();
      } else {
        alert("Error al actualizar estado");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    } finally {
      setActualizando(null);
    }
  };

  const verDetalles = (pedido: Pedido) => {
    setPedidoSeleccionado(pedido);
    setShowModal(true);
  };

  const getColorEstado = (estado: EstadoPedido) => {
    const colores: Record<EstadoPedido, string> = {
      pendiente: "#FFD3B6",
      procesando: "#FDFD97",
      enviado: "#A8E6CF",
      entregado: "#A8E6CF",
      cancelado: "#FFAAA5",
    };

    return colores[estado];
  };

  const getTextoEstado = (estado: EstadoPedido) => {
    const textos: Record<EstadoPedido, string> = {
      pendiente: "⏳ Pendiente",
      procesando: "🔄 Procesando",
      enviado: "📦 Enviado",
      entregado: "✅ Entregado",
      cancelado: "❌ Cancelado",
    };

    return textos[estado];
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    return new Date(dateString).toLocaleDateString("es-ES", options);
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
        <h2 style={{ color: "#2E7D32" }}>📋 Gestión de Pedidos</h2>

        <Button
          onClick={fetchPedidos}
          style={{
            backgroundColor: "#A8E6CF",
            borderColor: "#A8E6CF",
            color: "#2E7D32",
            borderRadius: "30px",
          }}
        >
          🔄 Actualizar
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {pedidos.length === 0 ? (
        <Alert variant="info">No hay pedidos para mostrar</Alert>
      ) : (
        <div className="bg-white rounded-4 shadow-sm p-4">
          <Table responsive hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Email</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>#{pedido.id}</td>

                  <td>
                    {pedido.usuario_nombre || `Usuario ${pedido.usuario_id}`}
                  </td>

                  <td>{pedido.email || "No especificado"}</td>

                  <td>{formatDate(pedido.fecha_pedido)}</td>

                  <td>
                    <strong>{pedido.total}€</strong>
                  </td>

                  <td>
                    <Badge
                      style={{
                        backgroundColor: getColorEstado(pedido.estado),
                        color: "#2E7D32",
                        padding: "0.5rem 1rem",
                        borderRadius: "30px",
                        fontSize: "0.9rem",
                      }}
                    >
                      {getTextoEstado(pedido.estado)}
                    </Badge>
                  </td>

                  <td>
                    <div className="d-flex gap-2">
                      <Form.Select
                        size="sm"
                        value={pedido.estado}
                        onChange={(e) =>
                          cambiarEstado(
                            pedido.id,
                            e.target.value as EstadoPedido
                          )
                        }
                        disabled={actualizando === pedido.id}
                        style={{
                          width: "130px",
                          borderRadius: "20px",
                          borderColor: "#A8E6CF",
                        }}
                      >
                        <option value="pendiente">⏳ Pendiente</option>
                        <option value="procesando">🔄 Procesando</option>
                        <option value="enviado">📦 Enviado</option>
                        <option value="entregado">✅ Entregado</option>
                        <option value="cancelado">❌ Cancelado</option>
                      </Form.Select>

                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => verDetalles(pedido)}
                        style={{
                          borderColor: "#A8E6CF",
                          color: "#2E7D32",
                          borderRadius: "20px",
                        }}
                      >
                        Ver detalles
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#2E7D32" }}>
            Detalles del Pedido #{pedidoSeleccionado?.id}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {pedidoSeleccionado && (
            <>
              <div className="mb-4">
                <h6 style={{ color: "#2E7D32" }}>Información del cliente</h6>

                <p>
                  <strong>Nombre:</strong>{" "}
                  {pedidoSeleccionado.usuario_nombre || "No especificado"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {pedidoSeleccionado.email || "No especificado"}
                </p>

                <p>
                  <strong>Teléfono:</strong>{" "}
                  {pedidoSeleccionado.telefono || "No especificado"}
                </p>
              </div>

              <div className="mb-4">
                <h6 style={{ color: "#2E7D32" }}>Dirección de envío</h6>

                <p>
                  {pedidoSeleccionado.direccion_envio || "No especificada"}
                </p>
              </div>

              <div className="mb-4">
                <h6 style={{ color: "#2E7D32" }}>Método de pago</h6>

                <p>
                  {pedidoSeleccionado.metodo_pago === "contrareembolso" &&
                    "💰 Contra reembolso"}
                  {pedidoSeleccionado.metodo_pago === "bizum" && "📱 Bizum"}
                  {pedidoSeleccionado.metodo_pago === "tarjeta" && "💳 Tarjeta"}
                </p>
              </div>

              <div>
                <h6 style={{ color: "#2E7D32" }}>Resumen del pedido</h6>

                <Table size="sm">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pedidoSeleccionado.detalles?.map((detalle, index) => (
                      <tr key={index}>
                        <td>
                          {detalle.producto_nombre ||
                            `Producto #${detalle.producto_id}`}
                        </td>

                        <td>{detalle.cantidad}</td>

                        <td>{detalle.precio_unitario}€</td>

                        <td>
                          {(detalle.cantidad * detalle.precio_unitario).toFixed(
                            2
                          )}
                          €
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr>
                      <td colSpan={3} className="text-end">
                        <strong>Total:</strong>
                      </td>

                      <td>
                        <strong>{pedidoSeleccionado.total}€</strong>
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              </div>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
} 