import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. LocalStorage: Ініціалізація
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('pizzeria_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. LocalStorage: Збереження
  useEffect(() => {
    localStorage.setItem('pizzeria_cart', JSON.stringify(cart));
  }, [cart]);

  // 3. Додавання з розумним групуванням
  const addToCart = (product) => {
    setCart(prev => {
      // Створюємо унікальний ключ на основі ID, розміру та додатків
      const itemKey = `${product.originalId}-${product.selectedSize}-${product.extrasNames || 'none'}`;
      
      const existingItem = prev.find(item => item.id === itemKey);

      if (existingItem) {
        return prev.map(item =>
          item.id === itemKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...prev, { ...product, id: itemKey, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => {
      const item = prev.find(i => i.id === id);
      if (item && item.quantity === 1 && delta === -1) {
        return prev.filter(i => i.id !== id);
      }
      return prev.map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i);
    });
  };

  const clearCart = () => setCart([]);
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  // 4. Розрахунок акції "Найдешевші в подарунок"
  const totals = useMemo(() => {
    let subtotal = 0;
    let totalItemsCount = 0;
    let pizzaPrices = [];

    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      totalItemsCount += item.quantity;

      // Складаємо ціни всіх піц в один масив (якщо їх 3 штуки — додаємо ціну 3 рази)
      if (item.category === 'pizza') {
        for (let i = 0; i < item.quantity; i++) {
          pizzaPrices.push(item.price);
        }
      }
    });

    // ЛОГІКА 1+1=3:
    // 1. Сортуємо всі ціни від найменшої до найбільшої
    pizzaPrices.sort((a, b) => a - b);

    // 2. Визначаємо, скільки піц мають бути безкоштовними
    const freePizzasCount = Math.floor(pizzaPrices.length / 3);

    // 3. Сумуємо ціни найдешевших піц (вони на початку масиву)
    let discount = 0;
    for (let i = 0; i < freePizzasCount; i++) {
      discount += pizzaPrices[i];
    }

    return {
      subtotal,
      discount,
      total: subtotal - discount,
      totalItems: totalItemsCount
    };
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, totals }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);