import React, { useState } from "react";
import { Plus, Utensils, Coffee, Cookie, Sparkles, Check, Ban } from "lucide-react";
import { formatRupiah } from "../utils/format";

/**
 * MenuCard Component sesuai PRD Section 8.2 & 13.2
 * Props:
 * - menu: object ({ id, name, category, price, description, image, badge, isOutOfStock })
 * - onAddToCart: function (menu) => void
 * - inCartQuantity: optional number (menunjukkan berapa item sudah ada di keranjang)
 */
export default function MenuCard({ menu, onAddToCart, inCartQuantity = 0 }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isJustAdded, setIsJustAdded] = useState(false);

  const isSoldOut = Boolean(menu.isOutOfStock);

  const handleAdd = () => {
    if (isSoldOut) return;
    onAddToCart(menu);
    setIsJustAdded(true);
    setTimeout(() => setIsJustAdded(false), 600);
  };

  const getCategoryTheme = (category) => {
    switch (category) {
      case "Makanan":
        return { color: "tag-makanan", icon: <Utensils size={12} /> };
      case "Minuman":
        return { color: "tag-minuman", icon: <Coffee size={12} /> };
      case "Snack":
        return { color: "tag-snack", icon: <Cookie size={12} /> };
      default:
        return { color: "tag-default", icon: <Sparkles size={12} /> };
    }
  };

  const theme = getCategoryTheme(menu.category);

  return (
    <article className={`menu-card ${isSoldOut ? "out-of-stock-card" : ""}`} id={`menu-card-${menu.id}`}>
      {/* Visual Image Banner */}
      <div className="menu-card-image-wrapper">
        {menu.image && !imageError ? (
          <>
            {!imageLoaded && <div className="image-skeleton-shimmer" />}
            <img
              src={menu.image}
              alt={`Foto hidangan ${menu.name}`}
              className={`menu-card-image ${imageLoaded ? "is-loaded" : ""}`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <div className="menu-image-fallback">
            <span className="fallback-icon">{theme.icon}</span>
            <span className="fallback-text">{menu.name}</span>
          </div>
        )}

        {/* Category Pill Tag */}
        <span className={`menu-card-category-badge ${theme.color}`}>
          {theme.icon}
          <span>{menu.category}</span>
        </span>

        {/* Out of stock badge or special badge */}
        {isSoldOut ? (
          <span className="menu-card-soldout-badge">
            <Ban size={11} className="inline-icon" />
            Stok Habis
          </span>
        ) : (
          menu.badge && (
            <span className="menu-card-special-badge">
              <Sparkles size={11} className="inline-icon" />
              {menu.badge}
            </span>
          )
        )}

        {/* In-cart indicator chip */}
        {inCartQuantity > 0 && !isSoldOut && (
          <span className="menu-card-incart-badge" title={`${inCartQuantity} item di keranjang`}>
            {inCartQuantity} di keranjang
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="menu-card-content">
        <div className="menu-card-header">
          <h3 className="menu-card-title" title={menu.name}>
            {menu.name}
          </h3>
          <p className="menu-card-description" title={menu.description}>
            {menu.description}
          </p>
        </div>

        {/* Price & Action Footer */}
        <div className="menu-card-footer">
          <div className="menu-card-price-block">
            <span className="price-label">Harga</span>
            <span className="price-value">{formatRupiah(menu.price)}</span>
          </div>

          <button
            type="button"
            className={`btn-add-to-cart ${isJustAdded ? "btn-added" : ""} ${isSoldOut ? "btn-soldout" : ""}`}
            onClick={handleAdd}
            disabled={isSoldOut}
            aria-label={isSoldOut ? `${menu.name} sedang habis` : `Tambah ${menu.name}`}
            id={`btn-add-menu-${menu.id}`}
          >
            {isSoldOut ? (
              <span>Habis</span>
            ) : isJustAdded ? (
              <>
                <Check size={16} />
                <span>Ditambah!</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>Tambah</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
