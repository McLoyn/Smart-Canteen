import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import CategoryFilter from "./components/CategoryFilter";
import MenuCard from "./components/MenuCard";
import CartSummary from "./components/CartSummary";
import CheckoutModal from "./components/CheckoutModal";
import LoginModal from "./components/LoginModal";
import MerchantDashboard from "./components/MerchantDashboard";
import StudentOrderTracker from "./components/StudentOrderTracker";
import OrderNotificationToast from "./components/OrderNotificationToast";
import { menus as initialMenus, CATEGORIES } from "./data/menus";
import { SAMPLE_STUDENTS, MERCHANT_CONFIG } from "./data/students";
import { playRfidBeep, playAddToCartClick, playBellChime } from "./utils/audio";
import { Search, AlertCircle } from "lucide-react";

// Storage keys untuk konsistensi persistensi data
const STORAGE_KEYS = {
  USER_ROLE: "sc_user_role",
  CURRENT_NIS: "sc_current_nis",
  STUDENTS_LIST: "sc_students_list",
  CART: "sc_cart",
  DINING_OPTION: "sc_dining_option",
  ORDER_NOTES: "sc_order_notes",
  MENU_LIST: "sc_menu_list",
  ORDERS: "sc_orders",
  AUDIO_MUTED: "sc_audio_muted",
  LOGGED_OUT: "sc_logged_out"
};

// Helper untuk membaca dari localStorage secara aman dengan fallback
function getStoredJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw || raw === "undefined" || raw === "null") {
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (err) {
    console.warn(`[Smart Canteen] Gagal memuat key "${key}" dari localStorage:`, err);
    return fallback;
  }
}

