"use client";

import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';

export default function Reservas() {
  const [formData, setFormData] = useState({
    tipo_servicio: 'peluqueria',
    fecha: '',
    hora: '',
    mascota_nombre: '',
    mascota_tipo: '',
    observaciones: ''
  });
  
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Aquí iría la llamada a la API para guardar la reserva
      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setEnviado(true);
        setFormData({
          tipo_servicio: 'peluqueria',
          fecha: '',
          hora: '',
          mascota_nombre: '',
          mascota_tipo: '',
          observaciones: ''
        });
      } else {
        setError('Error al crear la reserva');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const horariosDisponibles = [
    '09:00', '10:00', '11:00', '12:00', 
    '16:00', '17:00', '18:00', '19:00'
  ];

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Reserva tu cita</h1>
      
      {enviado && (
        <Alert variant="success" onClose={() => setEnviado(false)} dismissible>
          ¡Reserva creada con éxito! Te contactaremos para confirmar.
        </Alert>
      )}
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4">Información del servicio</Card.Title>
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de servicio *</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Peluquería"
                      name="tipo_servicio"
                      value="peluqueria"
                      checked={formData.tipo_servicio === 'peluqueria'}
                      onChange={handleChange}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Veterinario"
                      name="tipo_servicio"
                      value="veterinario"
                      checked={formData.tipo_servicio === 'veterinario'}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha *</Form.Label>
                      <Form.Control
                        type="date"
                        name="fecha"
                        value={formData.fecha}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Hora *</Form.Label>
                      <Form.Select 
                        name="hora" 
                        value={formData.hora}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Selecciona una hora</option>
                        {horariosDisponibles.map(hora => (
                          <option key={hora} value={hora}>{hora}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Nombre de la mascota *</Form.Label>
                  <Form.Control
                    type="text"
                    name="mascota_nombre"
                    value={formData.mascota_nombre}
                    onChange={handleChange}
                    placeholder="Ej: Max"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tipo de mascota *</Form.Label>
                  <Form.Control
                    type="text"
                    name="mascota_tipo"
                    value={formData.mascota_tipo}
                    onChange={handleChange}
                    placeholder="Ej: Perro, Gato..."
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Observaciones</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleChange}
                    placeholder="Alguna indicación especial..."
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Confirmar reserva
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="shadow-sm bg-light">
            <Card.Body>
              <Card.Title>Información útil</Card.Title>
              <hr />
              <h5>🕒 Horarios:</h5>
              <p>Lunes a Viernes: 9:00 - 14:00 | 16:00 - 20:00</p>
              <p>Sábados: 10:00 - 14:00</p>
              
              <h5 className="mt-4">📞 Contacto:</h5>
              <p>Teléfono: 123 456 789</p>
              <p>Email: reservas@misipuchiful.com</p>
              
              <h5 className="mt-4">📍 Dirección:</h5>
              <p>Calle de las Mascotas, 123</p>
              
              <Alert variant="info" className="mt-4">
                <strong>Nota:</strong> Las reservas están sujetas a confirmación. 
                Te contactaremos para confirmar la disponibilidad.
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}