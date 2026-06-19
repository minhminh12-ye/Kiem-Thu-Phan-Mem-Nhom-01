import React from 'react';
import { Link } from 'react-router-dom';

const AccessDenied = () => {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>🚫 ACCESS DENIED 🚫</h1>
            <h2>Bạn không có quyền truy cập trang này.</h2>
            <p>Vui lòng đăng nhập bằng tài khoản Admin để tiếp tục.</p>
            <Link to="/login">Quay lại Trang Đăng nhập</Link>
        </div>
    );
};

export default AccessDenied;