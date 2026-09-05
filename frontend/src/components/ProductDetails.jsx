import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { product } from "../data";
import SiteFooter from "./SiteFooter";
import ReferencePdpSections from "./ReferencePdpSections";
import LintProPdpSections from "./LintProPdpSections";
import GroomingGlovesPdpSections from "./GroomingGlovesPdpSections";
import PetGroomingKitPdpSections from "./PetGroomingKitPdpSections";
import MoldStainRemoverPdpSections from "./MoldStainRemoverPdpSections";
import LcpPdpSections from "./LcpPdpSections";
import "./ProductDetails.css";

/** Product-specific full PDP below-the-fold layouts (isolated per product). */
const CUSTOM_PDP_LAYOUTS = {
  "lint-pro": LintProPdpSections,
  "cleaner-tools": LintProPdpSections,
  "grooming-gloves": GroomingGlovesPdpSections,
  "pet-grooming-kit": PetGroomingKitPdpSections,
  "mold-stain-remover": MoldStainRemoverPdpSections,
  "laundry-cycle-pro": LcpPdpSections,
};

const formatPrice = (value) => `$${Number(value || 0).toFixed(2)}`;

const formatReviews = (value) =>
  new Intl.NumberFormat("en-US").format(value || 0);

const formatSpecKey = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase());

const formatReviewDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getUrlPath = (url) => {
  if (!url || typeof url !== "string") return "";
  return url.split("?")[0].toLowerCase();
};

const isVideoUrl = (url) =>
  /\.(mp4|webm|ogg|mov)$/i.test(getUrlPath(url));

const isDemoGif = (url) => getUrlPath(url).endsWith(".gif");

/** Collect demo media from `videos` and gallery GIFs (no invented URLs). */
const collectDemoMedia = (prod) => {
  const demos = [];
  const seen = new Set();

  const push = (src, type) => {
    if (!src || seen.has(src)) return;
    seen.add(src);
    demos.push({ src, type });
  };

  (prod.videos || []).forEach((url) => {
    if (isVideoUrl(url)) push(url, "video");
    else if (isDemoGif(url)) push(url, "gif");
    else push(url, "video");
  });

  (prod.images?.gallery || []).forEach((url) => {
    if (isDemoGif(url)) push(url, "gif");
  });

  return demos;
};

const DemoMedia = ({ item, className = "", alt = "" }) => {
  if (!item) return null;

  if (item.type === "gif") {
    return (
      <img
        src={item.src}
        alt={alt}
        className={`up-demo-gif ${className}`.trim()}
        loading="lazy"
      />
    );
  }

  return (
    <video
      controls
      preload="metadata"
      playsInline
      src={item.src}
      className={className}
      aria-label={alt}
    />
  );
};

/* ============================================================
   STAR RATING
============================================================ */

const StarRating = ({ rating = 5, reviews = 0, showCount = true }) => {
  const rounded = Math.round(Number(rating) || 0);

  return (
    <div className="up-star-rating">
      <div className="up-stars" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rounded ? "up-star active" : "up-star"}
          >
            ★
          </span>
        ))}
      </div>

      {showCount && (
        <span className="up-review-link">
          {formatReviews(reviews)} Reviews
        </span>
      )}
    </div>
  );
};

/* ============================================================
   IMAGE GALLERY
============================================================ */

