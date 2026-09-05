import { useEffect, useMemo, useState } from "react";
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

const TRUST_ITEMS = [
  {
    icon: "🚚",
    title: "Fast Shipping",
    text: "Ships quickly from Florida",
  },
  {
    icon: "↩",
    title: "Easy Returns",
    text: "60-day money back guarantee",
  },
  {
    icon: "✓",
    title: "Guaranteed Results",
    text: "Love it or get your money back",
  },
  {
    icon: "★",
    title: "Patented Design",
    text: "Designed for maximum results",
  },
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
          >
            <img
              src={src}
              alt={`${prod.name} ${index + 1}`}
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
          </button>
        ))}
      </div>

      <div className="up-main-image">
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

const StickyCart = ({ prod, image, onAddToCart }) => (
  <div className="up-sticky-cart">
    <div className="up-sticky-inner">
      <div className="up-sticky-product">
        <img src={image} alt="" />

        <div>
          <strong>{prod.name}</strong>
          <span>{formatPrice(prod.price)}</span>
        </div>
      </div>

      <button
        type="button"
        className="up-btn up-btn-primary up-sticky-button"
        onClick={onAddToCart}
        disabled={!prod.inStock}
      >
        {prod.inStock ? "ADD TO CART" : "SOLD OUT"}
      </button>
    </div>
  </div>
);

