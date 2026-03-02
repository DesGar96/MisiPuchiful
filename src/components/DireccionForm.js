"use client";

import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const DireccionForm = ({ formData, handleChange, userData }) => {
  const tiposVia = [
    'Calle', 'Avenida', 'Plaza', 'Paseo', 'Ronda', 
    'Camino', 'Carretera', 'Glorieta', 'Travesía', 'Urbanización'
  ];

  return (
    <>
      <h4 style={{ color: '#2E7D32', marginBottom: '1.5rem' }}>📮 Dirección de envío</h4>
      
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#6B5E4A' }}>Tipo de vía</Form.Label>
            <Form.Select
              name="tipoVia"
              value={formData.tipoVia || ''}
              onChange={handleChange}
              required
              style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
            >
              <option value="">Selecciona...</option>
              {tiposVia.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={5}>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#6B5E4A' }}>Nombre de la vía</Form.Label>
            <Form.Control
              type="text"
              name="nombreVia"
              value={formData.nombreVia || ''}
              onChange={handleChange}
              required
              placeholder="Ej: Gran Vía"
              style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
            />
          </Form.Group>
        </Col>
        
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#6B5E4A' }}>Número</Form.Label>
            <Form.Control
              type="number"
              name="numeroVia"
              value={formData.numeroVia || ''}
              onChange={handleChange}
              required
              min="1"
              placeholder="123"
              style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#6B5E4A' }}>Piso / Puerta / Letra</Form.Label>
            <Form.Control
              type="text"
              name="piso"
              value={formData.piso || ''}
              onChange={handleChange}
              placeholder="Ej: 3º B"
              style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
            />
          </Form.Group>
        </Col>
        
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#6B5E4A' }}>Código Postal</Form.Label>
            <Form.Control
              type="text"
              name="codigoPostal"
              value={formData.codigoPostal || ''}
              onChange={handleChange}
              required
              maxLength="5"
              placeholder="28001"
              style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
            />
          </Form.Group>
        </Col>
        
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#6B5E4A' }}>Ciudad</Form.Label>
            <Form.Control
              type="text"
              name="ciudad"
              value={formData.ciudad || ''}
              onChange={handleChange}
              required
              placeholder="Madrid"
              style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
            />
          </Form.Group>
        </Col>
      </Row>

      <h4 style={{ color: '#2E7D32', marginBottom: '1.5rem', marginTop: '1rem' }}>📞 Datos de contacto</h4>
      
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#6B5E4A' }}>Teléfono</Form.Label>
            <Form.Control
              type="tel"
              name="telefono"
              value={formData.telefono || ''}
              onChange={handleChange}
              required
              maxLength="9"
              pattern="[0-9]{9}"
              placeholder="600123456"
              title="Debe contener 9 dígitos numéricos"
              style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
            />
            <Form.Text className="text-muted">
              Máximo 9 dígitos, solo números
            </Form.Text>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#6B5E4A' }}>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              required
              placeholder="ejemplo@email.com"
              style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
            />
          </Form.Group>
        </Col>
      </Row>

      <h4 style={{ color: '#2E7D32', marginBottom: '1.5rem', marginTop: '1rem' }}>📝 Observaciones</h4>
      
      <Form.Group className="mb-4">
        <Form.Label style={{ color: '#6B5E4A' }}>¿Alguna nota para el pedido?</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="observaciones"
          value={formData.observaciones || ''}
          onChange={handleChange}
          placeholder="Ej: Entregar en horario de tarde, llamar al llegar, etc."
          style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
        />
      </Form.Group>
    </>
  );
};

export default DireccionForm;