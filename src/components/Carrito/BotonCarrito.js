"use client";

import React from 'react';
import { Button } from 'react-bootstrap';
import { useCarrito } from '@/context/CarritoContext';

const BotonCarrito = () => {
  const { totalItems, setMostrarCarrito } = useCarrito();

  return (
    <Button
      variant="outline-primary"
      onClick={() => setMostrarCarrito(true)}
      style={{
        position: 'relative',
        borderColor: '#A8E6CF',
        color: '#2E7D32',
        borderRadius: '30px',
        marginRight: '1rem'
      }}
    >
      🛒 Carrito
      {totalItems > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            backgroundColor: '#FF8B94',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {totalItems}
        </span>
      )}
    </Button>
  );
};

export default BotonCarrito;