import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./CartContext";

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Tăng số lượng
  const increaseQty = (id) => {
    const item = cart.find(p => p.id === id);
    if (item) {
      updateQuantity(id, item.quantity + 1);
    }
  };

  // Giảm số lượng
  const decreaseQty = (id) => {
    const item = cart.find(p => p.id === id);
    if (item) {
      updateQuantity(id, item.quantity - 1);
    }
  };

  // Xóa sp khỏi giỏ
  const removeItem = (id) => {
    removeFromCart(id);
  };

  // Tính tổng tiền
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  // Tính tổng số lượng
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Nếu giỏ hàng trống
  if (cart.length === 0)
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <h2>Giỏ hàng của bạn đang trống</h2>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            backgroundColor: "#007bff",
            border: "none",
            borderRadius: 8,
            color: "white",
            cursor: "pointer",
          }}
        >
          ← Quay lại mua sắm
        </button>
      </div>
    );

  return (
    <div style={{ margin: "50px auto", maxWidth: 1100 }}>
      <h2 style={{ fontWeight: "bold", marginBottom: 20 }}>Giỏ hàng của bạn</h2>

      <div style={{ display: "flex", gap: 20 }}>
        {/* ds sp */}
        <div style={{ flex: 2 }}>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                padding: 15,
                marginBottom: 15,
                borderRadius: 12,
                border: "1px solid #ddd",
                background: "#fff",
              }}
            >
              {/* Hình */}
              <img
                src={item.image || item.image_url || "https://picsum.photos/seed/fallback/600/400"}                alt={item.product_name}
                style={{ width: 120, height: 120, borderRadius: 8, objectFit: 'cover' }}
              />

              {/*nd*/}
              <div style={{ marginLeft: 20, flex: 1 }}>
                <h4 style={{ margin: "0 0 10px" }}>{item.product_name}</h4>

                <p style={{ fontSize: 15, fontWeight: 600 }}>
                  {(item.price || 0).toLocaleString('vi-VN')} đ
                </p>

                {/* Tăng giảm sl */}
                <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
                  <button
                    onClick={() => decreaseQty(item.id)}
                    style={qtyBtn}
                  >
                    -
                  </button>

                  <span style={{ margin: "0 12px", fontSize: 16 }}>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => increaseQty(item.id)}
                    style={qtyBtn}
                  >
                    +
                  </button>
                </div>

                {/* Xóa */}
                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    marginTop: 10,
                    color: "red",
                    fontSize: 14,
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                  }}
                >
                  Xóa sản phẩm
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Tổng tiền */}
        <div
          style={{
            flex: 1,
            border: "1px solid #ddd",
            padding: 20,
            height: "fit-content",
            borderRadius: 12,
            background: "#fff",
          }}
        >
          <h3 style={{ marginBottom: 20 }}>Tổng thanh toán</h3>
          
          <p style={priceRow}>
            Tổng sản phẩm:
            <span>{totalQuantity}</span>
          </p>
          
          <p style={priceRow}>
            Tổng tiền hàng:
            <span>{totalPrice.toLocaleString('vi-VN')} đ</span>
          </p>

          <p style={priceRow}>
            Phí vận chuyển:
            <span>0 đ</span>
          </p>

          <hr />

          <p style={{ ...priceRow, fontSize: 18, fontWeight: "bold" }}>
            Tổng cộng:
            <span>{totalPrice.toLocaleString('vi-VN')} đ</span>
          </p>

          <button
            onClick={() => navigate("/checkout")}
            style={{
              marginTop: 20,
              width: "100%",
              padding: "10px 0",
              backgroundColor: "#28a745",
              border: "none",
              borderRadius: 8,
              color: "white",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Tiến hành thanh toán
          </button>

          <button
            onClick={() => clearCart()}
            style={{
              marginTop: 10,
              width: "100%",
              padding: "10px 0",
              backgroundColor: "#dc3545",
              border: "none",
              borderRadius: 8,
              color: "white",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Xóa toàn bộ giỏ
          </button>
        </div>
      </div>
    </div>
  );
}

//nút tăng/giảm số lượng
const qtyBtn = {
  width: 28,
  height: 28,
  borderRadius: 6,
  border: "1px solid #aaa",
  background: "#f1f1f1",
  cursor: "pointer",
  fontSize: 18,
};

//các dòng giá
const priceRow = {
  display: "flex",
  justifyContent: "space-between",
  margin: "8px 0",
  fontSize: 15,
};

export default Cart;
