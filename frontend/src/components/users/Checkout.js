import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { CartContext } from "./CartContext";

export default function Checkout() {
  const { user } = useContext(AuthContext);
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  // Tính tổng tiền
  const totalPrice = cart?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const totalQuantity = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const submitOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage("Bạn phải đăng nhập mới đặt được hàng.");
      setMessageType("error");
      return;
    }

    if (!cart || cart.length === 0) {
      setMessage("Giỏ hàng rỗng, không thể thanh toán.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          payment_method: paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Lỗi server");

      // Xóa giỏ hàng sau khi tạo đơn thành công
      clearCart();

      setMessage(`🎉 Đặt hàng thành công! Mã đơn hàng: #${data.order_id}`);
      setMessageType("success");

      // Chuyển về trang chủ sau 3 giây
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      setMessage("❌ Không thể tạo đơn hàng: " + err.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <h2>🔒 Vui lòng đăng nhập để đặt hàng</h2>
          <button onClick={() => navigate("/login")} style={styles.loginButton}>
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <h2>🛒 Giỏ hàng của bạn đang trống</h2>
          <button onClick={() => navigate("/")} style={styles.backButton}>
            ← Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Thanh toán đơn hàng</h1>

      <div style={styles.layout}>
        {/* Left: Form thanh toán */}
        <div style={styles.formSection}>
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Thông tin khách hàng</h3>
            <div style={styles.customerInfo}>
              <p><strong>Họ tên:</strong> {user.name || user.email}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Chi tiết đơn hàng</h3>
            <div style={styles.orderItems}>
              {cart.map((item) => (
                <div key={item.product_id || item.id} style={styles.orderItem}>
                  <img
                    src={item.image || item.image_url || "https://picsum.photos/seed/fallback/80/80"}
                    alt={item.product_name}
                    style={styles.itemImage}
                  />
                  <div style={styles.itemDetails}>
                    <h4 style={styles.itemName}>{item.product_name}</h4>
                    <p style={styles.itemPrice}>
                      {(item.price || 0).toLocaleString('vi-VN')}đ × {item.quantity}
                    </p>
                  </div>
                  <div style={styles.itemTotal}>
                    {((item.price || 0) * item.quantity).toLocaleString('vi-VN')}đ
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={submitOrder} style={styles.card}>
            <h3 style={styles.sectionTitle}>Phương thức thanh toán</h3>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
                style={styles.radio}
              />
              <div>
                <strong>💵 Thanh toán khi nhận hàng (COD)</strong>
                <p style={styles.radioDescription}>Thanh toán bằng tiền mặt khi nhận hàng</p>
              </div>
            </label>

            <button type="submit" disabled={loading} style={styles.submitButton}>
              {loading ? "Đang xử lý..." : `Đặt hàng (${totalPrice.toLocaleString('vi-VN')}đ)`}
            </button>
          </form>

          {message && (
            <div style={messageType === "success" ? styles.successMessage : styles.errorMessage}>
              {message}
            </div>
          )}
        </div>

        {/* Right: Tóm tắt đơn hàng */}
        <div style={styles.summarySection}>
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>Tóm tắt đơn hàng</h3>
            
            <div style={styles.summaryRow}>
              <span>Tổng sản phẩm:</span>
              <strong>{totalQuantity}</strong>
            </div>
            
            <div style={styles.summaryRow}>
              <span>Tạm tính:</span>
              <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
            </div>
            
            <div style={styles.summaryRow}>
              <span>Phí vận chuyển:</span>
              <span style={{ color: '#28a745' }}>Miễn phí</span>
            </div>

            <hr style={styles.divider} />

            <div style={{ ...styles.summaryRow, fontSize: 18, fontWeight: 'bold' }}>
              <span>Tổng cộng:</span>
              <span style={{ color: '#dc3545' }}>{totalPrice.toLocaleString('vi-VN')}đ</span>
            </div>

            <button onClick={() => navigate("/cart")} style={styles.backToCartButton}>
              ← Quay lại giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 1200,
    margin: "40px auto",
    padding: "0 20px",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  layout: {
    display: "flex",
    gap: 30,
    alignItems: "flex-start",
  },
  formSection: {
    flex: 2,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  summarySection: {
    flex: 1,
  },
  card: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    border: "1px solid #ddd",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  summaryCard: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    border: "1px solid #ddd",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    position: "sticky",
    top: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
  },
  customerInfo: {
    fontSize: 15,
    lineHeight: 1.8,
    color: "#555",
  },
  orderItems: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  orderItem: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    objectFit: "cover",
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "500",
    margin: 0,
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: "#666",
    margin: 0,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  radioLabel: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: 15,
    border: "2px solid #ddd",
    borderRadius: 8,
    cursor: "pointer",
    transition: "all 0.2s",
    marginBottom: 15,
  },
  radio: {
    marginTop: 3,
    cursor: "pointer",
  },
  radioDescription: {
    fontSize: 13,
    color: "#666",
    margin: "5px 0 0 0",
  },
  submitButton: {
    width: "100%",
    padding: "14px 0",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 12,
    fontSize: 15,
  },
  divider: {
    border: "none",
    borderTop: "1px solid #ddd",
    margin: "15px 0",
  },
  backToCartButton: {
    width: "100%",
    padding: "12px 0",
    marginTop: 20,
    backgroundColor: "#f8f9fa",
    color: "#333",
    border: "1px solid #ddd",
    borderRadius: 8,
    fontSize: 15,
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  successMessage: {
    padding: 15,
    backgroundColor: "#d4edda",
    border: "1px solid #c3e6cb",
    borderRadius: 8,
    color: "#155724",
    fontSize: 15,
  },
  errorMessage: {
    padding: 15,
    backgroundColor: "#f8d7da",
    border: "1px solid #f5c6cb",
    borderRadius: 8,
    color: "#721c24",
    fontSize: 15,
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
  },
  loginButton: {
    marginTop: 20,
    padding: "12px 30px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    cursor: "pointer",
  },
  backButton: {
    marginTop: 20,
    padding: "12px 30px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    cursor: "pointer",
  },
};

