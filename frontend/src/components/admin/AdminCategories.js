import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../AuthContext';

const CATEGORY_API = 'http://localhost:5000/category';
const BRAND_API = 'http://localhost:5000/brands';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('category'); // 'category' or 'brand'
  
  // Form states
  const [categoryForm, setCategoryForm] = useState({ id: '', name: '' });
  const [brandForm, setBrandForm] = useState({ id: '', name: '' });
  
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const { getAuthHeaders } = useContext(AuthContext) || {};

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders ? getAuthHeaders() : {};
      const [catRes, brandRes] = await Promise.all([
        axios.get(CATEGORY_API, { headers }),
        axios.get(BRAND_API, { headers })
      ]);
      setCategories(catRes.data);
      setBrands(brandRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      showMessage('Lỗi tải dữ liệu', 'error');
      setLoading(false);
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  // ===== CATEGORY HANDLERS =====
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      showMessage('Tên danh mục không được để trống', 'error');
      return;
    }

    try {
      const headers = getAuthHeaders ? getAuthHeaders() : {};
      if (categoryForm.id) {
        await axios.put(`${CATEGORY_API}/${categoryForm.id}`, 
          { category_name: categoryForm.name }, { headers });
        showMessage('Cập nhật danh mục thành công!');
      } else {
        await axios.post(CATEGORY_API, { category_name: categoryForm.name }, { headers });
        showMessage('Thêm danh mục thành công!');
      }
      setCategoryForm({ id: '', name: '' });
      fetchData();
    } catch (err) {
      showMessage(err.response?.data?.error || 'Lỗi xử lý danh mục', 'error');
    }
  };

  const handleCategoryEdit = (cat) => {
    setCategoryForm({ id: cat.id, name: cat.category_name });
  };

  const handleCategoryDelete = async (id, productCount) => {
    if (productCount > 0) {
      if (!window.confirm(`Danh mục này có ${productCount} sản phẩm. Bạn có chắc muốn xóa?`)) {
        return;
      }
    } else {
      if (!window.confirm('Bạn có chắc muốn xóa danh mục này?')) return;
    }

    try {
      const headers = getAuthHeaders ? getAuthHeaders() : {};
      await axios.delete(`${CATEGORY_API}/${id}`, { headers });
      showMessage('Xóa danh mục thành công!');
      fetchData();
    } catch (err) {
      showMessage(err.response?.data?.error || 'Lỗi xóa danh mục', 'error');
    }
  };

  // ===== BRAND HANDLERS =====
  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    if (!brandForm.name.trim()) {
      showMessage('Tên thương hiệu không được để trống', 'error');
      return;
    }

    try {
      const headers = getAuthHeaders ? getAuthHeaders() : {};
      if (brandForm.id) {
        await axios.put(`${BRAND_API}/${brandForm.id}`, 
          { brand_name: brandForm.name }, { headers });
        showMessage('Cập nhật thương hiệu thành công!');
      } else {
        await axios.post(BRAND_API, { brand_name: brandForm.name }, { headers });
        showMessage('Thêm thương hiệu thành công!');
      }
      setBrandForm({ id: '', name: '' });
      fetchData();
    } catch (err) {
      showMessage(err.response?.data?.error || 'Lỗi xử lý thương hiệu', 'error');
    }
  };

  const handleBrandEdit = (brand) => {
    setBrandForm({ id: brand.id, name: brand.brand_name });
  };

  const handleBrandDelete = async (id, productCount) => {
    if (productCount > 0) {
      if (!window.confirm(`Thương hiệu này có ${productCount} sản phẩm. Bạn có chắc muốn xóa?`)) {
        return;
      }
    } else {
      if (!window.confirm('Bạn có chắc muốn xóa thương hiệu này?')) return;
    }

    try {
      const headers = getAuthHeaders ? getAuthHeaders() : {};
      await axios.delete(`${BRAND_API}/${id}`, { headers });
      showMessage('Xóa thương hiệu thành công!');
      fetchData();
    } catch (err) {
      showMessage(err.response?.data?.error || 'Lỗi xóa thương hiệu', 'error');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📁 Quản lý Danh mục & Thương hiệu</h1>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('category')}
          style={{
            ...styles.tab,
            ...(activeTab === 'category' ? styles.activeTab : {})
          }}
        >
          Danh mục sản phẩm
        </button>
        <button
          onClick={() => setActiveTab('brand')}
          style={{
            ...styles.tab,
            ...(activeTab === 'brand' ? styles.activeTab : {})
          }}
        >
          Thương hiệu
        </button>
      </div>

      {message.text && (
        <div style={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
          {message.text}
        </div>
      )}

      {loading ? (
        <p style={{ color: '#007bff' }}>Đang tải dữ liệu...</p>
      ) : (
        <>
          {/* CATEGORY TAB */}
          {activeTab === 'category' && (
            <div style={styles.tabContent}>
              <div style={styles.formCard}>
                <h3>{categoryForm.id ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h3>
                <form onSubmit={handleCategorySubmit} style={styles.form}>
                  <input
                    type="text"
                    placeholder="Tên danh mục"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    style={styles.input}
                  />
                  <div style={styles.formActions}>
                    <button type="submit" style={styles.submitButton}>
                      {categoryForm.id ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                    {categoryForm.id && (
                      <button
                        type="button"
                        onClick={() => setCategoryForm({ id: '', name: '' })}
                        style={styles.cancelButton}
                      >
                        Hủy
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div style={styles.tableCard}>
                <h3>Danh sách danh mục ({categories.length})</h3>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>ID</th>
                      <th style={styles.th}>Tên danh mục</th>
                      <th style={styles.th}>Số sản phẩm</th>
                      <th style={styles.th}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(cat => (
                      <tr key={cat.id}>
                        <td style={styles.td}>{cat.id}</td>
                        <td style={styles.td}><strong>{cat.category_name}</strong></td>
                        <td style={styles.td}>
                          <span style={styles.badge}>{cat.product_count || 0}</span>
                        </td>
                        <td style={styles.tdActions}>
                          <button
                            onClick={() => handleCategoryEdit(cat)}
                            style={{ ...styles.actionButton, backgroundColor: '#ffc107' }}
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleCategoryDelete(cat.id, cat.product_count)}
                            style={{ ...styles.actionButton, backgroundColor: '#dc3545', marginLeft: '8px' }}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BRAND TAB */}
          {activeTab === 'brand' && (
            <div style={styles.tabContent}>
              <div style={styles.formCard}>
                <h3>{brandForm.id ? 'Sửa thương hiệu' : 'Thêm thương hiệu mới'}</h3>
                <form onSubmit={handleBrandSubmit} style={styles.form}>
                  <input
                    type="text"
                    placeholder="Tên thương hiệu"
                    value={brandForm.name}
                    onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                    style={styles.input}
                  />
                  <div style={styles.formActions}>
                    <button type="submit" style={styles.submitButton}>
                      {brandForm.id ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                    {brandForm.id && (
                      <button
                        type="button"
                        onClick={() => setBrandForm({ id: '', name: '' })}
                        style={styles.cancelButton}
                      >
                        Hủy
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div style={styles.tableCard}>
                <h3>Danh sách thương hiệu ({brands.length})</h3>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>ID</th>
                      <th style={styles.th}>Tên thương hiệu</th>
                      <th style={styles.th}>Số sản phẩm</th>
                      <th style={styles.th}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brands.map(brand => (
                      <tr key={brand.id}>
                        <td style={styles.td}>{brand.id}</td>
                        <td style={styles.td}><strong>{brand.brand_name}</strong></td>
                        <td style={styles.td}>
                          <span style={styles.badge}>{brand.product_count || 0}</span>
                        </td>
                        <td style={styles.tdActions}>
                          <button
                            onClick={() => handleBrandEdit(brand)}
                            style={{ ...styles.actionButton, backgroundColor: '#ffc107' }}
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleBrandDelete(brand.id, brand.product_count)}
                            style={{ ...styles.actionButton, backgroundColor: '#dc3545', marginLeft: '8px' }}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
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
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    borderBottom: '2px solid #e9ecef'
  },
  tab: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    color: '#666',
    transition: 'all 0.3s'
  },
  activeTab: {
    color: '#007bff',
    borderBottomColor: '#007bff'
  },
  tabContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formCard: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #ddd'
  },
  form: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginTop: '15px'
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    fontSize: '14px'
  },
  formActions: {
    display: 'flex',
    gap: '8px'
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  tableCard: {
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #ddd'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px'
  },
  th: {
    border: '1px solid #ddd',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '14px'
  },
  td: {
    border: '1px solid #ddd',
    padding: '12px',
    fontSize: '14px'
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
  badge: {
    display: 'inline-block',
    padding: '4px 10px',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  successMessage: {
    padding: '12px',
    backgroundColor: '#d4edda',
    border: '1px solid #c3e6cb',
    borderRadius: '4px',
    color: '#155724',
    marginBottom: '15px'
  },
  errorMessage: {
    padding: '12px',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '4px',
    color: '#721c24',
    marginBottom: '15px'
  }
};

export default CategoriesManagement;