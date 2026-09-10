import React from "react";
import {
  ShoppingBag,
  UtensilsCrossed,
  Sparkles,
  Store,
  CreditCard,
  Volume2,
  VolumeX,
  Search
} from "lucide-react";
import StudentCardBadge from "./StudentCardBadge";

/**
 * Navbar Component
 * Menampilkan:
 * 1. Brand / Logo Smart Canteen
 * 2. Search Bar Utama di tengah navbar
 * 3. Tampilan Akun Siswa & Saldo Teroptimasi (Trigger Pill + Dropdown)
 * 4. Tombol Kontrol Audio & Switch Role & Keranjang
 */
export default function Navbar({
  cartCount = 0,
  onOpenCart,
  userRole, // 'student' | 'merchant' | null
  currentUser, // student object or merchant object
  searchQuery = "",
  onSearchChange,
  isAudioMuted = false,
  onToggleAudio,
  activeOrdersCount = 0,
  onOpenLoginModal,
  onSwitchToMerchant,
  onSwitchToStudent,
  onLogout
}) {
  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Left: Brand / Logo */}
        <div className="brand-group">
          <div className="brand-icon-box">
            <UtensilsCrossed className="brand-icon" size={22} />
          </div>
          <div className="brand-text">
            <div className="brand-title-row">
              <h1 className="brand-title">Smart Canteen</h1>
              <span className="brand-badge">
                <Sparkles size={11} className="inline-icon" /> Kantin Sekolah
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search Bar in Navbar (Only in Student view or when browsing) */}
        {userRole !== "merchant" && onSearchChange && (
          <div className="navbar-search-wrapper">
            <div className="navbar-search-box">
              <Search size={16} className="navbar-search-icon" />
              <input
                type="text"
                placeholder="Cari menu kantin: nasi goreng, es teh, roti..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="navbar-search-input"
                aria-label="Cari menu kantin"
                id="navbar-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="navbar-clear-search-btn"
                  onClick={() => onSearchChange("")}
                  aria-label="Hapus pencarian"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        )}

        {/* Right Section: Student Account & Balance (Optimized), Sound, Role Switch, Cart */}
        <div className="navbar-right-actions">
          {/* Audio Sound Toggle */}
          {onToggleAudio && (
            <button
              type="button"
              className={`btn-sound-toggle ${isAudioMuted ? "muted" : "active"}`}
              onClick={onToggleAudio}
              title={isAudioMuted ? "Aktifkan Efek Suara" : "Senyapkan Suara"}
              aria-label={isAudioMuted ? "Aktifkan Efek Suara" : "Senyapkan Suara"}
            >
              {isAudioMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          )}

          {/* Optimized Student Card Badge */}
          {userRole === "student" && currentUser && (
            <StudentCardBadge
              student={currentUser}
              onLogout={onLogout}
              onChangeCard={() => onOpenLoginModal("student")}
            />
          )}

          {/* Merchant Active Chip */}
          {userRole === "merchant" && (
            <div className="merchant-active-chip">
              <Store size={15} />
              <span>Mode Pengelola Merchant</span>
            </div>
          )}

          {/* Login Button if not logged in */}
          {!userRole && (
            <button
              type="button"
              className="btn-login-trigger"
              onClick={() => onOpenLoginModal("student")}
              id="btn-trigger-login"
            >
              <CreditCard size={15} />
              <span>Tap Kartu Pelajar</span>
            </button>
          )}

          {/* Role Switch Button */}
          {userRole === "student" && (
            <button
              type="button"
              className="btn-switch-role"
              onClick={onSwitchToMerchant}
              title="Masuk ke Dashboard Merchant"
              id="btn-switch-to-merchant"
            >
              <Store size={15} />
              <span className="btn-switch-role-text">Portal Merchant</span>
            </button>
          )}

          {userRole === "merchant" && (
            <button
              type="button"
              className="btn-switch-role"
              onClick={onSwitchToStudent}
              title="Kembali ke Menu Siswa"
              id="btn-switch-to-student"
            >
              <UtensilsCrossed size={15} />
              <span className="btn-switch-role-text">Menu Siswa</span>
            </button>
          )}

          {/* Cart Action Button (Only in Student view) */}
          {userRole !== "merchant" && (
            <button
              type="button"
              className={`navbar-cart-btn ${cartCount > 0 ? "has-items" : ""}`}
              onClick={onOpenCart}
              aria-label={`Keranjang belanja berisi ${cartCount} item`}
              id="navbar-cart-button"
            >
              <div className="cart-icon-wrapper">
                <ShoppingBag size={19} />
                {cartCount > 0 && (
                  <span className="cart-count-badge" key={cartCount}>
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="cart-btn-label">Pesanan</span>
              {cartCount > 0 && (
                <span className="cart-btn-indicator">({cartCount})</span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
