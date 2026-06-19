import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // check khi mount

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false); // xong bước check
  }, []);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const getAuthHeaders = () => {
    try {
      const stored = localStorage.getItem('user');
      const parsed = stored ? JSON.parse(stored) : null;
      const token = parsed?.token;
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch (err) {
      return {};
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, getAuthHeaders, loading }}>
      {children}
    </AuthContext.Provider>
  );
}