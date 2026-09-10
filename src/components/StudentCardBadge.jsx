import React, { useState, useRef, useEffect } from "react";
import {
  CreditCard,
  Wallet,
  LogOut,
  ChevronDown,
  UserCheck,
  School,
  Scan,
  Sparkles,
  X
} from "lucide-react";
import { formatRupiah } from "../utils/format";

export default function StudentCardBadge({ student, onLogout, onChangeCard }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!student) return null;

  return (
    <div className="student-profile-wrapper" ref={dropdownRef}>
      {/* Optimized Navbar Trigger Pill */}
      <button
        type="button"
        className={`student-profile-trigger ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Akun ${student.name}, Saldo: ${formatRupiah(student.balance)}`}
        id="btn-student-profile-menu"
      >
        <div className="student-avatar-ring">
          <img
            src={student.avatar}
            alt={`Foto ${student.name}`}
            className="student-avatar-img"
          />
          <span className="student-online-dot" />
        </div>

        <div className="student-identity-col">
          <span className="student-pill-name">{student.name}</span>
          <span className="student-pill-grade">{student.grade.split(" ")[0]}</span>
        </div>

        {/* Optimized Saldo Chip */}
        <div className="student-wallet-chip">
          <Wallet size={13} className="wallet-chip-icon" />
          <span className="wallet-chip-amount">{formatRupiah(student.balance)}</span>
        </div>

        <ChevronDown size={14} className={`chevron-indicator ${isOpen ? "rotate" : ""}`} />
      </button>

      {/* Floating Detailed Student Card Dropdown */}
      {isOpen && (
        <div className="student-dropdown-card" role="menu">
          {/* Card Header */}
          <div className="dropdown-card-top">
            <div className="school-id-tag">
              <School size={13} />
              <span>SMART CANTEEN ID</span>
            </div>
            <span className="status-verified-chip">
              <UserCheck size={11} />
              Aktif
            </span>
          </div>

          {/* Mini Holographic Preview */}
          <div className="dropdown-student-profile">
            <img
              src={student.avatar}
              alt={student.name}
              className="dropdown-photo"
            />
            <div className="dropdown-info">
              <h4 className="dropdown-name">{student.name}</h4>
              <p className="dropdown-nis">NIS: <strong>{student.nis}</strong></p>
              <p className="dropdown-grade">{student.grade}</p>
              <span className="dropdown-uid">{student.cardUid || "RFID-SMART-CARD"}</span>
            </div>
          </div>

          {/* Balance Spotlight Box */}
          <div className="dropdown-balance-spotlight">
            <div className="balance-spotlight-left">
              <span className="spotlight-label">Saldo Kartu Pelajar</span>
              <strong className="spotlight-value">{formatRupiah(student.balance)}</strong>
            </div>
            <div className="balance-spotlight-icon">
              <Wallet size={20} />
            </div>
          </div>

          {/* Actions */}
          <div className="dropdown-actions-row">
            <button
              type="button"
              className="dropdown-action-btn btn-change-card"
              onClick={() => {
                setIsOpen(false);
                onChangeCard();
              }}
            >
              <CreditCard size={15} />
              <span>Ganti / Tap Kartu</span>
            </button>

            <button
              type="button"
              className="dropdown-action-btn btn-logout-student"
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
            >
              <LogOut size={15} />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
