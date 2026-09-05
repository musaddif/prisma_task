import { useEffect, useRef, useState } from "react";
import "./PetGroomingKitPdpSections.css";

/**
 * Below-the-fold for Uproot Pet Grooming Kit 7-in-1.
 * Only when prod.pdpLayout === "pet-grooming-kit".
 */
const PetGroomingKitPdpSections = ({ prod, openFaq, setOpenFaq }) => {
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef(null);
  const features = prod.featuresSection || null;
  const stories = prod.storySections || [];
  const quiet = prod.quietTechnology || null;
  const press = prod.pressMentions || [];
  const faqs = prod.faqs || [];
  const reviews = prod.reviewsList || [];
  const summary = prod.reviewSummary || {
    rating: prod.rating,
    count: prod.reviews,
  };

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (playing) el.play().catch(() => {});
    else el.pause();
  }, [playing]);

  return (
    <div className="pkg-pdp">
      {prod.heroVideo && (
        <section className="pkg-video">
          <div className="up-container">
            <div className="pkg-video-wrap">
              <video
                ref={videoRef}
                src={prod.heroVideo}
                autoPlay
                muted
                loop
                playsInline
              />
              <button
                type="button"
                className="pkg-video-toggle"
                onClick={() => setPlaying((v) => !v)}
              >
                {playing ? "Pause" : "Play"}
              </button>
            </div>
          </div>
        </section>
      )}

      {features && (
        <section className="pkg-features">
          <div className="up-container">
            {features.subtitle && (
              <span className="pkg-eyebrow">{features.subtitle}</span>
            )}
            <h2>{features.title}</h2>
            <ul className="pkg-feature-grid">
              {(features.items || []).map((item) => (
                <li key={item.name}>
                  {item.icon && (
                    <img src={item.icon} alt="" width={64} height={64} loading="lazy" />
                  )}
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {quiet && (
        <section className="pkg-quiet">
          <div className="up-container">
            <span className="pkg-eyebrow">SilentGroom™ Technology</span>
            <h2>{quiet.name}</h2>
            {quiet.description && <p>{quiet.description}</p>}
          </div>
        </section>
      )}

      {stories.map((section) => (
        <section
          key={section.id}
          className={`pkg-story pkg-story-${section.imageSide || "left"}`}
        >
          <div className="up-container pkg-story-grid">
            <div className="pkg-story-media">
              <img src={section.image} alt={section.title} loading="lazy" />
            </div>
            <div className="pkg-story-copy">
              <h2>{section.title}</h2>
              {(section.paragraphs || []).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {section.highlights?.length > 0 && (
                <div className="pkg-highlights">
                  {section.highlights.map((h) => (
                    <article key={h.title}>
                      <strong>{h.title}</strong>
                      <p>{h.text}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      {press.length > 0 && (
        <section className="pkg-press">
          <div className="up-container">
            <h2>Press Mentions</h2>
            <div className="pkg-press-row">
              {press.map((item) => (
                <div key={item.name} className="pkg-press-item">
                  {item.logo && (
                    <img src={item.logo} alt={item.name} loading="lazy" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="pkg-faq up-faq-section">
          <div className="up-container">
            <span className="pkg-eyebrow">Got questions?</span>
            <h2>Frequently Asked Questions</h2>
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

      <section className="pkg-reviews">
        <div className="up-container">
          <span className="pkg-eyebrow">See What Our Customers Are Saying</span>
          <h2>Rave Reviews</h2>
          <p className="pkg-review-summary">
            <strong>{summary.rating}</strong> Rated {summary.rating} out of 5
            stars · Based on {(summary.count || 0).toLocaleString()} reviews
          </p>
          <div className="pkg-review-grid">
            {reviews.map((r) => (
              <article key={r.id} className="pkg-review-card">
                <div className="pkg-stars">
                  {"★".repeat(r.rating || 5)}
                  {"☆".repeat(Math.max(0, 5 - (r.rating || 5)))}
                </div>
                {r.title && <h3>{r.title}</h3>}
                <p>{r.body}</p>
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

export default PetGroomingKitPdpSections;
