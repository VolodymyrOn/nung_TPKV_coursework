import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, ListGroup, Spinner, Badge } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { MapPin, Clock, CheckCircle, Smartphone, User, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Checkout = () => {
  const { cart, totals, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [orderType, setOrderType] = useState('delivery'); 
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  const [phone, setPhone] = useState('+380');
  const [pickupTime, setPickupTime] = useState('');
  const [isNextDay, setIsNextDay] = useState(false);

  useEffect(() => {
    if (orderType === 'pickup' && pickupTime) {
      const now = new Date();
      const [hours, minutes] = pickupTime.split(':').map(Number);
      
      const selectedTime = new Date();
      selectedTime.setHours(hours, minutes, 0, 0);

      const minTimeToday = new Date(now.getTime() + 30 * 60000);

      if (selectedTime < minTimeToday) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsNextDay(true);
      } else {
        setIsNextDay(false);
      }
    }
  }, [pickupTime, orderType]);

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith('+380')) value = '+380';
    const rest = value.slice(4).replace(/\D/g, ''); 
    setPhone('+380' + rest.slice(0, 9));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false || phone.length < 13) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(form);
      const customerData = Object.fromEntries(formData.entries());

      const orderData = {
        customer: {
          name: customerData.fullName,
          address: orderType === 'delivery' ? customerData.address : 'Самовивіз',
          pickupTime: orderType === 'pickup' ? (isNextDay ? `Завтра о ${pickupTime}` : `Сьогодні о ${pickupTime}`) : null,
        },
        phone: phone,
        orderType: orderType,
        items: cart.map(item => ({
          id: item.id || item.originalId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.selectedSize || "стандарт",
          extras: item.extrasNames || ""
        })),
        totals: {
          subtotal: totals.subtotal,
          discount: totals.discount,
          finalTotal: totals.total
        },
        status: 'Нове',
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);
      setOrderId(docRef.id);
      setSubmitted(true);
      clearCart();
    } catch (error) {
      console.error("Помилка Firebase:", error);
      alert("Сталася помилка при відправці замовлення.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Container className="text-center py-5">
        <div className="py-5 bg-white rounded-4 shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
          <CheckCircle size={80} className="text-success mb-4" />
          <h2 className="fw-bold">Замовлення прийнято!</h2>
          <p className="text-muted px-4">
            Номер вашого чеку: <strong>#{orderId?.slice(-6).toUpperCase()}</strong>. 
            Очікуйте на дзвінок підтвердження.
          </p>
          <Button variant="warning" onClick={() => navigate('/')} className="rounded-pill mt-3 px-5 py-2">
            НА ГОЛОВНУ
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <style>{`
        /* Вимикаємо стандартну іконку валідації Bootstrap для time picker, 
           щоб вона не накладалася на іконку годинника браузера */
        .no-validation-icon {
          background-image: none !important;
          padding-right: 0.75rem !important;
        }
      `}</style>

      <div className="text-center mb-5">
        <h2 className="fw-bold text-uppercase">Оформлення замовлення</h2>
      </div>

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <Col lg={7}>
            {/* 1. Контактні дані */}
            <Card className="border-0 shadow-sm mb-4 rounded-4">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4 d-flex align-items-center">
                  <span className="bg-orange text-white rounded-circle d-inline-flex align-items-center justify-content-center me-2" style={{width: '24px', height: '24px', fontSize: '14px'}}>1</span>
                  Контактні дані
                </h5>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Label className="small fw-bold text-muted">Ваше ім'я *</Form.Label>
                    <div className="position-relative">
                      <User size={18} className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
                      <Form.Control required name="fullName" type="text" placeholder="Ім'я та прізвище" className="ps-5 py-2" />
                    </div>
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Label className="small fw-bold text-muted">Телефон *</Form.Label>
                    <div className="position-relative">
                      {/* Змінили: замість top-50 ставимо фіксований відступ зверху */}
                      <Smartphone 
                        size={18} 
                        className="position-absolute text-muted" 
                        style={{ 
                          left: '16px', 
                          top: '12px', // Фіксована відстань від верхнього краю інпута
                          zIndex: 5 
                        }} 
                      />
                      <Form.Control 
                        required 
                        type="tel" 
                        name="phone"
                        value={phone} 
                        onChange={handlePhoneChange}
                        pattern="\+380\d{9}"
                        placeholder="+380"
                        className={`ps-5 py-2 ${
                          validated 
                            ? (phone.length < 13 ? 'is-invalid' : 'is-valid') 
                            : ''
                        }`} 
                      />
                      <Form.Control.Feedback type="invalid">
                        Введіть повний номер телефону (9 цифр)
                      </Form.Control.Feedback>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* 2. Спосіб отримання */}
            <Card className="border-0 shadow-sm mb-4 rounded-4">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4 d-flex align-items-center">
                  <span className="bg-orange text-white rounded-circle d-inline-flex align-items-center justify-content-center me-2" style={{width: '24px', height: '24px', fontSize: '14px'}}>2</span>
                  Спосіб отримання
                </h5>
                <div className="d-flex gap-2 mb-4 bg-light p-1 rounded-3">
                  <Button 
                    variant={orderType === 'delivery' ? 'orange' : 'light'} 
                    onClick={() => setOrderType('delivery')}
                    className={`flex-fill rounded-3 border-0 py-2 ${orderType === 'delivery' ? 'text-white shadow-sm' : ''}`}
                    style={orderType === 'delivery' ? { backgroundColor: '#ff5e00' } : {}}
                  >
                    <MapPin size={18} className="me-2" /> Доставка
                  </Button>
                  <Button 
                    variant={orderType === 'pickup' ? 'orange' : 'light'} 
                    onClick={() => setOrderType('pickup')}
                    className={`flex-fill rounded-3 border-0 py-2 ${orderType === 'pickup' ? 'text-white shadow-sm' : ''}`}
                    style={orderType === 'pickup' ? { backgroundColor: '#ff5e00' } : {}}
                  >
                    <Clock size={18} className="me-2" /> Самовивіз
                  </Button>
                </div>

                {orderType === 'delivery' ? (
                  <div className="animate-fade-in">
                    <Form.Label className="small fw-bold text-muted">Адреса доставки *</Form.Label>
                    <Form.Control required={orderType === 'delivery'} name="address" type="text" placeholder="Вулиця, будинок, під'їзд" className="py-2" />
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <Form.Label className="small fw-bold text-muted">Час самовивозу(10:00 - 22:00) *</Form.Label>
                    <div className="d-flex align-items-start gap-3 flex-column flex-sm-row">
                      <div className="flex-grow-1 w-100">
                        <Form.Control 
                          required={orderType === 'pickup'} 
                          name="pickupTime" 
                          type="time" 
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          min="10:00" 
                          max="22:00" 
                          className="py-2 no-validation-icon" 
                        />
                        <Form.Control.Feedback type="invalid">Будь ласка, оберіть час (10:00 - 22:00)</Form.Control.Feedback>
                      </div>
                      
                      {pickupTime && (
                        <Badge bg={isNextDay ? "info" : "success"} className="py-2 px-3 rounded-pill d-flex align-items-center">
                          {isNextDay ? (
                            <><AlertCircle size={14} className="me-1" /> Замовлення на завтра</>
                          ) : (
                            'На сьогодні'
                          )}
                        </Badge>
                      )}
                    </div>
                    <Form.Text className="text-muted d-block mt-2">
                      {isNextDay 
                        ? "⚠️ Обраний час уже минув або занадто близько. Приготуємо на завтра." 
                        : "Ми готуємо замовлення мінімум 30 хвилин."}
                    </Form.Text>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Права колонка - Чек */}
          <Col lg={5}>
            <Card className="border-0 shadow-sm sticky-top rounded-4" style={{ top: '100px' }}>
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4">Ваше замовлення</h5>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }} className="pe-2">
                  <ListGroup variant="flush">
                    {cart.map((item, index) => (
                      <ListGroup.Item key={index} className="px-0 py-3 bg-transparent border-bottom-dashed">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <span className="fw-bold d-block">{item.name}</span>
                            <small className="text-muted">
                              {item.quantity} шт. × {item.price} ₴ {item.selectedSize && `(${item.selectedSize})`}
                            </small>
                            {item.extrasNames && <div className="text-orange small">+ {item.extrasNames}</div>}
                          </div>
                          <span className="fw-bold">{item.price * item.quantity} ₴</span>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>

                <div className="mt-4">
                  <div className="d-flex justify-content-between mb-2 small text-muted">
                    <span>Сума</span>
                    <span>{totals.subtotal} ₴</span>
                  </div>
                  {totals.discount > 0 && (
                    <div className="d-flex justify-content-between mb-2 text-success fw-bold small">
                      <span>Акція</span>
                      <span>-{totals.discount} ₴</span>
                    </div>
                  )}
                  <hr className="my-3 border-dashed" />
                  <div className="d-flex justify-content-between h4 fw-bold">
                    <span>РАЗОМ</span>
                    <span className="text-orange">{totals.total} ₴</span>
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-100 py-3 btn-orange-pill mt-4 shadow-sm fw-bold"
                >
                  {isSubmitting ? <Spinner animation="border" size="sm" /> : 'ПІДТВЕРДИТИ ЗАМОВЛЕННЯ'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default Checkout;