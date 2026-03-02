"use client";

import React, { useEffect } from 'react';

const Notificacion = ({ tipo, mensaje, mostrar, onClose, duracion = 3000 }) => {
  useEffect(() => {
    if (mostrar) {
      const timer = setTimeout(() => {
        onClose();
      }, duracion);
      
      return () => clearTimeout(timer);
    }
  }, [mostrar, onClose, duracion]);

  if (!mostrar) return null;

  const colores = {
    exito: {
      bg: '#E8F5E9',
      border: '#A8E6CF',
      icono: '✅',
      color: '#2E7D32'
    },
    error: {
      bg: '#FFEBEE',
      border: '#FFAAA5',
      icono: '❌',
      color: '#C62828'
    },
    info: {
      bg: '#E3F2FD',
      border: '#A7C7E7',
      icono: 'ℹ️',
      color: '#0D47A1'
    }
  };

  const estilo = colores[tipo] || colores.info;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        maxWidth: '400px',
        minWidth: '300px',
        animation: 'slideIn 0.3s ease-out',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}
    >
      <div
        style={{
          backgroundColor: estilo.bg,
          borderLeft: `5px solid ${estilo.border}`,
          borderRadius: '10px',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          position: 'relative'
        }}
      >
        <span style={{ fontSize: '1.5rem' }}>{estilo.icono}</span>
        
        <div style={{ flex: 1 }}>
          <p style={{ 
            margin: 0, 
            color: estilo.color,
            fontWeight: '500'
          }}>
            {mensaje}
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            color: '#6B5E4A',
            padding: '0.2rem 0.5rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          ×
        </button>

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '3px',
            backgroundColor: estilo.border,
            width: '100%',
            animation: `progreso ${duracion}ms linear`
          }}
        />
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes progreso {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default Notificacion;