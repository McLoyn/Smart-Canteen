import React, { useState } from "react";
import {
  Store,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  DollarSign,
  Plus,
  ArrowLeft,
  Search,
  Filter,
  Flame,
  Check,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  ShoppingBag,
  Coffee,
  Utensils,
  Cookie
} from "lucide-react";
import { formatRupiah } from "../utils/format";
import { MERCHANT_CONFIG } from "../data/students";

export default function MerchantDashboard({
  orders = [],
  menus = [],
  onUpdateOrderStatus,
  onToggleMenuStock,
  onUpdateMenuPrice,
  onAddNewMenu,
  onBackToStudentView,
  onLogoutMerchant
}) {
  const [activeTab, setActiveTab] = useState("orders"); // 'orders' | 'menus' | 'analytics'
  const [orderFilter, setOrderFilter] = useState("Semua"); // 'Semua' | 'Menunggu' | 'Diproses' | 'Siap Diambil' | 'Selesai'

  // New Menu Form State
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [newMenuName, setNewMenuName] = useState("");
  const [newMenuCategory, setNewMenuCategory] = useState("Makanan");
  const [newMenuPrice, setNewMenuPrice] = useState("");
  const [newMenuDesc, setNewMenuDesc] = useState("");

  // Editing price state: { id: number, price: number }
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [tempPrice, setTempPrice] = useState("");

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === "Semua") return true;
    return o.status === orderFilter;
  });

  // Analytics derived calculations using .reduce()
  const totalRevenue = orders.reduce((sum, order) => {
    // Only count completed or processed orders
    return sum + order.total;
  }, 0);

  const completedOrdersCount = orders.filter((o) => o.status === "Selesai").length;
  const pendingOrdersCount = orders.filter((o) => o.status === "Menunggu" || o.status === "Diproses").length;

  const totalPortionsSold = orders.reduce((total, order) => {
    return total + order.items.reduce((sub, item) => sub + item.quantity, 0);
  }, 0);

  // Handle Add New Menu
  const handleCreateMenu = (e) => {
    e.preventDefault();
    if (!newMenuName.trim() || !newMenuPrice) return;

    const newMenuItem = {
      id: Date.now(),
      name: newMenuName.trim(),
      category: newMenuCategory,
      price: parseInt(newMenuPrice, 10) || 10000,
      description: newMenuDesc.trim() || "Menu kantin lezat dan bergizi",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
      badge: "Menu Baru",
      isOutOfStock: false
    };

    onAddNewMenu(newMenuItem);
    setNewMenuName("");
    setNewMenuPrice("");
    setNewMenuDesc("");
    setShowAddMenuModal(false);
  };

  const handleSavePrice = (id) => {
    const parsed = parseInt(tempPrice, 10);
    if (!isNaN(parsed) && parsed > 0) {
      onUpdateMenuPrice(id, parsed);
    }
    setEditingPriceId(null);
    setTempPrice("");
  };

  return (
    <div className="merchant-portal-container">
      {/* Merchant Top Bar */}
      <header className="merchant-header-bar">
        <div className="merchant-header-container">
          <div className="merchant-header-brand">
            <div className="merchant-avatar-box">
              <Store size={22} />
            </div>
            <div>
              <div className="merchant-title-row">
                <h1 className="merchant-stall-heading">{MERCHANT_CONFIG.stallName}</h1>
                <span className="merchant-live-badge">
                  <span className="live-pulse-dot" /> Online
                </span>
              </div>
              <p className="merchant-sub-heading">
                Kasir & Dapur Kantin • Pengelola: <strong>{MERCHANT_CONFIG.ownerName}</strong>
              </p>
            </div>
          </div>

          <div className="merchant-header-actions">
            <button
              type="button"
              className="btn-switch-student-view"
              onClick={onBackToStudentView}
              id="btn-return-student-view"
            >
              <ArrowLeft size={16} />
              <span>Lihat Menu Siswa</span>
            </button>
            <button
              type="button"
              className="btn-logout-merchant"
              onClick={onLogoutMerchant}
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Main Merchant Portal Content */}
      <main className="merchant-main-content">
        <div className="merchant-content-wrapper">
          {/* Navigation Tabs */}
          <div className="merchant-nav-tabs">
            <button
              type="button"
              className={`merchant-nav-tab ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
              id="tab-merchant-orders"
            >
              <ShoppingBag size={18} />
              <span>Antrean Pesanan Masuk</span>
              {pendingOrdersCount > 0 && (
                <span className="tab-counter-badge">{pendingOrdersCount}</span>
              )}
            </button>

            <button
              type="button"
              className={`merchant-nav-tab ${activeTab === "menus" ? "active" : ""}`}
              onClick={() => setActiveTab("menus")}
              id="tab-merchant-menus"
            >
              <Package size={18} />
              <span>Kelola Menu & Stok ({menus.length})</span>
            </button>

            <button
              type="button"
              className={`merchant-nav-tab ${activeTab === "analytics" ? "active" : ""}`}
              onClick={() => setActiveTab("analytics")}
              id="tab-merchant-analytics"
            >
              <TrendingUp size={18} />
              <span>Ringkasan Penjualan</span>
            </button>
          </div>

          {/* =================================================================
              TAB 1: ANTREAN PESANAN (KITCHEN & QUEUE)
              ================================================================= */}
          {activeTab === "orders" && (
            <section className="merchant-section-orders" aria-label="Antrean Pesanan Masuk">
              {/* Order Status Filters */}
              <div className="orders-filter-row">
                <div className="filter-pill-group">
                  {["Semua", "Menunggu", "Diproses", "Siap Diambil", "Selesai"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={`order-filter-pill ${orderFilter === st ? "active" : ""}`}
                      onClick={() => setOrderFilter(st)}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                <span className="order-stats-info">
                  Menampilkan <strong>{filteredOrders.length}</strong> pesanan
                </span>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="merchant-empty-state">
                  <div className="empty-icon-circle">
                    <CheckCircle size={40} />
                  </div>
                  <h3>Belum ada pesanan pada kategori ini</h3>
                  <p>Pesanan baru yang dikirim oleh siswa akan langsung muncul di sini secara real-time.</p>
                </div>
              ) : (
                <div className="merchant-orders-grid">
                  {filteredOrders.map((order) => {
                    return (
                      <div
                        key={order.id}
                        className={`merchant-order-card status-${order.status.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {/* Order Card Header */}
                        <div className="order-card-header">
                          <div className="order-token-chip">
                            <span className="token-hash">#{order.orderNumber}</span>
                            <span className="order-time">{order.timestamp} WIB</span>
                          </div>
                          <span className={`order-status-badge status-badge-${order.status.toLowerCase().replace(/\s+/g, "-")}`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Student Details & Dining Option */}
                        <div className="order-student-info">
                          <div className="student-info-top-row">
                            <span className="student-info-name">
                              <strong>{order.studentName || "Siswa Kantin"}</strong>
                            </span>
                            {order.diningOption && (
                              <span className={`merchant-dining-pill ${order.diningOption === "Bungkus" ? "takeaway" : "dinein"}`}>
                                {order.diningOption === "Bungkus" ? "🥡 Bungkus" : "🍽️ Makan di Tempat"}
                              </span>
                            )}
                          </div>
                          <div className="student-info-sub">
                            <span>NIS: {order.studentNis || "-"}</span> • <span>{order.studentGrade || "Umum"}</span>
                          </div>

                          {order.orderNotes && (
                            <div className="merchant-order-notes-chip">
                              <strong>Catatan Siswa:</strong> "{order.orderNotes}"
                            </div>
                          )}
                        </div>

                        {/* Order Items List */}
                        <div className="order-items-box">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="order-item-line">
                              <span className="order-item-qty">{item.quantity}x</span>
                              <span className="order-item-name">{item.name}</span>
                              <span className="order-item-subtotal">
                                {formatRupiah(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order Card Total */}
                        <div className="order-total-footer">
                          <span>Total Tagihan:</span>
                          <strong className="order-total-price">{formatRupiah(order.total)}</strong>
                        </div>

                        {/* Status Transition Action Buttons */}
                        <div className="order-action-footer">
                          {order.status === "Menunggu" && (
                            <button
                              type="button"
                              className="btn-order-action btn-process"
                              onClick={() => onUpdateOrderStatus(order.id, "Diproses")}
                            >
                              <Flame size={16} />
                              <span>Mulai Masak / Siapkan</span>
                            </button>
                          )}

                          {order.status === "Diproses" && (
                            <button
                              type="button"
                              className="btn-order-action btn-ready"
                              onClick={() => onUpdateOrderStatus(order.id, "Siap Diambil")}
                            >
                              <CheckCircle size={16} />
                              <span>Tandai Siap Diambil</span>
                            </button>
                          )}

                          {order.status === "Siap Diambil" && (
                            <button
                              type="button"
                              className="btn-order-action btn-complete"
                              onClick={() => onUpdateOrderStatus(order.id, "Selesai")}
                            >
                              <Check size={16} />
                              <span>Selesaikan & Serahkan</span>
                            </button>
                          )}

                          {order.status === "Selesai" && (
                            <div className="order-completed-indicator">
                              <CheckCircle size={16} />
                              <span>Pesanan Telah Diambil</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* =================================================================
              TAB 2: KELOLA MENU & STOK
              ================================================================= */}
          {activeTab === "menus" && (
            <section className="merchant-section-menus" aria-label="Kelola Menu dan Stok">
              <div className="menus-header-action-row">
                <div>
                  <h3 className="section-title">Katalog & Ketersediaan Stok Menu</h3>
                  <p className="section-subtitle">
                    Atur stok menu yang tersedia atau habis, serta perbarui harga menu kantin.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-add-new-menu"
                  onClick={() => setShowAddMenuModal(true)}
                  id="btn-open-add-menu-modal"
                >
                  <Plus size={16} />
                  <span>Tambah Menu Baru</span>
                </button>
              </div>

              <div className="merchant-menus-table-card">
                <table className="merchant-table">
                  <thead>
                    <tr>
                      <th>Menu</th>
                      <th>Kategori</th>
                      <th>Harga Satuan</th>
                      <th>Status Stok</th>
                      <th style={{ textAlign: "right" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menus.map((item) => (
                      <tr key={item.id} className={item.isOutOfStock ? "row-out-of-stock" : ""}>
                        <td>
                          <div className="menu-table-cell-title">
                            <img src={item.image} alt={item.name} className="menu-table-img" />
                            <div>
                              <strong className="table-menu-name">{item.name}</strong>
                              <p className="table-menu-desc">{item.description}</p>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="table-category-badge">{item.category}</span>
                        </td>

                        <td>
                          {editingPriceId === item.id ? (
                            <div className="table-edit-price-box">
                              <input
                                type="number"
                                className="table-price-input"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(e.target.value)}
                                autoFocus
                              />
                              <button
                                type="button"
                                className="btn-save-price"
                                onClick={() => handleSavePrice(item.id)}
                              >
                                Simpan
                              </button>
                            </div>
                          ) : (
                            <div className="table-price-display">
                              <span className="table-price-val">{formatRupiah(item.price)}</span>
                              <button
                                type="button"
                                className="btn-edit-price-inline"
                                onClick={() => {
                                  setEditingPriceId(item.id);
                                  setTempPrice(String(item.price));
                                }}
                                title="Ubah harga"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </td>

                        <td>
                          <button
                            type="button"
                            className={`stock-toggle-btn ${item.isOutOfStock ? "is-empty" : "is-available"}`}
                            onClick={() => onToggleMenuStock(item.id)}
                            title={item.isOutOfStock ? "Klik untuk jadikan Tersedia" : "Klik untuk jadikan Habis"}
                          >
                            {item.isOutOfStock ? (
                              <>
                                <ToggleLeft size={20} />
                                <span>Stok Habis</span>
                              </>
                            ) : (
                              <>
                                <ToggleRight size={20} />
                                <span>Tersedia</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td style={{ textAlign: "right" }}>
                          <span className={`status-indicator-tag ${item.isOutOfStock ? "tag-red" : "tag-green"}`}>
                            {item.isOutOfStock ? "Sold Out" : "Aktif"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* =================================================================
              TAB 3: LAPORAN PENJUALAN & ANALYTICS
              ================================================================= */}
          {activeTab === "analytics" && (
            <section className="merchant-section-analytics" aria-label="Ringkasan Penjualan">
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon-box revenue-icon">
                    <DollarSign size={24} />
                  </div>
                  <div className="metric-data">
                    <span className="metric-label">Total Omset Pesanan</span>
                    <h4 className="metric-value">{formatRupiah(totalRevenue)}</h4>
                    <span className="metric-sub">Kalkulasi real-time via .reduce()</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon-box orders-icon">
                    <ShoppingBag size={24} />
                  </div>
                  <div className="metric-data">
                    <span className="metric-label">Total Pesanan Masuk</span>
                    <h4 className="metric-value">{orders.length} Pesanan</h4>
                    <span className="metric-sub">{completedOrdersCount} telah selesai diambil</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon-box portions-icon">
                    <Package size={24} />
                  </div>
                  <div className="metric-data">
                    <span className="metric-label">Total Porsi Terjual</span>
                    <h4 className="metric-value">{totalPortionsSold} Porsi</h4>
                    <span className="metric-sub">Makanan, minuman, & camilan</span>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Modal Tambah Menu Baru */}
      {showAddMenuModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="add-menu-modal-card">
            <div className="modal-header-row">
              <h3>Tambah Menu Kantin Baru</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAddMenuModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateMenu} className="add-menu-form">
              <div className="form-group">
                <label>Nama Menu</label>
                <input
                  type="text"
                  placeholder="Contoh: Ayam Geprek Sambal Matah"
                  value={newMenuName}
                  onChange={(e) => setNewMenuName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Kategori</label>
                  <select
                    value={newMenuCategory}
                    onChange={(e) => setNewMenuCategory(e.target.value)}
                    className="form-input"
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Harga (Rupiah)</label>
                  <input
                    type="number"
                    placeholder="Contoh: 15000"
                    value={newMenuPrice}
                    onChange={(e) => setNewMenuPrice(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  placeholder="Deskripsi menu..."
                  value={newMenuDesc}
                  onChange={(e) => setNewMenuDesc(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="modal-form-actions">
                <button
                  type="button"
                  className="btn-cancel-modal"
                  onClick={() => setShowAddMenuModal(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn-submit-create-menu">
                  Simpan Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
