// src/pages/AdminMenu.jsx
import { useEffect, useState } from 'react';
import api from '../api';
import Toast from '../components/Toast';

// ----------------------------------------------------
// 💡 Custom Confirmation Modal Component
// ----------------------------------------------------
// Component นี้จะแสดงเมื่อผู้ใช้ต้องการยืนยันการลบ
function ConfirmationModal({ show, onConfirm, onCancel, itemName }) {
  if (!show) return null;

  return (
    // Backdrop
    <div style={modalBackdropStyle}>
      {/* Modal Box */}
      <div style={modalContentStyle}>
        <h3 style={{ margin: '0 0 15px 0', color: '#dc3545', fontSize: '1.5em' }}>
          ⚠️ ยืนยันการลบเมนู
        </h3>
        <p style={{ margin: '0 0 25px 0', fontSize: '1.1em', lineHeight: '1.5' }}>
          คุณแน่ใจหรือไม่ว่าต้องการ **ลบเมนู "{itemName}"** ออกจากรายการถาวร?
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onCancel} style={cancelButtonStyle}>
            ยกเลิก
          </button>
          <button onClick={onConfirm} style={confirmButtonStyle}>
            ยืนยันการลบ
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 💻 AdminMenu Component
// ----------------------------------------------------
export default function AdminMenu() {
  const [menus, setMenus] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // ✅ State สำหรับ Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // ✅ State สำหรับเก็บ ID และ ชื่อเมนู ที่กำลังจะถูกลบ
  const [menuToDelete, setMenuToDelete] = useState(null); 

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await api.get('/api/menu');
      setMenus(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addMenu = async (e) => {
    e.preventDefault();
    if (!name || !price || !image) {
      setToastMessage('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    try {
      await api.post('/api/menu', { name, price: Number(price), image });
      setToastMessage('เพิ่มเมนูสำเร็จ!');
      setName('');
      setPrice('');
      setImage('');
      fetchMenus();
    } catch (err) {
      const errorMessage = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'เพิ่มเมนูไม่สำเร็จ (ดู Console Log สำหรับรายละเอียด)';
        
      console.error("Error adding menu:", err.response ? err.response.data : err.message);
      setToastMessage(`❌ ${errorMessage}`);
    }
  };

  // ✅ 1. ฟังก์ชันเปิด Modal
  const openDeleteModal = (menu) => {
    setMenuToDelete(menu);
    setShowDeleteModal(true);
  };
  
  // ✅ 2. ฟังก์ชันปิด Modal
  const closeDeleteModal = () => {
    setMenuToDelete(null);
    setShowDeleteModal(false);
  };

  // ✅ 3. ฟังก์ชันยืนยันการลบ (แทนที่ window.confirm)
  const confirmDelete = async () => {
    if (!menuToDelete) return; // ป้องกันการทำงานถ้าไม่มีเมนูถูกเลือก

    const id = menuToDelete.id;
    closeDeleteModal(); // ปิด Modal ทันทีที่กดลบ

    try {
      await api.delete(`/api/menu/${id}`);
      setToastMessage(`ลบเมนู "${menuToDelete.name}" สำเร็จ`);
      fetchMenus();
    } catch (err) {
      const errorMessage = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'ลบเมนูไม่สำเร็จ';

      console.error("Error deleting menu:", err.response ? err.response.data : err.message);
      setToastMessage(`❌ ${errorMessage}`);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.8em', margin: '40px 0', color: '#333' }}>
        จัดการเมนูอาหาร
      </h1>

      {/* ฟอร์มเพิ่มเมนู ... (โค้ดเดิม) */}
      <div style={{
        backgroundColor: '#f8fff8',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        marginBottom: '40px',
      }}>
        <h2 style={{ fontSize: '1.8em', marginBottom: '20px', color: '#1976d2' }}>
          เพิ่มเมนูใหม่
        </h2>
        <form onSubmit={addMenu} style={{ display: 'grid', gap: '15px', gridTemplateColumns: '1fr 1fr 1fr auto', alignItems: 'end' }}>
          <input
            placeholder="ชื่ออาหาร (เช่น ข้าวมันไก่)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="ราคา (บาท)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="URL รูปภาพ (เช่น จาก imgur หรือ unsplash)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={addButtonStyle}>
            + เพิ่มเมนู
          </button>
        </form>
        <p style={{ marginTop: '15px', color: '#666', fontSize: '0.95em' }}>
          💡 แนะนำ: ใช้รูปจาก <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2196f3' }}>Unsplash</a> หรือ <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2196f3' }}>Imgur</a>
        </p>
      </div>

      {/* รายการเมนูทั้งหมด ... (โค้ดเดิม) */}
      <h2 style={{ fontSize: '1.8em', marginBottom: '20px', color: '#333' }}>
        รายการเมนูทั้งหมด ({menus.length})
      </h2>

      {menus.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '1.4em', color: '#888', padding: '60px' }}>
          ยังไม่มีเมนูอาหารในระบบ
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {menus.map(menu => (
            <div key={menu.id} style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <img
                src={menu.image || 'https://via.placeholder.com/300x200?text=ไม่มีรูป'}
                alt={menu.name}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4em' }}>{menu.name}</h3>
                <p style={{ margin: '0 0 15px 0', fontSize: '1.4em', fontWeight: 'bold', color: '#e91e63' }}>
                  {menu.price} บาท
                </p>
                {/* 🚨 เปลี่ยนไปเรียก openDeleteModal แทน window.confirm */}
                <button
                  onClick={() => openDeleteModal(menu)}
                  style={deleteButtonStyle}
                >
                  ลบเมนู
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🚨 เพิ่ม Modal Component */}
      <ConfirmationModal 
        show={showDeleteModal} 
        onConfirm={confirmDelete} 
        onCancel={closeDeleteModal} 
        // 🚨 ส่งชื่อเมนูไปแสดงใน Modal
        itemName={menuToDelete ? menuToDelete.name : ''} 
      />

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}

// ----------------------------------------------------
// 🎨 Styles (เพิ่ม Styles ของ Modal)
// ----------------------------------------------------

const inputStyle = { /* โค้ดเดิม */
  padding: '14px',
  fontSize: '1.1em',
  border: '1px solid #ddd',
  borderRadius: '10px',
};

const addButtonStyle = { /* โค้ดเดิม */
  padding: '14px 24px',
  fontSize: '1.2em',
  fontWeight: 'bold',
  backgroundColor: '#4caf50',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
};

const deleteButtonStyle = { /* โค้ดเดิม */
  width: '100%',
  padding: '12px',
  fontSize: '1.1em',
  fontWeight: 'bold',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
};

// ✅ Styles สำหรับ Modal
const modalBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000, // ต้องอยู่เหนือ Element อื่นๆ
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '15px',
  width: '90%',
  maxWidth: '450px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
  animation: 'fadeIn 0.3s ease-out',
};

const cancelButtonStyle = {
  padding: '10px 20px',
  fontSize: '1em',
  backgroundColor: '#f8f9fa',
  color: '#6c757d',
  border: '1px solid #ced4da',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const confirmButtonStyle = {
  padding: '10px 20px',
  fontSize: '1em',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'background-color 0.2s',
};