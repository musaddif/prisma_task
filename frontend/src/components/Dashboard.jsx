import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { product } from "../data";
import SiteFooter from "./SiteFooter";
import "./Dashboard.css";

const PER_PAGE = 99999; // Show all

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "name", label: "Name: A to Z" },
];

const formatPrice = (value) => `$${Number(value).toFixed(2)}`;

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  return (
    <div className="star-rating" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        if (i < fullStars) return <span key={i} className="star star-full">★</span>;
        if (i === fullStars && hasHalf) return <span key={i} className="star star-half">★</span>;
        return <span key={i} className="star star-empty">☆</span>;
      })}
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [page, setPage] = useState(1);

  const categories = ["All", ...new Set(product.map((p) => p.category))];

  const filtered = useMemo(() => {
    return activeCategory === "All"
      ? product
      : product.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const sorted = useMemo(() => {
    const items = [...filtered];
    switch (sortBy) {
      case "price-asc":
        return items.sort((a, b) => a.price - b.price);
      case "price-desc":
        return items.sort((a, b) => b.price - a.price);
      case "rating":
        return items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "name":
        return items.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return items;
    }
  }, [filtered, sortBy]);

  // All products shown, no pagination needed
  const pageItems = sorted;

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1);
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="dashboard-page">

      {/* HERO BANNER */}
      <section className="products-hero">
        <div className="products-hero-inner">
          <div className="products-hero-content">
            <span className="products-hero-eyebrow">UPROOT CLEAN</span>
            <h1>Best Sellers</h1>
            <p>
              Explore all of our top-rated pet hair removers at Uproot
              Clean. Our expert tools easily clean pet fur from carpets,
              rugs, furniture, clothing, and more.
            </p>
          </div>
        </div>
      </section>

      <div className="dashboard-container">

        {/* CATEGORY FILTERS */}
        {/* <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div> */}

        {/* TOOLBAR: SORT */}
        {/*<div className="products-toolbar">
           <label className="sort-control">
            <span className="sort-label">Sort By</span>
            <select value={sortBy} onChange={handleSortChange}>
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <span className="products-count">
            {sorted.length} Product{sorted.length === 1 ? "" : "s"}
          </span>
        </div> */}

        {/* PRODUCT GRID */}
        <div className="products-grid">
          {pageItems.map((p) => {
            const badgeLabel = !p.inStock ? "Sold Out" : p.badge;
            const badgeClass = !p.inStock
              ? "badge-sold-out"
              : p.badge
                ? `badge-${p.badge.toLowerCase().replace(/\s/g, "-")}`
                : "";

            const comparePrice = p.compareAtPrice || p.originalPrice;

            return (
              <div
                key={p.id}
                className="product-card"
                onClick={() => handleProductClick(p.id)}
              >
                <div className="product-card-image">
                  {badgeLabel && (
                    <span className={`product-badge ${badgeClass}`}>
                      {badgeLabel}
                    </span>
                  )}
                  <img
                    src={p.images?.main || p.image}
                    alt={p.name}
                    loading="lazy"
                    onError={(e) => {
                      const fallback =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' fill='%23f6f7f8'%3E%3Crect width='600' height='600'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='18'%3EImage unavailable%3C/text%3E%3C/svg%3E";
                      if (e.target.src !== fallback) {
                        e.target.src = fallback;
                      } else {
                        e.target.style.display = "none";
                      }
                    }}
                  />
                </div>

                <div className="product-card-body">
                  {p.rating && (
                    <div className="product-rating-row">
                      <StarRating rating={p.rating} />
                      {p.reviews && (
                        <span className="product-review-count">
                          ({p.reviews.toLocaleString()})
                        </span>
                      )}
                    </div>
                  )}

                  <h3 className="product-name">{p.name}</h3>

                  <div className="product-price-row">
                    <span className="product-price">
                      {formatPrice(p.price)}
                    </span>
                    {comparePrice && comparePrice > p.price && (
                      <span className="product-price-compare">
                        {formatPrice(comparePrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {sorted.length === 0 && (
          <p className="no-products">No products found in this category.</p>
        )}


      </div>

      <SiteFooter />
    </div>
  );
};

export default Dashboard;
