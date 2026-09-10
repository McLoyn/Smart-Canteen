import React, { useState } from "react";
import {
  CheckCircle2,
  Receipt,
  X,
  Sparkles,
  CreditCard,
  AlertTriangle,
  Wallet,
  ArrowRight,
  Utensils,
  ShoppingBag,
  FileText
} from "lucide-react";
import { formatRupiah } from "../utils/format";

export default function CheckoutModal({
  isOpen,
  onClose,
  cart = [],
  total = 0,
  student,
  diningOption = "Makan di Tempat",
  orderNotes = "",
  onConfirmOrder,
  onOpenLoginModal
}) {
  if (!isOpen) return null;

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const studentBalance = student ? student.balance : 0;
  const isBalanceSufficient = student && studentBalance >= total;

  const handlePayWithCard = () => {
    if (!student) {
      onOpenLoginModal("student");
      return;
    }

    if (!isBalanceSufficient) return;

    const orderNumber = Math.floor(100 + Math.random() * 900);
    const currentTime = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit"
    });

    const newOrder = {
      id: Date.now(),
      orderNumber,
      timestamp: currentTime,
      items: [...cart],
      total,
      status: "Menunggu",
      studentName: student.name,
      studentNis: student.nis,
      studentGrade: student.grade,
      paymentMethod: "Kartu Pelajar RFID",
      diningOption,
      orderNotes: orderNotes.trim(),
      remainingBalance: studentBalance - total
    };

    onConfirmOrder(newOrder);
    setCreatedOrder(newOrder);
    setOrderPlaced(true);
  };

  const handleFinish = () => {
    setOrderPlaced(false);
    setCreatedOrder(null);
    onClose();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="checkout-modal-title">
      <div className="modal-card checkout-modal-card">
        {/* Close Button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={handleFinish}
          aria-label="Tutup jendela pemesanan"
        >
          <X size={18} />
        </button>

        {!orderPlaced ? (
          /* STEP 1: REVIEW & KONFIRMASI PEMBAYARAN KARTU PELAJAR */
          <div className="checkout-step-review">
            <div className="modal-header-box">
              <div className="status-icon-circle primary-circle">
                <CreditCard size={28} />
              </div>
              <h3 className="modal-title" id="checkout-modal-title">
                Konfirmasi Pembayaran Kantin
              </h3>
              <p className="modal-subtitle">
                Pembayaran otomatis dipotong dari saldo Kartu Pelajar Siswa
              </p>
            </div>

            {/* Student Card Info Strip */}
            {student ? (
              <div className={`checkout-student-strip ${!isBalanceSufficient ? "insufficient" : ""}`}>
                <div className="student-strip-header">
                  <div className="strip-identity">
                    <img src={student.avatar} alt={student.name} className="strip-avatar" />
                    <div>
                      <strong className="strip-name">{student.name}</strong>
                      <span className="strip-nis">NIS: {student.nis} • {student.grade}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="strip-change-btn"
                    onClick={() => onOpenLoginModal("student")}
                  >
                    Ganti
                  </button>
                </div>

                <div className="strip-balance-row">
                  <span>Saldo Kartu Saat Ini:</span>
                  <strong className="strip-balance-val">{formatRupiah(studentBalance)}</strong>
                </div>

                {!isBalanceSufficient && (
                  <div className="strip-error-warning">
                    <AlertTriangle size={15} />
                    <span>
                      Saldo tidak cukup! Kekurangan:{" "}
                      <strong>{formatRupiah(total - studentBalance)}</strong>
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="checkout-no-student-box">
                <AlertTriangle size={24} className="warning-icon" />
                <div>
                  <strong>Belum ada Kartu Pelajar terhubung</strong>
                  <p>Silakan tap kartu pelajar terlebih dahulu untuk memesan menu kantin.</p>
                </div>
                <button
                  type="button"
                  className="btn-tap-card-now"
                  onClick={() => onOpenLoginModal("student")}
                >
                  Tap Kartu Pelajar
                </button>
              </div>
            )}

            {/* Order Items Preview */}
            <div className="receipt-container">
              <div className="receipt-header">
                <Receipt size={16} />
                <span>Rincian Pesanan Kantin ({cart.length} Jenis Menu)</span>
              </div>

              {/* Dining Option & Notes Banner in Receipt */}
              <div className="receipt-meta-banner">
                <span className="receipt-dining-badge">
                  {diningOption === "Bungkus" ? (
                    <><ShoppingBag size={12} className="inline-icon" /> Bungkus (Takeaway)</>
                  ) : (
                    <><Utensils size={12} className="inline-icon" /> Makan di Kantin</>
                  )}
                </span>
                {orderNotes && (
                  <span className="receipt-notes-badge" title={orderNotes}>
                    <FileText size={12} className="inline-icon" /> Catatan: {orderNotes}
                  </span>
                )}
              </div>

              <div className="receipt-items-list">
                {cart.map((item) => (
                  <div key={item.id} className="receipt-item-row">
                    <div className="receipt-item-left">
                      <span className="receipt-item-qty">{item.quantity}x</span>
                      <span className="receipt-item-name">{item.name}</span>
                    </div>
                    <span className="receipt-item-subtotal">
                      {formatRupiah(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="receipt-divider" />

              <div className="receipt-total-row">
                <span>Total Tagihan:</span>
                <span className="receipt-total-price">{formatRupiah(total)}</span>
              </div>

              {student && isBalanceSufficient && (
                <div className="receipt-remaining-row">
                  <span>Sisa Saldo Setelah Transaksi:</span>
                  <span className="remaining-val">
                    {formatRupiah(studentBalance - total)}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel-checkout"
                onClick={onClose}
              >
                Kembali
              </button>

              <button
                type="button"
                className="btn-confirm-payment"
                onClick={handlePayWithCard}
                disabled={!student || !isBalanceSufficient}
                id="btn-confirm-card-payment"
              >
                <span>Konfirmasi & Bayar</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: SUKSES & TIKET NOMOR ANTREAN */
          <div className="checkout-step-success">
            <div className="modal-status-badge">
              <div className="status-icon-circle success-circle">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="modal-title">Pesanan Berhasil Dikirim ke Merchant!</h3>
              <p className="modal-subtitle">
                Saldo Kartu Pelajar telah dipotong. Tunjukkan nomor antrean saat mengambil pesanan.
              </p>
            </div>

            {/* Queue Token Box */}
            <div className="queue-token-box">
              <span className="token-label">Nomor Antrean Kantin</span>
              <span className="token-number">#{createdOrder?.orderNumber}</span>
              <span className="token-time">
                Waktu: {createdOrder?.timestamp} WIB • Pemesan: {createdOrder?.studentName}
              </span>
              <span className="token-dining">
                {createdOrder?.diningOption === "Bungkus" ? "🥡 Opsi: BUNGKUS" : "🍽️ Opsi: MAKAN DI KANTIN"}
              </span>
            </div>

            <div className="success-balance-notice">
              <Wallet size={16} />
              <span>
                Sisa Saldo Kartu Pelajar:{" "}
                <strong>{formatRupiah(createdOrder?.remainingBalance)}</strong>
              </span>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-primary-modal"
                onClick={handleFinish}
                id="btn-finish-checkout"
              >
                <Sparkles size={16} />
                <span>Selesai & Buat Pesanan Baru</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
