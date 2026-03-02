import Image from "next/image";
import Link from "next/link";
import CarruselProductos from "@/components/CarruselProductos";
// Importaciones directas de react-bootstrap (NO desestructuradas)
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import CardBody from 'react-bootstrap/CardBody';
import CardTitle from 'react-bootstrap/CardTitle';
import CardText from 'react-bootstrap/CardText';
import CardImg from 'react-bootstrap/CardImg';

export default function Inicio() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-section bg-light py-5">
        <Container>
          <Row className="align-items-center min-vh-50">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-3 fw-bold mb-4">
                Bienvenido a <span className="text-success">Misipuchiful!!</span>
              </h1>
              <p className="lead text-muted mb-4">
                Te presento a mis dos compañeros peludos, los cuales son grandes responsables de esta web, se llaman Misifú y Puchi. 
                Se encargan del departamento de I+D buscando mejorar la calidad de vida y las comodidades de los peludos y del 
                departamento de control de calidad ya que han de comprobar que los productos son los mejores del mercado para sus 
                compañeros.
              </p>
              <p className="mb-4">
                A veces, escriben algunos trucos en el blog acerca de estrategias para engañar a los compañeros humanos y conseguir 
                más pollito o salir más a la calle, así que no te pierdas y ¡lee nuestro blog! Esperamos que aquí puedas encontrar 
                todos los productos y servicios que necesitas para que tu compañero peludo disfrute cada día.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Button 
                  href="/tienda" 
                  size="lg"
                  style={{
                    backgroundColor: '#A8E6CF',
                    borderColor: '#A8E6CF',
                    color: '#000000',
                    borderRadius: '40px',
                    padding: '0.8rem 2rem',
                    fontWeight: 'bold'
                  }}
                >
                  🛒 Ver Tienda
                </Button>
                <Button 
                  href="/blog" 
                  size="lg"
                  style={{
                    backgroundColor: '#A8E6CF',
                    borderColor: '#A8E6CF',
                    color: '#000000',
                    borderRadius: '40px',
                    padding: '0.8rem 2rem',
                    fontWeight: 'bold'
                  }}
                >
                  📖 Leer Blog
                </Button>
                <Button 
                  href="/contacto" 
                  size="lg"
                  style={{
                    backgroundColor: '#A8E6CF',
                    borderColor: '#A8E6CF',
                    color: '#000000',
                    borderRadius: '40px',
                    padding: '0.8rem 2rem',
                    fontWeight: 'bold'
                  }}
                >
                  📞 Contactar
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <div className="position-relative">
                <Image
                  src="/imagenes/animales/cabecera.jpg"
                  alt="Misifú y Puchi"
                  width={600}
                  height={400}
                  className="img-fluid rounded-4 shadow-lg"
                  style={{ objectFit: 'cover' }}
                />
                <div className="position-absolute bottom-0 start-0 bg-white p-3 rounded-4 shadow m-3">
                  <p className="mb-0 fw-bold">
                    <span className="text-success">🐾 Misifú</span> y{' '}
                    <span className="text-primary">🐾 Puchi</span>
                  </p>
                  <small className="text-muted">Nuestros jefes de I+D</small>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* SECCIÓN DE BENEFICIOS */}
      <section className="benefits-section py-5">
        <Container>
          <h2 className="text-center mb-5">¿Por qué elegir Misipuchiful?</h2>
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm text-center p-4">
                <div className="bg-success bg-opacity-10 rounded-circle mx-auto mb-3 p-3" style={{ width: '80px', height: '80px' }}>
                  <span className="fs-1">🐕</span>
                </div>
                <CardBody>
                  <CardTitle className="fw-bold">Productos de Calidad</CardTitle>
                  <CardText className="text-muted">
                    Todos nuestros productos son testeados por Misifú y Puchi antes de llegar a ti.
                  </CardText>
                </CardBody>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm text-center p-4">
                <div className="bg-primary bg-opacity-10 rounded-circle mx-auto mb-3 p-3" style={{ width: '80px', height: '80px' }}>
                  <span className="fs-1">✂️</span>
                </div>
                <CardBody>
                  <CardTitle className="fw-bold">Servicios Profesionales</CardTitle>
                  <CardText className="text-muted">
                    Peluquería y veterinario con los mejores profesionales para tu mascota.
                  </CardText>
                </CardBody>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm text-center p-4">
                <div className="bg-warning bg-opacity-10 rounded-circle mx-auto mb-3 p-3" style={{ width: '80px', height: '80px' }}>
                  <span className="fs-1">📦</span>
                </div>
                <CardBody>
                  <CardTitle className="fw-bold">Envío Rápido</CardTitle>
                  <CardText className="text-muted">
                    Entregas en 24/48 horas para que no tengas que esperar.
                  </CardText>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* NOVEDADES Y OFERTAS */}
      <section className="products-section py-5 bg-light">
        <Container>
          <CarruselProductos />
        </Container>
      </section>

      {/* SERVICIOS */}
      <section className="services-section py-5">
        <Container>
          <h2 className="text-center mb-5">Nuestros Servicios</h2>
          <Row className="g-4">
            <Col md={6}>
              <Card className="border-0 shadow-sm overflow-hidden">
                <Row className="g-0">
                  <Col md={6}>
                    <Image
                      src="/imagenes/animales/puchi.jpg"
                      alt="Peluquería canina"
                      width={300}
                      height={300}
                      className="img-fluid h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  </Col>
                  <Col md={6}>
                    <CardBody className="p-4">
                      <h3 className="h4 fw-bold mb-3">✂️ Peluquería</h3>
                      <p className="text-muted mb-4">
                        Baño, corte, cepillado y cuidados estéticos para que tu mascota luzca espectacular.
                      </p>
                      <Link href="/reservas" style={{ textDecoration: 'none' }}>
                        <Button
                          style={{
                            backgroundColor: '#A8E6CF',
                            borderColor: '#A8E6CF',
                            color: '#000000',
                            borderRadius: '30px',
                            padding: '0.5rem 1.5rem',
                            fontWeight: 'bold'
                          }}
                        >
                          Reservar cita
                        </Button>
                      </Link>
                    </CardBody>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="border-0 shadow-sm overflow-hidden">
                <Row className="g-0">
                  <Col md={6}>
                    <Image
                      src="/imagenes/animales/misi.jpg"
                      alt="Veterinario"
                      width={300}
                      height={300}
                      className="img-fluid h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  </Col>
                  <Col md={6}>
                    <CardBody className="p-4">
                      <h3 className="h4 fw-bold mb-3">🏥 Veterinario</h3>
                      <p className="text-muted mb-4">
                        Consultas, vacunas, revisiones y cuidados médicos para tu compañero peludo.
                      </p>
                      <Link href="/reservas" style={{ textDecoration: 'none' }}>
                        <Button
                          style={{
                            backgroundColor: '#A8E6CF',
                            borderColor: '#A8E6CF',
                            color: '#000000',
                            borderRadius: '30px',
                            padding: '0.5rem 1.5rem',
                            fontWeight: 'bold'
                          }}
                        >
                          Pedir cita
                        </Button>
                      </Link>
                    </CardBody>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* BLOG */}
      <section className="blog-preview-section py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">Últimos consejos del blog</h2>
            <p className="text-muted">Misifú y Puchi comparten sus secretos</p>
          </div>
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <CardImg 
                  variant="top" 
                  src="/imagenes/animales/puchinavidad.jpg" 
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <CardBody>
                  <CardTitle>5 trucos para conseguir más premios</CardTitle>
                  <CardText className="text-muted small">
                    Por Misifú · Hace 2 días
                  </CardText>
                  <CardText>
                    Aprende las mejores técnicas para convencer a tus humanos de que te den ese pollito extra...
                  </CardText>
                  <Button 
                    size="sm" 
                    href="/blog"
                    style={{
                      backgroundColor: '#A8E6CF',
                      borderColor: '#A8E6CF',
                      color: '#000000',
                      borderRadius: '20px',
                      padding: '0.4rem 1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    Leer más
                  </Button>
                </CardBody>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <CardImg 
                  variant="top" 
                  src="/imagenes/animales/sofa.jpg" 
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <CardBody>
                  <CardTitle>La siesta perfecta: guía profesional</CardTitle>
                  <CardText className="text-muted small">
                    Por Puchi · Hace 5 días
                  </CardText>
                  <CardText>
                    Descubre las mejores posiciones y momentos del día para dormir como un verdadero experto...
                  </CardText>
                  <Button 
                    size="sm" 
                    href="/blog"
                    style={{
                      backgroundColor: '#A8E6CF',
                      borderColor: '#A8E6CF',
                      color: '#000000',
                      borderRadius: '20px',
                      padding: '0.4rem 1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    Leer más
                  </Button>
                </CardBody>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <CardImg 
                  variant="top" 
                  src="/imagenes/animales/alsol.jpg" 
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <CardBody>
                  <CardTitle>Cómo elegir el mejor juguete</CardTitle>
                  <CardText className="text-muted small">
                    Por Misifú y Puchi · Hace 1 semana
                  </CardText>
                  <CardText>
                    Guía definitiva para seleccionar el juguete que durará más de 5 minutos sin romperse...
                  </CardText>
                  <Button 
                    size="sm" 
                    href="/blog"
                    style={{
                      backgroundColor: '#A8E6CF',
                      borderColor: '#A8E6CF',
                      color: '#000000',
                      borderRadius: '20px',
                      padding: '0.4rem 1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    Leer más
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <div className="text-center mt-4">
            <Button 
              href="/blog" 
              size="lg"
              style={{
                backgroundColor: '#A8E6CF',
                borderColor: '#A8E6CF',
                color: '#000000',
                borderRadius: '40px',
                padding: '0.8rem 2rem',
                fontWeight: 'bold'
              }}
            >
              Ver todos los artículos del blog
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}