import React from "react";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Utensils,
  X,
  FileText
} from "lucide-react";
import { formatRupiah } from "../utils/format";

/**
 * CartSummary Component
 * Dilengkapi Pilihan Bersantap (Makan di Tempat / Bungkus) dan Catatan Pesanan
 */
export default function CartSummary({
  cart = [],
  onIncrease,
  onDecrease,
  onRemove,
  total = 0,
  diningOption = "Makan di Tempat",
  onDiningOptionChange,
  orderNotes = "",
  onOrderNotesChange,
  onCheckout,
  onCloseMobile
}) {
  const isCartEmpty = cart.length === 0;

  return (
    <aside className="cart-summary-card" aria-label="Ringkasan Keranjang Pesanan">
      {/* Header */}
      <div className="cart-header">
        <div className="cart-header-title-box">
          <div className="cart-header-icon-box">
            <ShoppingBag size={18} />
          </div>
          <div>
            <h2 className="cart-title">Keranjang Belanja</h2>
            <p className="cart-subtitle">
              {isCartEmpty ? "0 menu dipilih" : `${cart.length} jenis menu`}
            </p>
          </div>
        </div>

        {onCloseMobile && (
          <button
            type="button"
            className="cart-close-mobile-btn"
            onClick={onCloseMobile}
            aria-label="Tutup keranjang"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Cart Content / Items List */}
      <div className="cart-body">
        {isCartEmpty ? (
          <div className="cart-empty-state">
            <div className="empty-state-icon-bubble">
              <ShoppingBag size={36} className="empty-cart-icon" />
            </div>
            <h3 className="empty-state-title">Keranjang masih kosong</h3>
            <p className="empty-state-desc">
              Tambahkan menu lezat pilihanmu untuk mulai memesan makanan & minuman.
            </p>
          </div>
        ) : (
          <>
            {/* Dining Options Toggle */}
            <div className="dining-option-section">
              <span className="dining-section-label">Opsi Penyajian:</span>
              <div className="dining-options-grid">
                <button
                  type="button"
                  className={`dining-pill-btn ${diningOption === "Makan di Tempat" ? "active" : ""}`}
                  onClick={() => onDiningOptionChange && onDiningOptionChange("Makan di Tempat")}
                >
                  <Utensils size={14} />
                  <span>Makan di Kantin</span>
                </button>

                <button
                  type="button"
                  className={`dining-pill-btn ${diningOption === "Bungkus" ? "active" : ""}`}
                  onClick={() => onDiningOptionChange && onDiningOptionChange("Bungkus")}
                >
                  <ShoppingBag size={14} />
                  <span>Bungkus (Takeaway)</span>
                </button>
              </div>
            </div>

            {/* List of Cart Items */}
            <ul className="cart-item-list" aria-label="Daftar item dalam keranjang">
              {cart.map((item) => {
                const itemSubtotal = item.price * item.quantity;
                return (
                  <li key={item.id} className="cart-item-row" id={`cart-item-${item.id}`}>
                    <div className="cart-item-info">
                      <div className="cart-item-header">
                        <span className="cart-item-name">{item.name}</span>
                        <span className="cart-item-category-tag">{item.category}</span>
                      </div>
                      <div className="cart-item-unit-price">
                        {formatRupiah(item.price)}
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <div className="quantity-stepper" role="group" aria-label={`Jumlah ${item.name}`}>
                        <button
                          type="button"
                          className="stepper-btn stepper-minus"
                          onClick={() => onDecrease(item.id)}
                          aria-label={`Kurangi jumlah ${item.name}`}
                          title="Kurangi 1"
                          id={`btn-decrease-${item.id}`}
                        >
                          <Minus size={14} />
                        </button>

                        <span className="stepper-value" aria-live="polite" id={`qty-val-${item.id}`}>
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          className="stepper-btn stepper-plus"
                          onClick={() => onIncrease(item.id)}
                          aria-label={`Tambah jumlah ${item.name}`}
                          title="Tambah 1"
                          id={`btn-increase-${item.id}`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="cart-item-subtotal-box">
                        <span className="cart-subtotal-val">{formatRupiah(itemSubtotal)}</span>
                        <button
                          type="button"
                          className="cart-remove-btn"
                          onClick={() => onRemove(item.id)}
                          aria-label={`Hapus ${item.name} dari keranjang`}
                          title="Hapus menu"
                          id={`btn-remove-${item.id}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Order Notes Field */}
            <div className="cart-notes-box">
              <label htmlFor="cart-order-notes" className="notes-label">
                <FileText size={13} className="inline-icon" />
                Catatan Pesanan Khusus (Opsional):
              </label>
              <textarea
                id="cart-order-notes"
                rows={2}
                placeholder="Misal: Jangan terlalu pedas, es teh sedikit gula, bawa ke kelas..."
                value={orderNotes}
                onChange={(e) => onOrderNotesChange && onOrderNotesChange(e.target.value)}
                className="cart-notes-textarea"
                maxLength={120}
              />
            </div>
          </>
        )}
      </div>

      {/* Cart Summary Footer & Checkout */}
      <div className="cart-footer">
        <div className="cart-total-row">
          <span className="cart-total-label">Total Tagihan:</span>
          <span className="cart-total-amount" id="cart-total-price">
            {formatRupiah(total)}
          </span>
        </div>

        {!isCartEmpty && (
          <button
            type="button"
            className="btn-checkout"
            onClick={onCheckout}
            id="btn-checkout-order"
          >
            <span>Proses Pesanan Kantin</span>
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </aside>
  );
}
