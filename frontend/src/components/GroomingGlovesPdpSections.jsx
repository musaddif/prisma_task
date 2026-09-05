import "./GroomingGlovesPdpSections.css";

/**
 * Below-the-fold for Uproot QuickClean™ Gloves Pro.
 * Only used when prod.pdpLayout === "grooming-gloves".
 */
const GroomingGlovesPdpSections = ({ prod, openFaq, setOpenFaq }) => {
  const stories = prod.storySections || [];
  const howTo = prod.howItWorks || null;
  const ingredients = prod.ingredients || [];
  const faqs = prod.faqs || [];
  const reviews = prod.reviewsList || [];
  const summary = prod.reviewSummary || {
    rating: prod.rating,
    count: prod.reviews,
  };

  return (
    <div className="gg-pdp">
      {stories.map((section) => (
        <section
          key={section.id}
          className={`gg-story gg-story-${section.imageSide || "left"}`}
        >
          <div className="up-container gg-story-grid">
            <div className="gg-story-media">
              <img src={section.image} alt={section.title} loading="lazy" />
            </div>
            <div className="gg-story-copy">
              <h2>{section.title}</h2>
              {(section.paragraphs || []).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      ))}

      {howTo?.steps?.length > 0 && (
        <section className="gg-howto">
          <div className="up-container gg-howto-grid">
            <div className="gg-howto-copy">
              <span className="gg-eyebrow">Simple to use</span>
              <h2>{howTo.title}</h2>
              {howTo.description && <p>{howTo.description}</p>}
              <ol className="gg-steps">
                {howTo.steps.map((step, i) => (
                  <li key={step.title}>
                    <span className="gg-step-num">{i + 1}</span>
                    <div>
                      <strong>{step.title}</strong>
                      {step.description && <p>{step.description}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            {howTo.image && (
              <div className="gg-howto-media">
                <img
                  src={howTo.image}
                  alt={howTo.title}
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {ingredients.length > 0 && (
        <section className="gg-ingredients">
          <div className="up-container">
            <span className="gg-eyebrow">Product Details & Ingredients</span>
            <h2>Ingredients and Their Benefits</h2>
            {prod.productDetailsNote && (
              <p className="gg-details-note">{prod.productDetailsNote}</p>
            )}
            <ul className="gg-ing-list">
              {ingredients.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="gg-faq up-faq-section">
          <div className="up-container">
            <span className="gg-eyebrow">Got questions?</span>
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

      <section className="gg-reviews">
        <div className="up-container">
          <span className="gg-eyebrow">See What Our Customers Are Saying</span>
          <h2>Rave Reviews</h2>
          <p className="gg-review-summary">
            <strong>{summary.rating}</strong> Rated {summary.rating} out of 5
            stars · Based on {(summary.count || 0).toLocaleString()} reviews
            {summary.recommendPercent != null && (
              <> · {summary.recommendPercent}% would recommend these products</>
            )}
          </p>

          {summary.breakdown?.length > 0 && (
            <div className="gg-rating-bars">
              {summary.breakdown.map((row) => {
                const max = Math.max(
                  ...summary.breakdown.map((b) => b.count || 0),
                  1
                );
                const pct = Math.round(((row.count || 0) / max) * 100);
                return (
                  <div key={row.stars} className="gg-rating-bar">
                    <span>{row.stars}★</span>
                    <div className="gg-rating-track">
                      <div
                        className="gg-rating-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span>{row.count}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="gg-review-grid">
            {reviews.map((r) => (
              <article key={r.id} className="gg-review-card">
                <div className="gg-stars" aria-label={`${r.rating} stars`}>
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

export default GroomingGlovesPdpSections;
