"use client";

import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AdminMenu from '@/components/AdminMenu';

export default function AdminLayout({ children }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin())) {
      router.push('/');
    }
  }, [user, loading, isAdmin, router]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </Container>
    );
  }

  if (!user || !isAdmin()) {
    return null;
  }

  return (
    <div style={{ backgroundColor: '#F8F6F2', minHeight: '100vh', padding: '2rem 0' }}>
      <Container fluid className="px-5">
        <Row>
          <Col lg={3} className="mb-4">
            <div className="sticky-top" style={{ top: '100px' }}>
              <h4 style={{ color: '#2E7D32', marginBottom: '1.5rem' }}>👑 Panel Admin</h4>
              <AdminMenu />
            </div>
          </Col>
          <Col lg={9}>
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  );
}