import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Đăng nhập thất bại");
        return;
      }

      // Lưu user vào localStorage thông qua AuthContext
      login(data.user);


      // Điều hướng theo role - KIỂM TRA AN TOÀN
      const isAdmin = Boolean(
        data.user?.isAdmin ||
        data.user?.roleId === 1 ||
        ['admin', 'administrator'].includes(String(data.user?.role || '').toLowerCase())
      );

      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Lỗi kết nối server!");
      console.error("Login error:", err);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <div
        style={{
          maxWidth: 400,
          margin: '30px auto 20px auto',
          fontWeight: 'bold',
          fontSize: '22px',
          textAlign: 'center',
          color: '#000',
        }}
      >
        ĐĂNG NHẬP
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 400,
          margin: '50px auto',
          backgroundColor: '#fff',
          padding: 30,
          borderRadius: 8,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {error && (
          <div style={{ color: "red", marginBottom: 15, fontSize: 14 }}>
            {error}
          </div>
        )}

        <label style={{ marginBottom: 8, fontWeight: '600' }}>
          Email
        </label>
        <input
          type="email"
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: '10px',
            marginBottom: 20,
            borderRadius: 5,
            border: '1px solid #ccc',
            fontSize: 16,
          }}
        />

        <label style={{ marginBottom: 8, fontWeight: '600' }}>
          Mật khẩu
        </label>
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: '10px',
            marginBottom: 30,
            borderRadius: 5,
            border: '1px solid #ccc',
            fontSize: 16,
          }}
        />

        <button
          type="submit"
          style={{
            backgroundColor: '#4CAF50',
            color: '#fff',
            padding: '12px 0',
            border: 'none',
            borderRadius: 6,
            fontSize: 18,
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
        >
          Đăng nhập
        </button>
      </form>

      <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center', fontSize: 14 }}>
        Chưa có tài khoản?{' '}
        <span
          onClick={() => navigate('/register')}
          style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Đăng ký ngay
        </span>
      </div>
    </div>
  );
}

export default Login;