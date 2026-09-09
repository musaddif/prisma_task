import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  Search,
  Check,
  Sparkles,
} from "lucide-react";
import { product } from "../data";
import { usStates } from "../data/usStates";
import { formatPrice, toEnding99 } from "../data/pricing";
import "./CheckoutPage.css";
import adopifyBorderlessCss from "./adopify-borderless.css?raw";

const ADOPIFY_SCRIPT_SRC = "https://adopify.online/widget.js";
const ADOPIFY_DATA_SOURCE = "https://uprootclean.site";
const ADOPIFY_SCRIPT_ID = "adopify-widget-script";

/** Loads the Adopify hosted payment widget into #ph-form. */
const AdopifyPaymentWidget = () => {
  useEffect(() => {
    const mount = document.getElementById("ph-form");
    if (!mount) return undefined;

    mount.innerHTML = "";

    const previous = document.getElementById(ADOPIFY_SCRIPT_ID);
    if (previous) previous.remove();

    const script = document.createElement("script");
    script.id = ADOPIFY_SCRIPT_ID;
    script.src = ADOPIFY_SCRIPT_SRC;
    script.setAttribute("data-source", ADOPIFY_DATA_SOURCE);
    // Keep synchronous so document.currentScript is available to the widget.
    script.async = false;

    mount.insertAdjacentElement("afterend", script);

    const hideDuplicateHeadings = (shadow) => {
      let styleEl = shadow.getElementById("adopify-borderless");
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "adopify-borderless";
        shadow.appendChild(styleEl);
      }
      styleEl.textContent = adopifyBorderlessCss;

      // Hide Adopify's own "Payment" / secure-copy so only our section-heading shows.
      shadow.querySelectorAll("h1, h2, h3, p, span, div, label").forEach((el) => {
        if (el.classList.contains("adopify-hide-heading")) return;

        const text = (el.textContent || "").replace(/\s+/g, " ").trim();
        if (!text) return;

        const isPaymentTitle =
          /^payment$/i.test(text) && el.children.length === 0;
        const isSecureCopy =
          /^all transactions are secure and encrypted\.?$/i.test(text) &&
          el.children.length === 0;

        if (!isPaymentTitle && !isSecureCopy) return;

        let target = el;
        const parent = el.parentElement;
        if (
          parent &&
          parent !== shadow.host &&
          parent.parentElement !== shadow &&
          !/payment-shell|^wrap$/i.test(parent.className || "") &&
          parent.children.length <= 4
        ) {
          const parentText = (parent.textContent || "")
            .replace(/\s+/g, " ")
            .trim();
          if (
            /^payment$/i.test(parentText) ||
            /^payment\s+all transactions are secure/i.test(parentText)
          ) {
            target = parent;
          }
        }
        target.classList.add("adopify-hide-heading");
      });
    };

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      const shadow = document.getElementById("ph-form")?.shadowRoot;
      if (shadow) {
        hideDuplicateHeadings(shadow);
        // Adopify may paint headings a beat after shadow attaches.
        if (attempts >= 15) window.clearInterval(timer);
      } else if (attempts >= 40) {
        window.clearInterval(timer);
      }
    }, 100);

    return () => {
      window.clearInterval(timer);
      script.remove();
      if (mount) mount.innerHTML = "";
    };
  }, []);

  return (
    <div className="adopify-payment-widget">
      <div id="ph-form" />
    </div>
  );
};

