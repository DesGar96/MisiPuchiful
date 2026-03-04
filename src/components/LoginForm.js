"use client";

import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const LoginForm = ({ show, onHide }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        onHide();
        router.push('/');
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = (path) => {
    onHide(); // Cerrar el modal
    router.push(path); // Navegar a la página
  };

  return (
    <Modal show={show} onHide={onHide} centered restoreFocus={false}>
      <Modal.Header closeButton style={{ border: 'none' }}>
        <Modal.Title style={{ color: '#2E7D32' }}>Iniciar Sesión</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#6B5E4A' }}>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#6B5E4A' }}>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ borderRadius: '15px', border: '2px solid #E8F5E9' }}
            />
          </Form.Group>

          <div className="text-end mb-3">
            <Button 
              variant="link" 
              onClick={() => handleLinkClick('/recuperar-password')}
              style={{ color: '#2E7D32', textDecoration: 'none', padding: 0 }}
            >
              ¿Has olvidado tu contraseña?
            </Button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#A8E6CF',
              borderColor: '#A8E6CF',
              color: '#2E7D32',
              borderRadius: '30px',
              padding: '0.75rem',
              width: '100%',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <span style={{ color: '#6B5E4A' }}>¿Aún no eres usuario? </span>
          <Button 
            variant="link" 
            onClick={() => handleLinkClick('/registro')}
            style={{ color: '#2E7D32', fontWeight: 'bold', textDecoration: 'none', padding: 0 }}
          >
            Regístrate aquí
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoginForm;