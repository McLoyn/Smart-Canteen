import React from "react";
import {
  Clock,
  Flame,
  Bell,
  CheckCircle2,
  Utensils,
  ShoppingBag,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { formatRupiah } from "../utils/format";

export default function StudentOrderTracker({
  activeOrders = [],
  onConcludeOrder
}) {
  if (activeOrders.length === 0) return null;

  return (
    <section className="student-order-tracker-section" aria-label="Status Pesanan Aktif Saya">
      <div className="tracker-header">
        <div className="tracker-title-row">
          <span className="live-status-ping" />
          <h3 className="tracker-heading">Pesanan Aktif Kamu ({activeOrders.length})</h3>
        </div>
        <span className="tracker-live-info">Dipantau secara real-time dari dapur kantin</span>
      </div>

      <div className="tracker-orders-list">
        {activeOrders.map((order) => {
          const isWaiting = order.status === "Menunggu";
          const isCooking = order.status === "Diproses";
          const isReady = order.status === "Siap Diambil";

          return (
            <div
              key={order.id}
              className={`tracker-order-card ${isReady ? "is-ready-highlight" : ""}`}
            >
              {/* Order Card Top Bar */}
              <div className="tracker-card-top">
                <div className="tracker-token-box">
                  <span className="token-label">Antrean</span>
                  <span className="token-num">#{order.orderNumber}</span>
                </div>

                <div className="tracker-card-meta">
                  <span className="meta-time">{order.timestamp} WIB</span>
                  {order.diningOption && (
                    <span className="meta-dining-tag">
                      {order.diningOption === "Bungkus" ? "🥡 Bungkus" : "🍽️ Makan di Kantin"}
                    </span>
                  )}
                </div>

                <div className="tracker-status-pill">
                  {isWaiting && (
                    <span className="pill-status pill-waiting">
                      <Clock size={13} className="spin-icon" /> Menunggu Dapur
                    </span>
                  )}
                  {isCooking && (
                    <span className="pill-status pill-cooking">
                      <Flame size={13} className="flame-icon" /> Sedang Dimasak
                    </span>
                  )}
                  {isReady && (
                    <span className="pill-status pill-ready">
                      <Bell size={13} className="bell-shake" /> Siap Diambil di Loket!
                    </span>
                  )}
                </div>
              </div>

              {/* 3-Step Progress Timeline */}
              <div className="tracker-timeline-stepper">
                <div className={`timeline-step ${isWaiting || isCooking || isReady ? "completed" : ""}`}>
                  <div className="step-circle">1</div>
                  <span className="step-label">Diterima</span>
                </div>
                <div className={`timeline-connector ${isCooking || isReady ? "active" : ""}`} />

                <div className={`timeline-step ${isCooking || isReady ? "completed" : ""}`}>
                  <div className="step-circle">2</div>
                  <span className="step-label">Dimasak</span>
                </div>
                <div className={`timeline-connector ${isReady ? "active" : ""}`} />

                <div className={`timeline-step ${isReady ? "completed active-ready" : ""}`}>
                  <div className="step-circle">3</div>
                  <span className="step-label">Siap Diambil</span>
                </div>
              </div>

              {/* Order Item Details & Notes */}
              <div className="tracker-items-summary">
                <div className="summary-items-text">
                  <strong>Menu: </strong>
                  {order.items.map((it) => `${it.quantity}x ${it.name}`).join(", ")}
                </div>
                {order.orderNotes && (
                  <div className="summary-notes-text">
                    <em>Catatan: "{order.orderNotes}"</em>
                  </div>
                )}
              </div>

              {/* Action Banner if Ready */}
              {isReady && (
                <div className="tracker-ready-banner">
                  <div className="ready-banner-text">
                    <Sparkles size={18} className="sparkle-gold" />
                    <span>
                      Makanan kamu sudah siap! Tunjukkan nomor <strong>#{order.orderNumber}</strong> ke kasir/loket.
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-conclude-pickup"
                    onClick={() => onConcludeOrder(order.id)}
                  >
                    <CheckCircle2 size={16} />
                    <span>Sudah Saya Ambil</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
