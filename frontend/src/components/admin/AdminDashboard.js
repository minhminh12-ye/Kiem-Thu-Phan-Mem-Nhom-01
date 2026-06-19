import React, {useState, useEffect} from 'react';

const AdminDashboard = () => {

    const [stats, setStats] = useState({
        users: 0,
        products: 0,
        sales: ""
    });

    useEffect(() => {
        fetch('http://localhost:5000/api/stats')
            .then(res => res.json())
            .then(data => setStats(
                {
                    users: data.total_users,
                    products: data.total_products,
                    sales: data.total_sales || "N/A"
                }
            ))
            .catch(err => console.error('Lỗi khi lấy dữ liệu thống kê:', err));
    }, []);
    return (
        <div style={styles.welcomeBox}>
            <h1 style={styles.title}>Tổng quan</h1>
            <p style={styles.description}>  
                Chọn chức năng từ menu bên trái để bắt đầu quản lý hệ thống.
            </p>
            <div style={styles.statsContainer}>
                <div style={styles.statCard}>
                    <h2>👥 Tài khoản</h2>
                    <p style={styles.statNumber}>{stats.users}</p>
                </div>
                <div style={styles.statCard}>
                    <h2>💻 Sản phẩm</h2>
                    <p style={styles.statNumber}>{stats.products}</p>
                </div>
                <div style={styles.statCard}>
                    <h2>Doanh thu</h2>
                    <p style={styles.statNumber}>{(stats.sales * 1000).toLocaleString('vi-VN')}đ</p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    welcomeBox: { 
        background: '#fff', 
        padding: '40px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
    },
    title: { 
        color: '#2c3e50', 
        marginBottom: '15px' 
    },
    description: { 
        color: '#7f8c8d', 
        fontSize: '16px',
        marginBottom: '30px'
    },
    statsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '30px'
    },
    statCard: {
        background: '#ecf0f5',
        padding: '25px',
        borderRadius: '8px',
        textAlign: 'center',
        border: '2px solid #3498db'
    },
    statNumber: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#3498db',
        margin: '10px 0 0 0'
    }
};

export default AdminDashboard;