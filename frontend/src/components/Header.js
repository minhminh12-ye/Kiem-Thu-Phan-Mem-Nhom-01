import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from '../AuthContext';
import { CartContext } from './users/CartContext';

function Header() {
    const {user, logout} = useContext(AuthContext)
    const { cart } = useContext(CartContext)
    const navigate = useNavigate();

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header
            style={{
                background: 'lightblue',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 20px',
                boxSizing: 'border-box',
                position: 'sticky',  // <-- sticky
                top: 0,              // dính top khi scroll
                zIndex: 1000,        // tránh bị che bởi content
            }}
        >
            <h1 style={{ margin: 0 }}>Đồ án chuyên ngành - Nhóm 7</h1>
            <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>Trang chủ</Link>
                <Link 
                    to="/cart" 
                    style={{ 
                        textDecoration: 'none', 
                        color: 'black',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}
                >
                    🛒 Giỏ hàng
                    {totalItems > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-12px',
                            backgroundColor: 'red',
                            color: 'white',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        }}>
                            {totalItems}
                        </span>
                    )}
                </Link>
                {user ? (
                    <div>
                        <span>Xin chào, {user.name}</span> |{' '}
                        <button onClick={handleLogout}>Đăng xuất</button>
                        {user.role === 'admin' && (
                            <>
                                {' | '}
                                <Link to="/admin" style={{ textDecoration: 'none', color: 'black' }}>Admin</Link>
                            </>
                        )}
                    </div>
                ) : (
                    <p>
                        <Link to="/login">Đăng nhập</Link> /{' '}
                        <Link to="/register">Đăng kí</Link>
                    </p>
                )}
            </nav>
        </header>
    );
}

export default Header;