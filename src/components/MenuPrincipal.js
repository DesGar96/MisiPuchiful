"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Container, Nav, Navbar, Form, Button, NavDropdown } from 'react-bootstrap';
import { useAuth } from '@/context/AuthContext';
import { useCarrito } from '@/context/CarritoContext';
import LoginForm from './LoginForm';
import BotonCarrito from './Carrito/BotonCarrito';

const MenuPrincipal = () => {
  const [busqueda, setBusqueda] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isBlogPage, setIsBlogPage] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();
  const { vaciarCarrito } = useCarrito(); // ← IMPORTAMOS vaciarCarrito

  useEffect(() => {
    setIsBlogPage(pathname?.includes('/blog') || false);
    setExpanded(false);
    setShowUserMenu(false);
  }, [pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (busqueda.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(busqueda)}`);
      setExpanded(false);
      setBusqueda(''); 
    }
  };

  const handleNavigation = (path) => {
    router.push(path);
    setShowUserMenu(false);
    setExpanded(false);
  };

  const handleLogout = async () => {
    // Primero vaciamos el carrito
    vaciarCarrito();
    // Luego cerramos sesión
    await logout();
    setShowUserMenu(false);
    setExpanded(false);
    router.push('/');
  };

  // ... resto del código igual ...

  return (
    <>
      <Navbar 
        bg="light" 
        expand="lg" 
        className="shadow-sm w-100" 
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
        style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 1000,
          backgroundColor: '#FFFFFF'
        }}
      >
        <Container fluid className="px-4">
          <Navbar.Brand onClick={() => handleNavigation('/')} style={{ cursor: 'pointer' }}>
            <span style={{ fontSize: '1.8rem', marginRight: '0.5rem' }}>🐾</span>
            <span style={{ color: '#2E7D32', fontWeight: 'bold' }}>Misipuchiful</span>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto mb-2 mb-lg-0">
              <Nav.Link 
                onClick={() => handleNavigation('/')} 
                className="mx-2 px-3"
                style={{ cursor: 'pointer', color: '#6B5E4A' }}
              >
                Inicio
              </Nav.Link>
              <Nav.Link 
                onClick={() => handleNavigation('/tienda')} 
                className="mx-2 px-3"
                style={{ cursor: 'pointer', color: '#6B5E4A' }}
              >
                Tienda
              </Nav.Link>
              <Nav.Link 
                onClick={() => handleNavigation('/reservas')} 
                className="mx-2 px-3"
                style={{ cursor: 'pointer', color: '#6B5E4A' }}
              >
                Reservas
              </Nav.Link>
              <Nav.Link 
                onClick={() => handleNavigation('/blog')} 
                className="mx-2 px-3"
                style={{ cursor: 'pointer', color: '#6B5E4A' }}
              >
                Blog
              </Nav.Link>
              <Nav.Link 
                onClick={() => handleNavigation('/contacto')} 
                className="mx-2 px-3"
                style={{ cursor: 'pointer', color: '#6B5E4A' }}
              >
                Contacto
              </Nav.Link>
            </Nav>

            {/* BUSCADOR - SOLO FUERA DEL BLOG */}
            {!isBlogPage && (
              <Form className="d-flex ms-lg-auto me-3" onSubmit={handleSearch}>
                <Form.Control
                  type="search"
                  placeholder="Buscar..."
                  className="me-2"
                  aria-label="Search"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  style={{ 
                    minWidth: '200px',
                    borderRadius: '30px',
                    border: '2px solid #E8F5E9',
                    backgroundColor: '#F8F6F2'
                  }}
                />
                
                <Button 
                  variant="outline-primary" 
                  type="submit"
                  style={{ 
                    borderColor: '#A8E6CF', 
                    color: '#2E7D32',
                    borderRadius: '30px'
                  }}
                >
                  🔍
                </Button>
              </Form>
            )}

            <BotonCarrito />

            {user ? (
              <div className="position-relative">
                <Button
                  variant="outline-primary"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    borderColor: '#A8E6CF',
                    color: '#2E7D32',
                    borderRadius: '30px',
                    padding: '0.5rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  👤 {user.nombre}
                </Button>
                
                {showUserMenu && (
                  <div
                    className="position-absolute end-0 mt-2 bg-white shadow-lg rounded-3"
                    style={{ 
                      minWidth: '250px',
                      zIndex: 1000,
                      borderRadius: '15px',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Perfil - para todos */}
                    <div
                      onClick={() => handleNavigation('/zonaPrivada/miPerfil')}
                      className="px-4 py-3 border-bottom"
                      style={{ cursor: 'pointer', color: '#6B5E4A' }}
                    >
                      👤 Mi Perfil
                    </div>

                    {/* Solo para usuarios normales (NO admin) */}
                    {user.rol !== 'admin' && (
                      <>
                        <div
                          onClick={() => handleNavigation('/zonaPrivada/mis-pedidos')}
                          className="px-4 py-3 border-bottom"
                          style={{ cursor: 'pointer', color: '#6B5E4A' }}
                        >
                          📦 Mis Pedidos
                        </div>
                        <div
                          onClick={() => handleNavigation('/zonaPrivada/mis-reservas')}
                          className="px-4 py-3 border-bottom"
                          style={{ cursor: 'pointer', color: '#6B5E4A' }}
                        >
                          📅 Mis Reservas
                        </div>
                        <div
                          onClick={() => handleNavigation('/zonaPrivada/mis-resenas')}
                          className="px-4 py-3 border-bottom"
                          style={{ cursor: 'pointer', color: '#6B5E4A' }}
                        >
                          ⭐ Mis Reseñas
                        </div>
                      </>
                    )}

                    {/* Solo para admin */}
                    {user.rol === 'admin' && (
                      <>
                        <div style={{ padding: '0.5rem 1rem', color: '#2E7D32', fontWeight: 'bold' }}>
                          Panel Admin
                        </div>
                        <div
                          onClick={() => handleNavigation('/admin/productos')}
                          className="px-4 py-3 border-bottom ps-5"
                          style={{ cursor: 'pointer', color: '#6B5E4A' }}
                        >
                          📦 Productos
                        </div>
                        <div
                          onClick={() => handleNavigation('/admin/blog')}
                          className="px-4 py-3 border-bottom ps-5"
                          style={{ cursor: 'pointer', color: '#6B5E4A' }}
                        >
                          📝 Blog Posts
                        </div>
                        <div
                          onClick={() => handleNavigation('/admin/pedidos')}
                          className="px-4 py-3 border-bottom ps-5"
                          style={{ cursor: 'pointer', color: '#6B5E4A' }}
                        >
                          📋 Pedidos
                        </div>
                        <div
                          onClick={() => handleNavigation('/admin/reservas')}
                          className="px-4 py-3 border-bottom ps-5"
                          style={{ cursor: 'pointer', color: '#6B5E4A' }}
                        >
                          📅 Reservas
                        </div>
                        <div
                          onClick={() => handleNavigation('/admin/contactos')}
                          className="px-4 py-3 border-bottom ps-5"
                          style={{ cursor: 'pointer', color: '#6B5E4A' }}
                        >
                          📬 Contactos
                        </div>
                        <div
                          onClick={() => handleNavigation('/admin/crear-admin')}
                          className="px-4 py-3 border-bottom ps-5"
                          style={{ cursor: 'pointer', color: '#6B5E4A' }}
                        >
                          👑 Crear Admin
                        </div>
                      </>
                    )}

                    {/* Cerrar sesión - para todos */}
                    <div
                      onClick={handleLogout}  // ← USAMOS handleLogout en lugar de logout directo
                      className="px-4 py-3"
                      style={{ cursor: 'pointer', color: '#FF8B94', fontWeight: 'bold' }}
                    >
                      🚪 Cerrar Sesión
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button 
                variant="primary" 
                onClick={() => setShowLogin(true)}
                style={{ 
                  backgroundColor: '#A8E6CF', 
                  borderColor: '#A8E6CF', 
                  color: '#2E7D32',
                  borderRadius: '30px',
                  padding: '0.5rem 1.5rem',
                  fontWeight: 'bold'
                }}
              >
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