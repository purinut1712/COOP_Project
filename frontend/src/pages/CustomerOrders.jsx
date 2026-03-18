// src/pages/CustomerOrders.jsx
import { useEffect, useState } from 'react';
import api from '../api';

export default function CustomerOrders({ userId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ ฟังก์ชันกำหนดสีสถานะ
  const getStatusStyle = (status) => {
    switch (status) {
      case 'พร้อมรับ':
        return { 
            color: '#1e7e34', 
            backgroundColor: '#e2f0e4', 
            fontWeight: 'bold', 
            animation: 'blink 1s infinite' 
        }; 
      case 'กำลังทำ':
        return { 
            color: '#ffc107', 
            backgroundColor: '#fff7e6', 
            fontWeight: 'bold' 
        }; 
      case 'เสร็จสิ้น': 
      case 'รับแล้ว':
      case 'เสร็จ':
        return { 
            color: '#6c757d', 
            backgroundColor: '#dee2e6', 
            fontWeight: 'normal' 
        }; 
      case 'รอทำ':
        return { 
            color: '#007bff', 
            backgroundColor: '#e6f2ff', 
            fontWeight: 'bold' 
        }; 
      case 'ยกเลิก': 
        return { 
            color: '#dc3545', 
            backgroundColor: '#f8d7da', 
            fontWeight: 'bold' 
        };
      default:
        return { 
            color: '#6f42c1', 
            backgroundColor: '#f3e8ff', 
            fontWeight: 'bold' 
        }; 
    }
  };

  const fetchOrders = async () => {
    // 🚨 สำคัญ: userId ต้องมีค่า (และควรเป็นตัวเลขสำหรับ SQL)
    if (!userId) { 
      setLoading(false);
      return;
    }
    
    try {
      // ✅ เรียก API ที่เราเพิ่มใน Backend (routes/orders.js)
      const res = await api.get(`/api/orders/customer/${userId}`); 
      setOrders(res.data);
      setError(null);
    } catch (err) {
      console.error("Fetch Orders Error:", err);
      setError('ไม่สามารถดึงประวัติการสั่งซื้อได้ (ตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // 🔔 Auto-refresh ทุก 5 วินาที เพื่อดูสถานะอาหารแบบ Real-time
    const intervalId = setInterval(fetchOrders, 5000); 

    return () => clearInterval(intervalId);
  }, [userId]);

  if (loading) return <p style={messageStyle}>กำลังโหลดประวัติการสั่งซื้อ...</p>;
  if (error) return <p style={{ ...messageStyle, color: 'red' }}>❌ {error}</p>;

  // ✅ คำนวณราคาทั้งหมด (ตรวจสอบว่า item.price และ item.quantity เป็นตัวเลข)
  const getTotal = (items) => {
    if (!items) return 0;
    return items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', margin: '30px 0', fontSize: '2.5em' }}>
        ประวัติและสถานะการสั่งซื้อ
      </h1>

      <style>{`
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
          <p style={{ fontSize: '1.5em' }}>คุณยังไม่มีประวัติการสั่งซื้อในขณะนี้</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order, index) => (
            <div key={order.id} style={{
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '15px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              borderLeft: `6px solid ${order.status === 'พร้อมรับ' ? '#28a745' : '#007bff'}`,
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.4em', color: '#333' }}>
                    คำสั่งซื้อ #{order.id}
                  </h3>
                  <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', color: '#999' }}>
                    {new Date(order.createdAt).toLocaleString('th-TH')}
                  </p>
                </div>
                
                <span style={{ 
                    fontSize: '1.1em', 
                    padding: '8px 16px', 
                    borderRadius: '30px', 
                    ...getStatusStyle(order.status)
                }}>
                  {order.status}
                </span>
              </div>
              
              <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '10px', margin: '15px 0' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {order.items && order.items.map((item) => (
                    <li key={item.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '1.1em' }}>
                        {item.name} <span style={{ color: '#888' }}>x {item.quantity}</span>
                      </span>
                      <span style={{ fontWeight: '500' }}>{item.price * item.quantity} บาท</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>ยอดรวมสุทธิ:</span>
                <span style={{ fontSize: '1.6em', fontWeight: 'bold', color: '#e91e63' }}>
                  {getTotal(order.items)} บาท
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const messageStyle = {
  textAlign: 'center',
  marginTop: '100px',
  fontSize: '1.4em',
  color: '#555'
};