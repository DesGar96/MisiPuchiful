import React from 'react';

const colores = {
  verde: {
    bg: '#A8E6CF',
    text: '#2E7D32'
  },
  melocoton: {
    bg: '#FFD3B6',
    text: '#6B5E4A'
  },
  coral: {
    bg: '#FFAAA5',
    text: '#6B5E4A'
  },
  rosa: {
    bg: '#FF8B94',
    text: '#6B5E4A'
  },
  amarillo: {
    bg: '#FDFD97',
    text: '#6B5E4A'
  }
};

const CustomBadge = ({ children, color = 'verde', style, ...props }) => {
  const colorSeleccionado = colores[color] || colores.verde;
  
  return (
    <span
      {...props}
      style={{
        display: 'inline-block',
        padding: '0.5rem 1rem',
        backgroundColor: colorSeleccionado.bg,
        color: colorSeleccionado.text,
        borderRadius: '30px',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        ...style
      }}
    >
      {children}
    </span>
  );
};

export default CustomBadge;