import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../AuthContext';

const API_URL = 'http://localhost:5000/products';
const CATEGORY_API = 'http://localhost:5000/category';
const BRAND_API = 'http://localhost:5000/brands';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const { user, getAuthHeaders } = useContext(AuthContext) || {};

  // --- Fetch products ---
  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(API_URL, { headers: getAuthHeaders ? getAuthHeaders() : {} });
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Không thể tải dữ liệu sản phẩm');
      setLoading(false);
    }
  };

  // --- Fetch category + brand ---
  const fetchCategoryBrand = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        axios.get(CATEGORY_API, { headers: getAuthHeaders ? getAuthHeaders() : {} }),
        axios.get(BRAND_API, { headers: getAuthHeaders ? getAuthHeaders() : {} }),
      ]);
      setCategories(catRes.data);
      setBrands(brandRes.data);
    } catch (err) {
      console.error('Lỗi load category/brand', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategoryBrand();
  }, []);

  // Auto dismiss messages after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // --- Handle add/update ---
  const handleFormSubmit = async (formData) => {
    setError('');
    setSuccessMessage('');
    try {
      const dataToSend = {
        product_name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        specs: formData.specs,
        category_id: formData.category_id,
        brand_id: formData.brand_id,
        image_url: formData.image_url
      };

      if (formData.id) {
        await axios.put(`${API_URL}/${formData.id}`, dataToSend, { headers: getAuthHeaders ? getAuthHeaders() : {} });
        setSuccessMessage('Cập nhật sản phẩm thành công!');
      } else {
        await axios.post(API_URL, dataToSend, { headers: getAuthHeaders ? getAuthHeaders() : {} });
        setSuccessMessage('Thêm sản phẩm mới thành công!');
      }
      setFormState(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Lưu dữ liệu thất bại.');
    }
  };

  // --- Handle delete ---
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) return;
    setError('');
    setSuccessMessage('');
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders ? getAuthHeaders() : {} });
      setSuccessMessage('Xóa sản phẩm thành công!');
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Xóa thất bại');
    }
  };

  // --- Form component ---
  if (formState !== null) {
    return (
      <ProductForm
        product={formState}
        categories={categories}
        brands={brands}
        onSubmit={handleFormSubmit}
        onCancel={() => setFormState(null)}
      />
    );
  }

  // --- Main render ---
  return (
    <div style={styles.container}>
      <h1>Quản lý Sản phẩm 📦</h1>
      <button onClick={() => setFormState({})} style={styles.addButton}>+ Thêm Sản phẩm Mới</button>

      {loading && <p style={{ color: '#007bff' }}>Đang tải dữ liệu...</p>}
      {error && <p style={styles.errorText}>{error}</p>}
      {successMessage && <p style={styles.successText}>{successMessage}</p>}

      {!loading && products.length === 0 && <p>Không có sản phẩm nào được tìm thấy.</p>}

      {!loading && products.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Tên Sản phẩm</th>
              <th style={styles.th}>Danh mục</th>
              <th style={styles.th}>Thương hiệu</th>
              <th style={styles.th}>Giá (VNĐ)</th>
              <th style={styles.th}>Tồn kho</th>
              <th style={styles.th}>Specs</th>
              <th style={styles.th}>Ảnh</th>
              <th style={styles.th}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td style={styles.td}>{p.id}</td>
                <td style={styles.tdName}>{p.product_name}</td>
                <td style={styles.td}>{p.category_name}</td>
                <td style={styles.td}>{p.brand_name}</td>
                <td style={styles.tdPrice}>{(p.price * 1000).toLocaleString('vi-VN')}</td>
                <td style={styles.td}>{p.stock}</td>
                <td style={styles.td}>{typeof p.specs === 'string' ? p.specs : JSON.stringify(p.specs)}</td>
                <td style={styles.td}><img src={p.image_url} alt={p.product_name} style={{ width: '100px', height: 'auto' }} /></td>
                <td style={styles.tdActions}>
                  <button
                    onClick={() =>
                      setFormState({
                        id: p.id,
                        name: p.product_name,
                        price: p.price,
                        stock: p.stock,
                        specs: typeof p.specs === 'string' ? p.specs : JSON.stringify(p.specs),
                        category_id: p.category_id,
                        brand_id: p.brand_id,
                        image_url: p.image_url
                      })
                    }
                    style={{ ...styles.actionButton, backgroundColor: '#ffc107' }}
                  >
                    Sửa
                  </button>
                  <button onClick={() => handleDelete(p.id)} style={{ ...styles.actionButton, backgroundColor: '#dc3545', marginLeft: '10px' }}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// --- Form component with dropdowns ---
const ProductForm = ({ product = {}, categories, brands, onSubmit, onCancel }) => {
  const parseSpecs = (specsStr) => {
    if (!specsStr) return [{ key: '', value: '' }];
    try {
      const parsed = typeof specsStr === 'string' ? JSON.parse(specsStr) : specsStr;
      return typeof parsed === 'object' && !Array.isArray(parsed)
        ? Object.entries(parsed).map(([k, v]) => ({ key: k, value: v }))
        : [{ key: '', value: '' }];
    } catch {
      return [{ key: '', value: '' }];
    }
  };

  const [formData, setFormData] = useState({
    id: product.id ?? '',
    name: product.name ?? '',
    price: product.price ?? 0,
    stock: product.stock ?? 0,
    specs: parseSpecs(product.specs ?? ''),
    category_id: product.category_id ?? '',
    brand_id: product.brand_id ?? '',
    image_url: product.image_url ?? ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specs];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setFormData({ ...formData, specs: newSpecs });
  };

  const addSpec = () => {
    setFormData({ ...formData, specs: [...formData.specs, { key: '', value: '' }] });
  };

  const removeSpec = (index) => {
    setFormData({ ...formData, specs: formData.specs.filter((_, i) => i !== index) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Chuyển specs từ array về JSON object
    const specsObj = {};
    formData.specs.forEach(spec => {
      if (spec.key.trim()) {
        specsObj[spec.key] = spec.value;
      }
    });

    const submitData = {
      ...formData,
      specs: Object.keys(specsObj).length > 0 ? JSON.stringify(specsObj) : null
    };
    onSubmit(submitData);
  };

  return (
    <div style={styles.formContainer}>
      <h2>{product.id ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm Mới'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label>Tên Sản phẩm:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={styles.inputField} />
        </div>

        <div style={styles.formGroup}>
          <label>Danh mục:</label>
          <select name="category_id" value={formData.category_id} onChange={handleChange} style={styles.inputField} required>
            <option value="">-- Chọn danh mục --</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.category_name}</option>)}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label>Thương hiệu:</label>
          <select name="brand_id" value={formData.brand_id} onChange={handleChange} style={styles.inputField} required>
            <option value="">-- Chọn thương hiệu --</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.brand_name}</option>)}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label>Giá (VNĐ):</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" style={styles.inputField} />
        </div>

        <div style={styles.formGroup}>
          <label>Tồn kho:</label>
          <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" style={styles.inputField} />
        </div>

        <div style={styles.formGroup}>
          <label>Thông số kỹ thuật (Specs):</label>
          <div style={{ marginTop: '10px' }}>
            {formData.specs.map((spec, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Tên thông số (vd: Màu, Kích thước)"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                  style={{ ...styles.inputField, flex: 1, margin: 0 }}
                />
                <input
                  type="text"
                  placeholder="Giá trị (vd: Đen, 5 inch)"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                  style={{ ...styles.inputField, flex: 1.5, margin: 0 }}
                />
                <button
                  type="button"
                  onClick={() => removeSpec(index)}
                  style={{ ...styles.actionButton, backgroundColor: '#dc3545', padding: '8px 12px' }}
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addSpec}
            style={{ marginTop: '10px', padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            + Thêm thông số
          </button>
        </div>

        <div style={styles.formGroup}>
          <label>Ảnh (URL):</label>
          <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} style={styles.inputField} />
        </div>

        <div style={{ marginTop: '20px' }}>
          <button type="submit" style={{ ...styles.actionButton, backgroundColor: '#28a745' }}>Lưu</button>
          <button type="button" onClick={onCancel} style={{ ...styles.actionButton, backgroundColor: '#6c757d', marginLeft: '10px' }}>Hủy</button>
        </div>
      </form>
    </div>
  );
};

// --- Styles giữ nguyên ---
const styles = {
  container: { padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' },
  addButton: { padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', marginBottom: '20px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
  th: { border: '1px solid #ddd', padding: '12px', backgroundColor: '#f8f9fa', textAlign: 'left' },
  td: { border: '1px solid #ddd', padding: '12px', fontSize: '14px' },
  tdName: { border: '1px solid #ddd', padding: '12px', fontSize: '14px', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  tdPrice: { border: '1px solid #ddd', padding: '12px', fontSize: '14px', textAlign: 'right', whiteSpace: 'nowrap' },
  tdActions: { border: '1px solid #ddd', padding: '12px', textAlign: 'center', width: '150px' },
  actionButton: { padding: '8px 12px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' },
  errorText: { color: '#dc3545', padding: '10px', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px' },
  successText: { color: '#155724', padding: '10px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '4px' },
  formContainer: { padding: '30px', backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },
  formGroup: { marginBottom: '15px' },
  inputField: { width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px', boxSizing: 'border-box', marginTop: '5px' },
};

export default ProductManagement;
