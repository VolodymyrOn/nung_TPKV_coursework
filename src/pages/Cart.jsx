import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Container, Row, Col, Button, Table, Card } from 'react-bootstrap';
import { Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cart, clearCart, updateQuantity, totals, removeFromCart } = useCart();

  if (cart.length === 0) {
    return (
      <Container className="text-center py-5">
        <div className="py-5">
          <ShoppingBag size={80} className="text-muted mb-4" />
          <h2 className="fw-bold">Ваш кошик порожній</h2>
          <p className="text-muted">Схоже, ви ще не додали жодної піци.</p>
          <Button as={Link} to="/" variant="orange" className="text-white mt-3 px-4 py-2" style={{ backgroundColor: '#ff5e00' }}>
            ПЕРЕЙТИ ДО МЕНЮ
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex align-items-center mb-4">
        <Button as={Link} to="/" variant="link" className="text-black bold p-0 me-3">
          <ArrowLeft size={32} />
        </Button>
        <h2 className="fw-bold m-auto">Мій кошик</h2>
      </div>

      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-0">
              <Table responsive className="align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4 py-3 border-0">Товар</th>
                    <th className="py-3 border-0">Ціна</th>
                    <th className="py-3 border-0">Кількість</th>
                    <th className="py-3 border-0 text-end pe-4">Сума</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td className="ps-4 py-4">
                        <div className="d-flex align-items-center">
                          <img src={`${import.meta.env.BASE_URL}${item.image}`} style={{ width: '60px' }} className="me-3" alt="" />
                          <div>
                            <h6 className="fw-bold mb-0">{item.name}</h6>
                            <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                              <span>{item.selectedSize}</span>
                              {item.extrasNames && (
                                <span className="ms-2 "> + {item.extrasNames}</span>
                              )}
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="btn btn-link btn-sm text-danger p-0 mt-1"
                            >
                              Видалити
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">{item.price} грн</td>
                      <td className="py-4">
                        <div className="d-flex align-items-center bg-light rounded-pill px-2 py-1" style={{ width: 'fit-content' }}>
                          <Button 
                            variant="link" 
                            className="text-dark p-0" 
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus size={16} />
                          </Button>
                          <span className="mx-3 fw-bold">{item.quantity}</span>
                          <Button 
                            variant="link" 
                            className="text-dark p-0" 
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                      </td>
                      <td className="py-4 text-end pe-4 fw-bold">
                        {item.price * item.quantity} грн
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm sticky-top" style={{ top: '100px' }}>
            <Card.Body className="p-4">
              <h4 className="fw-bold mb-4">Разом</h4>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Сума за товари:</span>
                <span>{totals.subtotal} грн</span>
              </div>

              {totals.discount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success fw-medium">
                  <span>Акція "1+1=3":</span>
                  <span>-{totals.discount} грн</span>
                </div>
              )}

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <span className="h5 fw-bold">До сплати:</span>
                <span className="h5 fw-bold ">{totals.total} грн</span>
              </div>

              {totals.discount > 0 && (
                <div className="bg-orange-light p-3 rounded mb-4 text-center">
                  <small className="fw-bold  text-uppercase">🔥 Акція застосована!</small>
                  <p className="small mb-0">Ви отримали безкоштовну піцу</p>
                </div>
              )}

              <Button 
                as={Link} 
                to="/checkout" 
                variant="orange" 
                className="w-100 py-3 text-white fw-bold rounded-pill shadow-sm"
                style={{ backgroundColor: '#ff5e00', border: 'none' }}
              >
                ОФОРМИТИ ЗАМОВЛЕННЯ
              </Button>
              
              <Link to="/" className="btn btn-link w-100 mt-2 text-muted text-decoration-none small">
                Продовжити покупки
              </Link>
              
              <Button 
                variant="orange" 
                className="btn btn-link w-100 text-muted text-decoration-none small" 
                onClick={clearCart}
              >
                Очистити кошик
              </Button>
              
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;