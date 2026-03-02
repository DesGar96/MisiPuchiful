"use client";

import React from 'react';
import { Modal, Button, ListGroup, Image, Form } from 'react-bootstrap';
import { useCarrito } from '@/context/CarritoContext';
import { useRouter } from 'next/navigation';

const CarritoModal = () => {
  const router = useRouter();
  const { mostrarCarrito, setMostrarCarrito, items, eliminarDelCarrito, actualizarCantidad, total } = useCarrito();

  const handleFinalizarCompra = () => {
    setMostrarCarrito(false);
    router.push('/carrito/finalizar');
  };

  return (
    <Modal 
      show={mostrarCarrito} 
      onHide={() => setMostrarCarrito(false)} 
      size="lg" 
      centered
      restoreFocus={false}
    >
      <Modal.Header closeButton style={{ border: 'none' }}>
        <Modal.Title style={{ color: '#2E7D32' }}>🛒 Tu Carrito</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {items.length === 0 ? (
          <p className="text-center" style={{ color: '#6B5E4A' }}>Tu carrito está vacío</p>
        ) : (
          <ListGroup variant="flush">
            {items.map((item) => (
              <ListGroup.Item key={item.id} className="d-flex align-items-center">
                <div style={{ width: '60px', height: '60px', position: 'relative', marginRight: '15px' }}>
                  <Image
                    src={item.imagen || '/imagenes/placeholder.jpg'}
                    alt={item.nombre}
                    fluid
                    style={{ objectFit: 'cover', borderRadius: '10px', width: '60px', height: '60px' }}
                  />
                </div>
                <div className="flex-grow-1">
                  <h6 style={{ color: '#2E7D32' }}>{item.nombre}</h6>
                  <small style={{ color: '#6B5E4A' }}>{item.precio}€</small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Form.Control
                    type="number"
                    min="1"
                    value={item.cantidad}
                    onChange={(e) => actualizarCantidad(item.id, parseInt(e.target.value) || 1)}
                    style={{ width: '70px', borderRadius: '15px' }}
                  />
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => eliminarDelCarrito(item.id)}
                    style={{ borderRadius: '50%' }}
                  >
                    ×
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      {items.length > 0 && (
        <Modal.Footer style={{ border: 'none' }}>
          <h5 style={{ color: '#2E7D32' }}>Total: {total.toFixed(2)}€</h5>
          <Button
            style={{
              backgroundColor: '#A8E6CF',
              borderColor: '#A8E6CF',
              color: '#2E7D32',
              borderRadius: '30px',
              padding: '0.5rem 2rem'
            }}
            onClick={handleFinalizarCompra}
          >
            Finalizar Compra
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default CarritoModal;