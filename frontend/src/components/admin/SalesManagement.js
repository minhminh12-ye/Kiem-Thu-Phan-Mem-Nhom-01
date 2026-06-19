import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../AuthContext';

const API_URL = 'http://localhost:5000/api/orders';

const SalesManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  const { getAuthHeaders } = useContext(AuthContext) || {};

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const headers = getAuthHeaders ? getAuthHeaders() : {};
      const response = await axios.get(API_URL, { headers });
      const orderData = response.data;
      
      setOrders(orderData);
      
      // Tính toán thống kê (loại trừ đơn hàng đã hủy)
      const totalRevenue = orderData
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, order) => sum + (order.total_price || 0), 0);
      const totalOrders = orderData.length;
      const pendingOrders = orderData.filter(o => o.status === 'pending').length;
      const completedOrders = orderData.filter(o => o.status === 'completed').length;
      
      setStats({ totalRevenue, totalOrders, pendingOrders, completedOrders });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Không thể tải dữ liệu đơn hàng');
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const headers = getAuthHeaders ? getAuthHeaders() : {};
      await axios.put(`${API_URL}/${orderId}/status`, { status: newStatus }, { headers });
      fetchOrders(); // Refresh danh sách
    } catch (err) {
      console.error(err);
      alert('Lỗi cập nhật trạng thái đơn hàng');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN');
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { text: 'Chờ xử lý', color: '#ffc107', bgColor: '#fff3cd' },
      processing: { text: 'Đang xử lý', color: '#0dcaf0', bgColor: '#cff4fc' },
      completed: { text: 'Hoàn thành', color: '#28a745', bgColor: '#d4edda' },
      cancelled: { text: 'Đã hủy', color: '#dc3545', bgColor: '#f8d7da' }
    };
    
    const statusInfo = statusMap[status] || statusMap.pending;
    
    return (
      <span style={{
        padding: '5px 12px',
        borderRadius: '12px',
        fontSize: '13px',
        fontWeight: '600',
        color: statusInfo.color,
        backgroundColor: statusInfo.bgColor,
        border: `1px solid ${statusInfo.color}`
      }}>
        {statusInfo.text}
      </span>
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💰 Quản lý Doanh thu & Đơn hàng</h1>

      {/* Thống kê tổng quan */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💵</div>
          <div>
            <div style={styles.statLabel}>Tổng doanh thu</div>
            <div style={styles.statValue}>{(stats.totalRevenue * 1000).toLocaleString('vi-VN')}đ</div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📦</div>
          <div>
            <div style={styles.statLabel}>Tổng đơn hàng</div>
            <div style={styles.statValue}>{stats.totalOrders}</div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⏳</div>
          <div>
            <div style={styles.statLabel}>Chờ xử lý</div>
            <div style={styles.statValue}>{stats.pendingOrders}</div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>✅</div>
          <div>
            <div style={styles.statLabel}>Hoàn thành</div>
            <div style={styles.statValue}>{stats.completedOrders}</div>
          </div>
        </div>
      </div>

      {loading && <p style={{ color: '#007bff', marginTop: 20 }}>Đang tải dữ liệu...</p>}
      {error && <p style={styles.errorText}>{error}</p>}

      {/* Bảng danh sách đơn hàng */}
      {!loading && orders.length === 0 && <p style={{ marginTop: 20 }}>Chưa có đơn hàng nào.</p>}

      {!loading && orders.length > 0 && (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Mã đơn</th>
                <th style={styles.th}>Khách hàng</th>
                <th style={styles.th}>Tổng tiền</th>
                <th style={styles.th}>Thanh toán</th>
                <th style={styles.th}>Trạng thái</th>
                <th style={styles.th}>Ngày đặt</th>
                <th style={styles.th}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} style={styles.tr}>
                  <td style={styles.td}>#{order.id}</td>
                  <td style={styles.td}>{order.user_name || order.user_email || `User #${order.user_id}`}</td>
                  <td style={styles.tdPrice}>{(order.total_price * 1000 || 0).toLocaleString('vi-VN')}đ</td>
                  <td style={styles.td}>{order.payment_method === 'COD' ? 'COD' : order.payment_method}</td>
                  <td style={styles.td}>{getStatusBadge(order.status)}</td>
                  <td style={styles.td}>{formatDate(order.created_at)}</td>
                  <td style={styles.tdActions}>
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'processing')}
                          style={{ ...styles.actionButton, backgroundColor: '#0dcaf0' }}
                        >
                          Xử lý
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          style={{ ...styles.actionButton, backgroundColor: '#dc3545', marginLeft: '5px' }}
                        >
                          Hủy
                        </button>
                      </>
                    )}
                    {order.status === 'processing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        style={{ ...styles.actionButton, backgroundColor: '#28a745' }}
                      >
                        Hoàn thành
                      </button>
                    )}
                    {(order.status === 'completed' || order.status === 'cancelled') && (
                      <span style={{ color: '#999', fontSize: 13 }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.05)'
  },
  title: {
    fontWeight: 'bold',
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    border: '2px solid #e9ecef'
  },
  statIcon: {
    fontSize: '36px'
  },
  statLabel: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '5px'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333'
  },
  tableContainer: {
    marginTop: '20px',
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  },
  th: {
    border: '1px solid #ddd',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '14px'
  },
  tr: {
    transition: 'background-color 0.2s'
  },
  td: {
    border: '1px solid #ddd',
    padding: '12px',
    fontSize: '14px'
  },
  tdPrice: {
    border: '1px solid #ddd',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#28a745'
  },
  tdActions: {
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'center'
  },
  actionButton: {
    padding: '6px 12px',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500'
  },
  errorText: {
    color: '#dc3545',
    padding: '10px',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '4px'
  }
};

export default SalesManagement;
