import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (e) {
      return [];
    }
  });

  // บันทึกตะกร้าลง LocalStorage ทุกครั้งที่ cart เปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (menu) => {
    // 🚨 ตรวจสอบ ID ให้มั่นใจว่าเป็นตัวเลข (เพราะ SQL ใช้ Integer)
    const menuId = Number(menu.id); 
    
    const exist = cart.find(i => Number(i.id) === menuId);
    
    if (exist) {
      setCart(cart.map(i =>
        Number(i.id) === menuId
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else {
      // เก็บข้อมูลลงตะกร้าโดยใช้ชื่อ 'id' และตรวจสอบค่าต่างๆ ให้ครบ
      setCart([...cart, { 
        id: menuId, 
        name: menu.name, 
        price: Number(menu.price), 
        image: menu.image, 
        quantity: 1 
      }]);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id); 
      return;
    }
    // ใช้ Number(id) เพื่อความแม่นยำในการเปรียบเทียบ
    setCart(cart.map(item =>
      Number(item.id) === Number(id) ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(i => Number(i.id) !== Number(id)));
  };

  const checkout = async (userId) => { 
    if (!userId) {
        throw new Error('ไม่พบรหัสผู้ใช้ (User ID is missing)');
    }
    
    if (cart.length === 0) {
        throw new Error('ไม่มีสินค้าในตะกร้า');
    }
    
    // 🚨 จุดสำคัญ: เตรียมข้อมูลให้ตรงกับ OrderItems ใน SQL Server
    const orderPayload = {
      userId: Number(userId), // มั่นใจว่าเป็นตัวเลข
      items: cart.map(item => ({
        menuId: Number(item.id), // 🚨 ส่งค่าไปในชื่อ menuId เพื่อไม่ให้เป็น null ใน DB
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity)
      }))
    };

    try {
      // ยิง API ไปที่ Backend (เช็ค baseURL ใน api.js ว่าเป็นพอร์ต 5001 หรือยัง)
      const response = await api.post('/api/orders', orderPayload);
      
      // เมื่อสำเร็จ ล้างข้อมูลทั้งหมด
      setCart([]);
      localStorage.removeItem('cart');
      return response.data;
    } catch (err) {
      console.error('Checkout error:', err.response?.data || err.message);
      throw err; 
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      checkout,
    }}>
      {children}
    </CartContext.Provider>
  );
}