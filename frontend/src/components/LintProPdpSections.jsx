import { useEffect, useRef, useState } from "react";
import { formatPrice } from "../data/pricing";
import ExpandableReviewBody from "./ExpandableReviewBody";
import "./LintProPdpSections.css";

const formatExact = (n) => `$${Number(n || 0).toFixed(2)}`;

/** Render *emphasized* segments in press quotes as italics. */
const formatPressQuote = (quote = "") =>
  String(quote)
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part, i) =>
      part.startsWith("*") && part.endsWith("*") ? (
        <em key={i}>{part.slice(1, -1)}</em>
      ) : (
        <span key={i}>{part}</span>
      )
    );

/**
 * Complete below-the-fold experience for Uproot Cleaner Pro (Lint Pro).
 * Isolated from other PDPs — only rendered when prod.pdpLayout === "lint-pro".
 */
const LintProPdpSections = ({ prod, openFaq, setOpenFaq }) => {
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [activePress, setActivePress] = useState(0);
  const videoRef = useRef(null);
  const cleaning = prod.cleaningSection || {};
  const spot = prod.spotTheDifference || {};
  const howTo = prod.howToUse || {};
  const compare = prod.compareCleaners || null;
  const designed = Array.isArray(prod.designedToClean)
    ? prod.designedToClean
    : [];
  const press = prod.pressMentions || [];
  const bundle = prod.bundlePromo || null;
  const faqs = prod.faqs || [];
  const reviews = prod.reviewsList || [];
  const summary = prod.reviewSummary || {
    rating: prod.rating,
    count: prod.reviews,
  };

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (videoPlaying) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [videoPlaying]);

  return (
    <div className="lint-pdp">
      {bundle && (
        <section className="lint-bundle">
          <div className="up-container lint-bundle-inner">
            <div className="lint-bundle-copy">
              {bundle.eyebrow && (
                <span className="lint-eyebrow">{bundle.eyebrow}</span>
              )}
              <h2>{bundle.title}</h2>
              {bundle.description && <p>{bundle.description}</p>}
            </div>
            <div className="lint-bundle-grid">
              {(bundle.items || []).map((item) => {
                const save =
                  item.originalPrice > item.price
                    ? item.originalPrice - item.price
                    : 0;
                return (
                  <article key={item.name} className="lint-bundle-card">
                    {item.image && (
                      <img
                        className="lint-bundle-card-img"
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                      />
                    )}
                    <h3>{item.name}</h3>
                    <div className="lint-bundle-price">
                      <strong>{formatPrice(item.price)}</strong>
                      {item.originalPrice > item.price && (
                        <del>{formatPrice(item.originalPrice)}</del>
                      )}
                      {save > 0 && (
                        <span className="lint-save">
                          SAVE {formatExact(save)}
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

      <section className="lint-cleaning">
        <div className="up-container lint-cleaning-grid">
          <div className="lint-cleaning-copy">
            {cleaning.subtitle && (
              <span className="lint-eyebrow">{cleaning.subtitle}</span>
            )}
            <h2>{cleaning.title || "Clean & Effective Results Guaranteed"}</h2>
            {cleaning.description && <p>{cleaning.description}</p>}

            {designed.length > 0 && (
              <div className="lint-solutions">
                <h3 className="lint-solutions-title">Designed to clean:</h3>
                <ul className="lint-solutions-items">
                  {designed.map((item) => {
                    const name = typeof item === "string" ? item : item.name;
                    const icon = typeof item === "string" ? null : item.icon;
                    return (
                      <li
                        key={name}
                        className={name.length > 14 ? "stretch" : ""}
                      >
                        {icon && (
                          <img
                            src={icon}
                            alt=""
                            className="lint-solutions-icon"
                            width={28}
                            height={28}
                            loading="lazy"
                          />
                        )}
                        <span>{name}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <div className="lint-cleaning-media">
            {cleaning.video ? (
              <div className="lint-video-wrap">
                <video
                  ref={videoRef}
                  className="lint-video"
                  src={cleaning.video}
                  poster={cleaning.poster || undefined}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls={false}
                />
                <button
                  type="button"
                  className="lint-video-toggle"
                  onClick={() => setVideoPlaying((v) => !v)}
                  aria-label={videoPlaying ? "Pause video" : "Play video"}
                >
                  {videoPlaying ? "Pause" : "Play"}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {spot.title && (
        <section className="lint-spot">
          <div className="up-container lint-spot-grid">
            <div className="lint-spot-media">
              {(spot.pairs?.length
                ? spot.pairs
                : spot.afterImage || spot.beforeImage
                  ? [
                      {
                        after: spot.afterImage,
                        before: spot.beforeImage,
                      },
                    ]
                  : []
              ).map((pair, idx) => (
                <div
                  key={`ba-${idx}`}
                  className="lint-ba-pair lint-ba-large"
                >
                  {pair.after && (
                    <figure>
                      <img
                        src={pair.after}
                        alt={`After ${idx + 1}`}
                        loading="lazy"
                      />
                      <figcaption>After</figcaption>
                    </figure>
                  )}
                  {pair.before && (
                    <figure>
                      <img
                        src={pair.before}
                        alt={`Before ${idx + 1}`}
                        loading="lazy"
                      />
                      <figcaption>Before</figcaption>
                    </figure>
                  )}
                </div>
              ))}
            </div>
            <div className="lint-spot-copy">
              {spot.eyebrow && (
                <span className="lint-eyebrow">{spot.eyebrow}</span>
              )}
              <h2>{spot.title}</h2>
              {(spot.paragraphs || []).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {howTo.title && (
        <section className="lint-howto">
          <div className="up-container">
            <div className="lint-howto-head">
              {howTo.eyebrow && (
                <span className="lint-eyebrow">{howTo.eyebrow}</span>
              )}
              <h2>{howTo.title}</h2>
              {howTo.description && <p>{howTo.description}</p>}
            </div>

            <div className="lint-angles">
              {(howTo.angles || []).map((angle) => (
                <article key={angle.title} className="lint-angle-card">
                  {angle.image && (
                    <img src={angle.image} alt={angle.title} loading="lazy" />
                  )}
                  <h3>{angle.title}</h3>
                  {angle.detail && <p>{angle.detail}</p>}
                </article>
              ))}
            </div>

            {howTo.demoImage && (
              <div className="lint-howto-demo">
                <img
                  src={howTo.demoImage}
                  alt="How to use Uproot Cleaner Pro"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="lint-faq up-faq-section">
          <div className="up-container">
            <div className="lint-howto-head">
              <span className="lint-eyebrow">Got questions?</span>
              <h2>Frequently Asked Questions</h2>
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

      {compare && (
        <section className="lint-compare">
          <div className="up-container">
            <h2 className="lint-compare-title">{compare.title}</h2>
            {compare.image && (
              <img
                className="lint-compare-banner"
                src={compare.image}
                alt=""
                loading="lazy"
              />
            )}
            <div className="lint-compare-table" role="table">
              <div className="lint-compare-head" role="row">
                {(compare.columns || []).map((col) => (
                  <div
                    key={col.name}
                    className={`lint-compare-col ${
                      col.current ? "current" : ""
                    }`}
                    role="columnheader"
                  >
                    <strong>{col.name}</strong>
                    <span>{col.subtitle}</span>
                  </div>
                ))}
              </div>
              {[0, 1, 2].map((rowIdx) => (
                <div className="lint-compare-row" role="row" key={rowIdx}>
                  {(compare.columns || []).map((col) => (
                    <div
                      key={`${col.name}-${rowIdx}`}
                      className={`lint-compare-cell ${
                        col.current ? "current" : ""
                      }`}
                      role="cell"
                    >
                      {(col.benefits || [])[rowIdx] || ""}
                    </div>
                  ))}
                </div>
              ))}
              <div className="lint-compare-row lint-compare-ctas" role="row">
                {(compare.columns || []).map((col) => (
                  <div
                    key={`${col.name}-cta`}
                    className={`lint-compare-cell ${
                      col.current ? "current" : ""
                    }`}
                    role="cell"
                  >
                    <span
                      className={`lint-compare-btn ${
                        col.current ? "is-current" : ""
                      }`}
                    >
                      {col.current ? "✓ " : ""}
                      {col.cta}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {press.length > 0 && (
        <section className="lint-press" aria-label="Press Mentions">
          <div className="up-container">
            <div className="lint-press-panel">
              <div className="lint-press-blobs" aria-hidden="true">
                <span className="lint-press-blob lint-press-blob--blue" />
                <span className="lint-press-blob lint-press-blob--pink" />
                <span className="lint-press-blob lint-press-blob--lilac" />
                <span className="lint-press-blob lint-press-blob--ring" />
                <span className="lint-press-blob lint-press-blob--dot" />
              </div>

              <div className="lint-press-layout">
                <div className="lint-press-copy">
                  <div
                    className="lint-press-tabs"
                    role="tablist"
                    aria-label="Press sources"
                  >
                    {press.map((item, idx) => {
                      const selected = activePress === idx;
                      return (
                        <button
                          key={item.name}
                          type="button"
                          role="tab"
                          id={`lint-press-tab-${idx}`}
                          aria-selected={selected}
                          aria-controls={`lint-press-panel-${idx}`}
                          tabIndex={selected ? 0 : -1}
                          className={`lint-press-tab${
                            selected ? " is-active" : ""
                          }`}
                          onClick={() => setActivePress(idx)}
                        >
                          {item.logo ? (
                            <img
                              src={item.logo}
                              alt={item.name}
                              loading="lazy"
                            />
                          ) : (
                            <span>{item.name}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {press.map((item, idx) => {
                    if (activePress !== idx) return null;
                    return (
                      <blockquote
                        key={item.name}
                        className="lint-press-quote"
                        role="tabpanel"
                        id={`lint-press-panel-${idx}`}
                        aria-labelledby={`lint-press-tab-${idx}`}
                      >
                        <span className="lint-press-mark lint-press-mark--open" aria-hidden="true">
                          “
                        </span>
                        <p>{formatPressQuote(item.quote)}</p>
                        <span className="lint-press-mark lint-press-mark--close" aria-hidden="true">
                          ”
                        </span>
                      </blockquote>
                    );
                  })}
                </div>

                {(prod.pressBanner || press[activePress]?.image) && (
                  <div className="lint-press-media">
                    <img
                      src={prod.pressBanner || press[activePress].image}
                      alt=""
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="lint-reviews">
        <div className="up-container">
          <div className="lint-howto-head">
            <span className="lint-eyebrow">
              See What Our Customers Are Saying
            </span>
            <h2>Rave Reviews</h2>
            <p className="lint-review-summary">
              <strong>{summary.rating}</strong> Rated {summary.rating} out of 5
              stars · Based on {(summary.count || 0).toLocaleString()} reviews
              {summary.recommendPercent != null && (
                <>
                  {" "}
                  · {summary.recommendPercent}% would recommend these products
                </>
              )}
            </p>
          </div>

          {summary.breakdown?.length > 0 && (
            <div className="lint-rating-bars">
              {summary.breakdown.map((row) => {
                const max = summary.breakdown[0]?.count || 1;
                const pct = Math.round((row.count / max) * 100);
                return (
                  <div key={row.stars} className="lint-rating-bar">
                    <span>{row.stars}★</span>
                    <div className="lint-rating-track">
                      <div
                        className="lint-rating-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span>
                      {row.count >= 1000
                        ? `${(row.count / 1000).toFixed(1)}k`
                        : row.count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="lint-review-grid">
            {reviews.map((r) => (
              <article key={r.id} className="lint-review-card">
                <div className="lint-stars" aria-label={`${r.rating} stars`}>
                  {"★".repeat(r.rating)}
                  {"☆".repeat(Math.max(0, 5 - r.rating))}
                </div>
                {r.title && <h3>{r.title}</h3>}
                <ExpandableReviewBody text={r.body} />
                <footer>
                  <strong>{r.author}</strong>
                  {r.verified && <span>Verified Buyer</span>}
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LintProPdpSections;
