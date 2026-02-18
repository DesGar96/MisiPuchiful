"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';

const CarritoContext = createContext();

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  }
  return context;
};

export const CarritoProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  // Cargar carrito del localStorage al iniciar
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      try {
        setItems(JSON.parse(carritoGuardado));
      } catch (e) {
        console.error('Error al cargar carrito:', e);
      }
    }
  }, []);

  // Actualizar localStorage cuando cambie el carrito
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(items));
    calcularTotal();
  }, [items]);

  const calcularTotal = () => {
    const nuevoTotal = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    setTotal(nuevoTotal);
  };

  const agregarAlCarrito = (producto, cantidad = 1) => {
    setItems(itemsActuales => {
      const existe = itemsActuales.find(item => item.id === producto.id);
      
      if (existe) {
        return itemsActuales.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      
      return [...itemsActuales, { 
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: cantidad
      }];
    });
    
    // Mostrar el carrito automáticamente al añadir un producto
    setMostrarCarrito(true);
  };

  const eliminarDelCarrito = (productoId) => {
    setItems(itemsActuales => itemsActuales.filter(item => item.id !== productoId));
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      eliminarDelCarrito(productoId);
      return;
    }
    
    setItems(itemsActuales =>
      itemsActuales.map(item =>
        item.id === productoId ? { ...item, cantidad: nuevaCantidad } : item
      )
    );
  };

  const vaciarCarrito = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CarritoContext.Provider value={{
      items,
      total,
      totalItems,
      mostrarCarrito,
      setMostrarCarrito,
      agregarAlCarrito,
      eliminarDelCarrito,
      actualizarCantidad,
      vaciarCarrito
    }}>
      {children}
    </CarritoContext.Provider>
  );
};