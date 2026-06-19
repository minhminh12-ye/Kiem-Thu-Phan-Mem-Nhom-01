// frontend/src/components/users/UserProductPage.js
import React, { useState, useEffect, useMemo, useContext } from "react";
import { CartContext } from "./CartContext";
import "./UserProductPage.css";

function formatCurrency(value) {
  return value.toLocaleString("vi-VN") + ".000₫";
}

export default function UserProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { error, success, setError, setSuccess } = useContext(CartContext);

  // Auto dismiss error and success messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, setSuccess]);

  // Lấy dữ liệu sản phẩm từ backend
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:5000/products");
        const data = await res.json();

        const mapped = data.map((p) => {
          // Safe parse specs
          let specs = {};
          try {
            if (p.specs) {
              if (typeof p.specs === 'string') {
                specs = p.specs.trim() ? JSON.parse(p.specs) : {};
              } else if (typeof p.specs === 'object') {
                specs = p.specs;
              }
            }
          } catch (err) {
            console.warn('Lỗi parse specs cho sản phẩm', p.id, err);
            specs = {};
          }

          return {
            id: p.id,
            name: p.product_name,
            category: p.category_name,
            brand: p.brand_name,
            price: p.price,
            inStock: p.stock > 0,
            specs,
            image: p.image_url || "https://picsum.photos/seed/fallback/600/400",
            rating: p.rating || 4.0,
            description: p.description || "",
          };
        });

        setProducts(mapped);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi load sản phẩm:", err);
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    console.log("🔍 Filter check - loading:", loading, "products:", products.length);
    if (loading) return [];

    let filtered = [...products];
    console.log("🔍 After copy:", filtered.length);

    if (searchText.trim() !== "") {
      const kw = searchText.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(kw) ||
          (p.specs.cpu && p.specs.cpu.toLowerCase().includes(kw)) ||
          (p.specs.ram && p.specs.ram.toLowerCase().includes(kw)) ||
          (p.specs.storage && p.specs.storage.toLowerCase().includes(kw))
      );
      console.log("🔍 After search filter:", filtered.length);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
      console.log("🔍 After category filter:", filtered.length, "category:", categoryFilter);
    }

    if (brandFilter !== "all") {
      filtered = filtered.filter((p) => p.brand === brandFilter);
      console.log("🔍 After brand filter:", filtered.length, "brand:", brandFilter);
    }

    if (onlyInStock) {
      filtered = filtered.filter((p) => p.inStock);
      console.log("🔍 After stock filter:", filtered.length);
    }

    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;
    if (min !== null) {
      filtered = filtered.filter((p) => p.price >= min);
      console.log("🔍 After min price filter:", filtered.length);
    }
    if (max !== null) {
      filtered = filtered.filter((p) => p.price <= max);
      console.log("🔍 After max price filter:", filtered.length);
    }

    if (sortBy === "price-asc") filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === "name-asc")
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "name-desc")
      filtered.sort((a, b) => b.name.localeCompare(a.name));

    console.log("🔍 Final filtered:", filtered.length);
    return filtered;
  }, [
    products,
    searchText,
    categoryFilter,
    brandFilter,
    sortBy,
    onlyInStock,
    minPrice,
    maxPrice,
    loading,
  ]);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return Array.from(set);
  }, [products]);

  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand));
    return Array.from(set);
  }, [products]);

  const handleViewDetail = (product) => setSelectedProduct(product);
  const handleCloseDetail = () => setSelectedProduct(null);

  if (loading) return <div>Đang tải sản phẩm...</div>;

  return (
    <div className="user-product-page">
      {error && (
        <div style={{
          position: 'fixed',
          top: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '12px 20px',
          borderRadius: '4px',
          border: '1px solid #f5c6cb',
          zIndex: 1000,
          minWidth: '300px',
          textAlign: 'center'
        }}>
          ❌ {error}
        </div>
      )}
      
      {success && (
        <div style={{
          position: 'fixed',
          top: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '12px 20px',
          borderRadius: '4px',
          border: '1px solid #c3e6cb',
          zIndex: 1000,
          minWidth: '300px',
          textAlign: 'center'
        }}>
          ✅ {success}
        </div>
      )}
      
      <header className="upp-header">
        <div>
          <h1>Danh sách sản phẩm</h1>
          <p>Khách hàng có thể xem, lọc và chọn sản phẩm máy tính phù hợp.</p>
        </div>
        <div className="upp-header__search">
          <input
            type="text"
            placeholder="Tìm theo tên, CPU, RAM..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </header>

      <div className="upp-layout">
        <aside className="upp-filters">
          <h2>Bộ lọc</h2>

          <div className="upp-filter-group">
            <label>Loại sản phẩm</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="upp-filter-group">
            <label>Hãng</label>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="upp-filter-group">
            <label>Khoảng giá (₫)</label>
            <div className="upp-price-range">
              <input
                type="number"
                placeholder="Tối thiểu"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Tối đa"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="upp-filter-group upp-checkbox">
            <label>
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
              />
              Chỉ hiển thị sản phẩm còn hàng
            </label>
          </div>

          <button
            className="upp-btn upp-btn-outline"
            onClick={() => {
              setSearchText("");
              setCategoryFilter("all");
              setBrandFilter("all");
              setSortBy("default");
              setOnlyInStock(false);
              setMinPrice("");
              setMaxPrice("");
            }}
          >
            Xóa bộ lọc
          </button>
        </aside>

        <main className="upp-content">
          <div className="upp-toolbar">
            <div className="upp-count">
              Tìm thấy <strong>{filteredProducts.length}</strong> /{" "}
              {products.length} sản phẩm
            </div>
            <div className="upp-sort">
              <label>Sắp xếp:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="default">Mặc định</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="name-asc">Tên A → Z</option>
                <option value="name-desc">Tên Z → A</option>
              </select>
            </div>
          </div>

          <div className="upp-grid">
            {filteredProducts.length === 0 ? (
              <div className="upp-empty">
                Không có sản phẩm nào phù hợp với bộ lọc hiện tại.
              </div>
            ) : (
              filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} onViewDetail={handleViewDetail} />
              ))
            )}
          </div>
        </main>
      </div>

      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={handleCloseDetail} />
      )}
    </div>
  );
}

