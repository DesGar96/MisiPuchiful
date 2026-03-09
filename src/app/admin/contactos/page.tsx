"use client";

import React, { useState, useEffect } from "react";
import {Container,Card,Badge,Spinner,Alert,Table,Form
} from "react-bootstrap";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import type { Contacto } from "@/types/contacto";

export default function AdminContactosPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();

  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin())) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchContactos = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/contacto/admin");
        const result = await response.json();

        if (result.success) {
          setContactos(result.data);
        } else {
          setError("Error al cargar los contactos");
        }
      } catch {
        setError("Error de conexión al servidor");
      } finally {
        setLoading(false);
      }
    };

    if (user && isAdmin()) {
      fetchContactos();
    }
  }, [user]);

  const marcarComoLeido = async (id: number, leido: boolean) => {
    try {
      const response = await fetch("/api/contacto/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, leido: !leido })
      });

      if (response.ok) {
        setContactos((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, leido: !leido } : c
          )
        );
      }
    } catch (error) {
      console.error("Error al marcar como leído:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading || authLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Cargando mensajes...</p>
      </Container>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#F8F6F2",
        minHeight: "100vh",
        padding: "3rem 0"
      }}
    >
      <Container fluid className="px-5">

        {/* CABECERA */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #A8E6CF 0%, #B5EAD7 50%, #C7E9C0 100%)",
            color: "#6B5E4A",
            padding: "2rem 0",
            marginTop: 0,
            marginBottom: "2rem",
            borderRadius: "0 0 50px 50px",
            textAlign: "center"
          }}
        >
          <h1
            className="display-4 fw-bold mb-2"
            style={{ color: "#2E7D32" }}
          >
            📋 Mensajes de Contacto
          </h1>

          <p className="lead" style={{ color: "#6B5E4A" }}>
            Gestiona las consultas de los usuarios
          </p>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Card
          className="border-0 shadow-lg"
          style={{ borderRadius: "30px", overflow: "hidden" }}
        >
          <Card.Body className="p-4">

            {contactos.length === 0 ? (
              <div className="text-center py-5">
                <span style={{ fontSize: "4rem" }}>📭</span>
                <h4 className="mt-3" style={{ color: "#2E7D32" }}>
                  No hay mensajes
                </h4>
              </div>
            ) : (

              <Table responsive hover style={{ color: "#6B5E4A" }}>
                <thead
                  style={{
                    backgroundColor: "#E8F5E9",
                    color: "#2E7D32"
                  }}
                >
                  <tr>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Mensaje</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {contactos.map((contacto) => (
                    <tr
                      key={contacto.id}
                      style={{
                        backgroundColor: contacto.leido
                          ? "white"
                          : "#FFF3E0",
                        fontWeight: contacto.leido
                          ? "normal"
                          : "bold"
                      }}
                    >

                      <td>
                        <Badge
                          style={{
                            backgroundColor: contacto.leido
                              ? "#A8E6CF"
                              : "#FFD3B6",
                            color: "#2E7D32",
                            padding: "0.5rem 1rem",
                            borderRadius: "30px"
                          }}
                        >
                          {contacto.leido
                            ? "✓ Leído"
                            : "🕐 Nuevo"}
                        </Badge>
                      </td>

                      <td>
                        {formatDate(contacto.fecha_creacion)}
                      </td>

                      <td>{contacto.nombre}</td>

                      <td>
                        <a
                          href={`mailto:${contacto.email}`}
                          style={{
                            color: "#2E7D32",
                            textDecoration: "none"
                          }}
                        >
                          {contacto.email}
                        </a>
                      </td>

                      <td>
                        {contacto.telefono && (
                          <a
                            href={`tel:${contacto.telefono}`}
                            style={{
                              color: "#2E7D32",
                              textDecoration: "none"
                            }}
                          >
                            {contacto.telefono}
                          </a>
                        )}
                      </td>

                      <td>
                        <div
                          style={{
                            maxWidth: "200px",
                            maxHeight: "60px",
                            overflow: "hidden"
                          }}
                        >
                          {contacto.mensaje}
                        </div>
                      </td>

                      <td>
                        <Form.Check
                          type="switch"
                          id={`leido-${contacto.id}`}
                          label="Leído"
                          checked={contacto.leido}
                          onChange={() =>
                            marcarComoLeido(
                              contacto.id,
                              contacto.leido
                            )
                          }
                          style={{ color: "#2E7D32" }}
                        />
                      </td>

                    </tr>
                  ))}
                </tbody>

              </Table>
            )}

          </Card.Body>
        </Card>

      </Container>
    </div>
  );
}