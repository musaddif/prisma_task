import { useLayoutEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPolicyBySlug } from "../data/policies";
import SiteFooter from "./SiteFooter";
import "./PolicyPage.css";

const HEADING_RE =
  /^(SECTION\s+\d+\b.*|OVERVIEW|Damages and Issues|Cancellations|Subscriptions|Pre-orders|Try before you buy|Exceptions \/ Non-Returnable Items|Exchanges|Refunds|Current Inventory Notice|Payment and Presale Orders|Order Processing|Domestic Shipping Rates and Estimates|International Shipping|How do I check the status of my order\?|Shipping to P\.O\. Boxes|Refunds, Returns, and Exchanges|Collecting Personal Information|Device information|Order information|Text Program|Minors|Sharing Personal Information|Behavioural Advertising|Using Personal Information|Lawful basis|Retention|Automatic decision-making|WHAT DO WE DO WITH YOUR INFORMATION\?|Selling Personal Information|Third Party Pixels and Cookies|Your rights|GDPR|CCPA|Cookies|Cookies Necessary for the Functioning of the Store|Reporting and Analytics|Do Not Track|Changes|Contact|Mobile Message Service Terms and Conditions)$/i;

const linkify = (text) => {
  const parts = String(text).split(
    /(https?:\/\/[^\s\]]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi
  );

  return parts.map((part, index) => {
    if (!part) return null;
    if (/^https?:\/\//i.test(part)) {
      return (
        <a key={index} href={part} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    }
    if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(part)) {
      return (
        <a key={index} href={`mailto:${part}`}>
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

const isHeadingLine = (line) => {
  if (!line || line.length > 110) return false;
  if (line.startsWith("•")) return false;
  if (HEADING_RE.test(line)) return true;
  if (/^SECTION\s+\d+/i.test(line)) return true;
  if (/^[A-Z0-9][A-Z0-9\s\-&/(),.']{3,}$/.test(line) && line.length < 90) return true;
  return false;
};

/**
 * Render the complete policy body string with headings / paragraphs / lists.
 * Uses `body` (full source text) so nothing is dropped.
 */
const renderPolicyBody = (body = "", pageTitle = "") => {
  const lines = String(body)
    .replace(/\u00a0/g, " ")
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (
    lines[0] &&
    pageTitle &&
    lines[0].toLowerCase().replace(/\s+/g, "") ===
      pageTitle.toLowerCase().replace(/\s+/g, "")
  ) {
    lines.shift();
  }

  const nodes = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (isHeadingLine(line)) {
      nodes.push(
        <h2 key={`h-${nodes.length}`} className="policy-heading">
          {line}
        </h2>
      );
      i += 1;
      continue;
    }

    if (line === "•" || line.startsWith("•")) {
      const items = [];
      while (i < lines.length && (lines[i] === "•" || lines[i].startsWith("•"))) {
        if (lines[i] === "•" && lines[i + 1] && !lines[i + 1].startsWith("•") && !isHeadingLine(lines[i + 1])) {
          items.push(lines[i + 1]);
          i += 2;
        } else {
          items.push(lines[i].replace(/^•\s*/, ""));
          i += 1;
        }
      }
      nodes.push(
        <ul key={`ul-${nodes.length}`} className="policy-list">
          {items.filter(Boolean).map((item, idx) => (
            <li key={idx}>{linkify(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    nodes.push(
      <p key={`p-${nodes.length}`} className="policy-paragraph">
        {linkify(line)}
      </p>
    );
    i += 1;
  }

  return nodes;
};

const PolicyPage = () => {
  const { slug: rawSlug } = useParams();
  const navigate = useNavigate();
  const slug = String(rawSlug || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");
  const policy = getPolicyBySlug(slug);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [slug]);

  if (!policy) {
    return (
      <div className="policy-page">
        <div className="up-announcement">Free shipping on orders over $49</div>
        <header className="up-site-header">
          <button type="button" className="up-brand" onClick={() => navigate("/")}>
            UPROOT CLEAN
          </button>
        </header>
        <main className="policy-main">
          <div className="policy-container">
            <h1 className="policy-title">Policy not found</h1>
            <p className="policy-paragraph">
              The page you requested does not exist.
            </p>
            <Link className="policy-back-link" to="/">
              Back to shop
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const bodyText = policy.body || "";

  return (
    <div className="policy-page">
      <div className="up-announcement">Free shipping on orders over $49</div>
      <header className="up-site-header">
        <button type="button" className="up-brand" onClick={() => navigate("/")}>
          UPROOT CLEAN
        </button>
      </header>

      <main className="policy-main">
        <div className="policy-container">
          <nav className="policy-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>{policy.title}</span>
          </nav>

          <h1 className="policy-title">{policy.title}</h1>

          <article className="policy-body">
            {bodyText ? (
              renderPolicyBody(bodyText, policy.title)
            ) : (
              <p className="policy-paragraph">Policy content is unavailable.</p>
            )}
          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default PolicyPage;
