import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: username,
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Đăng ký thất bại");
        return;
      }

      alert("Đăng ký thành công!");
      navigate("/login");

    } catch (err) {
      setError("Lỗi kết nối server!");
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
          userSelect: 'none',
        }}
      >
        ĐĂNG KÝ
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
          Tên đăng nhập
        </label>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          Email
        </label>
        <input
          type="email"
          placeholder="Email"
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
            marginBottom: 20,
            borderRadius: 5,
            border: '1px solid #ccc',
            fontSize: 16,
          }}
        />

        <label style={{ marginBottom: 8, fontWeight: '600' }}>
          Xác nhận mật khẩu
        </label>
        <input
          type="password"
          placeholder="Nhập lại mật khẩu"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
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
            backgroundColor: '#007BFF',
            color: '#fff',
            padding: '12px 0',
            border: 'none',
            borderRadius: 6,
            fontSize: 18,
            cursor: 'pointer',
          }}
        >
          Đăng ký
        </button>
      </form>

      <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center', fontSize: 14 }}>
        Đã có tài khoản?{' '}
        <span
          onClick={() => navigate('/login')}
          style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Đăng nhập
        </span>
      </div>
    </div>
  );
}

export default Register;
