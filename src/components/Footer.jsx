import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="mt-auto py-5" style={{ background: '#0a0a0a', borderTop: '1px solid #222' }}>
      <Container>
        <Row className="gy-4">
          <Col md={4}>
            <h5 className="fw-bold ">PIZZERIA</h5>
            <p className="text-white small">Найкраща піца у твоєму місті. Працюємо з душею та свіжими інгредієнтами.</p>
          </Col>
          <Col md={4} className="text-md-center">
            <h6 className="fw-bold text-white">Графік роботи</h6>
            <p className="text-white small mb-0">Пн-Нд: 10:00 — 22:00</p>
            <p className="text-white small">Доставка до 21:30</p>
          </Col>
          <Col md={4} className="text-md-end">
            <h6 className="fw-bold text-white">Контакти</h6>
            <p className=" fw-bold mb-0">+38 (099) 123-45-67</p>
            <p className="text-white small">вул. Смачна, 12, Івано-Франківськ</p>
          </Col>
        </Row>
        <hr className="my-4 border-secondary" />
        <p className="text-center text-white small mb-0">
          © {new Date().getFullYear()} Pizzeria. Створено для тебе.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;