import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { product } from "../data";
import SiteFooter from "./SiteFooter";
import "./ProductDetails.css";

const DEFAULT_BENEFITS = [
  "Removes 99.99% of pet hair in seconds",
  "Works on carpets, rugs, couches, clothes & more",
  "Reusable forever — no refills needed",
  "Extremely easy to use",
  "60-Day Money Back Guarantee",
];

const formatPrice = (value) => `$${Number(value || 0).toFixed(2)}`;

const formatReviews = (value) =>
  new Intl.NumberFormat("en-US").format(value || 0);

const formatSpecKey = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase());

/* ============================================================
   STAR RATING
============================================================ */

const StarRating = ({ rating = 5, reviews = 0 }) => {
  const rounded = Math.round(rating);

  return (
    <div className="up-star-rating">
      <div className="up-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rounded ? "up-star active" : "up-star"}
          >
            ★
          </span>
        ))}
      </div>

      <span className="up-review-link">
        {formatReviews(reviews)} Reviews
      </span>
    </div>
  );
};

/* ============================================================
   IMAGE GALLERY
============================================================ */

const ProductGallery = ({ prod }) => {
  const allImages = useMemo(() => {
    if (prod.images?.gallery?.length) {
      return [prod.images.main, ...prod.images.gallery].filter(Boolean);
    }
    return [prod.images?.main || prod.image].filter(Boolean);
  }, [prod]);

  const [selected, setSelected] = useState(0);
  const [activeId, setActiveId] = useState(prod.id);

  if (activeId !== prod.id) {
    setActiveId(prod.id);
    setSelected(0);
  }

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
      if (deltaX < 0) {
        next();
      } else {
        previous();
      }
    }

    touchStartXRef.current = null;
  };

  if (!allImages.length) {
    return (
      <div className="up-gallery-empty">
        Product image unavailable
      </div>
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
            }`}
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

const StickyCart = ({ prod, image, price, onBuyNow }) => (
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
        disabled={!prod.inStock}
      >
        Buy it now
      </button>
    </div>
  </div>
);

/* ============================================================
   MOBILE BUY BAR
============================================================ */

const MobileBuyBar = ({ prod, price, onBuyNow }) => (
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
        disabled={!prod.inStock}
      >
        {prod.inStock ? "BUY IT NOW" : "SOLD OUT"}
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

  // Find product by id (or handle if routed by handle)
  const prod = product.find(
    (p) => p.id === Number(id) || p.handle === id
  );

  const [showSticky, setShowSticky] = useState(false);
  const [specsOpen, setSpecsOpen] = useState(true);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 550);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset variant and scroll to top when product ID changes
  useEffect(() => {
    setSelectedVariantIndex(0);
    setQuantity(1);
    setOpenFaq(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

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

  const allImages = prod.images?.gallery?.length
    ? [prod.images.main, ...prod.images.gallery].filter(Boolean)
    : [prod.images?.main || prod.image].filter(Boolean);

  const mainImage = allImages[0];

  const variants = prod.variants || [];
  const currentVariant = variants[selectedVariantIndex] || null;

  const activePrice = currentVariant ? currentVariant.price : prod.price;
  const activeComparePrice =
    currentVariant?.compareAtPrice ||
    prod.compareAtPrice ||
    prod.originalPrice ||
    0;

  const savings =
    activeComparePrice > activePrice
      ? activeComparePrice - activePrice
      : 0;

  const benefits =
    prod.benefits?.length > 0
      ? prod.benefits
      : DEFAULT_BENEFITS;

  const relatedProducts = product
    .filter((item) => item.id !== prod.id)
    .slice(0, 3);

  const prodVideos = prod.videos?.length ? prod.videos : [];
  const designedToClean = prod.designedToClean || [];
  const cleansCategories = prod.cleansCategories || [];
  const howWorks = prod.howItWorks || prod.howToUse || null;
  const faqs = prod.faqs || [];
  const reviewsList = prod.reviewsList || [];

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
    <main className="up-product-page">
      <div className="up-announcement">
        Free shipping on orders over $49
      </div>

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
          prod={prod}
          image={mainImage}
          price={formatPrice(activePrice * quantity)}
          onBuyNow={handleBuyNow}
        />
      )}

      <MobileBuyBar
        prod={prod}
        price={formatPrice(activePrice * quantity)}
        onBuyNow={handleBuyNow}
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
            {/* IMAGE GALLERY */}
            <ProductGallery prod={prod} />

            {/* PRODUCT INFO */}
            <div className="up-product-info">
              <StarRating
                rating={prod.rating}
                reviews={prod.reviews}
              />

              <h1 className="up-product-title">
                {prod.name}
              </h1>

              <p className="up-product-subtitle">
                {prod.subtitle ||
                  "Professional cleaning power designed to make cleaning faster, easier and more effective."}
              </p>

              {/* PRICING ROW */}
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

              <div className="up-payment-note">
                <span>✓</span>
                Free shipping on qualifying orders over $49
              </div>

              {/* QUANTITY ROW */}
              <div className="up-quantity-row">
                <span className="up-quantity-label">Quantity</span>

                <div className="up-quantity-control">
                  <button
                    type="button"
                    className="up-qty-btn up-qty-btn-minus"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1 || !prod.inStock}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>

                  <span className="up-qty-value">{quantity}</span>

                  <button
                    type="button"
                    className="up-qty-btn up-qty-btn-plus"
                    onClick={incrementQuantity}
                    disabled={!prod.inStock}
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

              {/* DYNAMIC VARIANT / PACK SELECTOR */}
              {variants.length > 1 && (
                <div className="up-pack-selector" aria-label="Choose options">
                  {variants.map((variant, idx) => {
                    const isSelected = selectedVariantIndex === idx;
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
                        }`}
                        onClick={() => setSelectedVariantIndex(idx)}
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
                        {!diff && idx === 1 && (
                          <small className="up-pack-badge">
                            Most Popular
                          </small>
                        )}
                        {!diff && idx === 2 && (
                          <small className="up-pack-badge">
                            Best Value
                          </small>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* BENEFITS LIST */}
              <div className="up-benefits">
                {benefits.map((benefit, index) => (
                  <div className="up-benefit" key={index}>
                    <span className="up-benefit-check">✓</span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* STOCK STATUS */}
              <div
                className={`up-stock ${
                  prod.inStock ? "available" : "unavailable"
                }`}
              >
                <span className="up-stock-dot" />
                {prod.inStock
                  ? "In Stock — Ready to Ship"
                  : "Sold Out"}
              </div>

              {/* BUY IT NOW */}
              <button
                type="button"
                className="up-btn up-btn-buy"
                onClick={handleBuyNow}
                disabled={!prod.inStock}
              >
                <span>{prod.inStock ? "BUY IT NOW" : "SOLD OUT"}</span>
                {prod.inStock && <span className="up-btn-buy-arrow">→</span>}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          MULTIPLE VIDEOS (if available)
      ====================================================== */}
      {prodVideos.length > 0 && (
        <section className="up-video-gallery-section">
          <div className="up-container">
            <div className="up-section-heading">
              <span className="up-eyebrow">SEE IT IN ACTION</span>
              <h2>See It In Action</h2>
            </div>

            <div className="up-video-gallery">
              {prodVideos.map((videoUrl, index) => (
                <article
                  className="up-video-card"
                  key={`${videoUrl}-${index}`}
                >
                  <video
                    controls
                    preload="metadata"
                    playsInline
                    src={videoUrl}
                    aria-label={`${prod.name} demonstration ${index + 1}`}
                  />
                  <span className="up-video-duration">PLAY DEMO</span>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          FEATURE & DETAILS
      ====================================================== */}
      <section className="up-video-detail-section">
        <div className="up-container up-video-detail-grid">
          <div className="up-video-feature">
            {prodVideos[0] ? (
              <video
                controls
                preload="metadata"
                playsInline
                src={prodVideos[0]}
                aria-label={`${prod.name} cleaning demonstration`}
              />
            ) : (
              <img
                src={allImages[0]}
                alt={prod.name}
                className="up-feature-media-img"
              />
            )}
          </div>

          <div className="up-video-detail-copy">
            <span className="up-eyebrow">
              {prod.badge ? prod.badge.toUpperCase() : "PROVEN RESULTS"}
            </span>
            <h2>
              Clean &amp; Effective
              <br />
              Results Guaranteed
            </h2>
            <p>
              Meet the {prod.name}, engineered to tackle stubborn pet hair,
              odors, and residue leaving nothing unchallenged.
            </p>
            <p>{prod.description}</p>

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

      {/* ======================================================
          HOW TO USE / ANGLE MODES
      ====================================================== */}
      {(angleModes.length > 0 || (howWorks && howWorks.steps?.length)) && (
        <section className="up-how-video-section">
          <div className="up-container up-video-detail-grid reverse">
            <div className="up-video-detail-copy">
              <span className="up-eyebrow">GET EFFECTIVE RESULTS</span>
              <h2>How to Use</h2>
              <p>
                Follow these simple steps to collect dust, lint, and pet
                hair effortlessly.
              </p>

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
              {prodVideos[1] || prodVideos[0] ? (
                <video
                  controls
                  preload="metadata"
                  playsInline
                  src={prodVideos[1] || prodVideos[0]}
                  aria-label={`How to use ${prod.name}`}
                />
              ) : (
                <img
                  src={allImages[1] || allImages[0]}
                  alt={`${prod.name} in use`}
                  className="up-feature-media-img"
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          RESULTS BANNER
      ====================================================== */}
      <section className="up-results-section">
        <div className="up-container">
          <div className="up-section-heading">
            <span className="up-eyebrow">POWERFUL CLEANING</span>
            <h2>
              Clean &amp; Effective.
              <br />
              Results Guaranteed.
            </h2>
            <p>
              Stop wasting time fighting stubborn dirt, hair, and buildup.
              Our products are designed to get straight to the problem.
            </p>
          </div>

          <div className="up-result-grid">
            <div className="up-result-card">
              <div className="up-result-number">01</div>
              <h3>Deep Cleaning</h3>
              <p>
                Engineered to lift dirt and buildup from hard-to-clean
                surfaces.
              </p>
            </div>

            <div className="up-result-card">
              <div className="up-result-number">02</div>
              <h3>Fast Results</h3>
              <p>
                Spend less time cleaning and more time doing what you
                actually enjoy.
              </p>
            </div>

            <div className="up-result-card">
              <div className="up-result-number">03</div>
              <h3>Reusable &amp; Durable</h3>
              <p>
                Built to be used again and again without wasteful,
                expensive refills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          PRODUCT COMPARISON
      ====================================================== */}
      <section className="up-comparison-section">
        <div className="up-container">
          <div className="up-section-heading">
            <span className="up-eyebrow">CHOOSE YOUR CLEANING POWER</span>
            <h2>
              Find The Right Tool
              <br />
              For The Job
            </h2>
            <p>
              Different messes need different tools. Compare our most
              popular pet cleaning solutions.
            </p>
          </div>

          <div className="up-comparison-grid">
            <div className="up-comparison-card featured">
              <div className="up-comparison-image">
                <img src={mainImage} alt={prod.name} />
              </div>

              <span className="up-comparison-label">CURRENT PRODUCT</span>

              <h3>{prod.name}</h3>
              <p>{prod.description}</p>
              <strong>{formatPrice(activePrice)}</strong>

              <button
                type="button"
                className="up-small-button"
                onClick={handleBuyNow}
              >
                BUY NOW
              </button>
            </div>

            {relatedProducts.map((item) => {
              const image =
                item.images?.main || item.image;

              return (
                <div className="up-comparison-card" key={item.id}>
                  <div className="up-comparison-image">
                    <img src={image} alt={item.name} />
                  </div>

                  <span className="up-comparison-label">UPROOT CLEAN</span>

                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
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

      {/* ======================================================
          WHY THIS PRODUCT / THE UPROOT DIFFERENCE
      ====================================================== */}
      <section className="up-feature-section">
        <div className="up-container">
          <div className="up-feature-grid">
            <div className="up-feature-image">
              <img src={mainImage} alt={prod.name} />
            </div>

            <div className="up-feature-content">
              <span className="up-eyebrow">THE UPROOT DIFFERENCE</span>
              <h2>
                There's A Better
                <br />
                Way To Clean.
              </h2>
              <p>
                Traditional cleaning tools often move dirt around instead of
                actually removing it. {prod.name} is designed to make the job
                quicker, deeper, and easier.
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
                <img src={mainImage} alt={prod.name} />
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
                          {whyStory.withUproot.map((item) => (
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
      <section className="up-details-section">
        <div className="up-container">
          <div className="up-details-box">
            <div className="up-details-description">
              <span className="up-eyebrow">PRODUCT DETAILS</span>
              <h2>Everything You Need To Know</h2>
              <p>{prod.description}</p>
            </div>

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

      {/* ======================================================
          FREQUENTLY ASKED QUESTIONS (ACCORDION)
      ====================================================== */}
      {faqs.length > 0 && (
        <section className="up-faq-section">
          <div className="up-container">
            <div className="up-section-heading">
              <span className="up-eyebrow">GOT QUESTIONS?</span>
              <h2>Frequently Asked Questions</h2>
              <p>
                Everything you need to know about using the {prod.name}.
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
                      onClick={() =>
                        setOpenFaq(isOpen ? null : idx)
                      }
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
      {reviewsList.length > 0 && (
        <section className="up-reviews-section">
          <div className="up-container">
            <div className="up-section-heading">
              <span className="up-eyebrow">REAL CUSTOMERS</span>
              <h2>See What Our Customers Are Saying</h2>

              <div className="up-review-summary">
                <div className="up-review-score">
                  {Number(prod.rating || 4.9).toFixed(1)}
                </div>

                <div>
                  <div className="up-big-stars">★★★★★</div>
                  <p>Based on {formatReviews(prod.reviews)} reviews</p>
                </div>
              </div>
            </div>

            <div className="up-review-grid">
              {reviewsList.map((review, index) => (
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
                          : "Verified Purchase"}
                      </small>
                    </div>
                  </div>
                </article>
              ))}
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
                Try {prod.name} with our 60-day money back guarantee.
              </p>
            </div>

            <div className="up-final-action">
              <span>{formatPrice(activePrice)}</span>
              <button
                type="button"
                className="up-btn up-btn-primary"
                onClick={handleBuyNow}
                disabled={!prod.inStock}
              >
                {prod.inStock ? "BUY IT NOW" : "SOLD OUT"}
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
