import "./LcpPdpSections.css";

/**
 * Below-the-fold for Uproot Laundry Cycle Pro.
 * pdpLayout: "laundry-cycle-pro"
 */
const LcpPdpSections = ({ prod, openFaq, setOpenFaq }) => {
  const stories = prod.storySections || [];
  const howTo = prod.howItWorks || null;
  const ingredients = prod.ingredients || [];
  const faqs = prod.faqs || [];
  const reviews = prod.reviewsList || [];

  return (
    <div className="lcp-pdp">
      {stories.map((section) => (
        <section
          key={section.id}
          className={`lcp-story lcp-story-${section.imageSide || "left"}`}
        >
          <div className="up-container lcp-story-grid">
            <div className="lcp-story-media">
              <img src={section.image} alt={section.title} loading="lazy" />
            </div>
            <div className="lcp-story-copy">
              <h2>{section.title}</h2>
              {(section.paragraphs || []).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      ))}

      {howTo?.steps?.length > 0 && (
        <section className="lcp-howto">
          <div className="up-container">
            <span className="lcp-eyebrow">The complete system</span>
            <h2>{howTo.title}</h2>
            {howTo.description && <p>{howTo.description}</p>}
            <ol className="lcp-steps">
              {howTo.steps.map((step, i) => (
                <li key={step.title}>
                  <span>{i + 1}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {ingredients.length > 0 && (
        <section className="lcp-ingredients">
          <div className="up-container">
            <span className="lcp-eyebrow">Product Details & Ingredients</span>
            <h2>What's Inside</h2>
            <ul className="lcp-ing-list">
              {ingredients.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="lcp-faq up-faq-section">
          <div className="up-container">
            <span className="lcp-eyebrow">Got questions?</span>
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
        <section className="lcp-reviews">
          <div className="up-container">
            <span className="lcp-eyebrow">See What Our Customers Are Saying</span>
            <h2>Rave Reviews</h2>
            <div className="lcp-review-grid">
              {reviews.slice(0, 6).map((r) => (
                <article key={r.id} className="lcp-review-card">
                  <div className="lcp-stars">
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

export default LcpPdpSections;
