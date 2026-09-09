import { formatPrice } from "../data/pricing";
import ExpandableReviewBody from "./ExpandableReviewBody";
import "./MoldStainRemoverPdpSections.css";

const scrollToBuy = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

/**
 * Below-the-fold for Uproot Mold Stain Remover.
 * pdpLayout: "mold-stain-remover"
 * Gallery images are designed section graphics — shown full-width, not cropped cards.
 */
const MoldStainRemoverPdpSections = ({ prod, openFaq, setOpenFaq }) => {
  const content = prod.msrContent || prod;
  const hero = content.heroIntro || prod.heroIntro;
  const bleach = content.bleachComparison || prod.bleachComparison;
  const surfaces = content.surfaceCards || prod.surfaceCards;
  const hub = content.hubInfographic || prod.hubInfographic;
  const reasons = content.reasons || prod.reasons;
  const tech = content.technologies || prod.technologies;
  const vs = content.vsTable || prod.vsTable;
  const howTo = content.howToSteps || prod.howToSteps;
  const chips = content.surfaceChips || prod.surfaceChips;
  const guarantee = content.guaranteeSection || prod.guaranteeSection;
  const faqs = prod.faqs || [];
  const reviews = prod.reviewsList || [];

  return (
    <div className="msr-pdp">
      {hero && (
        <section className="msr-hero-intro">
          <div className="up-container msr-hero-grid">
            <div className="msr-hero-copy">
              <h2>{hero.title}</h2>
              {(hero.paragraphs || []).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {hero.image && (
              <div className="msr-hero-media">
                <img src={hero.image} alt={hero.title} loading="lazy" />
              </div>
            )}
          </div>
        </section>
      )}

      {bleach && (
        <section className="msr-bleach">
          <div className="up-container">
            <h2 className="msr-section-title">{bleach.title}</h2>
            <div className="msr-bleach-grid">
              <article className="msr-bleach-card without">
                <header>
                  <span className="msr-bleach-icon no" aria-hidden="true">
                    ✘
                  </span>
                  <h3>{bleach.without?.heading}</h3>
                </header>
                <ul>
                  {(bleach.without?.items || []).map((item) => (
                    <li key={item.title}>
                      <h4>{item.title}</h4>
                      <p>{item.body}</p>
                    </li>
                  ))}
                </ul>
              </article>
              <article className="msr-bleach-card with">
                <header>
                  <span className="msr-bleach-icon yes" aria-hidden="true">
                    ✔
                  </span>
                  <h3>{bleach.withProduct?.heading}</h3>
                </header>
                <ul>
                  {(bleach.withProduct?.items || []).map((item) => (
                    <li key={item.title}>
                      <h4>{item.title}</h4>
                      <p>{item.body}</p>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>
      )}

      {surfaces?.cards?.length > 0 && (
        <section className="msr-surfaces">
          <div className="up-container">
            <h2 className="msr-section-title">{surfaces.title}</h2>
            <div className="msr-surface-grid">
              {surfaces.cards.map((card) => (
                <article key={card.title} className="msr-surface-card">
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {hub?.image && (
        <section className="msr-hub" aria-label={hub.alt || "Surface infographic"}>
          <div className="msr-hub-bleed">
            <img
              src={hub.image}
              alt={hub.alt || "Works on Every Mold Stain in Your Home"}
              loading="lazy"
            />
          </div>
        </section>
      )}

      {reasons?.items?.length > 0 && (
        <section className="msr-reasons">
          <div className="up-container">
            <h2 className="msr-section-title">{reasons.title}</h2>
            {reasons.subtitle && (
              <p className="msr-section-sub">{reasons.subtitle}</p>
            )}
            <div className="msr-reason-grid">
              {reasons.items.map((item) => (
                <article key={item.number} className="msr-reason-card">
                  <span className="msr-reason-num" aria-hidden="true">
                    {item.number}
                  </span>
                  <div className="msr-reason-copy">
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {tech?.items?.length > 0 && (
        <section className="msr-tech">
          <div className="up-container">
            <h2 className="msr-section-title">{tech.title}</h2>
            {tech.subtitle && (
              <p className="msr-section-sub">{tech.subtitle}</p>
            )}
            <div className="msr-tech-list msr-tech-list-solo">
              {tech.items.map((item) => (
                <article key={item.title} className="msr-tech-card">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>

          {tech.formulaPowersImage && (
            <figure className="msr-graphic-bleed">
              <img
                src={tech.formulaPowersImage}
                alt={tech.formulaPowersAlt || "What Powers the Formula"}
                loading="lazy"
              />
            </figure>
          )}

          {tech.formulaInsideImage && (
            <figure className="msr-graphic-bleed">
              <img
                src={tech.formulaInsideImage}
                alt={tech.formulaInsideAlt || "Inside the Formula"}
                loading="lazy"
              />
            </figure>
          )}

          {tech.petSafeImage && (
            <figure className="msr-graphic-bleed msr-graphic-contain">
              <div className="up-container">
                <img
                  src={tech.petSafeImage}
                  alt={tech.petSafeAlt || "Pet-safe active ingredients"}
                  loading="lazy"
                />
              </div>
            </figure>
          )}
        </section>
      )}

      {vs && (
        <section className="msr-vs">
          <div className="up-container">
            <h2 className="msr-section-title">{vs.title}</h2>
            {vs.image && (
              <figure className="msr-vs-graphic">
                <img
                  src={vs.image}
                  alt={vs.imageAlt || vs.title}
                  loading="lazy"
                />
              </figure>
            )}
            {/* Visually hidden table for screen readers when graphic is primary UI */}
            <div className="msr-vs-a11y">
              <table>
                <caption>{vs.title}</caption>
                <thead>
                  <tr>
                    <th scope="col">Feature</th>
                    <th scope="col">{vs.leftLabel}</th>
                    <th scope="col">{vs.rightLabel}</th>
                  </tr>
                </thead>
                <tbody>
                  {(vs.rows || []).map((row) => (
                    <tr key={row.feature}>
                      <th scope="row">{row.feature}</th>
                      <td>
                        {row.uprootText != null
                          ? row.uprootText
                          : row.uproot
                            ? "Yes"
                            : "No"}
                      </td>
                      <td>
                        {row.bleachText != null
                          ? row.bleachText
                          : row.bleach
                            ? "Yes"
                            : "No"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {howTo?.steps?.length > 0 && (
        <section className="msr-howto">
          <div className="up-container">
            <h2 className="msr-section-title">{howTo.title}</h2>
            {howTo.heroImage && (
              <figure className="msr-howto-hero">
                <img
                  src={howTo.heroImage}
                  alt={howTo.heroAlt || howTo.title}
                  loading="lazy"
                />
              </figure>
            )}
            <div className="msr-howto-grid">
              {howTo.steps.map((step) => (
                <article key={step.number} className="msr-howto-card">
                  <span className="msr-howto-num">Step {step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {chips?.chips?.length > 0 && (
        <section className="msr-chips">
          <div className="up-container">
            <h2 className="msr-section-title">{chips.title}</h2>
            <ul className="msr-chip-list">
              {chips.chips.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {guarantee && (
        <section className="msr-guarantee">
          <div className="up-container msr-guarantee-inner">
            <h2>{guarantee.title}</h2>
            {(guarantee.paragraphs || []).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
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
            <span className="msr-eyebrow">
              See What Our Customers Are Saying
            </span>
            <h2>Rave Reviews</h2>
            <div className="msr-review-grid">
              {reviews.map((r) => (
                <article key={r.id} className="msr-review-card">
                  <div className="msr-stars">
                    {"★".repeat(r.rating || 5)}
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
      )}

      <section className="msr-bottom-cta">
        <div className="up-container msr-bottom-inner">
          <div>
            <h2>Remove Mold Stains the Pet-Safe Way</h2>
            <p>From {formatPrice(prod.price)}</p>
          </div>
          <button type="button" className="msr-cta" onClick={scrollToBuy}>
            Shop Mold Stain Remover
          </button>
        </div>
      </section>
    </div>
  );
};

export default MoldStainRemoverPdpSections;
