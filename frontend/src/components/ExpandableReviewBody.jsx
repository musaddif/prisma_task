import { useEffect, useRef, useState } from "react";
import "./ExpandableReviewBody.css";

/**
 * Clamps long review text (~8 lines), shows gray "Read More",
 * then expands that card only with its own scrollable body.
 */
const ExpandableReviewBody = ({ text, className = "" }) => {
  const [expanded, setExpanded] = useState(false);
  const [needsMore, setNeedsMore] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    setExpanded(false);
  }, [text]);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return undefined;

    const measure = () => {
      if (expanded) return;
      setNeedsMore(el.scrollHeight > el.clientHeight + 1);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text, expanded]);

  if (!text) return null;

  return (
    <div
      className={`up-expandable-review ${expanded ? "is-expanded" : ""} ${className}`.trim()}
    >
      <div
        ref={bodyRef}
        className={`up-expandable-review-body ${
          expanded ? "is-expanded" : "is-clamped"
        }`}
      >
        <p>{text}</p>
      </div>

      {needsMore && (
        <button
          type="button"
          className="up-read-more"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
        >
          {expanded ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

export default ExpandableReviewBody;
