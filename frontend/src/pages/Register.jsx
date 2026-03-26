// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import Toast from '../components/Toast';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [toastMessage, setToastMessage] = useState(null);
  const navigate = useNavigate();

  const register = async () => {
    if (!username.trim() || !password.trim()) {
      alert('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    try {
      await api.post('/auth/register', { username, password, role });
      setToastMessage('สมัครสมาชิกสำเร็จ! กำลังไปหน้าเข้าสู่ระบบ...');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
        console.log("Full Error:", err.response); // ดูใน Inspect > Console
        const errorMsg = err.response?.data?.message || 'สมัครไม่สำเร็จ กรุณาลองใหม่';
        alert(errorMsg);
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
          width: '100%',
          maxWidth: '400px',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          <h1 style={{ marginBottom: '30px', fontSize: '2.2em', color: '#333' }}>
            สมัครสมาชิก
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

          <div style={{ margin: '20px 0', textAlign: 'left' }}>
            <label style={{ fontSize: '1.1em', color: '#555' }}>ประเภทบัญชี:</label>
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '30px' }}>
              <label>
                <input
                  type="radio"
                  value="customer"
                  checked={role === 'customer'}
                  onChange={e => setRole(e.target.value)}
                /> ลูกค้า
              </label>
              <label>
                <input
                  type="radio"
                  value="shop"
                  checked={role === 'shop'}
                  onChange={e => setRole(e.target.value)}
                /> ร้านค้า
              </label>
            </div>
          </div>

          <button onClick={register} style={registerButtonStyle}>
            สมัครสมาชิก
          </button>

          <p style={{ marginTop: '25px', color: '#666' }}>
            มีบัญชีอยู่แล้ว?{' '}
            <Link to="/login" style={{ color: '#2196f3', fontWeight: 'bold' }}>
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
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

const registerButtonStyle = {
  width: '100%',
  padding: '16px',
  marginTop: '10px',
  fontSize: '1.2em',
  fontWeight: 'bold',
  backgroundColor: '#4caf50',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
};