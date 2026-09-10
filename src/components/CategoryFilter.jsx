import React from "react";
import { LayoutGrid, Utensils, Coffee, Cookie, ArrowUpDown } from "lucide-react";

/**
 * CategoryFilter Component dengan integrasi Sorting Menu
 * Props:
 * - activeCategory: string
 * - categories: array
 * - onChange: function (category: string) => void
 * - sortBy: string
 * - onSortChange: function (sortBy: string) => void
 */
export default function CategoryFilter({
  activeCategory = "Semua",
  categories = ["Semua", "Makanan", "Minuman", "Snack"],
  onChange,
  sortBy = "default",
  onSortChange
}) {
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Makanan":
        return <Utensils size={15} />;
      case "Minuman":
        return <Coffee size={15} />;
      case "Snack":
        return <Cookie size={15} />;
      case "Semua":
      default:
        return <LayoutGrid size={15} />;
    }
  };

  return (
    <div className="category-and-sort-container">
      {/* Category Pills Nav */}
      <nav className="category-filter-nav" aria-label="Filter Kategori Menu">
        <div className="category-filter-scroll">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                id={`filter-btn-${category.toLowerCase()}`}
                className={`category-pill-btn ${isActive ? "active" : ""}`}
                onClick={() => onChange(category)}
                aria-pressed={isActive}
                aria-label={`Pilih kategori ${category}`}
              >
                <span className="category-pill-icon">{getCategoryIcon(category)}</span>
                <span className="category-pill-name">{category}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Sorting Dropdown Selector */}
      {onSortChange && (
        <div className="sort-menu-wrapper">
          <ArrowUpDown size={14} className="sort-icon" />
          <select
            className="sort-dropdown-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Urutkan menu kantin"
            id="sort-menu-select"
          >
            <option value="default">Urutkan: Rekomendasi</option>
            <option value="price-asc">Harga: Termurah</option>
            <option value="price-desc">Harga: Tertinggi</option>
            <option value="popular">Paling Populer ⭐</option>
          </select>
        </div>
      )}
    </div>
  );
}
