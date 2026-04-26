import { useState } from 'react';
import { Container, Row, Col, Button,} from 'react-bootstrap';
import { MapPin, Truck, Utensils } from 'lucide-react';
import menuData from '../data/menu.json';
import PizzaCard from '../components/PizzaCard';

const Home = () => {
  const [category, setCategory] = useState('pizza');

  const filteredItems = category === 'pizza' ? menuData.pizzas : menuData.drinks;

  return (
    <div>
      <Container className="mt-5">
        <div className="d-flex justify-content-center gap-2 mb-5">
          {['pizza', 'drink'].map((cat) => (
            <Button 
                  key={cat}
                  variant={category === cat ? 'orange' : 'light'}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 fw-bold ${category === cat ? 'text-white' : ''}`}
                  style={category === cat ? { backgroundColor: '#ff5e00' } : {}}
                >
                  {cat === 'pizza' ? 'Піца' : 'Напої'}
            </Button>
            ))}
        </div>

        <Row xs={1} md={2} lg={4} className="g-4">
          {filteredItems.map(item => (
            <Col key={item.id}>
              <PizzaCard item={item} />
            </Col>
          ))}
        </Row>
      </Container>

      <section className="bg-light mt-5 py-5 border-bottom">
        <Container>
          <h2 className="text-center fw-bold mb-5">ЯК МИ ПРАЦЮЄМО</h2>
          <Row className="text-center">
            <Col md={4}>
              <div className="mb-3 "><MapPin size={40} /></div>
              <h5>Вибирайте</h5>
              <p className="text-muted small">Подивіться асортимент і виберіть улюблені страви</p>
            </Col>
            <Col md={4}>
              <div className="mb-3 "><Truck size={40} /></div>
              <h5>Швидка Доставка</h5>
              <p className="text-muted small">Доставимо гарячу піцу прямо до ваших дверей</p>
            </Col>
            <Col md={4}>
              <div className="mb-3 "><Utensils size={40} /></div>
              <h5>Смакуйте</h5>
              <p className="text-muted small">Насолоджуйтесь найкращою піцею у місті!</p>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;