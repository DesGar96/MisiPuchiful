"use client";

import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalConfirmacion = ({ 
  show, 
  onHide, 
  onConfirm, 
  titulo, 
  mensaje, 
  icono = '❓', // ← AÑADIDO CON VALOR POR DEFECTO
  textoConfirmacion = 'Sí, vaciar'
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="sm"
      restoreFocus={false}
    >
      <Modal.Header closeButton style={{ border: 'none' }}>
        <Modal.Title style={{ color: '#2E7D32' }}>
          {titulo || 'Confirmar acción'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>
          {icono} {/* ← AHORA USA LA PROP */}
        </span>
        <p style={{ color: '#6B5E4A', fontSize: '1.1rem' }}>
          {mensaje || '¿Estás seguro de realizar esta acción?'}
        </p>
      </Modal.Body>
      <Modal.Footer style={{ border: 'none', justifyContent: 'center' }}>
        <Button
          variant="outline-secondary"
          onClick={onHide}
          style={{
            borderColor: '#6B5E4A',
            color: '#6B5E4A',
            borderRadius: '30px',
            padding: '0.5rem 1.5rem'
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onHide();
          }}
          style={{
            backgroundColor: '#FF8B94',
            borderColor: '#FF8B94',
            color: 'white',
            borderRadius: '30px',
            padding: '0.5rem 1.5rem',
            fontWeight: 'bold'
          }}
        >
          {textoConfirmacion}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalConfirmacion;