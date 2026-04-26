import { Container, Row, Col, Card } from 'react-bootstrap';
import { Pizza, Heart, Clock, Gift } from 'lucide-react';

const About = () => {
  return (
    <Container className="py-5 animate-fade-in">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-lite mb-3 text-uppercase">Наша історія</h1>
        <p className="text-lite fs-5 mx-auto" style={{ maxWidth: '700px' }}>
          Ми не просто готуємо їжу. Ми створюємо моменти радості, використовуючи лише найкращі інгредієнти та традиційні рецепти.
        </p>
      </div>

      <Row className="gy-4">
        <Col lg={6}>
          <Card className="custom-card h-100 p-4 border-0">
            <Card.Body>
              <div className="d-flex align-items-center mb-4">
                <Heart size={40} className="me-3" />
                <h3 className="fw-bold m-0">З любов'ю до кожного шматочка</h3>
              </div>
              <p className="fs-5 text-muted">
                Наша піцерія почалася з маленької мрії про справжнє італійське тісто, яке визріває 24 години. Ми самі відбираємо фермерські томати, купуємо моцарелу найвищої якості та ніколи не економимо на начинці.
              </p>
              <p className="text-muted">
                Кожна піца — це ручна робота нашого піцайоло, який знає, як зробити бортики хрусткими, а начинку — соковитою.
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="custom-card h-100 p-4 border-0">
            <Card.Body>
              <div className="d-flex align-items-center mb-4">
                <Clock size={40} className="me-3" />
                <h3 className="fw-bold m-0">Гаряча доставка</h3>
              </div>
              <p className="fs-5 text-muted">
                Ми знаємо, що голод не терпить очікування. Саме тому наша логістика налаштована так, щоб ви отримали свою піцу ще гарячою. 
              </p>
              <ul className="list-unstyled mt-3">
                <li className="mb-2">- Доставка до 45 хвилин</li>
                <li className="mb-2">- Спеціальні термосумки</li>
                <li className="mb-2">- Ввічливі кур'єри</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12}>
          <Card className="custom-card promo-card border-0 overflow-hidden shadow-lg">
            <Row className="align-items-center g-0">
              <Col md={8} className="p-5">
                <div className="d-flex align-items-center mb-3">
                  <Gift size={48} className="me-3" />
                  <h2 className="display-5 fw-bold m-0 text-uppercase">АКЦІЯ 1+1=3</h2>
                </div>
                <h4 className="fw-bold mb-4 opacity-90">Більше друзів — більше піци!</h4>
                <p className="fs-5">
                  Ми обожнюємо великі компанії, тому даруємо кожну третю піцу у вашому замовленні абсолютно безкоштовно! 
                </p>
                <div className="mt-4 p-3 bg-white bg-opacity-25 rounded-3 d-inline-block">
                  <p className="small mb-0 fw-bold">
                    * Акція діє автоматично у кошику: система сама зробить найдешевшу піцу подарунковою.
                  </p>
                </div>
              </Col>
              <Col md={4} className="d-none d-md-block text-center p-4">
                 <Pizza size={200} color="white" opacity={0.2} strokeWidth={1} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5 pt-4 text-center text-lite">
        <Col md={4}>
          <h2 className="fw-black display-6">15+</h2>
          <p className="text-lite">Видів авторської піци</p>
        </Col>
        <Col md={4}>
          <h2 className="fw-black display-6">1000+</h2>
          <p className="text-lite">Задоволених клієнтів щомісяця</p>
        </Col>
        <Col md={4}>
          <h2 className="fw-black display-6">100%</h2>
          <p className="text-lite">Натуральні інгредієнти</p>
        </Col>
      </Row>
    </Container>
  );
};

export default About;