const ProductGallery = ({ prod, featuredImage = null }) => {
  const allImages = useMemo(() => {
    const gallery = prod.images?.gallery?.length
      ? [prod.images.main, ...prod.images.gallery].filter(Boolean)
      : [prod.images?.main || prod.image].filter(Boolean);

    if (featuredImage) {
      return [featuredImage, ...gallery.filter((src) => src !== featuredImage)];
    }

    return gallery;
  }, [prod, featuredImage]);

  const [selected, setSelected] = useState(0);

  useEffect(() => {
    setSelected(0);
  }, [prod.id, featuredImage]);

  const previous = () => {
    setSelected((current) =>
      current === 0 ? allImages.length - 1 : current - 1
    );
  };

  const next = () => {
    setSelected((current) =>
      current === allImages.length - 1 ? 0 : current + 1
    );
  };

  const touchStartXRef = useRef(null);

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;

    if (Math.abs(deltaX) > 45) {
      if (deltaX < 0) next();
      else previous();
    }

    touchStartXRef.current = null;
  };

  if (!allImages.length) {
    return (
      <div className="up-gallery-empty">Product image unavailable</div>
    );
  }

  return (
    <div className="up-gallery">
      <div className="up-thumbnails">
        {allImages.map((src, index) => (
          <button
            key={`${src}-${index}`}
            className={`up-thumbnail ${
              selected === index ? "selected" : ""
            } ${isDemoGif(src) ? "is-demo" : ""}`}
            onClick={() => setSelected(index)}
            type="button"
            aria-label={`Thumbnail ${index + 1}`}
          >
            <img
              src={src}
              alt={`${prod.name} thumbnail ${index + 1}`}
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
            {isDemoGif(src) && (
              <span className="up-thumb-demo-label">Demo</span>
            )}
          </button>
        ))}
      </div>

      <div
        className="up-main-image"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          className="up-gallery-arrow up-gallery-prev"
          onClick={previous}
          type="button"
          aria-label="Previous product image"
        >
          ‹
        </button>

        <img
          src={allImages[selected]}
          alt={prod.name}
          className="up-main-product-image"
          draggable={false}
          onError={(e) => {
            e.currentTarget.style.visibility = "hidden";
          }}
        />

        <button
          className="up-gallery-arrow up-gallery-next"
          onClick={next}
          type="button"
          aria-label="Next product image"
        >
          ›
        </button>

        <div className="up-image-counter">
          {selected + 1} / {allImages.length}
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   STICKY CART BAR
============================================================ */

const StickyCart = ({
  prod,
  image,
  price,
  onBuyNow,
  canBuy,
  ctaLabel = "Buy it now",
}) => (
  <div className="up-sticky-cart">
    <div className="up-sticky-inner">
      <div className="up-sticky-product">
        <img src={image} alt={prod.name} />

        <div>
          <strong>{prod.name}</strong>
          <span>{price}</span>
        </div>
      </div>

      <button
        type="button"
        className="up-btn up-btn-buy up-sticky-button"
        onClick={onBuyNow}
        disabled={!canBuy}
      >
        {ctaLabel}
      </button>
    </div>
  </div>
);

/* ============================================================
   MOBILE BUY BAR
============================================================ */

const MobileBuyBar = ({
  price,
  onBuyNow,
  canBuy,
  ctaLabel = "BUY IT NOW",
}) => (
  <div className="up-mobile-buybar">
    <div className="up-mobile-buybar-inner">
      <div className="up-mobile-buybar-price">
        <span>Total</span>
        <strong>{price}</strong>
      </div>

      <button
        type="button"
        className="up-btn up-btn-primary up-mobile-buybar-button"
        onClick={onBuyNow}
        disabled={!canBuy}
      >
        {canBuy ? ctaLabel : "SOLD OUT"}
      </button>
    </div>
  </div>
);

/* ============================================================
   MAIN COMPONENT
============================================================ */

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const prod = product.find(
    (p) => p.id === Number(id) || p.handle === id
  );

  const [showSticky, setShowSticky] = useState(false);
  const [specsOpen, setSpecsOpen] = useState(true);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 550);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setSelectedVariantIndex(0);
    setDetailsOpen(false);
    setQuantity(1);
    setOpenFaq(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // Seed option selections when product changes
  useEffect(() => {
    if (!prod?.optionAxes?.length) {
      setSelectedOptions({});
      return;
    }
    const next = {};
    prod.optionAxes.forEach((axis) => {
      next[axis.key] = axis.values?.[0];
    });
    setSelectedOptions(next);
  }, [id, prod?.id]);

  if (!prod) {
    return (
      <main className="up-product-page">
        <div className="up-container">
          <div className="up-not-found">
            <h2>Product not found</h2>

            <button
              type="button"
              className="up-btn up-btn-primary"
              onClick={() => navigate("/")}
            >
              Back to Products
            </button>
          </div>
        </div>
      </main>
    );
  }

  const isReference = prod.pdpStyle === "reference";
  const CustomPdpSections = CUSTOM_PDP_LAYOUTS[prod.pdpLayout] || null;
  const isCustomPdp = Boolean(CustomPdpSections);
  const hasOptionAxes = Boolean(prod.optionAxes?.length);

  const allImages = prod.images?.gallery?.length
    ? [prod.images.main, ...prod.images.gallery].filter(Boolean)
    : [prod.images?.main || prod.image].filter(Boolean);

  const variants = prod.variants || [];
  const optionAxes = prod.optionAxes || [];
  const primaryAxes = optionAxes.slice(0, -1);
  const lastAxis = optionAxes[optionAxes.length - 1] || null;

  const currentVariant = hasOptionAxes
    ? variants.find((variant) =>
        optionAxes.every(
          (axis) => variant[axis.key] === selectedOptions[axis.key]
        )
      ) || variants[0]
    : variants[selectedVariantIndex] || null;

  const displayTitle = currentVariant?.displayName || prod.name;
  const featuredImage = currentVariant?.image || null;

  const mainImage = featuredImage || allImages[0];
  const staticImages = allImages.filter((src) => !isDemoGif(src));
  const featureImage = featuredImage || staticImages[0] || mainImage;
  const secondaryImage = staticImages[1] || staticImages[0] || mainImage;

  const activePrice = currentVariant ? currentVariant.price : prod.price;
  const activeComparePrice =
    currentVariant?.compareAtPrice ||
    prod.compareAtPrice ||
    (prod.originalPrice > prod.price ? prod.originalPrice : 0) ||
    0;

  const savings =
    activeComparePrice > activePrice
      ? activeComparePrice - activePrice
      : 0;

  const variantAvailable =
    currentVariant == null || currentVariant.available !== false;
  const canBuy = Boolean(prod.inStock && variantAvailable);

  const benefits = prod.benefits?.length > 0 ? prod.benefits : [];
  const ingredients = prod.ingredients || [];
  const trustBadges = prod.trustBadges || [];
  const promoGift = prod.promoGift || null;

  const bestValueIndex = (() => {
    if (variants.length < 2) return -1;
    let bestIdx = -1;
    let bestPct = 0;
    variants.forEach((variant, idx) => {
      if (
        variant.compareAtPrice &&
        variant.compareAtPrice > variant.price
      ) {
        const pct =
          (variant.compareAtPrice - variant.price) / variant.compareAtPrice;
        if (pct > bestPct) {
          bestPct = pct;
          bestIdx = idx;
        }
      }
    });
    return bestIdx;
  })();

  const lastAxisVariants = lastAxis
    ? variants.filter((variant) =>
        primaryAxes.every(
          (axis) => variant[axis.key] === selectedOptions[axis.key]
        )
      )
    : [];

  const setOptionValue = (key, value) => {
    setSelectedOptions((current) => ({ ...current, [key]: value }));
  };

  const relatedProducts = (() => {
    const others = product.filter((item) => item.id !== prod.id);
    const sameCategory = others.filter(
      (item) => item.category && item.category === prod.category
    );
    const rest = others.filter(
      (item) => !item.category || item.category !== prod.category
    );
    return [...sameCategory, ...rest].slice(0, 3);
  })();

  const demoMedia = collectDemoMedia(prod);
  const designedToClean = prod.designedToClean || [];
  const cleansCategories = prod.cleansCategories || [];
  const howWorks = prod.howItWorks || prod.howToUse || null;
  const faqs = prod.faqs || [];
  const reviewsList = prod.reviewsList || [];
  const bundles = prod.bundles || [];
  const functions = prod.functions || [];
  const quietTech = prod.quietTechnology || null;
  const pressMentions = prod.pressMentions || [];
  const comparedTo = prod.comparedTo || null;
  const guarantee = prod.guarantee || null;

  const angleModes =
    prod.specs?.cleaningModes
      ?.split(",")
      .map((mode) => mode.trim())
      .filter(Boolean) || [];

  const cleansItems = cleansCategories.length
    ? cleansCategories.map((item) => ({
        name: item.name,
        text: item.description,
      }))
    : prod.surfacesItWorksOn?.length
      ? prod.surfacesItWorksOn.map((item) => ({ name: item }))
      : [];

  const whyStory = prod.whyItMatters || prod.whyBleachFree || null;
  const reasonList = prod.reasonsToSwitch || [];

  const resultHighlights = benefits.slice(0, 3);

  const handleBuyNow = () => {
    navigate("/checkout", {
      state: {
        productId: prod.id,
        quantity,
        variantId: currentVariant?.id,
        variantTitle: currentVariant?.title,
        price: activePrice,
      },
    });
  };

  const decrementQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const incrementQuantity = () => {
    setQuantity((current) => current + 1);
  };

  return (
    <main
      className={`up-product-page ${
        isReference ? "up-pdp-reference" : ""
      }`}
    >
      {/* <div className="up-announcement">
        Free shipping on orders over $49
      </div> */}

      <header className="up-site-header">
        <button
          type="button"
          className="up-brand"
          onClick={() => navigate("/")}
        >
          UPROOT CLEAN
        </button>
      </header>

      {showSticky && (
        <StickyCart
          prod={{ ...prod, name: displayTitle }}
          image={featureImage}
          price={formatPrice(activePrice * quantity)}
          onBuyNow={handleBuyNow}
          canBuy={canBuy}
          ctaLabel={isReference ? "Add to cart" : "Buy it now"}
        />
      )}

      <MobileBuyBar
        price={formatPrice(activePrice * quantity)}
        onBuyNow={handleBuyNow}
        canBuy={canBuy}
        ctaLabel={isReference ? "Add to cart" : "BUY IT NOW"}
      />

      {/* ======================================================
          HERO SECTION
      ====================================================== */}
      <section className="up-hero">
        <div className="up-container">
          <button
            type="button"
            className="up-back"
            onClick={() => navigate("/")}
          >
            ← Back to Products
          </button>

          <div className="up-hero-grid">
            <ProductGallery prod={prod} featuredImage={featuredImage} />

            <div className="up-product-info">
              <div className="up-product-info-scroll">
              <StarRating rating={prod.rating} reviews={prod.reviews} />

              <h1 className="up-product-title">{displayTitle}</h1>

              {prod.subtitle && (
                <p className="up-product-subtitle">{prod.subtitle}</p>
              )}

              <div className="up-price-row">
                <span className="up-current-price">
                  {formatPrice(activePrice)}
                </span>

                {activeComparePrice > activePrice && (
                  <del className="up-old-price">
                    {formatPrice(activeComparePrice)}
                  </del>
                )}

                {savings > 0 && (
                  <span className="up-save-badge">
                    SAVE {formatPrice(savings)}
                  </span>
                )}
              </div>

              {benefits.length > 0 && (
                <div className="up-benefits">
                  {benefits.map((benefit, index) => (
                    <div className="up-benefit" key={index}>
                      <span className="up-benefit-check">✓</span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              )}

              {hasOptionAxes ? (
                <>
                  {primaryAxes.map((axis) => (
                    <div className="up-option-group" key={axis.key}>
                      <div className="up-option-label-row">
                        <span className="up-option-label">{axis.name}</span>
                        {axis.key === "style" && prod.comparisonTable && (
                          <a href="#uc-comparison" className="up-help-choose">
                            (Help me choose)
                          </a>
                        )}
                      </div>
                      <div className="up-style-options">
                        {axis.values.map((value) => (
                          <button
                            key={value}
                            type="button"
                            className={`up-style-pill ${
                              selectedOptions[axis.key] === value
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => setOptionValue(axis.key, value)}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {lastAxis && (
                    <div className="up-option-group">
                      <span className="up-option-label">{lastAxis.name}</span>
                      <div className="up-size-options">
                        {lastAxisVariants.map((variant) => {
                          const value = variant[lastAxis.key];
                          const isSelected =
                            selectedOptions[lastAxis.key] === value;
                          const diff =
                            variant.compareAtPrice &&
                            variant.compareAtPrice > variant.price
                              ? variant.compareAtPrice - variant.price
                              : null;

                          return (
                            <button
                              key={variant.id}
                              type="button"
                              className={`up-size-pill ${
                                isSelected ? "selected" : ""
                              }`}
                              onClick={() =>
                                setOptionValue(lastAxis.key, value)
                              }
                              disabled={variant.available === false}
                            >
                              {variant.badge && (
                                <span
                                  className={`up-size-ribbon ${
                                    variant.badge === "Best Value"
                                      ? "value"
                                      : "popular"
                                  }`}
                                >
                                  {variant.badge}
                                </span>
                              )}
                              <span className="up-size-pill-left">
                                <strong>{value}</strong>
                                {diff && (
                                  <small>Save {formatPrice(diff)}</small>
                                )}
                              </span>
                              <span className="up-size-pill-right">
                                {formatPrice(variant.price)}
                                {variant.compareAtPrice > variant.price && (
                                  <del>
                                    {formatPrice(variant.compareAtPrice)}
                                  </del>
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="up-payment-note">
                    <span>✓</span>
                    Free shipping on qualifying orders over $49
                  </div>

                  <div className="up-quantity-row">
                    <span className="up-quantity-label">Quantity</span>

                    <div className="up-quantity-control">
                      <button
                        type="button"
                        className="up-qty-btn up-qty-btn-minus"
                        onClick={decrementQuantity}
                        disabled={quantity <= 1 || !canBuy}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <span className="up-qty-value">{quantity}</span>

                      <button
                        type="button"
                        className="up-qty-btn up-qty-btn-plus"
                        onClick={incrementQuantity}
                        disabled={!canBuy}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="up-quantity-total">
                      <span>Total</span>
                      <strong>
                        {formatPrice(activePrice * quantity)}
                      </strong>
                    </div>
                  </div>

                  {variants.length > 1 && (
                    <div
                      className="up-pack-selector"
                      aria-label="Choose options"
                    >
                      {variants.map((variant, idx) => {
                        const isSelected = selectedVariantIndex === idx;
                        const isUnavailable = variant.available === false;
                        const diff =
                          variant.compareAtPrice &&
                          variant.compareAtPrice > variant.price
                            ? variant.compareAtPrice - variant.price
                            : null;

                        return (
                          <button
                            key={variant.id || idx}
                            type="button"
                            className={`up-pack-option ${
                              isSelected ? "selected" : ""
                            } ${isUnavailable ? "unavailable" : ""}`}
                            onClick={() => setSelectedVariantIndex(idx)}
                            disabled={isUnavailable}
                          >
                            <span className="up-pack-label">
                              {variant.title}
                            </span>
                            <strong>{formatPrice(variant.price)}</strong>
                            {diff && (
                              <small className="up-pack-savings">
                                Save {formatPrice(diff)}
                              </small>
                            )}
                            {!diff && idx === bestValueIndex && (
                              <small className="up-pack-badge">
                                Best Value
                              </small>
                            )}
                            {isUnavailable && (
                              <small className="up-pack-badge">
                                Unavailable
                              </small>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {hasOptionAxes && (
                <div className="up-quantity-row up-quantity-compact">
                  <span className="up-quantity-label">Quantity</span>
                  <div className="up-quantity-control">
                    <button
                      type="button"
                      className="up-qty-btn up-qty-btn-minus"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1 || !canBuy}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="up-qty-value">{quantity}</span>
                    <button
                      type="button"
                      className="up-qty-btn up-qty-btn-plus"
                      onClick={incrementQuantity}
                      disabled={!canBuy}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div
                className={`up-stock ${
                  canBuy ? "available" : "unavailable"
                }`}
              >
                <span className="up-stock-dot" />
                {canBuy ? "In Stock" : "Sold Out"}
              </div>

              {promoGift && (
                <div className="up-promo-gift">
                  <span className="up-promo-free">FREE</span>
                  <img
                    src={promoGift.icon}
                    alt={promoGift.label}
                    className="up-promo-gift-icon"
                  />
                  <div>
                    <strong>
                      {promoGift.label}{" "}
                      <span>{promoGift.value}</span>
                    </strong>
                    <p>{promoGift.note}</p>
                  </div>
                </div>
              )}

              {guarantee && !isReference && (
                <div className="up-guarantee-note">
                  <span>✓</span>
                  {guarantee}
                </div>
              )}

              {trustBadges.length > 0 && (
                <ul className="up-trust-row">
                  {trustBadges.map((badge) => (
                    <li key={badge.label}>
                      <img src={badge.image} alt="" loading="lazy" />
                      <span>{badge.label}</span>
                    </li>
                  ))}
                </ul>
              )}

              {(prod.description || ingredients.length > 0) &&
                isReference && (
                  <div className="up-details-accordion">
                    <button
                      type="button"
                      className="up-details-accordion-btn"
                      onClick={() => setDetailsOpen((open) => !open)}
                      aria-expanded={detailsOpen}
                    >
                      <span>Product Details & Ingredients</span>
                      <span>{detailsOpen ? "−" : "+"}</span>
                    </button>
                    {detailsOpen && (
                      <div className="up-details-accordion-body">
                        {prod.description && <p>{prod.description}</p>}
                        {ingredients.length > 0 && (
                          <>
                            <strong>Ingredients</strong>
                            <ul>
                              {ingredients.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="up-product-info-cta">
                <button
                  type="button"
                  className={`up-btn up-btn-buy ${
                    isReference ? "up-btn-shine" : ""
                  }`}
                  onClick={handleBuyNow}
                  disabled={!canBuy}
                >
                  <span>
                    {canBuy
                      ? isReference
                        ? "Add to cart"
                        : "BUY IT NOW"
                      : "SOLD OUT"}
                  </span>
                  {canBuy && !isReference && (
                    <span className="up-btn-buy-arrow">→</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isReference ? (
        <>
          {CustomPdpSections ? (
            <CustomPdpSections
              prod={prod}
              openFaq={openFaq}
              setOpenFaq={setOpenFaq}
            />
          ) : (
            <>
              <ReferencePdpSections prod={prod} />

              {howWorks?.steps?.length > 0 && (
                <section className="up-how-section">
                  <div className="up-container">
                    <div className="up-section-heading">
                      <span className="up-eyebrow">SIMPLE TO USE</span>
                      <h2>{howWorks.title || "How to Use"}</h2>
                      {howWorks.description && <p>{howWorks.description}</p>}
                    </div>

                    <div className="up-how-wrap">
                      <div className="up-steps">
                        {howWorks.steps.map((step, index) => (
                          <div className="up-step" key={index}>
                            <span className="up-step-number">{index + 1}</span>
                            <div>
                              <h3>{step.title}</h3>
                              {step.description && <p>{step.description}</p>}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="up-how-image">
                        <img src={featureImage} alt={displayTitle} />
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
        </>
      ) : (
        <>
      {/* ======================================================
          DEMO / VIDEO GALLERY (only when media exists)
      ====================================================== */}
      {demoMedia.length > 0 && (
        <section className="up-video-gallery-section">
          <div className="up-container">
            <div className="up-section-heading">
              <span className="up-eyebrow">SEE IT IN ACTION</span>
              <h2>See It In Action</h2>
              <p>
                Watch how {prod.name} performs in real cleaning situations.
              </p>
            </div>

            <div
              className={`up-video-gallery ${
                demoMedia.length === 1
                  ? "single"
                  : demoMedia.length === 2
                    ? "pair"
                    : ""
              }`}
            >
              {demoMedia.map((item, index) => (
                <article
                  className="up-video-card"
                  key={`${item.src}-${index}`}
                >
                  <DemoMedia
                    item={item}
                    alt={`${prod.name} demonstration ${index + 1}`}
                  />
                  <span className="up-video-duration">
                    {item.type === "gif" ? "LIVE DEMO" : "PLAY DEMO"}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          FEATURE & DETAILS
      ====================================================== */}
      {(prod.description || designedToClean.length > 0) && (
        <section className="up-video-detail-section">
          <div className="up-container up-video-detail-grid">
            <div className="up-video-feature">
              {demoMedia[0] ? (
                <DemoMedia
                  item={demoMedia[0]}
                  alt={`${prod.name} cleaning demonstration`}
                />
              ) : (
                <img
                  src={featureImage}
                  alt={prod.name}
                  className="up-feature-media-img"
                />
              )}
            </div>

            <div className="up-video-detail-copy">
              <span className="up-eyebrow">
                {prod.badge ? prod.badge.toUpperCase() : "PRODUCT DETAILS"}
              </span>
              <h2>{prod.name}</h2>
              {prod.subtitle && <p>{prod.subtitle}</p>}
              {prod.description && <p>{prod.description}</p>}

              {designedToClean.length > 0 && (
                <>
                  <strong>Designed to clean:</strong>
                  <div className="up-use-tags">
                    {designedToClean.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          HOW TO USE / ANGLE MODES
      ====================================================== */}
      {(angleModes.length > 0 || (howWorks && howWorks.steps?.length)) && (
        <section className="up-how-video-section">
          <div className="up-container up-video-detail-grid reverse">
            <div className="up-video-detail-copy">
              <span className="up-eyebrow">GET EFFECTIVE RESULTS</span>
              <h2>How to Use</h2>
              {howWorks?.description ? (
                <p>{howWorks.description}</p>
              ) : (
                <p>
                  Follow these simple steps to get the best results with{" "}
                  {prod.name}.
                </p>
              )}

              {angleModes.length > 0 && (
                <div className="up-angle-list">
                  {angleModes.map((mode) => {
                    const [title, ...rest] = mode.split(" for ");
                    const detail = rest.length
                      ? `for ${rest.join(" for ")}`
                      : "";

                    return (
                      <div className="up-angle-item" key={mode}>
                        <span className="up-angle-mark">∠</span>
                        <span>
                          {detail ? (
                            <>
                              <strong>{title}</strong>
                              <small>{detail}</small>
                            </>
                          ) : (
                            <strong>{mode}</strong>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {howWorks?.steps && angleModes.length === 0 && (
                <div className="up-step-condensed-list">
                  {howWorks.steps.map((s, idx) => (
                    <div key={idx} className="up-condensed-step">
                      <span className="up-step-num-pill">{idx + 1}</span>
                      <div>
                        <strong>{s.title}</strong>
                        <p>{s.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="up-video-feature">
              {demoMedia[1] || demoMedia[0] ? (
                <DemoMedia
                  item={demoMedia[1] || demoMedia[0]}
                  alt={`How to use ${prod.name}`}
                />
              ) : (
                <img
                  src={secondaryImage}
                  alt={`${prod.name} in use`}
                  className="up-feature-media-img"
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          KEY BENEFITS / RESULTS (data-driven)
      ====================================================== */}
      {resultHighlights.length > 0 && (
        <section className="up-results-section">
          <div className="up-container">
            <div className="up-section-heading">
              <span className="up-eyebrow">WHY IT WORKS</span>
              <h2>
                Built For
                <br />
                Real Results
              </h2>
              {prod.subtitle && <p>{prod.subtitle}</p>}
            </div>

            <div className="up-result-grid">
              {resultHighlights.map((benefit, index) => (
                <div className="up-result-card" key={index}>
                  <div className="up-result-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h3>{benefit}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          FUNCTIONS + QUIET TECHNOLOGY
      ====================================================== */}
      {(functions.length > 0 || quietTech) && (
        <section className="up-functions-section">
          <div className="up-container">
            <div className="up-section-heading">
              <span className="up-eyebrow">CAPABILITIES</span>
              <h2>
                {quietTech?.name
                  ? quietTech.name
                  : "What It Can Do"}
              </h2>
              {quietTech?.description && <p>{quietTech.description}</p>}
            </div>

            {functions.length > 0 && (
              <div className="up-function-tags">
                {functions.map((fn) => (
                  <span key={fn} className="up-function-tag">
                    {fn}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ======================================================
          BUNDLES
      ====================================================== */}
      {bundles.length > 0 && (
        <section className="up-bundles-section">
          <div className="up-container">
            <div className="up-section-heading">
              <span className="up-eyebrow">SAVE MORE</span>
              <h2>Available Bundles</h2>
              <p>Pair {prod.name} with curated kits for better value.</p>
            </div>

            <div className="up-bundles-grid">
              {bundles.map((bundle, index) => {
                const bundleSave =
                  bundle.originalPrice > bundle.price
                    ? bundle.originalPrice - bundle.price
                    : 0;

                return (
                  <article className="up-bundle-card" key={index}>
                    <h3>{bundle.name}</h3>
                    <div className="up-bundle-pricing">
                      <strong>{formatPrice(bundle.price)}</strong>
                      {bundle.originalPrice > bundle.price && (
                        <del>{formatPrice(bundle.originalPrice)}</del>
                      )}
                      {bundleSave > 0 && (
                        <span className="up-save-badge">
                          SAVE {formatPrice(bundleSave)}
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          PRESS MENTIONS
      ====================================================== */}
      {pressMentions.length > 0 && (
        <section className="up-press-section">
          <div className="up-container">
            <div className="up-section-heading">
              <span className="up-eyebrow">AS SEEN IN</span>
              <h2>Trusted By Leading Media</h2>
            </div>

            <div className="up-press-row">
              {pressMentions.map((name) => (
                <span key={name} className="up-press-item">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          PRODUCT COMPARISON / RELATED
      ====================================================== */}
      {relatedProducts.length > 0 && (
        <section className="up-comparison-section">
          <div className="up-container">
            <div className="up-section-heading">
              <span className="up-eyebrow">EXPLORE MORE</span>
              <h2>
                Find The Right Tool
                <br />
                For The Job
              </h2>
              {comparedTo?.note ? (
                <p className="up-compared-note">{comparedTo.note}</p>
              ) : prod.category ? (
                <p>
                  Browse related products
                  {prod.category ? ` in ${prod.category}` : ""}.
                </p>
              ) : null}
            </div>

            <div className="up-comparison-grid">
              <div className="up-comparison-card featured">
                <div className="up-comparison-image">
                  <img src={featureImage} alt={prod.name} />
                </div>

                <span className="up-comparison-label">CURRENT PRODUCT</span>

                <h3>{prod.name}</h3>
                {prod.subtitle ? (
                  <p>{prod.subtitle}</p>
                ) : prod.description ? (
                  <p>{prod.description}</p>
                ) : null}
                <strong>{formatPrice(activePrice)}</strong>

                <button
                  type="button"
                  className="up-small-button"
                  onClick={handleBuyNow}
                  disabled={!canBuy}
                >
                  BUY NOW
                </button>
              </div>

              {relatedProducts.map((item) => {
                const image = item.images?.main || item.image;

                return (
                  <div className="up-comparison-card" key={item.id}>
                    <div className="up-comparison-image">
                      <img src={image} alt={item.name} />
                    </div>

                    <span className="up-comparison-label">
                      {item.badge || item.category || "UPROOT CLEAN"}
                    </span>

                    <h3>{item.name}</h3>
                    {item.subtitle ? (
                      <p>{item.subtitle}</p>
                    ) : item.description ? (
                      <p>{item.description}</p>
                    ) : null}
                    <strong>{formatPrice(item.price)}</strong>

                    <button
                      type="button"
                      className="up-small-button"
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      VIEW PRODUCT
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          WHY THIS PRODUCT / THE UPROOT DIFFERENCE
      ====================================================== */}
      {benefits.length > 0 && (
        <section className="up-feature-section">
          <div className="up-container">
            <div className="up-feature-grid">
              <div className="up-feature-image">
                <img src={featureImage} alt={prod.name} />
              </div>

              <div className="up-feature-content">
                <span className="up-eyebrow">THE UPROOT DIFFERENCE</span>
                <h2>
                  There&apos;s A Better
                  <br />
                  Way To Clean.
                </h2>
                <p>
                  {prod.subtitle ||
                    `${prod.name} is designed to make cleaning quicker, deeper, and easier.`}
                </p>

                <div className="up-feature-list">
                  {benefits.slice(0, 5).map((benefit, index) => (
                    <div className="up-feature-item" key={index}>
                      <span>✓</span>
                      <p>{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          WHAT IT HANDLES
      ====================================================== */}
      {cleansItems.length > 0 && (
        <section className="up-cleans-section">
          <div className="up-container">
            <div className="up-section-heading">
              <span className="up-eyebrow">WHAT IT HANDLES</span>
              <h2>Everything It Tackles</h2>
              <p>Just some of the messes the {prod.name} takes care of.</p>
            </div>

            <div className="up-cleans-grid">
              {cleansItems.map((item, index) => (
                <div className="up-cleans-card" key={index}>
                  <span className="up-cleans-mark">✓</span>
                  <div>
                    <h3>{item.name}</h3>
                    {item.text && <p>{item.text}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          HOW IT WORKS (DETAILED STEPS)
      ====================================================== */}
      {howWorks && (
        <section className="up-how-section">
          <div className="up-container">
            <div className="up-section-heading">
              <span className="up-eyebrow">SIMPLE TO USE</span>
              <h2>{howWorks.title || "How It Works"}</h2>
              {howWorks.description && <p>{howWorks.description}</p>}
            </div>

            <div
              className={`up-how-wrap ${
                howWorks.steps?.length ? "" : "alone"
              }`}
            >
              {howWorks.steps?.length > 0 && (
                <div className="up-steps">
                  {howWorks.steps.map((step, index) => (
                    <div className="up-step" key={index}>
                      <span className="up-step-number">{index + 1}</span>
                      <div>
                        <h3>{step.title}</h3>
                        {step.description && <p>{step.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="up-how-image">
                <img src={featureImage} alt={prod.name} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          WHY IT MATTERS / THE UPROOT STORY
      ====================================================== */}
      {(whyStory || reasonList.length > 0) && (
        <section className="up-why-section">
          <div className="up-container">
            <div className="up-why-card">
              <span className="up-eyebrow">THE UPROOT DIFFERENCE</span>

              {whyStory ? (
                <>
                  <h2>{whyStory.title}</h2>
                  {whyStory.description && (
                    <p className="up-why-lead">{whyStory.description}</p>
                  )}

                  {whyStory.withoutUproot && (
                    <div className="up-vs-grid">
                      <div className="up-vs-col up-vs-bad">
                        <h3>Without Uproot</h3>
                        <ul>
                          {whyStory.withoutUproot.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="up-vs-col up-vs-good">
                        <h3>With Uproot</h3>
                        <ul>
                          {(whyStory.withUproot || []).map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <h2>Why Switch</h2>
              )}

              {reasonList.length > 0 && (
                <div className="up-feature-list up-why-reasons">
                  {reasonList.map((reason) => (
                    <div className="up-feature-item" key={reason}>
                      <span>✓</span>
                      <p>{reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          DESCRIPTION / SPECIFICATIONS
      ====================================================== */}
      {(prod.description ||
        (prod.specs && Object.keys(prod.specs).length > 0)) && (
        <section className="up-details-section">
          <div className="up-container">
            <div className="up-details-box">
              {prod.description && (
                <div className="up-details-description">
                  <span className="up-eyebrow">PRODUCT DETAILS</span>
                  <h2>Everything You Need To Know</h2>
                  <p>{prod.description}</p>
                </div>
              )}

              {prod.specs && Object.keys(prod.specs).length > 0 && (
                <div className="up-specs">
                  <button
                    type="button"
                    className="up-specs-header"
                    onClick={() => setSpecsOpen((open) => !open)}
                  >
                    <span>Product Specifications</span>
                    <span>{specsOpen ? "−" : "+"}</span>
                  </button>

                  {specsOpen && (
                    <div className="up-specs-content">
                      {Object.entries(prod.specs).map(([key, value]) => (
                        <div className="up-spec-row" key={key}>
                          <span>{formatSpecKey(key)}</span>
                          <strong>{value}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
        </>
      )}

      {/* ======================================================
          FREQUENTLY ASKED QUESTIONS (ACCORDION)
      ====================================================== */}
      {!isCustomPdp && faqs.length > 0 && (
        <section className="up-faq-section">
          <div className="up-container">
            <div className="up-section-heading">
              <span className="up-eyebrow">GOT QUESTIONS?</span>
              <h2>Frequently Asked Questions</h2>
              <p>
                Everything you need to know about using the {displayTitle}.
              </p>
            </div>

            <div className="up-faq-list">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className={`up-faq-item ${isOpen ? "open" : ""}`}
                  >
                    <button
                      type="button"
                      className="up-faq-question"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <span className="up-faq-toggle">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="up-faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          AUTHENTIC CUSTOMER REVIEWS
      ====================================================== */}
      {!isCustomPdp && reviewsList.length > 0 && (
        <section className="up-reviews-section">
          <div className="up-container">
            <div className="up-section-heading">
              <span className="up-eyebrow">REAL CUSTOMERS</span>
              <h2>See What Our Customers Are Saying</h2>

              <div className="up-review-summary">
                <div className="up-review-score">
                  {Number(prod.rating || 0).toFixed(1)}
                </div>

                <div>
                  <StarRating
                    rating={prod.rating}
                    reviews={prod.reviews}
                    showCount={false}
                  />
                  <p>Based on {formatReviews(prod.reviews)} reviews</p>
                </div>
              </div>
            </div>

            <div className="up-review-grid">
              {reviewsList.map((review, index) => {
                const reviewDate = formatReviewDate(review.date);

                return (
                  <article
                    className="up-review-card"
                    key={review.id || index}
                  >
                    <div className="up-review-stars">
                      {"★".repeat(review.rating || 5)}
                      {"☆".repeat(5 - (review.rating || 5))}
                    </div>

                    <h3>{review.title}</h3>
                    <p>{review.body}</p>

                    <div className="up-review-author">
                      <span className="up-avatar">✓</span>
                      <div>
                        <strong>{review.author}</strong>
                        <small>
                          {review.verified !== false
                            ? "Verified Buyer"
                            : "Customer Review"}
                          {reviewDate ? ` · ${reviewDate}` : ""}
                        </small>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          FINAL CTA
      ====================================================== */}
      <section className="up-final-cta">
        <div className="up-container">
          <div className="up-final-card">
            <div>
              <span className="up-eyebrow">READY TO CLEAN?</span>
              <h2>
                Make Cleaning
                <br />
                Easier Today.
              </h2>
              <p>
                Try {displayTitle}
                {guarantee ? ` with our ${guarantee}.` : "."}
              </p>
            </div>

            <div className="up-final-action">
              <span>{formatPrice(activePrice)}</span>
              <button
                type="button"
                className="up-btn up-btn-primary"
                onClick={handleBuyNow}
                disabled={!canBuy}
              >
                {canBuy ? (isReference ? "Add to cart" : "BUY IT NOW") : "SOLD OUT"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
};

export default ProductDetails;
