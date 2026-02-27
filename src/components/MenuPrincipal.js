"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container, Nav, Navbar, Form, Button, NavDropdown } from 'react-bootstrap';
import { useAuth } from '@/context/AuthContext';
import { useCarrito } from '@/context/CarritoContext';
import LoginForm from './LoginForm';
import BotonCarrito from './Carrito/BotonCarrito';

const MenuPrincipal = () => {
  const [busqueda, setBusqueda] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();
  const { user, logout, isAdmin } = useAuth();
  const { setMostrarCarrito } = useCarrito();

  const handleSearch = (e) => {
    e.preventDefault();
    if (busqueda.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(busqueda)}`);
    }
  };

  // Función para navegación programática
  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="shadow-sm w-100" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <Container fluid className="px-4">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto mb-2 mb-lg-0">
              {/* Usando onClick en lugar de href para evitar problemas con React 19 */}
              <Nav.Link 
                onClick={() => handleNavigation('/')} 
                className="mx-2 px-3"
                style={{ cursor: 'pointer' }}
              >
                Inicio
              </Nav.Link>
              <Nav.Link 
                onClick={() => handleNavigation('/tienda')} 
                className="mx-2 px-3"
                style={{ cursor: 'pointer' }}
              >
                Tienda
              </Nav.Link>
              <Nav.Link 
                onClick={() => handleNavigation('/reservas')} 
                className="mx-2 px-3"
                style={{ cursor: 'pointer' }}
              >
                Reservas
              </Nav.Link>
              <Nav.Link 
                onClick={() => handleNavigation('/blog')} 
                className="mx-2 px-3"
                style={{ cursor: 'pointer' }}
              >
                Blog
              </Nav.Link>
              <Nav.Link 
                onClick={() => handleNavigation('/contacto')} 
                className="mx-2 px-3"
                style={{ cursor: 'pointer' }}
              >
                Contacto
              </Nav.Link>
            </Nav>

            <Form className="d-flex ms-lg-auto me-3" onSubmit={handleSearch}>
              <Form.Control
                type="search"
                placeholder="Buscar..."
                className="me-2"
                aria-label="Search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{ minWidth: '200px' }}
              />
              
              <Button variant="outline-primary" type="submit">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  fill="currentColor" 
                  className="bi bi-search" 
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </Button>
            </Form>

            <BotonCarrito />

            {user ? (
              <NavDropdown 
                title={`Hola, ${user.nombre}`} 
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item onClick={() => handleNavigation('/perfil')}>
                  Mi Perfil
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleNavigation('/mis-pedidos')}>
                  Mis Pedidos
                </NavDropdown.Item>
                {isAdmin() && (
                  <>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={() => handleNavigation('/admin')}>
                      Panel Admin
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => handleNavigation('/admin/productos')}>
                      Gestionar Productos
                    </NavDropdown.Item>
                  </>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>
                  Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button variant="primary" onClick={() => setShowLogin(true)}>
                Iniciar Sesión
              </Button>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <LoginForm show={showLogin} onHide={() => setShowLogin(false)} />
    </>
  );
};

export default MenuPrincipal;