/* ============================================================
   MAIN PAGE
============================================================ */

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const prod = product.find((p) => p.id === Number(id));

  const [showSticky, setShowSticky] = useState(false);
  const [specsOpen, setSpecsOpen] = useState(true);
  const [selectedPack, setSelectedPack] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 550);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const comparePrice =
    prod.compareAtPrice || prod.originalPrice || 0;

  const savings =
    comparePrice > prod.price
      ? comparePrice - prod.price
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

  const howWorks = prod.howItWorks || prod.howToUse || null;

  const angleModes =
    prod.specs?.cleaningModes
      ?.split(",")
      .map((mode) => mode.trim())
      .filter(Boolean) || [];

  const cleansItems = prod.cleansCategories?.length
    ? prod.cleansCategories.map((item) => ({
        name: item.name,
        text: item.description,
      }))
    : prod.surfacesItWorksOn?.length
      ? prod.surfacesItWorksOn.map((item) => ({ name: item }))
      : [];

  const whyStory = prod.whyItMatters || prod.whyBleachFree || null;

  const reasonList = prod.reasonsToSwitch || [];

  const handleAddToCart = () => {
    alert(`Added "${prod.name}" to cart.`);
  };

  const handleBuyNow = () => {
    navigate("/checkout", {
      state: { productId: prod.id },
    });
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
        <nav className="up-site-nav" aria-label="Main navigation">
          <button type="button" onClick={() => navigate("/")}>Shop</button>
          <button type="button" onClick={() => navigate("/")}>Best Sellers</button>
          <button type="button" onClick={() => navigate("/")}>Our Story</button>
        </nav>
        <span className="up-currency">USD ▾</span>
      </header>

      {showSticky && (
        <StickyCart
          prod={prod}
          image={mainImage}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* ======================================================
          HERO
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
            {/* IMAGE */}
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
                Professional cleaning power designed to make
                cleaning faster, easier and more effective.
              </p>

              <div className="up-price-row">
                <span className="up-current-price">
                  {formatPrice(prod.price)}
                </span>

                {comparePrice > prod.price && (
                  <del className="up-old-price">
                    {formatPrice(comparePrice)}
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
                Free shipping on qualifying orders
              </div>

              <div className="up-pack-selector" aria-label="Choose pack size">
                {[1, 2, 3].map((pack) => (
                  <button
                    key={pack}
                    type="button"
                    className={`up-pack-option ${
                      selectedPack === pack ? "selected" : ""
                    }`}
                    onClick={() => setSelectedPack(pack)}
                  >
                    <span className="up-pack-label">{pack} Pack</span>
                    <strong>{formatPrice(prod.price * pack)}</strong>
                    {pack === 2 && <small>Most Popular</small>}
                    {pack === 3 && <small>Best Value</small>}
                  </button>
                ))}
              </div>

              {/* BENEFITS */}
              <div className="up-benefits">
                {benefits.map((benefit, index) => (
                  <div className="up-benefit" key={index}>
                    <span className="up-benefit-check">✓</span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* STOCK */}
              <div
                className={`up-stock ${
                  prod.inStock ? "available" : "unavailable"
                }`}
              >
                <span className="up-stock-dot" />
                {prod.inStock ? "In Stock — Ready to Ship" : "Sold Out"}
              </div>

              {/* CTA */}
              <button
                type="button"
                className="up-btn up-btn-primary up-add-cart"
                onClick={handleAddToCart}
                disabled={!prod.inStock}
              >
                {prod.inStock ? "ADD TO CART" : "SOLD OUT"}
              </button>

              <button
                type="button"
                className="up-btn up-btn-buy"
                onClick={handleBuyNow}
                disabled={!prod.inStock}
              >
                Buy it now
              </button>

              {/* FREE GIFT */}
              <div className="up-gift-box">
                <div className="up-gift-icon">
                  🎁
                </div>

                <div>
                  <strong>FREE MYSTERY GIFT</strong>
                  <p>
                    Order today and receive a mystery gift
                    valued at $10.
                  </p>
                </div>
              </div>

              {/* TRUST */}
              <div className="up-mini-trust">
                {TRUST_ITEMS.map((item) => (
                  <div className="up-mini-trust-item" key={item.title}>
                    <span className="up-mini-trust-icon">
                      {item.icon}
                    </span>

                    <div>
                      <strong>{item.title}</strong>
                      <small>{item.text}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* MULTIPLE VIDEOS */}

      {prodVideos.length > 0 && (
        <section className="up-video-gallery-section">
          <div className="up-container">
            <div className="up-section-heading">
              <span className="up-eyebrow">SEE IT IN ACTION</span>
              <h2>See It In Action</h2>
            </div>

            <div className="up-video-gallery">
              {prodVideos.map((videoUrl, index) => (
                <article className="up-video-card" key={`${videoUrl}-${index}`}>
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

        {/* VIDEO + DETAILS */}

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
            <span className="up-eyebrow">WITH THE PRO</span>
            <h2>Clean &amp; Effective<br />Results Guaranteed</h2>
            <p>
              Meet the {prod.name}, the ultimate weapon against pet hair,
              leaving no strand unchallenged.
            </p>
            <p>
              This powerhouse tackles stubborn fur and buildup, transforming
              your home into a cleaner, hair-free space.
            </p>
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

        {/* VIDEO + HOW TO USE */}

      <section className="up-how-video-section">
        <div className="up-container up-video-detail-grid reverse">
          <div className="up-video-detail-copy">
            <span className="up-eyebrow">GET EFFECTIVE RESULTS</span>
            <h2>How to Use</h2>
            <p>
              Use the specialized edges on the area that needs cleaning and
              collect dust, lint and pet hair in seconds.
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

      {/* ======================================================
          RESULTS BANNER
      ====================================================== */}

      <section className="up-results-section">
        <div className="up-container">
          <div className="up-section-heading">
            <span className="up-eyebrow">
              POWERFUL CLEANING
            </span>

            <h2>
              Clean & Effective.
              <br />
              Results Guaranteed.
            </h2>

            <p>
              Stop wasting time fighting stubborn dirt, hair
              and buildup. Our products are designed to get
              straight to the problem.
            </p>
          </div>

          <div className="up-result-grid">
            <div className="up-result-card">
              <div className="up-result-number">01</div>
              <h3>Deep Cleaning</h3>
              <p>
                Designed to remove dirt and buildup from
                hard-to-clean surfaces.
              </p>
            </div>

            <div className="up-result-card">
              <div className="up-result-number">02</div>
              <h3>Fast Results</h3>
              <p>
                Spend less time cleaning and more time doing
                the things you actually enjoy.
              </p>
            </div>

            <div className="up-result-card">
              <div className="up-result-number">03</div>
              <h3>Reusable</h3>
              <p>
                Built to be used again and again without
                expensive replacement refills.
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
            <span className="up-eyebrow">
              CHOOSE YOUR CLEANING POWER
            </span>

            <h2>
              Find The Right Tool
              <br />
              For The Job
            </h2>

            <p>
              Different messes need different tools. Compare
              some of our most popular cleaning solutions.
            </p>
          </div>

          <div className="up-comparison-grid">
            <div className="up-comparison-card featured">
              <div className="up-comparison-image">
                <img
                  src={mainImage}
                  alt={prod.name}
                />
              </div>

              <span className="up-comparison-label">
                CURRENT PRODUCT
              </span>

              <h3>{prod.name}</h3>

              <p>
                {prod.description ||
                  "Our powerful cleaning solution for everyday messes."}
              </p>

              <strong>
                {formatPrice(prod.price)}
              </strong>

              <button
                type="button"
                className="up-small-button"
                onClick={handleAddToCart}
              >
                SHOP NOW
              </button>
            </div>

            {relatedProducts.map((item) => {
              const image =
                item.images?.main || item.image;

              return (
                <div
                  className="up-comparison-card"
                  key={item.id}
                >
                  <div className="up-comparison-image">
                    <img
                      src={image}
                      alt={item.name}
                    />
                  </div>

                  <span className="up-comparison-label">
                    UPROOT CLEAN
                  </span>

                  <h3>{item.name}</h3>

                  <p>
                    {item.description ||
                      "A simple and effective solution for everyday cleaning."}
                  </p>

                  <strong>
                    {formatPrice(item.price)}
                  </strong>

                  <button
                    type="button"
                    className="up-small-button"
                    onClick={() =>
                      navigate(`/product/${item.id}`)
                    }
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
          WHY THIS PRODUCT
      ====================================================== */}

      <section className="up-feature-section">
        <div className="up-container">
          <div className="up-feature-grid">
            <div className="up-feature-image">
              <img
                src={mainImage}
                alt={prod.name}
              />
            </div>

            <div className="up-feature-content">
              <span className="up-eyebrow">
                THE UPROOT DIFFERENCE
              </span>

              <h2>
                There's A Better
                <br />
                Way To Clean.
              </h2>

              <p>
                Traditional cleaning tools often move dirt
                around instead of actually removing it.
                {` `}
                {prod.name} is designed to make the job
                quicker and easier.
              </p>

              <div className="up-feature-list">
                {benefits.slice(0, 5).map((benefit, index) => (
                  <div
                    className="up-feature-item"
                    key={index}
                  >
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
              <span className="up-eyebrow">
                WHAT IT HANDLES
              </span>

              <h2>Everything It Tackles</h2>

              <p>
                Just some of the messes the {prod.name} takes care of.
              </p>
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
          HOW IT WORKS
      ====================================================== */}

      {howWorks && (
        <section className="up-how-section">
          <div className="up-container">
            <div className="up-section-heading">
              <span className="up-eyebrow">
                SIMPLE TO USE
              </span>

              <h2>{howWorks.title || "How It Works"}</h2>

              {howWorks.description && (
                <p>{howWorks.description}</p>
              )}
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
                      <span className="up-step-number">
                        {index + 1}
                      </span>

                      <div>
                        <h3>{step.title}</h3>

                        {step.description && (
                          <p>{step.description}</p>
                        )}
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
          WHY IT MATTERS
      ====================================================== */}

      {(whyStory || reasonList.length > 0) && (
        <section className="up-why-section">
          <div className="up-container">
            <div className="up-why-card">
              <span className="up-eyebrow">
                THE UPROOT DIFFERENCE
              </span>

              {whyStory ? (
                <>
                  <h2>{whyStory.title}</h2>

                  {whyStory.description && (
                    <p className="up-why-lead">
                      {whyStory.description}
                    </p>
                  )}

                  {whyStory.withoutUproot && (
                    <div className="up-vs-grid">
                      <div className="up-vs-col up-vs-bad">
                        <h3>Without Uproot</h3>

                        <ul>
                          {whyStory.withoutUproot.map(
                            (item) => (
                              <li key={item}>{item}</li>
                            )
                          )}
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
                    <div
                      className="up-feature-item"
                      key={reason}
                    >
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
          DESCRIPTION / SPECS
      ====================================================== */}

      <section className="up-details-section">
        <div className="up-container">
          <div className="up-details-box">
            <div className="up-details-description">
              <span className="up-eyebrow">
                PRODUCT DETAILS
              </span>

              <h2>Everything You Need To Know</h2>

              <p>
                {prod.description ||
                  "Designed to deliver powerful cleaning results while keeping the process simple and easy."}
              </p>
            </div>

            {prod.specs &&
              Object.keys(prod.specs).length > 0 && (
                <div className="up-specs">
                  <button
                    type="button"
                    className="up-specs-header"
                    onClick={() =>
                      setSpecsOpen((open) => !open)
                    }
                  >
                    <span>Product Specifications</span>
                    <span>
                      {specsOpen ? "−" : "+"}
                    </span>
                  </button>

                  {specsOpen && (
                    <div className="up-specs-content">
                      {Object.entries(prod.specs).map(
                        ([key, value]) => (
                          <div
                            className="up-spec-row"
                            key={key}
                          >
                            <span>
                              {formatSpecKey(key)}
                            </span>

                            <strong>{value}</strong>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      </section>

      {/* ======================================================
          REVIEWS
      ====================================================== */}

      {/* <section className="up-reviews-section">
        <div className="up-container">
          <div className="up-section-heading">
            <span className="up-eyebrow">
              REAL CUSTOMERS
            </span>

            <h2>
              See What Our
              <br />
              Customers Are Saying
            </h2>

            <div className="up-review-summary">
              <div className="up-review-score">
                {Number(prod.rating || 5).toFixed(1)}
              </div>

              <div>
                <div className="up-big-stars">
                  ★★★★★
                </div>

                <p>
                  Based on{" "}
                  {formatReviews(prod.reviews)} reviews
                </p>
              </div>
            </div>
          </div>

          <div className="up-review-grid">
            {[
              {
                name: "Verified Customer",
                text: "This product made cleaning so much easier. I was surprised by how effective it was.",
              },
              {
                name: "Verified Customer",
                text: "Really impressed with the results. It is simple to use and actually works.",
              },
              {
                name: "Verified Customer",
                text: "Great product and exactly what I needed. Would definitely recommend it.",
              },
            ].map((review, index) => (
              <article
                className="up-review-card"
                key={index}
              >
                <div className="up-review-stars">
                  ★★★★★
                </div>

                <h3>Works incredibly well!</h3>

                <p>{review.text}</p>

                <div className="up-review-author">
                  <span className="up-avatar">
                    ✓
                  </span>

                  <div>
                    <strong>{review.name}</strong>
                    <small>Verified Purchase</small>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section> */}

      {/* ======================================================
          FINAL CTA
      ====================================================== */}

      <section className="up-final-cta">
        <div className="up-container">
          <div className="up-final-card">
            <div>
              <span className="up-eyebrow">
                READY TO CLEAN?
              </span>

              <h2>
                Make Cleaning
                <br />
                Easier Today.
              </h2>

              <p>
                Try {prod.name} with our 60-day money back
                guarantee.
              </p>
            </div>

            <div className="up-final-action">
              <span>
                {formatPrice(prod.price)}
              </span>

              <button
                type="button"
                className="up-btn up-btn-primary"
                onClick={handleAddToCart}
                disabled={!prod.inStock}
              >
                {prod.inStock
                  ? "ADD TO CART"
                  : "SOLD OUT"}
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
