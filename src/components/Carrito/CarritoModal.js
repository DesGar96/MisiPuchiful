"use client";

import React from 'react';
import { useCarrito } from '@/context/CarritoContext';
import { useRouter } from 'next/navigation';

const CarritoModal = () => {
  const { 
    items, 
    total, 
    mostrarCarrito, 
    setMostrarCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito 
  } = useCarrito();
  
  const router = useRouter();

  const handleCantidadChange = (productoId, nuevaCantidad) => {
    actualizarCantidad(productoId, parseInt(nuevaCantidad));
  };

  const handleFinalizarCompra = () => {
    setMostrarCarrito(false);
    router.push('/checkout');
  };

  if (!mostrarCarrito) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1050
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          borderBottom: '1px solid #dee2e6'
        }}>
          <h5 style={{ margin: 0, fontWeight: 'bold' }}>Carrito de Compras</h5>
          <button 
            onClick={() => setMostrarCarrito(false)}
            style={{
              border: 'none',
              background: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0 0.5rem'
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1rem' }}>
          {items.length === 0 ? (
            <div style={{
              padding: '1rem',
              backgroundColor: '#e7f3ff',
              color: '#004085',
              borderRadius: '4px'
            }}>
              Tu carrito está vacío. ¡Explora nuestros productos!
            </div>
          ) : (
            <>
              {/* Lista de productos */}
              {items.map(item => (
                <div key={item.id} style={{
                  padding: '1rem 0',
                  borderBottom: '1px solid #dee2e6'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    {/* Imagen */}
                    <div style={{
                      width: '50px',
                      height: '50px',
                      flexShrink: 0
                    }}>
                      <img 
                        src={item.imagen || 'https://via.placeholder.com/50'} 
                        alt={item.nombre}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                    </div>

                    {/* Contenido */}
                    <div style={{ flexGrow: 1 }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                      }}>
                        <div>
                          <h6 style={{ margin: '0 0 0.25rem 0' }}>{item.nombre}</h6>
                          <small style={{ color: '#6c757d' }}>{item.precio} €</small>
                        </div>
                        <button 
                          onClick={() => eliminarDelCarrito(item.id)}
                          style={{
                            border: 'none',
                            background: 'none',
                            color: '#dc3545',
                            fontSize: '1.25rem',
                            cursor: 'pointer'
                          }}
                        >
                          ✕
                        </button>
                      </div>

                      {/* Cantidad y subtotal */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginTop: '0.5rem'
                      }}>
                        <input
                          type="number"
                          min="1"
                          value={item.cantidad}
                          onChange={(e) => handleCantidadChange(item.id, e.target.value)}
                          style={{
                            width: '70px',
                            padding: '0.375rem',
                            border: '1px solid #ced4da',
                            borderRadius: '4px'
                          }}
                        />
                        <span style={{ fontWeight: 'bold' }}>
                          {(item.precio * item.cantidad).toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Resumen */}
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <span>Subtotal:</span>
                  <span style={{ fontWeight: 'bold' }}>{total.toFixed(2)} €</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <span>Envío:</span>
                  <span style={{ color: '#28a745' }}>Gratis</span>
                </div>
                <hr style={{ margin: '1rem 0' }} />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '1rem'
                }}>
                  <h5 style={{ margin: 0 }}>Total:</h5>
                  <h5 style={{ margin: 0, color: '#007bff' }}>{total.toFixed(2)} €</h5>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid #dee2e6',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.5rem'
        }}>
          <button
            onClick={() => setMostrarCarrito(false)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #6c757d',
              backgroundColor: 'transparent',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Seguir Comprando
          </button>
          
          {items.length > 0 && (
            <>
              <button
                onClick={vaciarCarrito}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #dc3545',
                  backgroundColor: 'transparent',
                  color: '#dc3545',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Vaciar Carrito
              </button>
              <button
                onClick={handleFinalizarCompra}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  backgroundColor: '#28a745',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Finalizar Compra
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarritoModal;