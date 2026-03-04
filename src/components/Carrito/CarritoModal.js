"use client";

import React, { useState } from 'react';
import { Modal, Button, ListGroup, Image, Form } from 'react-bootstrap';
import { useCarrito } from '@/context/CarritoContext';
import { useRouter } from 'next/navigation';
import ModalConfirmacion from '../ModalConfirmacion';

const CarritoModal = () => {
  const router = useRouter();
  const { mostrarCarrito, setMostrarCarrito, items, eliminarDelCarrito, actualizarCantidad, total, vaciarCarrito } = useCarrito();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleFinalizarCompra = () => {
    setMostrarCarrito(false);
    router.push('/carrito/finalizar');
  };

  const handleContinuarComprando = () => {
    setMostrarCarrito(false);
    router.push('/tienda');
  };

  const handleVaciarCarrito = () => {
    vaciarCarrito();
    setShowConfirmModal(false);
  };

  return (
    <>
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
            <div className="text-center py-4">
              <p style={{ color: '#6B5E4A' }}>Tu carrito está vacío</p>
              <Button
                variant="outline-primary"
                onClick={handleContinuarComprando}
                style={{
                  borderColor: '#A8E6CF',
                  color: '#2E7D32',
                  borderRadius: '30px',
                  marginTop: '1rem'
                }}
              >
                🛍️ Ir a la tienda
              </Button>
            </div>
          ) : (
            <>
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

              {/* Resumen del carrito */}
              <div className="mt-4 p-3" style={{ backgroundColor: '#F8F6F2', borderRadius: '15px' }}>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: '#6B5E4A' }}>Subtotal:</span>
                  <span style={{ color: '#2E7D32', fontWeight: 'bold' }}>{total.toFixed(2)}€</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: '#6B5E4A' }}>Gastos de envío:</span>
                  <span style={{ color: '#2E7D32' }}>Gratis</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <span style={{ color: '#6B5E4A', fontWeight: 'bold' }}>Total:</span>
                  <span style={{ color: '#2E7D32', fontWeight: 'bold', fontSize: '1.2rem' }}>{total.toFixed(2)}€</span>
                </div>
              </div>
            </>
          )}
        </Modal.Body>

        {items.length > 0 && (
          <Modal.Footer style={{ border: 'none', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Button
                variant="outline-secondary"
                onClick={() => setShowConfirmModal(true)}
                style={{
                  borderColor: '#FF8B94',
                  color: '#FF8B94',
                  borderRadius: '30px',
                  padding: '0.5rem 1.5rem',
                  marginRight: '0.5rem'
                }}
              >
                🗑️ Vaciar carrito
              </Button>
              <Button
                variant="outline-primary"
                onClick={handleContinuarComprando}
                style={{
                  borderColor: '#A8E6CF',
                  color: '#2E7D32',
                  borderRadius: '30px',
                  padding: '0.5rem 1.5rem'
                }}
              >
                🛍️ Seguir comprando
              </Button>
            </div>
            <Button
              style={{
                backgroundColor: '#A8E6CF',
                borderColor: '#A8E6CF',
                color: '#2E7D32',
                borderRadius: '30px',
                padding: '0.5rem 2rem',
                fontWeight: 'bold'
              }}
              onClick={handleFinalizarCompra}
            >
              Finalizar Compra
            </Button>
          </Modal.Footer>
        )}
      </Modal>

      {/* Modal de confirmación personalizado */}
      <ModalConfirmacion
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={handleVaciarCarrito}
        titulo="Vaciar carrito"
        mensaje="¿Estás seguro de que quieres eliminar todos los productos del carrito?"
      />
    </>
  );
};

export default CarritoModal;