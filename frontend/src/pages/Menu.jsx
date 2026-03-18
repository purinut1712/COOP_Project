import { useEffect, useState } from 'react';
import api from '../api';
import Toast from '../components/Toast';  // เพิ่ม import

export default function Menu({ addToCart }) {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);  // เพิ่ม state สำหรับ toast

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await api.get('/api/menu');
      setMenus(res.data);
      setLoading(false);
    } catch (err) {
      setError('ไม่สามารถโหลดเมนูได้');
      setLoading(false);
    }
  };

  const handleAddToCart = (menu) => {
    addToCart(menu);
    setToastMessage(`เพิ่ม "${menu.name}" ลงตะกร้าเรียบร้อย!`);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.4em' }}>กำลังโหลดเมนู...</div>;
  if (error) return <div style={{ textAlign: 'center', color: 'red', padding: '50px' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', margin: '40px 0', fontSize: '2.5em', color: '#333' }}>
        เมนูอาหาร
      </h1>

      {menus.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '1.4em', color: '#888' }}>
          ไม่มีเมนูในขณะนี้
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '25px',
        }}>
          {menus.map(menu => (
            <div
              key={menu.id}
              style={{
                border: '1px solid #eee',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: '#fff',
                boxShadow: '0 6px 15px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.08)';
              }}
            >
              <img
                src={menu.image || 'https://via.placeholder.com/300x200?text=อาหาร'}
                alt={menu.name}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4em', color: '#333' }}>
                  {menu.name}
                </h3>
                <p style={{ margin: '0 0 20px 0', fontSize: '1.3em', fontWeight: 'bold', color: '#e91e63' }}>
                  {menu.price} บาท
                </p>
                <button
                  onClick={() => handleAddToCart(menu)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '1.1em',
                    fontWeight: 'bold',
                    backgroundColor: '#ff9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                  }}
                >
                  เพิ่มลงตะกร้า
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}