import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { useCart } from '../context/CartContext'; // Імпортуємо контекст

const Header = () => {
  const { totals } = useCart(); // Беремо дані про суму та кількість

  return (
    <Navbar bg="white" expand="lg" className="py-3 shadow-sm sticky-top border-bottom">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center">
          {/* Логотип */}
          <img
            src={`${import.meta.env.BASE_URL}/logo.png`} // Шлях до файлу в папці public
            alt="Logo"
            width="40"      // Налаштуй розмір під себе
            height="40"
            className="d-inline-block align-top me-2" // Відступ me-2 від тексту
            style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' }} 
          />
          
          {/* Текст назви */}
          <span style={{ 
            color: '#ff5e00', 
            fontSize: '1.6rem', 
            letterSpacing: '1px',
            lineHeight: '1' 
          }}>
            PIZZERIA
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto fw-bold">
            <Nav.Link as={NavLink} to="/" className="px-3 text-uppercase small">Меню</Nav.Link>
            <Nav.Link as={NavLink} to="/about" className="px-3 text-uppercase small">Про нас</Nav.Link>
          </Nav>

          <Button 
            as={Link} 
            to="/cart" 
            variant="orange" 
            className="d-flex align-items-center gap-2 text-white px-4 py-2"
            style={{ backgroundColor: '#ff5e00', borderRadius: '12px', border: 'none' }}
          >
            <ShoppingCart size={18} />
            <span className="fw-bold">
              {totals.totalItems} | {totals.total} грн
            </span>
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;