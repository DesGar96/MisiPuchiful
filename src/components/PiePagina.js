"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const PiePagina = () => {
  const añoActual = new Date().getFullYear();
  
  return (
    <footer className="bg-light pt-4 pb-3 mt-5 border-top">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
            <p className="text-muted mb-0">
              Copyright © Misipuchiful {añoActual}
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <p className="text-muted mb-0 small">
              Cuidando a tus peludos con amor y dedicación
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default PiePagina;