function ProductCard({ product, onViewDetail }) {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart({ id: product.id });
  };

  return (
    <div className="upp-card">
      <div className="upp-card__image">
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.target.src = "https://picsum.photos/seed/fallback/600/400";
          }}
        />
        {!product.inStock && (
          <span className="upp-badge upp-badge--out">Hết hàng</span>
        )}
      </div>
      <div className="upp-card__body">
        <h3 className="upp-card__title">{product.name}</h3>
        <div className="upp-card__meta">
          <span className="upp-chip">{product.category}</span>
          <span className="upp-chip upp-chip--muted">{product.brand}</span>
        </div>
        <ul className="upp-specs">
          {product.specs.cpu && <li>CPU: {product.specs.cpu}</li>}
          {product.specs.ram && <li>RAM: {product.specs.ram}</li>}
          {product.specs.storage && <li>Ổ cứng: {product.specs.storage}</li>}
          {product.specs.gpu && <li>GPU: {product.specs.gpu}</li>}
        </ul>
        <div className="upp-card__bottom">
          <div className="upp-price">{formatCurrency(product.price)}</div>
          <div className="upp-rating">★ {product.rating.toFixed(1)}</div>
        </div>
      </div>
      <div className="upp-card__actions">
        <button className="upp-btn upp-btn-secondary" onClick={() => onViewDetail(product)}>
          Xem chi tiết
        </button>
        <button
          className="upp-btn upp-btn-primary"
          disabled={!product.inStock}
          onClick={handleAddToCart}
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}

function ProductDetailModal({ product, onClose }) {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart({ id: product.id });
    onClose();
  };

  return (
    <div className="upp-modal-backdrop" onClick={onClose}>
      <div className="upp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="upp-modal__header">
          <h2>{product.name}</h2>
          <button className="upp-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="upp-modal__body">
          <div className="upp-modal__image">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                e.target.src = "https://picsum.photos/seed/fallback/600/400";
              }}
            />
            {!product.inStock && <span className="upp-badge upp-badge--out">Hết hàng</span>}
          </div>

          <div className="upp-modal__info">
            <div className="upp-modal__chips">
              <span className="upp-chip">{product.category}</span>
              <span className="upp-chip upp-chip--muted">{product.brand}</span>
            </div>

            <p className="upp-modal__description">
              {product.description || "Chưa có mô tả cho sản phẩm này."}
            </p>

            <ul className="upp-specs">
              {product.specs.cpu && <li>CPU: {product.specs.cpu}</li>}
              {product.specs.ram && <li>RAM: {product.specs.ram}</li>}
              {product.specs.storage && <li>Ổ cứng: {product.specs.storage}</li>}
              {product.specs.gpu && <li>GPU: {product.specs.gpu}</li>}
            </ul>

            <div className="upp-modal__bottom">
              <div className="upp-modal__price">{formatCurrency(product.price)}</div>
              <div className="upp-rating">★ {product.rating.toFixed(1)}</div>
            </div>

            <div className="upp-modal__actions">
              <button className="upp-btn upp-btn-secondary" onClick={onClose}>
                Đóng
              </button>
              <button
                className="upp-btn upp-btn-primary"
                disabled={!product.inStock}
                onClick={handleAddToCart}
              >
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