/** Shopify-style select caret (matches checkout reference). */
const SelectChevron = () => (
  <span className="select-chevron" aria-hidden="true">
    <svg
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.4 1.7L6 6.3L10.6 1.7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

/** ⓘ icon with hover tooltip — Contact / Security code. */
const FieldInfoTip = ({ text, label = "More information" }) => (
  <span className="field-info-tip">
    <button
      type="button"
      className="field-info-btn"
      aria-label={label}
      tabIndex={0}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="8"
          cy="8"
          r="6.25"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <path
          d="M8 7.15V11.1"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
        />
        <circle cx="8" cy="5.15" r="0.85" fill="currentColor" />
      </svg>
    </button>
    <span className="field-info-tooltip" role="tooltip">
      {text}
    </span>
  </span>
);
const EMPTY_SELECTION = {};

/** Read a positive integer quantity from any checkout payload source. */
const resolveQuantity = (...candidates) => {
  for (const value of candidates) {
    if (value == null || value === "") continue;
    const parsed = Math.floor(Number(value));
    if (Number.isFinite(parsed) && parsed >= 1) return parsed;
  }
  return 1;
};

/** Units in a pack label: "2 Pack" / "Pro / 4 Pack" → 2 / 4. */
const parsePackUnits = (...labels) => {
  for (const label of labels) {
    if (label == null || label === "") continue;
    const match = String(label).match(/(\d+)\s*-?\s*packs?\b/i);
    if (match) {
      const units = Math.floor(Number(match[1]));
      if (Number.isFinite(units) && units >= 1) return units;
    }
  }
  return 1;
};

const readStoredCheckoutSelection = () => {
  try {
    const raw = sessionStorage.getItem("checkoutSelection");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const CheckoutPage = () => {
  const location = useLocation();

  const storedSelection = readStoredCheckoutSelection();
  const locationState =
    location.state && typeof location.state === "object"
      ? location.state
      : EMPTY_SELECTION;
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const selection = {
    ...(storedSelection && typeof storedSelection === "object"
      ? storedSelection
      : EMPTY_SELECTION),
    ...locationState,
  };

  const selectedProductId = selection.productId;
  const mainProduct = product.find(
    (item) => item.id === Number(selectedProductId)
  );

  // Prefer live navigation state, then URL (?quantity=), then sessionStorage.
  const quantity = resolveQuantity(
    locationState.quantity,
    searchParams.get("quantity"),
    storedSelection?.quantity,
    selection.quantity
  );

  const selectedVariant =
    mainProduct?.variants?.find(
      (variant) =>
        selection.variantId != null &&
        String(variant.id) === String(selection.variantId)
    ) ||
    mainProduct?.variants?.find(
      (variant) =>
        selection.variantTitle && variant.title === selection.variantTitle
    ) ||
    mainProduct?.variants?.find(
      (variant) =>
        selection.variantSize &&
        (variant.size === selection.variantSize ||
          variant.title === selection.variantSize)
    ) ||
    null;

  const unitPrice = toEnding99(
    Number(selection.price) > 0
      ? Number(selection.price)
      : selectedVariant?.price || mainProduct?.price || 0
  );

  const selectedVariantTitle =
    selection.variantSize ||
    selectedVariant?.size ||
    selection.variantTitle ||
    selectedVariant?.title ||
    null;

  // Image badge: PDP qty × pack size (2 Pack → 2, qty 3 of 1 Pack → 3).
  // Line price still uses SKU `quantity` only so multipacks are not double-charged.
  const badgeQuantity =
    quantity *
    parsePackUnits(
      selection.variantSize,
      selectedVariant?.size,
      selectedVariantTitle,
      selectedVariant?.title
    );

  const PRODUCTS = mainProduct
    ? [
        {
          ...mainProduct,
          name: mainProduct.name,
          variantTitle: selectedVariantTitle,
          price: unitPrice,
          quantity,
          badgeQuantity,
          images: {
            ...mainProduct.images,
            main:
              selectedVariant?.image ||
              mainProduct.images?.main ||
              mainProduct.image,
          },
        },
      ]
    : [];

  // Keep sessionStorage in sync so refresh / direct revisit keeps the chosen qty.
  useEffect(() => {
    if (!selectedProductId) return;
    try {
      const stored = readStoredCheckoutSelection();
      sessionStorage.setItem(
        "checkoutSelection",
        JSON.stringify({
          ...(stored && typeof stored === "object" ? stored : {}),
          ...locationState,
          quantity,
        })
      );
    } catch {
      /* ignore quota / private mode */
    }
  }, [selectedProductId, quantity, locationState]);

  const [sameBillingAddress, setSameBillingAddress] = useState(true);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const packageProtection = false;
  const [textOffers, setTextOffers] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    country: "United States",
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",

    billingCountry: "United States",
    billingAddress: "",
    billingApartment: "",
    billingCity: "",
    billingState: "",
    billingPostalCode: "",
  });

  const hasShippingAddress = useMemo(() => {
    return Boolean(
      formData.address.trim() &&
        formData.city.trim() &&
        formData.state &&
        formData.postalCode.trim()
    );
  }, [
    formData.address,
    formData.city,
    formData.state,
    formData.postalCode,
  ]);

  if (!mainProduct) {
    return (
      <main className="checkout-page">
        <p className="checkout-error">
          Product not found. Please return to the dashboard and select a product.
        </p>
      </main>
    );
  }

  const shippingCost = hasShippingAddress
    ? shippingMethod === "expedited"
      ? 7.99
      : 4.99
    : 0;

  const protectionCost = packageProtection ? 2.97 : 0;

  const subtotal = toEnding99(unitPrice * quantity);
  const total = toEnding99(subtotal + shippingCost + protectionCost);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "postalCode" || name === "billingPostalCode") {
      const cleaned = value.replace(/\D/g, "").slice(0, 5);

      setFormData((prev) => ({
        ...prev,
        [name]: cleaned,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (event) => {
    // Payment is handled by the Adopify widget (its own Pay now control).
    event.preventDefault();
  };

  return (
    <main className="checkout-page">
      <SiteHeader />

      <div className="checkout-shell">

        {/* =====================================================
            MOBILE ORDER SUMMARY TOGGLE
        ====================================================== */}

        <div className="mobile-summary">
          <button
            type="button"
            className="mobile-summary-toggle"
            onClick={() =>
              setSummaryOpen((prev) => !prev)
            }
          >
            <span className="mobile-summary-left">
              <span className="bag-icon">
                <ShoppingBag size={19} strokeWidth={1.7} />
              </span>

              <span>
                {summaryOpen
                  ? "Hide order summary"
                  : "Show order summary"}
              </span>

              <span
                className={`summary-chevron ${
                  summaryOpen ? "open" : ""
                }`}
              >
                ↓
              </span>
            </span>

            <strong>
              {formatPrice(total)}
            </strong>
          </button>

          {summaryOpen && (
            <div className="mobile-summary-content">
              <OrderSummary
                products={PRODUCTS}
                total={total}
              />
            </div>
          )}
        </div>

        <div className="checkout-grid">

          {/* =====================================================
              LEFT / MAIN CHECKOUT
          ====================================================== */}

          <form
            className="checkout-main"
            onSubmit={handleFormSubmit}
            noValidate
          >
            {/* =================================================
                EXPRESS CHECKOUT
            ================================================== */}

            <section
              className="checkout-block express-checkout"
              aria-label="Express checkout"
            >
              <h2 className="express-checkout-title">Express checkout</h2>
            </section>

            {/* =================================================
                CONTACT
            ================================================== */}

            <section className="checkout-block">
              <div className="section-heading">
                <h2>Contact</h2>
              </div>

              <Field
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                rightIcon={
                  <FieldInfoTip
                    label="Email information"
                    text="Used for your order confirmation and cart reminders"
                  />
                }
              />
            </section>

            {/* =================================================
                DELIVERY
            ================================================== */}

            <section className="checkout-block">
              <div className="section-heading">
                <h2>Delivery</h2>
              </div>

              <div className="field">
                <div className="select-container">
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option value="United States">
                      United States
                    </option>
                  </select>

                  <SelectChevron />
                </div>
              </div>

              <div className="field-grid">
                <Field
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                />

                <Field
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                />
              </div>

              {/* <Field
                label="Company (optional)"
                optional
                name="company"
                value={formData.company}
                onChange={handleChange}
                autoComplete="organization"
              /> */}

              <Field
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                autoComplete="street-address"
                rightIcon={
                  <span className="search-icon">
                    <Search size={18} strokeWidth={1.8} />
                  </span>
                }
              />

              <Field
                label="Apartment, suite, etc."
                optional
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                autoComplete="address-line2"
              />

              <div className="field-grid delivery-city-grid">
                <Field
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  autoComplete="address-level2"
                />

                <div className="field">
                  <div className="select-container">
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        State
                      </option>

                      {usStates.map((state) => (
                        <option
                          key={state.code}
                          value={state.code}
                        >
                          {state.name}
                        </option>
                      ))}
                    </select>

                    <SelectChevron />
                  </div>
                </div>

                <Field
                  label="ZIP code"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  inputMode="numeric"
                  autoComplete="postal-code"
                />
              </div>

              <Checkbox
                checked={textOffers}
                onChange={setTextOffers}
                label="Unlock special discounts & insider updates via text"
              />
            </section>

            {/* =================================================
                SHIPPING
            ================================================== */}

            <section className="checkout-block">
              <div className="section-heading">
                <h2>Shipping method</h2>
              </div>

              {!hasShippingAddress ? (
                <div className="shipping-placeholder">
                  Enter your shipping address to view
                  available shipping methods.
                </div>
              ) : (
                <div className="shipping-options">

                  <ShippingOption
                    selected={
                      shippingMethod === "standard"
                    }
                    value="standard"
                    title="Standard Shipping"
                    subtitle="3–5 Days"
                    price="Free"
                    onClick={() =>
                      setShippingMethod("standard")
                    }
                  />

                  {/* <ShippingOption
                    selected={
                      shippingMethod === "expedited"
                    }
                    value="expedited"
                    title="Expedited Shipping"
                    subtitle="2–4 Days"
                    price="$7.99"
                    onClick={() =>
                      setShippingMethod("expedited")
                    }
                  /> */}
                </div>
              )}
            </section>

            {/* =================================================
                PAYMENT
            ================================================== */}

            <section
              id="payment-section"
              className="checkout-block payment-block"
            >
              <div className="section-heading">
                <h2>Payment</h2>

                <p>
                  All transactions are secure and
                  encrypted
                </p>
              </div>

              <div className="payment-card payment-card--adopify">
                <AdopifyPaymentWidget />
              </div>

              {/* BILLING */}

              <div className="billing-section">
                  <label className="billing-check-row">
                    <input
                      type="checkbox"
                      checked={sameBillingAddress}
                      onChange={(event) =>
                        setSameBillingAddress(
                          event.target.checked
                        )
                      }
                    />

                    <span>
                      Billing &amp; Shipping address are
                      the same
                    </span>
                  </label>

                  {!sameBillingAddress && (
                    <div className="billing-fields">

                      <div className="field">
                        <div className="select-container">
                          <select
                            id="billingCountry"
                            name="billingCountry"
                            value={
                              formData.billingCountry
                            }
                            onChange={handleChange}
                          >
                            <option value="United States">
                              United States
                            </option>
                          </select>

                          <SelectChevron />
                        </div>
                      </div>

                      <Field
                        label="Address"
                        name="billingAddress"
                        value={
                          formData.billingAddress
                        }
                        onChange={handleChange}
                        autoComplete="billing street-address"
                      />

                      <Field
                        label="Apt, Suite, etc."
                        optional
                        name="billingApartment"
                        value={
                          formData.billingApartment
                        }
                        onChange={handleChange}
                      />

                      <Field
                        label="City"
                        name="billingCity"
                        value={formData.billingCity}
                        onChange={handleChange}
                        autoComplete="billing address-level2"
                      />

                      <div className="field-grid">
                        <div className="field">
                          <div className="select-container">
                            <select
                              id="billingState"
                              name="billingState"
                              value={
                                formData.billingState
                              }
                              onChange={handleChange}
                            >
                              <option
                                value=""
                                disabled
                              >
                                Select State
                              </option>

                              {usStates.map(
                                (state) => (
                                  <option
                                    key={state.code}
                                    value={state.code}
                                  >
                                    {state.name}
                                  </option>
                                )
                              )}
                            </select>

                            <SelectChevron />
                          </div>
                        </div>

                        <Field
                          label="Postal Code"
                          name="billingPostalCode"
                          value={
                            formData.billingPostalCode
                          }
                          onChange={handleChange}
                          inputMode="numeric"
                          autoComplete="billing postal-code"
                        />
                      </div>
                    </div>
                  )}
                </div>

              <div className="checkout-footer-links">
                <Link to="/policies/refund-policy">Refund policy</Link>
                <Link to="/policies/shipping-policy">Shipping</Link>
                <Link to="/policies/privacy-policy">Privacy policy</Link>
                <Link to="/policies/terms-of-service">Terms of service</Link>
                <Link to="/policies/cancellation-policy">Cancellations</Link>
              </div>
            </section>
          </form>

          {/* =====================================================
              RIGHT ORDER SUMMARY
          ====================================================== */}

          <aside className="checkout-sidebar">
            <OrderSummary
              products={PRODUCTS}
              total={total}
            />
          </aside>
        </div>
      </div>
    </main>
  );
};

/* ============================================================
   SITE HEADER
============================================================ */

const SiteHeader = () => {
  return (
    <header className="site-header">
      <div className="site-header-inner"> 
       
        <div className="brand-lockup">
          <span className="brand-logo">
            UPROOT
            <Sparkles
              className="brand-sparkle"
              size={18}
              strokeWidth={1.8}
            />
            CLEAN
          </span>

          <div className="brand-checklist">
            <span>
              <Check size={13} strokeWidth={2.4} /> 20,000+ 5 Star
              Reviews
            </span>
            <span>
              <Check size={13} strokeWidth={2.4} /> No Disruptions,
              No Delays
            </span>
            <span>
              <Check size={13} strokeWidth={2.4} /> Secure
            </span>
          </div>
        </div>

        <button
          type="button"
          className="header-bag-button"
          aria-label="Cart"
        >
          <ShoppingBag size={22} strokeWidth={1.7} />
        </button>
      </div>
    </header>
  );
};

/* ============================================================
   FIELD
============================================================ */

const Field = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  disabled,
  optional = false,
  rightIcon,
  ...props
}) => {
  const placeholderText =
    optional && label ? `${label} (optional)` : label;

  return (
    <div className="field">
      <div className="input-container">
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholderText}
          {...props}
        />

        {rightIcon}
      </div>
    </div>
  );
};

/* ============================================================
   CHECKBOX
============================================================ */

const Checkbox = ({
  checked,
  onChange,
  disabled,
  label,
}) => {
  return (
    <label className="checkbox-row">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        disabled={disabled}
      />

      <span className="custom-check">
        {checked ? "✓" : ""}
      </span>

      <span>{label}</span>
    </label>
  );
};

/* ============================================================
   SHIPPING OPTION
============================================================ */

const ShippingOption = ({
  selected,
  title,
  subtitle,
  price,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={`shipping-option ${
        selected ? "selected" : ""
      }`}
      onClick={onClick}
    >
      <span className="shipping-radio">
        <span
          className={
            selected ? "shipping-radio-dot" : ""
          }
        />
      </span>

      <span className="shipping-name">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </span>

      <strong className="shipping-price">
        {price}
      </strong>
    </button>
  );
};

/* ============================================================
   ORDER SUMMARY
============================================================ */

const OrderSummary = ({
  products,
  total,
}) => {
  return (
    <section className="order-summary">
      <div className="product-list">
        {products.map((product) => {
          const qty = resolveQuantity(product.quantity);
          const badgeQty = resolveQuantity(
            product.badgeQuantity,
            product.quantity
          );
          const lineTotal = toEnding99(product.price * qty);
          const isFree = product.price === 0;

          return (
            <div
              className="summary-product"
              key={product.id}
            >
              <div className="summary-product-image">
                <img
                  src={product.images?.main || product.image}
                  alt=""
                />

                <span className="quantity-badge">
                  {badgeQty}
                </span>
              </div>

              <div className="summary-product-info">
                <span className="summary-product-name">
                  {product.name}
                </span>

                {product.variantTitle ? (
                  <span className="summary-product-variant">
                    {product.variantTitle}
                  </span>
                ) : null}
              </div>

              <strong className="summary-product-price">
                {isFree ? "FREE" : formatPrice(lineTotal)}
              </strong>
            </div>
          );
        })}
      </div>

      <div className="cost-summary">
        <div className="total-row">
          <span>Total</span>

          <strong>
            <small>USD</small>
            {formatPrice(total)}
          </strong>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;