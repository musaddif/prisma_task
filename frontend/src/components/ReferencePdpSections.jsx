/**
 * Below-the-fold sections matching uprootclean.com washing-machine cleaner PDP.
 * Renders only when product data includes the corresponding fields.
 */
const ReferencePdpSections = ({ prod }) => {
  const storySections = prod.storySections || [];
  const washerTypes = prod.washerTypes || null;
  const featureCards = prod.featureCards || null;
  const comparisonTable = prod.comparisonTable || null;

  return (
    <>
      {storySections.map((section) => (
        <section
          key={section.id}
          className={`up-story-section up-story-${section.imageSide || "left"}`}
        >
          <div className="up-container up-story-grid">
            <div className="up-story-media">
              <img src={section.image} alt={section.title} loading="lazy" />
            </div>
            <div className="up-story-copy">
              <h2>{section.title}</h2>
              {(section.paragraphs || []).map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      ))}

      {washerTypes?.items?.length > 0 && (
        <section className="up-washer-types">
          <div className="up-container">
            <div className="up-washer-types-header">
              <h2>{washerTypes.title}</h2>
              {washerTypes.description && <p>{washerTypes.description}</p>}
            </div>

            <div className="up-washer-types-grid">
              {washerTypes.items.map((item) => (
                <article key={item.name} className="up-washer-type-card">
                  <div className="up-washer-type-image">
                    <img src={item.image} alt={item.name} loading="lazy" />
                  </div>
                  <span className="up-washer-type-check" aria-hidden="true">
                    ✓
                  </span>
                  <h3>{item.name}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {featureCards?.items?.length > 0 && (
        <section className="up-feature-cards-section">
          <div className="up-container">
            <div className="up-section-heading">
              <h2>{featureCards.title}</h2>
              {featureCards.subtitle && <p>{featureCards.subtitle}</p>}
            </div>

            <div className="up-feature-cards-grid">
              {featureCards.items.map((card) => (
                <article key={card.name} className="up-feature-card-ba">
                  <div className="up-feature-card-ba-copy">
                    {card.icon && (
                      <img
                        src={card.icon}
                        alt=""
                        className="up-feature-card-icon"
                        width={48}
                        height={48}
                        loading="lazy"
                      />
                    )}
                    <h3>{card.name}</h3>
                    <p>{card.description}</p>
                  </div>

                  {(card.before || card.after) && (
                    <div className="up-ba-pair">
                      {card.before && (
                        <div className="up-ba-frame">
                          <img
                            src={card.before}
                            alt={`${card.name} before`}
                            loading="lazy"
                          />
                          <span>BEFORE</span>
                        </div>
                      )}
                      {card.after && (
                        <div className="up-ba-frame">
                          <img
                            src={card.after}
                            alt={`${card.name} after`}
                            loading="lazy"
                          />
                          <span>AFTER</span>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {comparisonTable && (
        <section className="up-pro-ultra-section" id="uc-comparison">
          <div className="up-container">
            <div className="up-pro-ultra-heads">
              <div className="up-pro-ultra-head">
                <h2>
                  Washing Machine
                  <br />
                  <strong>Cleaner Pro</strong>
                </h2>
                <img
                  src={comparisonTable.left.image}
                  alt={comparisonTable.left.title}
                  loading="lazy"
                />
              </div>
              <div className="up-pro-ultra-head">
                <h2>
                  Washing Machine
                  <br />
                  <strong>
                    Cleaner <em>Ultra</em>
                  </strong>
                </h2>
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
                    <h3>{row.leftTitle}</h3>
                    <p>{row.leftText}</p>
                  </div>
                  <div className="up-pro-ultra-icon">
                    {row.icon && (
                      <img src={row.icon} alt="" loading="lazy" />
                    )}
                  </div>
                  <div className="up-pro-ultra-cell up-pro-ultra-cell-right">
                    <h3>
                      <em>{row.rightTitle}</em>
                    </h3>
                    <p>{row.rightText}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ReferencePdpSections;
