// src/components/Navbar.jsx
import { useState } from 'react';
// ✅ เพิ่ม useLocation
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { useCart } from '../context/CartContext';

export default function Navbar({ role, setRole }) {
  const navigate = useNavigate();
  // ✅ เรียกใช้ useLocation
  const location = useLocation(); 
  const { cart } = useCart();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 🚨 ตรวจสอบว่าอยู่หน้า Login/Register หรือไม่
  const isAuthPage = 
    location.pathname === '/login' || 
    location.pathname === '/register' || 
    location.pathname === '/'; // เพิ่ม / ด้วยเพื่อความชัวร์ (ถ้าไม่มีการ redirect)

  const handleLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem('role');
    localStorage.removeItem('userId'); 
    setRole(null); 
    navigate('/login');
  };

  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);

  return (
    <>
      <nav
        style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          padding: '15px 20px',
          borderBottom: '2px solid #eee',
          backgroundColor: '#fff',
          flexWrap: 'wrap',
        }}
      >
        {/* แสดงโลโก้/ชื่อแอป */
        <Link to={role === 'shop' ? '/shop/orders' : '/menu'} style={{ textDecoration: 'none', color: '#333', fontSize: '1.5em', fontWeight: 'bold', marginRight: 'auto' }}>
            Canteen Q
        </Link>}


        {/* แสดงลิงก์เมนูและตะกร้า เฉพาะเมื่อ login แล้วเท่านั้น */}
        {role && (
          <>
            {role === 'customer' && (
              <>
                <Link to="/menu" style={linkStyle}>เมนู</Link>
                <Link to="/order-history" style={linkStyle}>ประวัติการสั่งซื้อ</Link>
              </>
            )}

            {role === 'shop' && (
              <>
                <Link to="/shop/orders" style={linkStyle}>รายการสั่งซื้อ</Link>
                <Link to="/admin/menu" style={linkStyle}>จัดการเมนู</Link>
              </>
            )}

            {role === 'customer' && (
              <div style={{ position: 'relative' }}>
                <Link to="/cart" style={linkStyle}>
                  ตะกร้า
                </Link>
                {cartCount > 0 && (
                  <span
                    style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-15px',
                    background: '#ff4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    fontSize: '0.9em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </div>
            )}
            
            <button onClick={openLogoutModal} style={buttonStyle}>
              ออกจากระบบ
            </button>
          </>
        )}

        {/* 🚨 เงื่อนไขการแสดงปุ่ม Login:
           - ต้องไม่มี role (ยังไม่ได้ login)
           - ต้องไม่อยู่บนหน้า Login/Register (isAuthPage เป็น false)
        */}
        {!role && !isAuthPage && (
            <Link to="/login" style={{...buttonStyle, backgroundColor: '#28a745'}}>
                เข้าสู่ระบบ
            </Link>
        )}
      </nav>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div style={modalOverlayStyle} onClick={closeLogoutModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5em', color: '#333' }}>
              ออกจากระบบ
            </h3>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบในตอนนี้?
            </p>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={closeLogoutModal}
                style={{
                  padding: '12px 24px',
                  fontSize: '1.1em',
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              >
                ยกเลิก
              </button>

              <button
                onClick={handleLogout}
                style={{
                  padding: '12px 24px',
                  fontSize: '1.1em',
                  fontWeight: 'bold',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const linkStyle = {
  textDecoration: 'none',
  color: '#333',
  fontWeight: '500',
  fontSize: '1.1em',
};

const buttonStyle = {
  padding: '8px 16px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1em',
  fontWeight: '600',
  cursor: 'pointer',
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '40px',
  borderRadius: '15px',
  textAlign: 'center',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
  maxWidth: '400px',
  width: '90%',
};