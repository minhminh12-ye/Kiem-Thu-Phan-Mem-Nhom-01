import React, { useContext } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';

const Admin = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const adminName = user ? user.name || user.email : 'Admin';

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
                <h2 style={styles.logo}>Laptop Admin</h2>
                <nav style={styles.nav}>
                    <NavLink 
                        to="/admin/dashboard" 
                        style={({ isActive }) => ({
                            ...styles.navLink,
                            backgroundColor: isActive ? '#34495e' : 'transparent'
                        })}
                    >
                        📊 Dashboard
                    </NavLink>
                    <NavLink 
                        to="/admin/users" 
                        style={({ isActive }) => ({
                            ...styles.navLink,
                            backgroundColor: isActive ? '#34495e' : 'transparent'
                        })}
                    >
                        👥 Quản lý Tài khoản
                    </NavLink>
                    <NavLink 
                        to="/admin/products" 
                        style={({ isActive }) => ({
                            ...styles.navLink,
                            backgroundColor: isActive ? '#34495e' : 'transparent'
                        })}
                    >
                        💻 Quản lý Sản phẩm
                    </NavLink>
                    <NavLink 
                        to="/admin/category" 
                        style={({ isActive }) => ({
                            ...styles.navLink,
                            backgroundColor: isActive ? '#34495e' : 'transparent'
                        })}
                    >
                        📂 Quản lý danh mục, thương hiệu
                    </NavLink>
                    <NavLink
                        to="/admin/sales"
                        style={({ isActive }) => ({
                            ...styles.navLink,
                            backgroundColor: isActive ? '#34495e' : 'transparent'
                        })}
                    >
                        $$ Quản lý doanh thu $$
                    </NavLink>
                    <button
                        type="button"
                        style={styles.logoutBtn}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#c0392b'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#e74c3c'}
                        onClick={(e) => {
                            e.preventDefault();
                            logout();
                            navigate('/login', { replace: true });
                        }}
                    >
                        🚪 Đăng xuất
                    </button>
                </nav>
            </div>

            {/* Content Area */}
            <div style={styles.content}>
                <header style={styles.header}>
                    <h1 style={styles.headerTitle}>Chào mừng đến với trang quản trị, {adminName}!</h1>
                </header>
                
                <main style={styles.main}>
                    {/* Outlet sẽ render các component con */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#ecf0f5' },
    sidebar: { 
        width: '250px', 
        backgroundColor: '#2c3e50', 
        color: 'white', 
        position: 'fixed', 
        height: '100%', 
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto'
    },
    logo: { 
        textAlign: 'center', 
        padding: '20px 0', 
        borderBottom: '1px solid #34495e', 
        margin: 0, 
        fontSize: '24px' 
    },
    nav: { paddingTop: '10px' },
    navLink: { 
        padding: '15px 20px', 
        textDecoration: 'none', 
        color: '#bdc3c7', 
        display: 'block', 
        transition: 'background-color 0.3s',
        borderLeft: '3px solid transparent'
    },
    logoutBtn: { 
        padding: '15px 20px', 
        textDecoration: 'none', 
        color: 'white', 
        display: 'block', 
        backgroundColor: '#e74c3c', 
        marginTop: '20px', 
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'background-color 0.3s'
    },
    content: { marginLeft: '250px', flexGrow: 1, padding: '20px' },
    header: { 
        padding: '15px 20px', 
        borderBottom: '1px solid #ccc', 
        marginBottom: '20px', 
        backgroundColor: 'white', 
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    headerTitle: { margin: 0, color: '#333' },
    main: { padding: '10px' }
};

export default Admin;