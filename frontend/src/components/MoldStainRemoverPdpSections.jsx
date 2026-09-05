import "./MoldStainRemoverPdpSections.css";

/**
 * Below-the-fold for Uproot Mold Stain Remover.
 * pdpLayout: "mold-stain-remover"
 */
const MoldStainRemoverPdpSections = ({ prod, openFaq, setOpenFaq }) => {
  const stories = prod.storySections || [];
  const surfaces = prod.surfacesItWorksOn || [];
  const reasons = prod.reasonsToSwitch || [];
  const ingredients = prod.ingredients || [];
  const faqs = prod.faqs || [];
  const reviews = prod.reviewsList || [];

  return (
    <div className="msr-pdp">
      {stories.map((section) => (
        <section
          key={section.id}
          className={`msr-story msr-story-${section.imageSide || "left"}`}
        >
          <div className="up-container msr-story-grid">
            <div className="msr-story-media">
              <img src={section.image} alt={section.title} loading="lazy" />
            </div>
            <div className="msr-story-copy">
              <h2>{section.title}</h2>
              {(section.paragraphs || []).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      ))}

      {surfaces.length > 0 && (
        <section className="msr-surfaces">
          <div className="up-container">
            <span className="msr-eyebrow">Built for every surface</span>
            <h2>Built for Every Surface Mold Stains Touch</h2>
            <ul className="msr-surface-grid">
              {surfaces.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {reasons.length > 0 && (
        <section className="msr-reasons">
          <div className="up-container">
            <span className="msr-eyebrow">Why switch</span>
            <h2>6 Reasons Pet Parents Are Switching from Bleach-Based Mold Removers</h2>
            <ul className="msr-reason-list">
              {reasons.map((r) => (
                <li key={r}>
                  <span>✓</span>
                  <p>{r}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {ingredients.length > 0 && (
        <section className="msr-ingredients">
          <div className="up-container">
            <span className="msr-eyebrow">Product Details & Ingredients</span>
            <h2>Ingredients</h2>
            <ul className="msr-ing-list">
              {ingredients.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {prod.specs?.application && (
              <p className="msr-app-note">{prod.specs.application}</p>
            )}
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="msr-faq up-faq-section">
          <div className="up-container">
            <span className="msr-eyebrow">Got questions?</span>
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

      {reviews.length > 0 && (
        <section className="msr-reviews">
          <div className="up-container">
            <span className="msr-eyebrow">See What Our Customers Are Saying</span>
            <h2>Rave Reviews</h2>
            <div className="msr-review-grid">
              {reviews.map((r) => (
                <article key={r.id} className="msr-review-card">
                  <div className="msr-stars">
                    {"★".repeat(r.rating || 5)}
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
      )}
    </div>
  );
};

export default MoldStainRemoverPdpSections;
