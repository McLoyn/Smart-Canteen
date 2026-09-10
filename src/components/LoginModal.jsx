import React, { useState } from "react";
import {
  CreditCard,
  Scan,
  Store,
  KeyRound,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  School,
  X,
  ArrowRight
} from "lucide-react";
import { SAMPLE_STUDENTS, MERCHANT_CONFIG } from "../data/students";
import { formatRupiah } from "../utils/format";

export default function LoginModal({
  isOpen,
  onClose,
  onStudentLogin,
  onMerchantLogin,
  initialTab = "student",
  studentsList = SAMPLE_STUDENTS
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'student' | 'merchant'
  const [selectedSampleStudent, setSelectedSampleStudent] = useState(
    studentsList[0] || SAMPLE_STUDENTS[0]
  );
  const [isTapping, setIsTapping] = useState(false);

  // Manual student form
  const [manualNis, setManualNis] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualGrade, setManualGrade] = useState("X Rekayasa Perangkat Lunak");
  const [isManualMode, setIsManualMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Merchant PIN
  const [merchantPin, setMerchantPin] = useState("");

  if (!isOpen) return null;

  // Handle Quick RFID Tap
  const handleTapStudent = (student) => {
    setSelectedSampleStudent(student);
    setIsTapping(true);
    setErrorMessage("");

    setTimeout(() => {
      setIsTapping(false);
      onStudentLogin(student);
    }, 700);
  };

  // Handle Manual Student Form Submit
  const handleManualStudentSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!manualNis.trim() || manualNis.trim().length < 4) {
      setErrorMessage("Nomor Kartu Pelajar (NIS) wajib diisi minimal 4 digit.");
      return;
    }

    if (!manualName.trim()) {
      setErrorMessage("Nama siswa wajib diisi.");
      return;
    }

    // Check if NIS matches an existing student to reuse balance/photo
    const existing = studentsList.find(
      (s) => s.nis.toLowerCase() === manualNis.trim().toLowerCase()
    );

    const studentData = existing || {
      nis: manualNis.trim(),
      name: manualName.trim(),
      grade: manualGrade.trim(),
      balance: 50000, // Default new student card balance
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
      status: "Aktif",
      cardUid: `RFID-${manualNis.slice(-4)}-MANUAL`
    };

    onStudentLogin(studentData);
  };

  // Handle Merchant Login
  const handleMerchantSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (merchantPin === MERCHANT_CONFIG.defaultPin) {
      onMerchantLogin();
    } else {
      setErrorMessage("PIN Pengelola Kantin salah. (Gunakan PIN demo: 1234)");
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="login-modal-card">
        {onClose && (
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Tutup jendela login"
          >
            <X size={18} />
          </button>
        )}

        {/* Modal Header */}
        <div className="login-modal-header">
          <div className="school-logo-badge">
            <School size={24} />
          </div>
          <h2 className="login-modal-title">Portal Masuk Smart Canteen</h2>
          <p className="login-modal-subtitle">
            Pilih login menggunakan Kartu Pelajar Siswa atau Portal Pengelola Merchant
          </p>
        </div>

        {/* Dual Tab Toggle */}
        <div className="login-tabs-nav" role="tablist">
          <button
            type="button"
            className={`login-tab-btn ${activeTab === "student" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("student");
              setErrorMessage("");
            }}
            role="tab"
            aria-selected={activeTab === "student"}
          >
            <CreditCard size={18} />
            <span>Kartu Pelajar Siswa</span>
          </button>

          <button
            type="button"
            className={`login-tab-btn ${activeTab === "merchant" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("merchant");
              setErrorMessage("");
            }}
            role="tab"
            aria-selected={activeTab === "merchant"}
          >
            <Store size={18} />
            <span>Pengelola Merchant</span>
          </button>
        </div>

        {errorMessage && (
          <div className="login-alert-error" role="alert">
            <AlertTriangle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* =================================================================
            TAB 1: KARTU PELAJAR SISWA
            ================================================================= */}
        {activeTab === "student" && (
          <div className="student-login-body">
            {/* Visual Student ID Card */}
            <div className={`student-id-card ${isTapping ? "card-scanning" : ""}`}>
              <div className="student-card-header">
                <div className="card-school-brand">
                  <School size={16} />
                  <span>KARTU TANDA PELAJAR</span>
                </div>
                <div className="card-rfid-chip">
                  <Scan size={14} />
                  <span>RFID ACTIVE</span>
                </div>
              </div>

              <div className="student-card-body">
                <img
                  src={selectedSampleStudent.avatar}
                  alt={selectedSampleStudent.name}
                  className="card-student-photo"
                />
                <div className="card-student-details">
                  <div className="card-field-name">{selectedSampleStudent.name}</div>
                  <div className="card-field-nis">NIS: {selectedSampleStudent.nis}</div>
                  <div className="card-field-grade">{selectedSampleStudent.grade}</div>
                  <div className="card-field-balance">
                    Saldo Kantin: <strong>{formatRupiah(selectedSampleStudent.balance)}</strong>
                  </div>
                </div>
              </div>

              <div className="student-card-footer">
                <span className="card-uid-code">{selectedSampleStudent.cardUid}</span>
                <span className="card-valid-badge">TERVERIFIKASI AKTIF</span>
              </div>

              {isTapping && (
                <div className="tap-animation-overlay">
                  <Scan size={32} className="scan-spin-icon" />
                  <span>Men-scan Kartu Pelajar...</span>
                </div>
              )}
            </div>

            {/* Quick Tap Demo Cards */}
            {!isManualMode ? (
              <div className="quick-tap-section">
                <div className="quick-tap-title-row">
                  <span className="quick-tap-title">
                    <Sparkles size={14} className="inline-icon" />
                    Pilih & Tap Kartu Pelajar Terdaftar (1-Klik):
                  </span>
                </div>

                <div className="quick-tap-grid">
                  {studentsList.map((student) => (
                    <button
                      key={student.nis}
                      type="button"
                      className={`quick-tap-card-btn ${selectedSampleStudent.nis === student.nis ? "selected" : ""
                        }`}
                      onClick={() => handleTapStudent(student)}
                      disabled={isTapping}
                    >
                      <img src={student.avatar} alt={student.name} className="mini-avatar" />
                      <div className="mini-info">
                        <span className="mini-name">{student.name}</span>
                        <span className="mini-nis">{student.grade.split(" ")[0]} • {formatRupiah(student.balance)}</span>
                      </div>
                      <Scan size={16} className="tap-icon" />
                    </button>
                  ))}
                </div>

                <div className="manual-toggle-row">
                  <button
                    type="button"
                    className="btn-toggle-manual"
                    onClick={() => setIsManualMode(true)}
                  >
                    Atau Masukkan Nomor Kartu / NIS Secara Manual
                  </button>
                </div>
              </div>
            ) : (
              /* Manual Input Form */
              <form onSubmit={handleManualStudentSubmit} className="manual-student-form">
                <div className="form-group">
                  <label htmlFor="input-nis">Nomor Induk Siswa (NIS)</label>
                  <input
                    id="input-nis"
                    type="text"
                    placeholder="Contoh: 20261011"
                    value={manualNis}
                    onChange={(e) => setManualNis(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="input-name">Nama Lengkap Siswa</label>
                  <input
                    id="input-name"
                    type="text"
                    placeholder="Nama siswa"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="input-grade">Kelas / Jurusan</label>
                  <input
                    id="input-grade"
                    type="text"
                    placeholder="Contoh: XII Rekayasa Perangkat Lunak 1"
                    value={manualGrade}
                    onChange={(e) => setManualGrade(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="manual-form-actions">
                  <button
                    type="button"
                    className="btn-back-tap"
                    onClick={() => setIsManualMode(false)}
                  >
                    Kembali ke Pilihan Kartu
                  </button>
                  <button type="submit" className="btn-submit-manual">
                    <span>Verifikasi & Masuk</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* =================================================================
            TAB 2: MERCHANT KANTIN
            ================================================================= */}
        {activeTab === "merchant" && (
          <div className="merchant-login-body">
            <div className="merchant-info-banner">
              <div className="merchant-stall-icon">
                <Store size={28} />
              </div>
              <div className="merchant-stall-text">
                <h4 className="stall-name">{MERCHANT_CONFIG.stallName}</h4>
                <p className="stall-owner">Pemilik: {MERCHANT_CONFIG.ownerName}</p>
              </div>
            </div>

            <form onSubmit={handleMerchantSubmit} className="merchant-pin-form">
              <div className="form-group">
                <label htmlFor="merchant-pin-input">
                  Masukkan PIN Kasir / Pengelola Kantin
                </label>
                <div className="pin-input-wrapper">
                  <KeyRound size={18} className="pin-icon" />
                  <input
                    id="merchant-pin-input"
                    type="password"
                    maxLength={6}
                    placeholder="PIN Kasir (Demo: 1234)"
                    value={merchantPin}
                    onChange={(e) => setMerchantPin(e.target.value)}
                    className="form-input pin-input"
                    autoFocus
                    required
                  />
                </div>
                <span className="pin-hint">PIN default untuk pengujian: <strong>1234</strong></span>
              </div>

              <button type="submit" className="btn-submit-merchant">
                <Store size={18} />
                <span>Buka Dashboard Merchant</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
