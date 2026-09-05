import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { product } from "../data";
import SiteFooter from "./SiteFooter";
import "./Dashboard.css";

const formatPrice = (value) => `$${Number(value).toFixed(2)}`;

const IMG_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' fill='%23f6f7f8'%3E%3Crect width='600' height='600'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='18'%3EImage unavailable%3C/text%3E%3C/svg%3E";

const CAN_HOVER =
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

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

const isCardImageUrl = (url) =>
  typeof url === "string" &&
  url.trim() !== "" &&
  !/\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);

const ProductCard = ({ p, onClick }) => {
  const images = useMemo(() => {
    const candidates = p.images?.gallery?.length
      ? [p.images.main, ...p.images.gallery]
      : [p.images?.main || p.image];

    const unique = [];
    const seen = new Set();

    for (const src of candidates) {
      if (!isCardImageUrl(src) || seen.has(src)) continue;
      seen.add(src);
      unique.push(src);
    }

    return unique;
  }, [p]);

  const [active, setActive] = useState(0);
  const intervalRef = useRef(null);

  const canAutoPlay = CAN_HOVER && images.length > 1;

  const stopAuto = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startAuto = () => {
    if (!canAutoPlay) return;

    stopAuto();

    // Warm the next slide so it isn't blank on first transition
    images.slice(1, 3).forEach((src) => {
      const preload = new Image();
      preload.src = src;
    });

    intervalRef.current = setInterval(() => {
      setActive((current) => (current + 1) % images.length);
    }, 1400);
  };

  const stopAndReset = () => {
    stopAuto();
    setActive(0);
  };

  useEffect(() => stopAuto, []);

  const badgeLabel = !p.inStock ? "Sold Out" : p.badge;
  const badgeClass = !p.inStock
    ? "badge-sold-out"
    : p.badge
      ? `badge-${p.badge.toLowerCase().replace(/\s/g, "-")}`
      : "";

  const comparePrice = p.compareAtPrice || p.originalPrice;

  return (
    <div className="product-card" onClick={onClick}>
      <div className="product-card-image">
        {badgeLabel && (
          <span className={`product-badge ${badgeClass}`}>
            {badgeLabel}
          </span>
        )}

        <div
          className="product-image-carousel"
          onMouseEnter={startAuto}
          onMouseLeave={stopAndReset}
        >
          <div
            className="product-image-track"
            style={{
              transform: `translateX(-${active * 100}%)`,
              transition: canAutoPlay
                ? "transform 0.45s ease-in-out"
                : "none",
            }}
          >
            {images.map((src, index) => (
              <img
                key={`${src}-${index}`}
                src={src}
                alt={p.name}
                loading={index < 2 ? "eager" : "lazy"}
                decoding="async"
                onError={(e) => {
                  if (e.currentTarget.src !== IMG_FALLBACK) {
                    e.currentTarget.src = IMG_FALLBACK;
                  }
                }}
              />
            ))}
          </div>
        </div>
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
};

const Dashboard = () => {
  const navigate = useNavigate();

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

        {/* PRODUCT GRID */}
        <div className="products-grid">
          {product.map((p) => (
            <ProductCard
              key={p.id}
              p={p}
              onClick={() => handleProductClick(p.id)}
            />
          ))}
        </div>

        {product.length === 0 && (
          <p className="no-products">No products available.</p>
        )}
      </div>

      <SiteFooter />
    </div>
  );
};

export default Dashboard;
