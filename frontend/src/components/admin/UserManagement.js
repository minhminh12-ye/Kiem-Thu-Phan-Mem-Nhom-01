import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/users'; // ✅ Sửa đường dẫn

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formState, setFormState] = useState(null); 
    const [successMessage, setSuccessMessage] = useState('');

    // --- 1. Lấy dữ liệu người dùng ---
    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(API_URL);
            setUsers(response.data.users || response.data);
            setLoading(false);
        } catch (err) {
            console.error('Lỗi khi lấy dữ liệu:', err);
            setError('Không thể tải dữ liệu người dùng. Vui lòng kiểm tra Server.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // --- 2. Xử lý Thêm/Sửa ---
    const handleFormSubmit = async (formData) => {
    setError('');
    setSuccessMessage('');

    try {
        if (formData.user_id) {
            const response = await axios.put(`${API_URL}/${formData.user_id}`, formData);
            if (!response.data.success) throw new Error(response.data.error);
            setSuccessMessage('Cập nhật người dùng thành công!');
        } else {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                user_name: formData.user_name,
                email: formData.email,
                password: formData.password,
                roleid: formData.roleid
            });
            if (response.status !== 201) throw new Error(response.data.error || 'Thêm người dùng thất bại');
            setSuccessMessage('Thêm người dùng mới thành công!');
        }
        setFormState(null);
        fetchUsers();
    } catch (err) {
        // Ném lỗi lên child form để hiển thị ngay dưới input
        const message = err.response?.data?.error || err.response?.data?.message || err.message || 'Lỗi khi lưu dữ liệu';
        setError(''); // reset parent error
        throw new Error(message); // ✅ ném lên UserForm
    }
};


    // --- 3. Xử lý Xóa ---
    const handleDelete = async (userId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
            setError('');
            setSuccessMessage('');
            try {
                await axios.delete(`${API_URL}/${userId}`);
                setSuccessMessage('Xóa người dùng thành công!');
                fetchUsers();
            } catch (err) {
                console.error('Lỗi khi xóa dữ liệu:', err);
                setError(err.response?.data?.error || 'Xóa dữ liệu thất bại.');
            }
        }
    };

    // --- 4. Render Form ---
    if (formState !== null) {
        return (
            <UserForm 
                user={formState} 
                onSubmit={handleFormSubmit} 
                onCancel={() => setFormState(null)} 
            />
        );
    }
    
    // --- 5. Render Giao diện chính ---
    return (
        <div style={styles.container}>
            <h1>Quản lý Người dùng 👥</h1>
            
            <button 
                onClick={() => setFormState({})} 
                style={styles.addButton}
            >
                + Thêm Người dùng Mới
            </button>

            {loading && <p style={{ color: '#007bff' }}>Đang tải dữ liệu...</p>}
            {error && <p style={styles.errorText}>{error}</p>}
            {successMessage && <p style={styles.successText}>{successMessage}</p>}

            {!loading && users.length === 0 && <p>Không có người dùng nào được tìm thấy.</p>}

            {!loading && users.length > 0 && (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Tên</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Vai trò</th>
                            <th style={styles.th}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.user_id}>
                                <td style={styles.td}>{user.user_id}</td>
                                <td style={styles.td}>{user.user_name}</td>
                                <td style={styles.td}>{user.email}</td>
                                <td style={styles.td}>
                                    <span style={{
                                        ...styles.roleBadge,
                                        backgroundColor: user.role_name === 'admin' ? '#e74c3c' : '#3498db'
                                    }}>
                                        {user.role_name.toUpperCase()}
                                    </span>
                                </td>
                                <td style={styles.tdActions}>
                                    <button 
                                        onClick={() => setFormState(user)} 
                                        style={{...styles.actionButton, backgroundColor: '#ffc107'}}
                                    >
                                        Sửa
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user.user_id)} 
                                        style={{...styles.actionButton, backgroundColor: '#dc3545', marginLeft: '10px'}}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

// --- Component Form ---
const UserForm = ({ user, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        user_id: user.user_id || '',
        user_name: user.user_name || '',
        email: user.email || '',
        password: '',
        roleid: user.roleid || 2,
    });

    const [formError, setFormError] = useState('');

    const handleChange = (e) => {
        const value = e.target.name === 'roleid' ? parseInt(e.target.value) : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
        if (e.target.name === 'email') setFormError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = { ...formData };
        if (dataToSend.user_id && !dataToSend.password) {
            delete dataToSend.password;
        }
        try {
            await onSubmit(dataToSend);
        }
        catch (err) {
            setFormError(err.response?.data?.error || err.message || 'Lỗi khi gửi dữ liệu.');
        }
        
    };

    return (
        <div style={styles.formContainer}>
            <h2>{user.user_id ? 'Sửa Người dùng' : 'Thêm Người dùng Mới'}</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label>Tên:</label>
                    <input 
                        type="text" 
                        name="user_name" 
                        value={formData.user_name} 
                        onChange={handleChange} 
                        required 
                        style={styles.inputField} 
                    />
                </div>
                <div style={styles.formGroup}>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        style={{...styles.inputField, borderColor: formError ? '#dc3545' : '#ced4da'}} 
                    />
                    {formError && <p style={{ color: '#dc3545', marginTop: '5px' }}>{formError}</p>}
                </div>
                <div style={styles.formGroup}>
                    <label>Mật khẩu {user.user_id ? '(Để trống nếu không thay đổi)' : '*'}:</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required={!user.user_id} 
                        style={styles.inputField} 
                    />
                </div>
                <div style={styles.formGroup}>
                    <label>Vai trò:</label>
                    <select name="roleid" value={formData.roleid} onChange={handleChange} style={styles.inputField}>
                        <option value={2}>User</option>
                        <option value={1}>Admin</option>
                    </select>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <button type="submit" style={{...styles.actionButton, backgroundColor: '#28a745'}}>
                        Lưu
                    </button>
                    <button 
                        type="button" 
                        onClick={onCancel} 
                        style={{...styles.actionButton, backgroundColor: '#6c757d', marginLeft: '10px'}}
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
};

const styles = {
    container: { padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)' },
    addButton: { padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', marginBottom: '20px', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
    th: { border: '1px solid #ddd', padding: '12px', backgroundColor: '#f8f9fa', textAlign: 'left' },
    td: { border: '1px solid #ddd', padding: '12px', fontSize: '14px' },
    tdActions: { border: '1px solid #ddd', padding: '12px', textAlign: 'center' },
    actionButton: { padding: '8px 12px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' },
    errorText: { color: '#dc3545', padding: '10px', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px' },
    successText: { color: '#155724', padding: '10px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '4px' },
    formContainer: { padding: '30px', backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' },
    formGroup: { marginBottom: '15px' },
    inputField: { width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px', boxSizing: 'border-box', marginTop: '5px' },
    roleBadge: {
        padding: '5px 12px',
        borderRadius: '15px',
        color: 'white',
        fontSize: '12px',
        fontWeight: '600',
        display: 'inline-block'
    }
};

export default UserManagement;