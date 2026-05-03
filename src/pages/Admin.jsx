import { useState, useEffect } from 'react';
import { Container, Table, Badge, Form, Button, Card, Spinner } from 'react-bootstrap';
import { LogOut, Phone, MapPin, Clock, Trash2, MessageSquare, XCircle, ChevronDown } from 'lucide-react';
import { db } from '../firebase';
import { 
  collection, query, orderBy, onSnapshot, 
  doc, updateDoc, deleteDoc, limit 
} from 'firebase/firestore';

const notificationSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('pizzeria_admin_auth') === 'true';
  });
  
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [ordersLimit, setOrdersLimit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [lastOrderId, setLastOrderId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const q = query(
      collection(db, "orders"), 
      orderBy("createdAt", "desc"), 
      limit(ordersLimit + 1) 
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs;
      if (docs.length > ordersLimit) {
        setHasMore(true);
        const slicedOrders = docs.slice(0, ordersLimit).map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(slicedOrders);
      } else {
        setHasMore(false);
        const allOrders = docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(allOrders);
      }

      if (docs.length > 0) {
        const newestOrder = { id: docs[0].id, ...docs[0].data() };
        if (lastOrderId && newestOrder.id !== lastOrderId && newestOrder.status === 'Нове') {
          notificationSound.play().catch(() => {});
        }
        setLastOrderId(newestOrder.id);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated, ordersLimit, lastOrderId]);

  const formatOrderDate = (timestamp) => {
  if (!timestamp) return '...';
  const date = timestamp.toDate();
  
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('pizzeria_admin_auth', 'true');
    } else {
      alert("Невірний пароль!");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('pizzeria_admin_auth');
  };

  const loadMore = () => {
    setOrdersLimit(prev => prev + 10);
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
    } catch (e) { alert("Помилка оновлення статусу", e); }
  };

  const updateAdminNote = async (orderId, note) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { adminNote: note });
    } catch (e) { console.error(e); }
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm("Видалити замовлення назавжди?")) {
      await deleteDoc(doc(db, "orders", orderId));
    }
  };

  const removeItemFromOrder = async (order, itemIndex) => {
    if (!window.confirm("Видалити цей товар із замовлення?")) return;

    const newItems = [...order.items];
    const removedItem = newItems.splice(itemIndex, 1)[0];
    
    const itemPrice = removedItem.price * removedItem.quantity;
    const oldSubtotal = order.totals?.subtotal || order.total || 0;
    const newSubtotal = Math.max(0, oldSubtotal - itemPrice);
    
    const discount = order.totals?.discount || 0;
    const newFinalTotal = Math.max(0, newSubtotal - discount);

    try {
      await updateDoc(doc(db, "orders", order.id), {
        items: newItems,
        "totals.subtotal": newSubtotal,
        "totals.total": newFinalTotal,
        "totals.finalTotal": newFinalTotal,
        total: newFinalTotal
      });
    } catch (e) { alert("Помилка при видаленні замовлення", e); }
  };

  if (!isAuthenticated) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Card className="p-4 shadow border-0" style={{ maxWidth: '400px', width: '100%' }}>
          <div className="text-center mb-4">
            <h3 className="fw-bold">Admin Access</h3>
          </div>
          <Form onSubmit={handleLogin}>
            <Form.Control 
              type="password" 
              className="mb-3 py-2"
              placeholder="Пароль..." 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <Button variant="dark" type="submit" className="w-100 py-2">УВІЙТИ</Button>
          </Form>
        </Card>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 px-lg-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div style={{ visibility: 'hidden' }}><LogOut size={16} /></div> {/* для візуального балансу */}
        <div>
          <h2 className="fw-bold m-0">PIZZERIA CONTROL</h2>
          <p className="text-muted small">Керування замовленнями та клієнтами</p>
        </div>
        <Button variant="dark" size="sm" onClick={handleLogout} className="rounded-pill px-3">
          <LogOut size={16} className="me-2" /> Вихід
        </Button>
      </div>

      <div className="d-flex gap-2 mb-4 overflow-auto pb-2 justify-content-center">
        {['all', 'Нове', 'Підтверджено', 'Готується', 'Виконано', 'Скасовано'].map(s => (
          <Button 
            key={s} 
            variant={filter === s ? 'warning' : 'light'}
            onClick={() => setFilter(s)}
            className="rounded-pill text-nowrap px-4 border shadow-sm"
          >
            {s === 'all' ? 'Всі' : s}
          </Button>
        ))}
      </div>

      <div className="bg-white rounded-4 shadow-sm border overflow-hidden">
        <Table responsive hover className="align-middle mb-0">
          <thead className="bg-light text-muted small">
            <tr>
              <th className="ps-4 py-3">КЛІЄНТ</th>
              <th>СКЛАД ТА НОТАТКИ</th>
              <th>ОПЛАТА</th>
              <th>СТАТУС</th>
              <th className="pe-4 text-end">ДІЇ</th>
            </tr>
          </thead>
          <tbody>
            {orders
              .filter(o => filter === 'all' || o.status === filter)
              .map(order => (
              <tr key={order.id} className="border-bottom">
                <td className="ps-4 py-4" style={{ minWidth: '220px' }}>
                  <div className="d-flex align-items-center gap-1 mb-2">
                    <Badge bg="light" className="text-dark border fw-normal py-1 px-2 d-flex align-items-center">
                      <Clock size={12} className="me-1" />
                      {formatOrderDate(order.createdAt)}
                    </Badge>
                  </div>
                  <div className="fw-bold text-dark">{order.customer?.name || order.customer?.fullName || "Гість"}</div>
                  <div className="text-muted small"><Phone size={12} /> {order.phone}</div>
                  <div className="mt-2 small">
                    {order.type === 'delivery' || order.orderType === 'delivery' ? (
                      <span className="text-danger fw-500"><MapPin size={12} /> {order.customer?.address}</span>
                    ) : (
                      <span className="text-primary fw-500"><Clock size={12} /> Самовивіз: {order.customer?.pickupTime}</span>
                    )}
                  </div>
                  <div className="text-muted mt-1" style={{ fontSize: '14px' }}>ID: <b>#{order.id.slice(-6).toUpperCase()}</b></div>
                </td>

                <td className="py-4" style={{ minWidth: '300px' }}>
                  <div className="mb-3">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="bg-light p-2 rounded mb-1 small border shadow-sm">
                        <div className="d-flex justify-content-between align-items-center">
                          <span>
                            <strong>{item.quantity}x</strong> {item.name} 
                            <span className="text-muted ms-1">({item.selectedSize || item.size})</span>
                          </span>
                        <XCircle 
                          size={14} 
                          className="text-danger cursor-pointer ms-2" 
                          onClick={() => removeItemFromOrder(order, idx)}
                        />
                      </div>

                      {item.extras && item.extras.trim() !== "" && (
                        <div className="mt-1 ps-2 border-start border-warning" style={{ fontSize: '12px' }}>
                          <span className="text-muted">Додатки: </span>
                          <span className="text-dark fw-500">{item.extras}</span>
                        </div>
                      )}
                      </div>
                    ))}
                  </div>
                  <div className="position-relative">
                    <MessageSquare size={14} className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
                    <Form.Control 
                      size="sm"
                      placeholder="Додати примітку для кухні..."
                      className="ps-4 border-dashed bg-transparent"
                      defaultValue={order.adminNote || ''}
                      onBlur={(e) => updateAdminNote(order.id, e.target.value)}
                    />
                  </div>
                </td>

                <td className="py-4">
                  <div className="fw-bold fs-5">
                    {order.totals?.finalTotal || order.totals?.total || order.total || 0} ₴
                  </div>
                  {order.totals?.discount > 0 && (
                    <Badge bg="success" className="fw-normal">Знижка: -{order.totals.discount} ₴</Badge>
                  )}
                </td>

                <td className="py-4">
                  <Form.Select 
                    size="sm" 
                    className="rounded-pill shadow-sm border"
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    style={{ minWidth: '130px' }}
                  >
                    <option value="Нове">Нове</option>
                    <option value="Підтверджено">Підтвердити</option>
                    <option value="Готується">Готується</option>
                    <option value="Виконано">Виконано</option>
                    <option value="Скасовано">Скасовано</option>
                  </Form.Select>
                </td>

                <td className="pe-4 text-end">
                  <Button variant="link" className="text-danger p-0" onClick={() => deleteOrder(order.id)}>
                    <Trash2 size={20} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="p-4 bg-light text-center border-top">
          {loading ? (
            <Spinner animation="border" variant="warning" size="sm" />
          ) : hasMore ? (
            <Button variant="outline-dark" size="sm" className="rounded-pill px-4" onClick={loadMore}>
              <ChevronDown size={16} className="me-1" /> Завантажити ще
            </Button>
          ) : (
            <span className="text-muted small italic">Це всі замовлення</span>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Admin;