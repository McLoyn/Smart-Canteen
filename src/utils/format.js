/**
 * Utility untuk memformat angka ke mata uang Rupiah Indonesia
 * Sesuai Section 15 PRD: Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
 */
export const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(number || 0);
};
