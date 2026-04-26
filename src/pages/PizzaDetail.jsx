import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import menuData from '../data/menu.json';
import { ArrowLeft } from 'lucide-react';

const PizzaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const pizza = menuData.pizzas.find(p => p.id === parseInt(id));

  const [selectedSize, setSelectedSize] = useState("30 см");
  const [selectedExtras, setSelectedExtras] = useState([]);

  if (!pizza) return <Container className="py-5 text-center"><h2 className="text-white">Піцу не знайдено</h2></Container>;

  const toggleExtra = (extra) => {
    setSelectedExtras(prev => 
      prev.find(item => item.id === extra.id)
        ? prev.filter(item => item.id !== extra.id)
        : [...prev, extra]
    );
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const currentPrice = useMemo(() => {
    const extrasTotal = selectedExtras.reduce((sum, item) => sum + item.price, 0);
    const sizeMultiplier = selectedSize === "40 см" ? 1.4 : 1;
    return Math.round(pizza.price * sizeMultiplier + extrasTotal);
  }, [selectedExtras, selectedSize, pizza.price]);

  const handleAddToCart = () => {
    const productToAdd = {
      originalId: pizza.id,
      name: pizza.name,
      price: currentPrice,
      image: pizza.image,
      category: pizza.category,
      selectedSize,
      extrasNames: selectedExtras.map(e => e.name).join(", ")
    };
    addToCart(productToAdd);
  };

  return (
    <Container className="py-5">
      <Button 
        variant="link" 
        onClick={() => navigate(-1)} 
        className="text-black p-0 mb-4 text-decoration-none d-inline-flex align-items-center opacity-75 hover-opacity-100"
        style={{ fontSize: '1.2rem'}}
      >
        <ArrowLeft size={30} className="me-2" /> <b>Назад до меню</b>
      </Button>

      <Card className="custom-card-1 p-4 p-md-5 border-0 shadow-lg">
        <Row className="align-items-center">
          <Col lg={6} className="text-center mb-4 mb-lg-0">
            <div className="pizza-detail-img-wrapper p-3">
              <img 
                src={pizza.image} 
                alt={pizza.name} 
                className="img-fluid" 
                style={{ 
                  maxHeight: '450px', 
                  mixBlendMode: 'multiply' 
                }} 
              />
            </div>
          </Col>

          <Col lg={6}>
            <h1 className="fw-bold text-uppercase mb-3" style={{ color: '#2b2b2b' }}>{pizza.name}</h1>
            <p className="text-muted fs-5 mb-4">{pizza.description}</p>

            <div className="mb-4">
              <h6 className="fw-bold mb-3">Оберіть розмір:</h6>
              <div className="d-flex gap-2">
                {["30 см", "40 см"].map(size => (
                  <Button 
                    key={size}
                    variant={selectedSize === size ? 'orange' : 'outline-secondary'}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-pill ${selectedSize === size ? 'text-white' : ''}`}
                    style={selectedSize === size ? { backgroundColor: '#ff5e00', border: 'none' } : {}}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h6 className="fw-bold mb-3">Додати до піци:</h6>
              <Row xs={2} className="g-2">
                {pizza.extraIngredients?.map(extra => {
                  const isSelected = selectedExtras.find(e => e.id === extra.id);
                  return (
                    <Col key={extra.id}>
                      <div 
                        className={`p-2 border rounded-3 cursor-pointer transition-all d-flex justify-content-between align-items-center ${isSelected ? 'border-orange bg-orange-light' : 'bg-white'}`}
                        onClick={() => toggleExtra(extra)}
                        style={{ 
                          cursor: 'pointer', 
                          fontSize: '0.9rem',
                          border: isSelected ? '1px solid #ff5e00' : '1px solid #dee2e6'
                        }}
                      >
                        <span className={isSelected ? 'fw-bold' : ''}>{extra.name}</span>
                        <span className=" small">+{extra.price} ₴</span>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </div>

            <div className="d-flex align-items-center justify-content-between mt-5 p-4 bg-light rounded-4">
              <div>
                <span className="text-muted d-block small">Фінальна ціна:</span>
                <h3 className="fw-bold m-0" style={{ color: '#2b2b2b' }}>{currentPrice} ₴</h3>
              </div>
              <Button 
                size="lg"
                onClick={handleAddToCart}
                className="btn-orange-pill"
              >
                ДОДАТИ В КОШИК
              </Button>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default PizzaDetail;