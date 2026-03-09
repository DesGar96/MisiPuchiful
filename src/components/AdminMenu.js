"use client";

import React from 'react';
import { Nav } from 'react-bootstrap';
import { useRouter, usePathname } from 'next/navigation';

const AdminMenu = () => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
  { path: '/admin/productos', icon: '📦', label: 'Productos' },
  { path: '/admin/blog', icon: '📝', label: 'Blog Posts' },
  { path: '/admin/pedidos', icon: '📋', label: 'Pedidos' },
  { path: '/admin/reservas', icon: '📅', label: 'Reservas' },
  { path: '/admin/contactos', icon: '📬', label: 'MensajesContactos' },
  { path: '/admin/crear-admin', icon: '👑', label: 'Crear Administrador' }
];

  return (
    <Nav className="flex-column gap-2">
      {menuItems.map(item => (
        <Nav.Link
          key={item.path}
          onClick={() => router.push(item.path)}
          active={pathname === item.path}
          style={{
            cursor: 'pointer',
            backgroundColor: pathname === item.path ? '#A8E6CF' : 'white',
            color: pathname === item.path ? '#2E7D32' : '#6B5E4A',
            borderRadius: '15px',
            padding: '1rem',
            fontWeight: pathname === item.path ? 'bold' : 'normal',
            transition: 'all 0.3s ease'
          }}
        >
          <span style={{ marginRight: '0.5rem' }}>{item.icon}</span>
          {item.label}
        </Nav.Link>
      ))}
    </Nav>
  );
};

export default AdminMenu;