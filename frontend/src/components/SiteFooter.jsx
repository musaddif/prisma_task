import "./SiteFooter.css";

const FOOTER_COLUMNS = [
  [
    "Track Your Order",
    "Wholesale",
    "Patents",
    "Shipping Policy",
    "Refund Policy",
    "Privacy Policy",
    "Accessibility",
  ],
  [
    "Manage Subscription",
    "Contact Us",
    "Store Locator",
    "Reviews",
    "Influencer Program",
    "Terms of Service",
    "Dog Hair Remover",
  ],
];

const SOCIAL_ITEMS = [
  ["◎", "Instagram"],
  ["f", "Facebook"],
  ["p", "Pinterest"],
  ["▶", "YouTube"],
  ["♪", "TikTok"],
];

const SiteFooter = () => (
  <footer className="site-footer">
    <div className="site-footer-inner">
      <div className="site-footer-brand">
        <div className="site-footer-logo-mark" aria-hidden="true">U</div>
        <div className="site-footer-logo">UPROOT <span>CLEAN</span></div>
        <p className="site-footer-address">3900 Crown Rd SE SW, Atlanta, GA 30304</p>
        <p className="site-footer-copyright">
          © 2026 Uproot Clean. All rights reserved. Website design by Fuel Made.
        </p>
      </div>

      <div className="site-footer-links">
        {FOOTER_COLUMNS.map((column, columnIndex) => (
          <div className="site-footer-column" key={columnIndex}>
            {column.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        ))}
      </div>

      <div className="site-footer-socials">
        {SOCIAL_ITEMS.map(([icon, label]) => (
          <div className="site-footer-social" key={label}>
            <span className="site-footer-social-icon" aria-hidden="true">{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  </footer>
);

export default SiteFooter;
