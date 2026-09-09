import { useState } from "react";
import { formatPrice } from "../data/pricing";
import ExpandableReviewBody from "./ExpandableReviewBody";
import "./LcpPdpSections.css";

const scrollToBuy = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const StatusBadge = ({ status, label }) => {
  const solved = status === "Solved";
  return (
    <span className={`lcp-status ${solved ? "solved" : "unsolved"}`}>
      {label || status}
    </span>
  );
};

/**
 * Below-the-fold for Uproot Laundry Cycle Pro.
 * pdpLayout: "laundry-cycle-pro"
 */
const LcpPdpSections = ({ prod, openFaq, setOpenFaq }) => {
  const content = prod.lcpContent || prod;
  const problem = content.problemSection || prod.problemSection;
  const beforeAfter = content.beforeAfterCards || prod.beforeAfterCards || [];
  const problemQuote = content.problemQuote || prod.problemQuote;
  const hiding = content.hidingPlaces || prod.hidingPlaces;
  const chapters = content.stageChapters || prod.stageChapters || [];
  const complete = content.completeSystem || prod.completeSystem;
  const difference = content.seeTheDifference || prod.seeTheDifference;
  const featured =
    content.featuredTestimonials || prod.featuredTestimonials || [];
  const summary = content.reviewSummary ||
    prod.reviewSummary || { rating: prod.rating, count: prod.reviews };
  const zeroEffort = content.zeroExtraEffort || prod.zeroExtraEffort;
  const guarantee = content.guaranteeSection || prod.guaranteeSection;
  const faqs = prod.faqs || [];
  const reviews = prod.reviewsList || [];
  const comparisonTable = prod.comparisonTable || null;

  const [activeChapter, setActiveChapter] = useState(0);
  const chapter = chapters[activeChapter] || null;

  return (
    <div className="lcp-pdp">
      {problem && (
        <section className="lcp-problem">
          <div className="up-container lcp-problem-grid">
            <div className="lcp-problem-copy">
              <h2>{problem.title}</h2>
              {(problem.paragraphs || []).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {problem.productHighlight && (
                <p className="lcp-highlight">
                  <strong>{problem.productHighlight}</strong>{" "}
                  {problem.highlightLine}
                </p>
              )}
              {(problem.bullets || []).length > 0 && (
                <ul className="lcp-bullets">
                  {problem.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
              {problem.closing && <p className="lcp-closing">{problem.closing}</p>}
            </div>
            {problem.image && (
              <div className="lcp-problem-media">
                <img src={problem.image} alt={problem.title} loading="lazy" />
              </div>
            )}
          </div>
        </section>
      )}

      {beforeAfter.length > 0 && (
        <section className="lcp-ba">
          <div className="up-container">
            <div className="lcp-ba-grid">
              {beforeAfter.map((card) => (
                <article key={card.name} className="lcp-ba-card">
                  <h3>{card.name}</h3>
                  <div className="lcp-ba-pair">
                    <div className="lcp-ba-shot">
                      <img src={card.before} alt={`${card.name} before`} loading="lazy" />
                      <span className="lcp-ba-pill before">Before</span>
                    </div>
                    <div className="lcp-ba-shot">
                      <img src={card.after} alt={`${card.name} after`} loading="lazy" />
                      <span className="lcp-ba-pill after">After</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {problemQuote && (
        <section className="lcp-inline-quote">
          <div className="up-container">
            <blockquote className="lcp-quote-card">
              <p>"{problemQuote.body}"</p>
              <footer>
                <strong>{problemQuote.author}</strong>
                {problemQuote.verified && <span>Verified Reviewer</span>}
              </footer>
            </blockquote>
          </div>
        </section>
      )}

      {hiding && (
        <section className="lcp-hiding">
          <div className="up-container">
            <h2>{hiding.intro}</h2>
            {(hiding.paragraphs || []).map((p, i) => (
              <p key={i} className={i === 2 ? "lcp-strong-line" : undefined}>
                {p}
              </p>
            ))}
            <div className="lcp-hiding-grid">
              {(hiding.places || []).map((place) => (
                <article key={place.number} className="lcp-hiding-card">
                  <div className="lcp-hiding-head">
                    <span className="lcp-hiding-num">{place.number}</span>
                    <StatusBadge
                      status={place.status}
                      label={place.statusLabel || place.status}
                    />
                  </div>
                  <h3>{place.title}</h3>
                  <p>{place.body}</p>
                </article>
              ))}
            </div>
            {(hiding.closing || []).map((p, i) => (
              <p key={`c-${i}`} className="lcp-hiding-close">
                {p}
              </p>
            ))}
          </div>
        </section>
      )}

      {chapters.length > 0 && chapter && (
        <section className="lcp-stages">
          <div className="up-container">
            <div className="lcp-stage-tabs" role="tablist" aria-label="Laundry stages">
              {chapters.map((ch, idx) => (
                <button
                  key={ch.id}
                  type="button"
                  role="tab"
                  aria-selected={activeChapter === idx}
                  className={`lcp-stage-tab ${activeChapter === idx ? "active" : ""}`}
                  onClick={() => setActiveChapter(idx)}
                >
                  <span className="lcp-stage-dot">{ch.tabLabel || ch.number}</span>
                  {ch.tabTitle && (
                    <span className="lcp-stage-tab-label">{ch.tabTitle}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="lcp-stage-panel" role="tabpanel">
              <div className="lcp-stage-grid">
                <div className="lcp-stage-copy">
                  <h2>{chapter.title}</h2>
                  {(chapter.paragraphs || []).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                  {(chapter.bullets || []).length > 0 && (
                    <ul className="lcp-bullets">
                      {chapter.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                  {chapter.quote && (
                    <blockquote className="lcp-quote-card nested">
                      <p>"{chapter.quote.body}"</p>
                      <footer>
                        <strong>{chapter.quote.author}</strong>
                        {chapter.quote.verified && <span>Verified Reviewer</span>}
                      </footer>
                    </blockquote>
                  )}
                  {chapter.bridge && <p className="lcp-bridge">{chapter.bridge}</p>}
                </div>
                {chapter.image && (
                  <div className="lcp-stage-media">
                    <img src={chapter.image} alt={chapter.title} loading="lazy" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {complete && (
        <section className="lcp-complete">
          <div className="up-container">
            {complete.eyebrow && (
              <span className="lcp-eyebrow">{complete.eyebrow}</span>
            )}
            <h2>{complete.title}</h2>
            {complete.description && <p>{complete.description}</p>}
            <div className="lcp-complete-grid">
              <div className="lcp-complete-steps">
                {(complete.steps || []).map((step) => (
                  <article key={step.number} className="lcp-complete-step">
                    <div className="lcp-hiding-head">
                      <span className="lcp-hiding-num">{step.number}</span>
                      <StatusBadge status={step.status} />
                    </div>
                    <h3>{step.label}</h3>
                    <p>{step.body}</p>
                  </article>
                ))}
              </div>
              {complete.image && (
                <div className="lcp-complete-media">
                  <img
                    src={complete.image}
                    alt="Laundry Cycle Pro"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    className="lcp-cta"
                    onClick={scrollToBuy}
                  >
                    {complete.ctaLabel || "Shop Laundry Cycle Pro"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {difference?.columns?.length > 0 && (
        <section className="lcp-difference">
          <div className="up-container">
            <h2>{difference.title}</h2>
            <div className="lcp-diff-grid">
              {difference.columns.map((col) => (
                <article key={col.title} className="lcp-diff-card">
                  {col.image && (
                    <img src={col.image} alt={col.title} loading="lazy" />
                  )}
                  <h3>{col.title}</h3>
                  <p>{col.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="lcp-featured">
          <div className="up-container">
            <span className="lcp-eyebrow">Don't Take Our Word For It</span>
            <h2>Real Results From Real Pet Parents</h2>
            {summary && (
              <div className="lcp-rating-strip">
                <strong>{summary.rating}</strong>
                <span className="lcp-stars">★★★★★</span>
                <span>
                  Based on {Number(summary.count || 0).toLocaleString()}+ reviews
                </span>
              </div>
            )}
            <div className="lcp-featured-grid">
              {featured.map((t) => (
                <article key={t.id} className="lcp-featured-card">
                  <div className="lcp-stars">{"★".repeat(t.rating || 5)}</div>
                  {t.title && <h3>"{t.title}"</h3>}
                  <ExpandableReviewBody text={t.body} />
                  <footer>
                    <strong>{t.author}</strong>
                    {t.verified && <span>Verified Reviewer</span>}
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {zeroEffort && (
        <section className="lcp-zero">
          <div className="up-container">
            <h2>{zeroEffort.title}</h2>
            {zeroEffort.subtitle && <p>{zeroEffort.subtitle}</p>}
            <div className="lcp-zero-grid">
              {(zeroEffort.cards || []).map((card, i) => (
                <article key={`${card.title}-${i}`} className="lcp-zero-card">
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </article>
              ))}
            </div>
            {zeroEffort.totalTime && (
              <p className="lcp-zero-total">{zeroEffort.totalTime}</p>
            )}
            {zeroEffort.closing && <p>{zeroEffort.closing}</p>}
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="lcp-faq up-faq-section">
          <div className="up-container">
            <span className="lcp-eyebrow">Laundry Cycle Pro</span>
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
                      <span className="up-faq-toggle">{isOpen ? "−" : "+"}</span>
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

      {guarantee && (
        <section className="lcp-guarantee">
          <div className="up-container lcp-guarantee-inner">
            <h2>{guarantee.title}</h2>
            {(guarantee.paragraphs || []).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {guarantee.closing && (
              <p className="lcp-guarantee-close">{guarantee.closing}</p>
            )}
          </div>
        </section>
      )}

      {comparisonTable && (
        <section className="up-pro-ultra-section lcp-comparison" id="uc-comparison">
          <div className="up-container">
            <span className="lcp-eyebrow">Help Me Choose</span>
            <h2>Pro vs Ultra</h2>
            <div className="up-pro-ultra-heads">
              <div className="up-pro-ultra-head">
                <h3>
                  Washing Machine
                  <br />
                  <strong>Cleaner Pro</strong>
                </h3>
                <img
                  src={comparisonTable.left.image}
                  alt={comparisonTable.left.title}
                  loading="lazy"
                />
              </div>
              <div className="up-pro-ultra-head">
                <h3>
                  Washing Machine
                  <br />
                  <strong>
                    Cleaner <em>Ultra</em>
                  </strong>
                </h3>
                <img
                  src={comparisonTable.right.image}
                  alt={comparisonTable.right.title}
                  loading="lazy"
                />
              </div>
            </div>
            <div className="up-pro-ultra-rows">
              {(comparisonTable.rows || []).map((row, idx) => (
                <div className="up-pro-ultra-row" key={idx}>
                  <div className="up-pro-ultra-cell">
                    <h4>{row.leftTitle}</h4>
                    <p>{row.leftText}</p>
                  </div>
                  <div className="up-pro-ultra-icon">
                    {row.icon && <img src={row.icon} alt="" loading="lazy" />}
                  </div>
                  <div className="up-pro-ultra-cell up-pro-ultra-cell-right">
                    <h4>
                      <em>{row.rightTitle}</em>
                    </h4>
                    <p>{row.rightText}</p>
                  </div>
                </div>
              ))}
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
                  <div className="lcp-stars">{"★".repeat(r.rating || 5)}</div>
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

      <section className="lcp-bottom-cta">
        <div className="up-container lcp-bottom-inner">
          <div>
            <h2>Make Cleaning Easier Today</h2>
            <p>From {formatPrice(prod.price)}</p>
          </div>
          <button type="button" className="lcp-cta" onClick={scrollToBuy}>
            Shop Laundry Cycle Pro
          </button>
        </div>
      </section>
    </div>
  );
};

export default LcpPdpSections;
