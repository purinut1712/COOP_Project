// src/components/Toast.jsx
import { useState, useEffect } from 'react';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); // หายไปใน 2 วินาที

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#333',
      color: 'white',
      padding: '16px 30px',
      borderRadius: '50px',
      fontSize: '1.2em',
      fontWeight: 'bold',
      boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
      zIndex: 1000,
      animation: 'slideUp 0.4s ease-out',
    }}>
      {message}
    </div>
  );
}

// เพิ่ม animation เล็กน้อย (ใส่ใน index.css หรือ App.css)
const style = document.createElement('style');
style.innerHTML = `
@keyframes slideUp {
  from { transform: translateX(-50%) translateY(100px); opacity: 0; }
  to { transform: translateX(-50%) translateY(0); opacity: 1; }
}
`;
document.head.appendChild(style);