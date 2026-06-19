import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './components/users/CartContext';
import Header from './components/Header';
import UserProductPage from './components/users/UserProductPage';
import Cart from './components/users/Cart';
import Checkout from './components/users/Checkout';
import Login from './Login';
import Register from './Register';

// Admin components
import AdminRoute from './components/admin/AdminRoute';
import Admin from './components/admin/Admin';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import ProductManagement from './components/admin/ProductManagement';
import AccessDenied from './components/admin/AccessDenied';
import CategoiesManagement from './components/admin/AdminCategories';
import SalesManagement from './components/admin/SalesManagement';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="app-root">
            <Header />
            <main style={{ minHeight: '70vh' }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<UserProductPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/access-denied" element={<AccessDenied />} />

              {/* Admin Protected Routes */}
              <Route path="/admin" element={<AdminRoute />}>
                {/* Admin.js là layout wrapper chứa sidebar */}
                <Route element={<Admin />}>
                  {/* Redirect /admin -> /admin/dashboard */}
                  <Route index element={<Navigate to="dashboard" replace />} />
                  
                  {/* Dashboard - trang chào mừng */}
                  <Route path="dashboard" element={<AdminDashboard />} />
                  
                  {/* Các trang quản lý */}
                  <Route path="users" element={<UserManagement />} />
                  <Route path="products" element={<ProductManagement />} />
                  <Route path="category" element={<CategoiesManagement />} />
                  <Route path="sales" element={<SalesManagement />} />
                  
                </Route>
              </Route>
            </Routes>
          </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;