// Helper untuk menyimpan ke localStorage secara aman
function setStoredJSON(key, value) {
  try {
    if (value === undefined || value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (err) {
    console.warn(`[Smart Canteen] Gagal menyimpan key "${key}" ke localStorage:`, err);
  }
}

// Data pesanan awal default (fallback)
const DEFAULT_ORDERS = [
  {
    id: 101,
    orderNumber: 201,
    timestamp: "09:45",
    studentName: "Siti Rahma",
    studentNis: "20261022",
    studentGrade: "XI MIPA 2",
    diningOption: "Makan di Tempat",
    orderNotes: "Jangan terlalu pedas ya bu",
    total: 17000,
    status: "Diproses",
    items: [
      { id: 1, name: "Nasi Goreng", price: 12000, quantity: 1 },
      { id: 5, name: "Es Teh", price: 5000, quantity: 1 }
    ]
  },
  {
    id: 102,
    orderNumber: 202,
    timestamp: "09:52",
    studentName: "Budi Santoso",
    studentNis: "20261033",
    studentGrade: "X Multimedia 1",
    diningOption: "Bungkus",
    orderNotes: "Bungkus plastik tebal",
    total: 10000,
    status: "Menunggu",
    items: [
      { id: 2, name: "Mie Goreng", price: 10000, quantity: 1 }
    ]
  }
];

/**
 * Smart Canteen - Aplikasi Kantin Sekolah
 * Dilengkapi:
 * 1. Login Kartu Pelajar Siswa (Simulasi RFID & saldo kartu)
 * 2. Halaman Khusus Merchant Kantin (Kitchen Display System, stok, laporan)
 * 3. Live Order Tracker & Toast Notifikasi status pesanan
 * 4. Pilihan Bersantap (Makan di Tempat / Bungkus) & Catatan Khusus Pesanan
 * 5. Efek Suara Web Audio API (RFID Beep, Pop Click, Bell Chime)
 * 6. Sorting Menu (Harga Termurah, Tertinggi, Terpopuler)
 * 7. State Persistence menyeluruh (Refresh browser tidak menghilangkan data)
 */
export default function App() {
  // 1. State Database Siswa & Saldo Kartu (Persistent)
  const [studentsList, setStudentsList] = useState(() => {
    return getStoredJSON(STORAGE_KEYS.STUDENTS_LIST, SAMPLE_STUDENTS);
  });

  useEffect(() => {
    setStoredJSON(STORAGE_KEYS.STUDENTS_LIST, studentsList);
  }, [studentsList]);

  // 2. State Autentikasi & Peran Pengguna (Persistent)
  const [userRole, setUserRole] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
    if (saved === "merchant") return "merchant";
    return "student";
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const isExplicitlyLoggedOut = localStorage.getItem(STORAGE_KEYS.LOGGED_OUT) === "true";
    if (isExplicitlyLoggedOut) return null;

    const initialStudents = getStoredJSON(STORAGE_KEYS.STUDENTS_LIST, SAMPLE_STUDENTS);
    const savedNis = localStorage.getItem(STORAGE_KEYS.CURRENT_NIS);
    if (savedNis) {
      const found = initialStudents.find((s) => s.nis === savedNis);
      if (found) return found;
    }
    return initialStudents[0] || SAMPLE_STUDENTS[0];
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalInitialTab, setLoginModalInitialTab] = useState("student");

  useEffect(() => {
    if (userRole) {
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, userRole);
    }
  }, [userRole]);

  useEffect(() => {
    if (currentUser && currentUser.nis) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_NIS, currentUser.nis);
      localStorage.removeItem(STORAGE_KEYS.LOGGED_OUT);
    }
  }, [currentUser]);

  // 3. State Audio & Sound Effects (Persistent)
  const [isAudioMuted, setIsAudioMuted] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.AUDIO_MUTED) === "true";
  });

  const toggleAudio = () => {
    setIsAudioMuted((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEYS.AUDIO_MUTED, String(next));
      return next;
    });
  };

  // 4. State Katalog Menu (Persistent)
  const [menuList, setMenuList] = useState(() => {
    return getStoredJSON(STORAGE_KEYS.MENU_LIST, initialMenus);
  });

  useEffect(() => {
    setStoredJSON(STORAGE_KEYS.MENU_LIST, menuList);
  }, [menuList]);

  // 5. State Daftar Pesanan Masuk (Persistent)
  const [orders, setOrders] = useState(() => {
    return getStoredJSON(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
  });

  useEffect(() => {
    setStoredJSON(STORAGE_KEYS.ORDERS, orders);
  }, [orders]);

  // Toast Notifikasi Aktif
  const [activeNotification, setActiveNotification] = useState(null);

  // 6. State Halaman Siswa: Keranjang, Pilihan Bersantap, & Catatan (Persistent)
  const [category, setCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("default"); // 'default' | 'price-asc' | 'price-desc' | 'popular'
  const [cart, setCart] = useState(() => {
    return getStoredJSON(STORAGE_KEYS.CART, []);
  });
  const [diningOption, setDiningOption] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DINING_OPTION);
    return saved === "Bungkus" ? "Bungkus" : "Makan di Tempat";
  });
  const [orderNotes, setOrderNotes] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.ORDER_NOTES) || "";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  useEffect(() => {
    setStoredJSON(STORAGE_KEYS.CART, cart);
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DINING_OPTION, diningOption);
  }, [diningOption]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDER_NOTES, orderNotes);
  }, [orderNotes]);

  // Derived Data: Menu terfilter & tersortir
  const filteredMenus = menuList
    .filter((menu) => {
      const matchesCategory = category === "Semua" || menu.category === category;
      const matchesSearch =
        searchQuery.trim() === "" ||
        menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        menu.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "popular") {
        const score = (item) => (item.badge ? 1 : 0);
        return score(b) - score(a);
      }
      return 0; // Default
    });

  // Derived Data: Perhitungan jumlah item keranjang (.reduce())
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Derived Data: Perhitungan total harga keranjang (.reduce())
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Derived Data: Pesanan aktif siswa saat ini
  const studentActiveOrders = orders.filter(
    (o) => o.studentNis === currentUser?.nis && o.status !== "Selesai"
  );

  // BR-01: Tambah Menu ke Keranjang (Mencegah duplikasi & cek stok)
  const handleAddToCart = (menu) => {
    if (menu.isOutOfStock) return;

    // Mainkan efek suara pop click
    playAddToCartClick(isAudioMuted);

    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === menu.id);

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === menu.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...menu, quantity: 1 }];
    });
  };

  // BR-02: Menambah Quantity (+1)
  const handleIncreaseQuantity = (id) => {
    playAddToCartClick(isAudioMuted);
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // BR-03: Mengurangi Quantity (-1), hapus jika kuantitas mencapai 0
  const handleDecreaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // BR-04: Menghapus Item dari Keranjang
  const handleRemoveFromCart = (id) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  };

  // Helper kuantitas item dalam keranjang
  const getItemQuantityInCart = (menuId) => {
    const item = cart.find((c) => c.id === menuId);
    return item ? item.quantity : 0;
  };

  // Auth Handlers
  const handleStudentLogin = (studentData) => {
    playRfidBeep(isAudioMuted);
    setUserRole("student");
    setCurrentUser(studentData);

    // Pastikan jika ada student baru / data ter-update masuk ke studentsList
    setStudentsList((prevList) => {
      const exists = prevList.some((s) => s.nis === studentData.nis);
      if (exists) {
        return prevList.map((s) => (s.nis === studentData.nis ? studentData : s));
      }
      return [...prevList, studentData];
    });

    localStorage.removeItem(STORAGE_KEYS.LOGGED_OUT);
    setIsLoginModalOpen(false);
  };

  const handleMerchantLogin = () => {
    setUserRole("merchant");
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.LOGGED_OUT);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole(null);
    setCart([]);
    setOrderNotes("");
    localStorage.setItem(STORAGE_KEYS.LOGGED_OUT, "true");
    localStorage.removeItem(STORAGE_KEYS.CURRENT_NIS);
    localStorage.removeItem(STORAGE_KEYS.CART);
    localStorage.removeItem(STORAGE_KEYS.ORDER_NOTES);
    setIsLoginModalOpen(true);
    setLoginModalInitialTab("student");
  };

  const handleOpenLoginModal = (tab = "student") => {
    setLoginModalInitialTab(tab);
    setIsLoginModalOpen(true);
  };

  // Konfirmasi Pemesanan Siswa
  const handleConfirmOrder = (newOrder) => {
    playRfidBeep(isAudioMuted);

    // Potong saldo siswa & simpan ke studentsList agar tidak hilang saat refresh
    if (currentUser) {
      const newBalance = currentUser.balance - newOrder.total;
      const updatedUser = {
        ...currentUser,
        balance: newBalance
      };
      setCurrentUser(updatedUser);

      setStudentsList((prevList) =>
        prevList.map((s) => (s.nis === currentUser.nis ? { ...s, balance: newBalance } : s))
      );
    }

    // Masukkan pesanan ke antrean merchant
    setOrders((prevOrders) => [newOrder, ...prevOrders]);

    // Kosongkan keranjang & reset catatan
    setCart([]);
    setOrderNotes("");
  };

  // Merchant Actions & Live Notification Trigger
  const handleUpdateOrderStatus = (orderId, nextStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: nextStatus } : ord))
    );

    // Jika status diubah menjadi "Siap Diambil", bunyikan bel & picu toast!
    if (nextStatus === "Siap Diambil") {
      playBellChime(isAudioMuted);

      const targetOrder = orders.find((o) => o.id === orderId);
      setActiveNotification({
        title: "Pesanan Siap Diambil di Loket! 🍽️",
        message: `Pesanan #${targetOrder?.orderNumber || ""} untuk ${targetOrder?.studentName || "Siswa"} sudah siap diambil di loket kantin!`,
        orderNumber: targetOrder?.orderNumber
      });
    }
  };

  const handleToggleMenuStock = (menuId) => {
    setMenuList((prev) =>
      prev.map((m) => (m.id === menuId ? { ...m, isOutOfStock: !m.isOutOfStock } : m))
    );
  };

  const handleUpdateMenuPrice = (menuId, newPrice) => {
    setMenuList((prev) =>
      prev.map((m) => (m.id === menuId ? { ...m, price: newPrice } : m))
    );
  };

  const handleAddNewMenu = (newMenuItem) => {
    setMenuList((prev) => [newMenuItem, ...prev]);
  };

  return (
    <div className="app-container">
      {/* 1. Navbar Utama */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsMobileCartOpen(true)}
        userRole={userRole}
        currentUser={currentUser}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isAudioMuted={isAudioMuted}
        onToggleAudio={toggleAudio}
        activeOrdersCount={studentActiveOrders.length}
        onOpenLoginModal={handleOpenLoginModal}
        onSwitchToMerchant={() => {
          if (userRole === "merchant") return;
          handleOpenLoginModal("merchant");
        }}
        onSwitchToStudent={() => {
          setUserRole("student");
          if (!currentUser) setCurrentUser(studentsList[0] || SAMPLE_STUDENTS[0]);
        }}
        onLogout={handleLogout}
      />

      {/* Floating Order Notification Toast */}
      <OrderNotificationToast
        notification={activeNotification}
        onClose={() => setActiveNotification(null)}
        onAction={() => {
          setActiveNotification(null);
          // Scroll smoothly to order tracker
          const trackerEl = document.querySelector(".student-order-tracker-section");
          if (trackerEl) trackerEl.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* 2. Tampilan Berdasarkan Peran */}
      {userRole === "merchant" ? (
        /* Halaman Khusus Merchant */
        <MerchantDashboard
          orders={orders}
          menus={menuList}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onToggleMenuStock={handleToggleMenuStock}
          onUpdateMenuPrice={handleUpdateMenuPrice}
          onAddNewMenu={handleAddNewMenu}
          onBackToStudentView={() => {
            setUserRole("student");
            if (!currentUser) setCurrentUser(studentsList[0] || SAMPLE_STUDENTS[0]);
          }}
          onLogoutMerchant={handleLogout}
        />
      ) : (
        /* Halaman Menu Siswa */
        <main className="main-content-layout">
          <div className="content-container">
            {/* Live Order Tracker (Muncul jika ada pesanan aktif siswa) */}
            <StudentOrderTracker
              activeOrders={studentActiveOrders}
              onConcludeOrder={(id) => handleUpdateOrderStatus(id, "Selesai")}
            />

            {/* Page Header */}
            <section className="page-header-section">
              <div className="header-info">
                <span className="welcome-tag">Kantin Sehat & Higienis</span>
                <h2 className="page-title">Pilih Menu Favoritmu Hari Ini</h2>
                <p className="page-desc">
                  Pesan langsung dengan saldo <strong>Kartu Pelajar</strong>. Makanan siap diambil tanpa antre lama di loket kantin.
                </p>
              </div>

              {/* Category Filter & Sorting Bar */}
              <div className="filter-and-sort-bar-row">
                <CategoryFilter
                  activeCategory={category}
                  categories={CATEGORIES}
                  onChange={(selectedCat) => setCategory(selectedCat)}
                  sortBy={sortBy}
                  onSortChange={(val) => setSortBy(val)}
                />
              </div>
            </section>

            {/* Layout Grid: Menu Cards (Kiri) + Cart Sidebar (Kanan) */}
            <div className="canteen-grid-layout">
              <section className="menu-list-section" aria-label="Daftar Menu Kantin">
                <div className="menu-section-header">
                  <div className="menu-count-badge">
                    <span>Kategori: <strong>{category}</strong></span>
                    <span className="count-pill">{filteredMenus.length} Menu</span>
                  </div>
                </div>

                {filteredMenus.length > 0 ? (
                  <div className="menu-cards-grid">
                    {filteredMenus.map((menu) => (
                      <MenuCard
                        key={menu.id}
                        menu={menu}
                        onAddToCart={handleAddToCart}
                        inCartQuantity={getItemQuantityInCart(menu.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="empty-menu-box">
                    <AlertCircle size={44} className="empty-menu-icon" />
                    <h3 className="empty-menu-title">Tidak ada menu yang sesuai</h3>
                    <p className="empty-menu-desc">
                      Tidak ditemukan menu untuk kategori "<strong>{category}</strong>"
                      {searchQuery ? ` dengan kata kunci "${searchQuery}"` : ""}.
                    </p>
                    <button
                      type="button"
                      className="btn-reset-filter"
                      onClick={() => {
                        setCategory("Semua");
                        setSearchQuery("");
                        setSortBy("default");
                      }}
                    >
                      Reset Filter & Pencarian
                    </button>
                  </div>
                )}
              </section>

              <div className="cart-desktop-wrapper">
                <CartSummary
                  cart={cart}
                  onIncrease={handleIncreaseQuantity}
                  onDecrease={handleDecreaseQuantity}
                  onRemove={handleRemoveFromCart}
                  total={total}
                  diningOption={diningOption}
                  onDiningOptionChange={(opt) => setDiningOption(opt)}
                  orderNotes={orderNotes}
                  onOrderNotesChange={(notes) => setOrderNotes(notes)}
                  onCheckout={() => {
                    if (!currentUser) {
                      handleOpenLoginModal("student");
                      return;
                    }
                    setIsCheckoutModalOpen(true);
                  }}
                />
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Floating Cart Button for Mobile View */}
      {userRole === "student" && cartCount > 0 && (
        <div className="mobile-floating-cart-bar">
          <button
            type="button"
            className="mobile-cart-float-btn"
            onClick={() => setIsMobileCartOpen(true)}
            id="mobile-view-cart-button"
            aria-label="Lihat Keranjang Pesanan"
          >
            <div className="float-btn-left">
              <span className="float-badge">{cartCount}</span>
              <span className="float-text">Lihat Keranjang</span>
            </div>
            <span className="float-price">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0
              }).format(total)}
            </span>
          </button>
        </div>
      )}

      {/* Mobile Cart Drawer */}
      {isMobileCartOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setIsMobileCartOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <CartSummary
              cart={cart}
              onIncrease={handleIncreaseQuantity}
              onDecrease={handleDecreaseQuantity}
              onRemove={handleRemoveFromCart}
              total={total}
              diningOption={diningOption}
              onDiningOptionChange={(opt) => setDiningOption(opt)}
              orderNotes={orderNotes}
              onOrderNotesChange={(notes) => setOrderNotes(notes)}
              onCloseMobile={() => setIsMobileCartOpen(false)}
              onCheckout={() => {
                setIsMobileCartOpen(false);
                if (!currentUser) {
                  handleOpenLoginModal("student");
                  return;
                }
                setIsCheckoutModalOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Modal Checkout Konfirmasi Saldo Kartu Pelajar */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cart={cart}
        total={total}
        student={currentUser}
        diningOption={diningOption}
        orderNotes={orderNotes}
        onConfirmOrder={handleConfirmOrder}
        onOpenLoginModal={handleOpenLoginModal}
      />

      {/* Modal Login (Kartu Pelajar Siswa / Merchant) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        initialTab={loginModalInitialTab}
        studentsList={studentsList}
        onStudentLogin={handleStudentLogin}
        onMerchantLogin={handleMerchantLogin}
      />
    </div>
  );
}
