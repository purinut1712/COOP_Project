// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import Toast from '../components/Toast';

export default function Login({ setRole }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const navigate = useNavigate();

  const login = async () => {
    if (!username.trim() || !password.trim()) {
      alert('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    try {
      const res = await api.post('/auth/login', { username, password });
      
      const userRole = res.data.role;
      // ✅ จุดที่แก้ไข: ดึง userId มาจาก response (เป็น _id)
      const userId = res.data.userId; 

      // บันทึก role และ userId
      localStorage.setItem('role', userRole);
      localStorage.setItem('userId', userId); // ✅ บันทึก userId
      
      // 🚨 ส่ง userId ขึ้นไปจัดการใน App.jsx
      setRole(userRole, userId); 

      // กำหนดข้อความ Toast ตาม role
      const roleName = userRole === 'shop' ? 'ร้านค้า' : 'ลูกค้า';
      setToastMessage(`ยินดีต้อนรับ ${roleName}! กำลังพาไปหน้าที่เหมาะสม...`);

      // รอให้ Toast แสดงสักครู่ แล้ว redirect ตาม role
      setTimeout(() => {
        if (userRole === 'shop') {
          navigate('/shop/orders');  // ร้านค้า → ไปหน้าออเดอร์เลย
        } else {
          navigate('/menu');         // ลูกค้า → ไปหน้าเมนู
        }
      }, 1800);

    } catch (err) {
      console.error(err);
      alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <>
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center',
        }}>
          <h1 style={{ margin: '0 0 30px', fontSize: '2.2em', color: '#333' }}>
            เข้าสู่ระบบ
          </h1>

          <input
            placeholder="ชื่อผู้ใช้"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button onClick={login} style={loginButtonStyle}>
            เข้าสู่ระบบ
          </button>

          <p style={{ marginTop: '25px', color: '#666' }}>
            ยังไม่มีบัญชี?{' '}
            <Link to="/register" style={{ color: '#2196f3', fontWeight: 'bold' }}>
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </>
  );
}

const inputStyle = {
  width: '100%',
  padding: '14px',
  marginBottom: '15px',
  fontSize: '1.1em',
  border: '1px solid #ddd',
  borderRadius: '10px',
  boxSizing: 'border-box',
};

const loginButtonStyle = {
  width: '100%',
  padding: '16px',
  marginTop: '20px',
  fontSize: '1.2em',
  fontWeight: 'bold',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
};