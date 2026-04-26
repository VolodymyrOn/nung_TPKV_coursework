import { Card, Button } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const PizzaCard = ({ item }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const isPizza = item.category === 'pizza';

  const handleAdd = (e) => {
    e.preventDefault();
    
    if (isPizza) {
      // Для піци завжди йдемо на сторінку вибору розміру
      navigate(`/pizza/${item.id}`);
    } else {
      // Для напоїв додаємо одразу
      const productToCart = {
        // Гарантуємо передачу id
        id: item.id, 
        originalId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        // Для напоїв ставимо логічне значення (якщо в JSON 1л, то пиши "1 л")
        selectedSize: item.name.includes("1л") ? "1 л" : "0.5 л", 
        extrasNames: ""
      };
      addToCart(productToCart);
    }
  };

  return (
    <Card className="h-100 custom-card border-0 shadow-sm">
      {/* Фото товару */}
      {isPizza ? (
        <Link to={`/pizza/${item.id}`} className="text-decoration-none">
          <div className="pizza-img-container">
            <Card.Img variant="top" src={item.image} alt={item.name} />
          </div>
        </Link>
      ) : (
        <div className="img-container d-flex align-items-center justify-content-center p-3" style={{ height: '200px' }}>
          <Card.Img 
            src={item.image} 
            alt={item.name}
            className="img-fluid h-100 w-auto" 
            style={{ objectFit: 'contain', mixBlendMode: 'multiply' }} 
          />
        </div>
      )}

      <Card.Body className="d-flex flex-column text-start px-3 pb-3">
        {/* Назва */}
        <h6 className="fw-bold text-uppercase mb-2" style={{ minHeight: '40px' }}>
          {isPizza ? (
            <Link to={`/pizza/${item.id}`} className="text-dark text-decoration-none">
              {item.name}
            </Link>
          ) : (
            <span className="text-dark">{item.name}</span>
          )}
        </h6>

        {/* Опис */}
        <p className="text-muted small mb-3" style={{ fontSize: '0.9rem', flexGrow: 1 }}>
          {item.description.length > 80 
            ? item.description.substring(0, 80) + '...' 
            : item.description}
        </p>
        
        {/* Ціна та Кнопка */}
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="fw-bold fs-5 text-dark">{item.price} ₴</span>
          <Button 
            onClick={handleAdd}
            className="btn-orange-pill border-0"
          >
            {isPizza ? 'ВИБРАТИ' : 'В КОШИК +'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PizzaCard;