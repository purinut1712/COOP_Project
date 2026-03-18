// src/App.jsx (โค้ดเต็มฉบับแก้ไข)
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import OrderSuccess from './pages/OrderSuccess';
import ShopOrders from './pages/ShopOrders';
import AdminMenu from './pages/AdminMenu';
import CustomerOrders from './pages/CustomerOrders'; // <<< เปลี่ยนชื่อ Import
import { useCart } from './context/CartContext';

// Protected Route สำหรับผู้ที่ต้อง login ก่อน
function ProtectedRoute({ children, role }) {
  if (!role) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Protected Route เฉพาะร้านค้า (role = 'shop')
function ShopOnlyRoute({ children, role }) {
  if (role !== 'shop') {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  // ✅ โหลด role และ userId จาก localStorage
  const [role, setRoleState] = useState(localStorage.getItem('role') || null);
  const [userId, setUserIdState] = useState(localStorage.getItem('userId') || null); 
  const { addToCart } = useCart();

  // 🚨 ฟังก์ชันจัดการ Role และ UserId ที่ส่งไปให้ Navbar และ Login
  const handleSetRole = (newRole, newUserId = null) => {
    if (newRole) {
      localStorage.setItem('role', newRole);
      setRoleState(newRole);
      
      if (newUserId) {
        localStorage.setItem('userId', newUserId);
        setUserIdState(newUserId);
      }
    } else {
      // Logout
      localStorage.removeItem('role');
      localStorage.removeItem('userId'); 
      setRoleState(null);
      setUserIdState(null); 
    }
  };


  return (
    <BrowserRouter>
      {/* 🚨 ส่ง handleSetRole ไปยัง Navbar และ Login */}
      <Navbar role={role} setRole={handleSetRole} /> 

      <Routes>
        {/* หน้าเริ่มต้นเด้งไป login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login setRole={handleSetRole} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes – ต้อง login ก่อน */}
        <Route
          path="/menu"
          element={
            <ProtectedRoute role={role}>
              <Menu addToCart={addToCart} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute role={role}>
              {/* ✅ ส่ง userId ลง Cart ไปด้วย */}
              <Cart userId={userId} /> 
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-success"
          element={
            <ProtectedRoute role={role}>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />
        
        {/* ✅ Route สำหรับประวัติการสั่งซื้อของลูกค้า (ใช้ CustomerOrders) */}
        <Route
          path="/order-history"
          element={
            <ProtectedRoute role={role}>
              <CustomerOrders userId={userId} />
            </ProtectedRoute>
          }
        />

        {/* Shop Routes */}
        <Route
          path="/shop/orders"
          element={
            <ShopOnlyRoute role={role}>
              <ShopOrders />
            </ShopOnlyRoute>
          }
        />

        {/* Admin Menu – เฉพาะร้านค้า */}
        <Route
          path="/admin/menu"
          element={
            <ShopOnlyRoute role={role}>
              <AdminMenu />
            </ShopOnlyRoute>
          }
        />

        {/* ถ้า path ไม่ตรง ให้เด้งไป login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;