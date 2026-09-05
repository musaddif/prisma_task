import { Link } from "react-router-dom";
import { POLICY_ROUTES_BY_LABEL } from "../data/policies";
import "./SiteFooter.css";

const FOOTER_LOGO =
  "https://uprootclean.com/cdn/shop/files/footer_logo.png?crop=center&height=895&v=1670231392&width=1046";

const FOOTER_COLUMNS = [
  [
    { label: "Track Your Order", to: "/pages/tracking" },
    { label: "Wholesale", href: "https://uprootclean.com/wholesale" },
    { label: "Patents", href: "https://uprootclean.com/pages/uproot-clean-patents" },
    { label: "Shipping Policy", to: POLICY_ROUTES_BY_LABEL["Shipping Policy"] },
    { label: "Refund Policy", to: POLICY_ROUTES_BY_LABEL["Refund Policy"] },
    { label: "Privacy Policy", to: POLICY_ROUTES_BY_LABEL["Privacy Policy"] },
    { label: "Accessibility", href: "https://uprootclean.com/pages/accessibility" },
  ],
  [
    {
      label: "Manage Subscription",
      href: "https://uprootclean.com/tools/recurring/get-subscription-access",
    },
    { label: "Contact Us", href: "https://uprootclean.com/pages/contact-us" },
    { label: "Store Locator", href: "https://uprootclean.com/pages/store-locator-1" },
    { label: "Reviews", href: "https://uprootclean.com/pages/reviews" },
    {
      label: "Influencer Program",
      href: "https://ambassador.upfluence.co/uproot-clean-b",
    },
    { label: "Terms of Service", to: POLICY_ROUTES_BY_LABEL["Terms of Service"] },
    {
      label: "Dog Hair Remover",
      href: "https://uprootclean.com/collections/dog-hair-remover",
    },
  ],
];

const SOCIAL_ITEMS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/uprootclean",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm9.75 1.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
        />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/uprootclean",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3.1l.9-3H13v-2c0-.6.4-1 1-1Z"
        />
      </svg>
    ),
  },
  {
    label: "Pinterest",
    href: "https://www.pinterest.com/uprootclean",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12.04 2C6.94 2 3 5.7 3 10.42c0 3.2 1.9 5.97 4.63 7.03-.06-.55-.12-1.4.03-2 .13-.55.86-3.46.86-3.46s-.22-.44-.22-1.09c0-1.02.59-1.78 1.33-1.78.63 0 .93.47.93 1.03 0 .63-.4 1.57-.61 2.44-.17.72.37 1.31 1.09 1.31 1.31 0 2.19-1.68 2.19-3.68 0-1.52-1.02-2.66-2.87-2.66-2.09 0-3.39 1.56-3.39 3.3 0 .6.18 1.03.46 1.36.13.15.15.21.1.38l-.14.54c-.05.17-.15.22-.33.13-1.17-.48-1.72-1.76-1.72-3.2 0-2.38 2.01-5.24 5.99-5.24 3.2 0 5.31 2.32 5.31 4.81 0 3.29-1.83 5.74-4.53 5.74-.91 0-1.76-.49-2.05-1.06l-.56 2.14c-.2.76-.6 1.71-.9 2.29A9.9 9.9 0 0 0 12.04 22C17.56 22 22 17.52 22 12S17.56 2 12.04 2Z"
        />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCgfWWblJ-bTs0JmNQaB19_g",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18.1 5 12 5 12 5s-6.1 0-7.7.3A2.7 2.7 0 0 0 2.4 7.2 28.3 28.3 0 0 0 2 12a28.3 28.3 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9C5.9 19 12 19 12 19s6.1 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9A28.3 28.3 0 0 0 22 12a28.3 28.3 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z"
        />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@uprootclean",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M19.6 8.4a6.5 6.5 0 0 1-3.8-1.2v7.1a5.8 5.8 0 1 1-5.8-5.8c.3 0 .6 0 .9.1v2.9a2.9 2.9 0 1 0 2 2.8V2.5h2.8c.2 2.4 1.8 4.4 4 5v.9Z"
        />
      </svg>
    ),
  },
];

const FooterItem = ({ item }) => {
  if (item.to) {
    return (
      <Link
        className="site-footer-link"
        to={item.to}
        onClick={() => window.scrollTo(0, 0)}
      >
        {item.label}
      </Link>
    );
  }

  if (item.href) {
    return (
      <a
        className="site-footer-link"
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {item.label}
      </a>
    );
  }

  return <span>{item.label}</span>;
};

const SiteFooter = () => (
  <footer className="site-footer">
    <div className="site-footer-inner">
      <div className="site-footer-brand">
        <Link to="/" className="site-footer-logo-link" aria-label="Uproot Clean home">
          <img
            className="site-footer-logo-img"
            src={FOOTER_LOGO}
            alt="Uproot Clean"
          />
        </Link>

        <p className="site-footer-address">
          3900 Crown Rd SE SW, Atlanta, GA 30304
        </p>

        <p className="site-footer-copyright">
          © 2026 Uproot Clean. All rights reserved. Website design by{" "}
          <a
            href="https://fuelmade.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Fuel Made
          </a>
          .
        </p>
      </div>

      <div className="site-footer-links">
        {FOOTER_COLUMNS.map((column, columnIndex) => (
          <div className="site-footer-column" key={columnIndex}>
            {column.map((item) => (
              <FooterItem key={item.label} item={item} />
            ))}
          </div>
        ))}
      </div>

      <div className="site-footer-socials">
        {SOCIAL_ITEMS.map((item) => (
          <a
            className="site-footer-social"
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="site-footer-social-icon">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default SiteFooter;
