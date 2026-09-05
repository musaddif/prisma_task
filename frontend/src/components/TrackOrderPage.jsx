import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SiteFooter from "./SiteFooter";
import "./TrackOrderPage.css";

const FAQS = [
  {
    question: "When will my order ship?",
    answer:
      "All orders are processed within 1 to 3 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.",
  },
  {
    question: "How long does it take to deliver an order?",
    answer:
      "Orders take 1-2 business days to be fulfilled and 3-5 business days to deliver. If it has been over 7 business days since you placed your order and you still haven't received it, please email us at help@uprootclean.com",
  },
  {
    question: "Where does the product ship from?",
    answer:
      "All of our products are shipped from our warehouse in Doral, Florida!",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns up to 60 days after delivery if the item is unused and in its original condition. We will refund the full order amount minus the shipping costs for the return.\n\nIn the event that your order arrives damaged in any way, please email us as soon as possible at help@uprootclean.com with your order number and a photo of the item's condition. We address these on a case-by-case basis but will try our best to work towards a satisfactory solution.",
  },
];

const TrackOrderPage = () => {
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [openFaq, setOpenFaq] = useState(0);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    const trimmedOrder = orderNumber.trim();
    const trimmedEmail = email.trim();

    if (!trimmedOrder || !trimmedEmail) {
      setStatus({
        type: "error",
        message: "Please enter both your order number and email address.",
      });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    setLoading(true);

    try {
      // Local checkout stores customer email on successful attempts.
      // Tracking numbers come from the shipping confirmation email on the live store.
      await new Promise((resolve) => setTimeout(resolve, 450));

      setStatus({
        type: "info",
        message:
          "If your order has shipped, your tracking details were sent to your confirmation email. Please allow 48 hours after the shipping notification for tracking to update. Need help? Email help@uprootclean.com with your order number.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="track-page">
      <div className="up-announcement">Free shipping on orders over $49</div>

      <header className="up-site-header">
        <button
          type="button"
          className="up-brand"
          onClick={() => navigate("/")}
        >
          UPROOT CLEAN
        </button>
      </header>

      <main className="track-main">
        <div className="track-container">
          <nav className="track-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Track your order</span>
          </nav>

          <h1 className="track-title">Track your order</h1>

          <p className="track-lead">
            Enter your order number and the email used at checkout to look up
            your shipment status.
          </p>

          <form className="track-form" onSubmit={handleSubmit} noValidate>
            <label className="track-field">
              <span>Order number</span>
              <input
                type="text"
                name="orderNumber"
                value={orderNumber}
                onChange={(event) => setOrderNumber(event.target.value)}
                placeholder="e.g. #1234"
                autoComplete="off"
                disabled={loading}
              />
            </label>

            <label className="track-field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@email.com"
                autoComplete="email"
                disabled={loading}
              />
            </label>

            <button
              type="submit"
              className="track-submit"
              disabled={loading}
            >
              {loading ? "Searching..." : "Track order"}
            </button>
          </form>

          {status ? (
            <div
              className={`track-status track-status-${status.type}`}
              role="status"
            >
              {status.message}
            </div>
          ) : null}

          <section className="track-faqs" aria-label="Tracking FAQs">
            <h2>FAQs</h2>

            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div className="track-faq" key={faq.question}>
                  <button
                    type="button"
                    className={`track-faq-toggle${isOpen ? " open" : ""}`}
                    onClick={() =>
                      setOpenFaq((prev) => (prev === index ? -1 : index))
                    }
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
                  </button>

                  {isOpen ? (
                    <div className="track-faq-body">
                      {faq.answer.split("\n\n").map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default TrackOrderPage;
