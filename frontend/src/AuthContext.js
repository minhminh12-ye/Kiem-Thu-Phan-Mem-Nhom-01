import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const normalizeUser = (userData) => {
  if (!userData) return null;

  const roleValue = typeof userData.role === 'string' ? userData.role.toLowerCase() : '';
  const isAdmin = Boolean(
    userData.isAdmin ||
    userData.roleId === 1 ||
    roleValue === 'admin' ||
    roleValue === 'administrator'
  );

  return {
    ...userData,
    role: isAdmin ? 'admin' : (roleValue || 'customer'),
    roleId: userData.roleId ?? (isAdmin ? 1 : 2),
    isAdmin
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(normalizeUser(JSON.parse(storedUser)));
      }
    } catch (err) {
      console.error('Auth load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    const normalizedUser = normalizeUser(userData);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    setUser(normalizedUser);
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