import React, { useEffect } from "react";
import { Bell, X, Sparkles, CheckCircle } from "lucide-react";

export default function OrderNotificationToast({
  notification,
  onClose,
  onAction
}) {
  if (!notification) return null;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 8000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  return (
    <div className="order-notification-toast" role="alert" aria-live="assertive">
      <div className="toast-icon-wrapper">
        <Bell size={22} className="bell-shake" />
      </div>

      <div className="toast-content">
        <div className="toast-header-row">
          <strong className="toast-title">{notification.title}</strong>
          <span className="toast-badge-token">#{notification.orderNumber}</span>
        </div>
        <p className="toast-message">{notification.message}</p>

        {onAction && (
          <button
            type="button"
            className="toast-action-btn"
            onClick={onAction}
          >
            <CheckCircle size={14} />
            <span>Lihat Pesanan</span>
          </button>
        )}
      </div>

      <button
        type="button"
        className="toast-close-btn"
        onClick={onClose}
        aria-label="Tutup notifikasi"
      >
        <X size={16} />
      </button>
    </div>
  );
}
