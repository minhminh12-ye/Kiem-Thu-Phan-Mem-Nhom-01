import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from '../../AuthContext';

export const CartContext = createContext();

const API_URL = "http://localhost:5000/cart";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { user, getAuthHeaders } = useContext(AuthContext) || {};

  // Get current user id (prefer AuthContext, fallback to localStorage)
  const getUserId = () => {
    if (user && user.id) return user.id;
    try {
      const userData = JSON.parse(localStorage.getItem("user")) || {};
      return userData.id;
    } catch {
      return null;
    }
  };

  // Fetch giỏ hàng từ API
  const fetchCart = async () => {
    setLoading(true);
    setError("");
    try {
      const userId = getUserId();
      if (!userId) return;

      const headers = getAuthHeaders ? getAuthHeaders() : {};
      const response = await fetch(`${API_URL}?user_id=${userId}`, { headers });
      const data = await response.json();
      setCart(data.items || []);
    } catch (err) {
      console.error("Lỗi load giỏ hàng:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load/reload giỏ hàng when authenticated user changes
  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      fetchCart();
    } else {
      // nếu logout hoặc không có user, xóa giỏ hàng local
      setCart([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Thêm sản phẩm vào giỏ
  const addToCart = async (product) => {
    try {
      setError("");
      const userId = getUserId();
      console.log("🛒 Thêm vào giỏ - userId:", userId, "productId:", product.id);
      
      if (!userId) {
        setError("Vui lòng đăng nhập");
        return;
      }

      const headers = { "Content-Type": "application/json", ...(getAuthHeaders ? getAuthHeaders() : {}) };
      const response = await fetch(`${API_URL}/add`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          user_id: userId,
          product_id: product.id,
          quantity: 1,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Lỗi thêm vào giỏ");
        return;
      }

      setSuccess("Thêm vào giỏ hàng thành công!");
      // Refresh giỏ hàng
      await fetchCart();
    } catch (err) {
      console.error("Lỗi addToCart:", err);
      setError(err.message);
    }
  };

  // Xóa sản phẩm
  const removeFromCart = async (cartItemId) => {
    try {
      setError("");
      const headers = getAuthHeaders ? getAuthHeaders() : {};
      const response = await fetch(`${API_URL}/item/${cartItemId}`, {
        method: "DELETE",
        headers,
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Lỗi xóa sản phẩm");
        return;
      }

      setCart((prev) => prev.filter((item) => item.id !== cartItemId));
      setSuccess("Xóa sản phẩm khỏi giỏ thành công!");
    } catch (err) {
      console.error("Lỗi removeFromCart:", err);
      setError(err.message);
    }
  };

  // Cập nhật số lượng sản phẩm
  const updateQuantity = async (cartItemId, quantity) => {
    try {
      setError("");
      if (quantity <= 0) {
        await removeFromCart(cartItemId);
        return;
      }

      const headers = { "Content-Type": "application/json", ...(getAuthHeaders ? getAuthHeaders() : {}) };
      const response = await fetch(`${API_URL}/item/${cartItemId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Lỗi cập nhật số lượng");
        return;
      }

      // Refresh giỏ hàng
      await fetchCart();
    } catch (err) {
      console.error("Lỗi updateQuantity:", err);
      setError(err.message);
    }
  };

  // Xóa toàn bộ giỏ
  const clearCart = async () => {
    try {
      setError("");
      const userId = getUserId();
      if (!userId) return;

      const headers = getAuthHeaders ? getAuthHeaders() : {};
      const response = await fetch(`${API_URL}?user_id=${userId}`, {
        method: "DELETE",
        headers,
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Lỗi xóa giỏ");
        return;
      }

      setCart([]);
      setSuccess("Xóa toàn bộ giỏ hàng thành công!");
    } catch (err) {
      console.error("Lỗi clearCart:", err);
      setError(err.message);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, loading, error, success, setSuccess, setError }}>
      {children}
    </CartContext.Provider>
  );
}
