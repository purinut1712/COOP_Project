import { Link } from 'react-router-dom';

export default function OrderSuccess() {
  return (
    <div
      className="container"
      style={{
        maxWidth: '550px',
        margin: '80px auto', // ขยับลงมาตรงกลางมากขึ้น
        padding: '50px 30px',
        textAlign: 'center',
        // --- Card Design ---
        backgroundColor: '#ffffff', // พื้นหลังสีขาว
        border: '1px solid #e0e0e0',
        borderRadius: '20px', // ขอบมน
        boxShadow: '0 10px 30px rgba(40, 167, 69, 0.15)', // เงาสีเขียวจางๆ
      }}
    >
      
      {/* 🚀 Icon & Header Area */}
      <div style={{
        fontSize: '5em', 
        marginBottom: '20px', 
        lineHeight: '1',
      }}>
        🎉
      </div>

      <h1 style={{ 
        fontSize: '2.5em', 
        color: '#1e7e34', // สีเข้มกว่าเดิม ดูเป็นทางการ
        margin: '0 0 10px 0',
      }}>
        สั่งซื้อสำเร็จ!
      </h1>
      
      <p style={{ 
        fontSize: '1.2em', 
        color: '#28a745', 
        fontWeight: '600',
        marginBottom: '30px',
      }}>
        ขอบคุณที่สั่งอาหารกับเราครับ/ค่ะ
      </p>
      
      {/* 📝 Detail Box */}
      <div style={{
          backgroundColor: '#f1fff4', // พื้นหลังสีเขียวอ่อนมาก
          padding: '25px',
          borderRadius: '15px',
          marginBottom: '40px',
          borderLeft: '5px solid #28a745', // เน้นขอบซ้าย
      }}>
        <p style={{ fontSize: '1.1em', color: '#333', margin: '0 0 8px 0' }}>
          **คำสั่งซื้อของคุณอยู่ในขั้นตอนการดำเนินการ**
        </p>
        <p style={{ fontSize: '1em', color: '#6c757d', margin: 0 }}>
          ร้านจะเริ่มทำอาหารให้คุณทันที โปรดรอมารับอาหารได้เลย
        </p>
      </div>


      {/* 🎯 Action Button */}
      <Link to="/menu" style={{ textDecoration: 'none' }}>
        <button
          style={{
            marginTop: '10px',
            padding: '15px 35px',
            fontSize: '1.3em',
            fontWeight: 'bold',
            backgroundColor: '#28a745', // ปุ่มสีเขียวเด่น
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            boxShadow: '0 5px 15px rgba(40, 167, 69, 0.4)',
            transition: 'background-color 0.3s ease',
          }}
          // คุณอาจต้องเพิ่ม onMouseOver/onMouseOut สำหรับ hover effect ใน React
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e7e34'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
        >
          กลับไปดูเมนู
        </button>
      </Link>
    </div>
  );
}