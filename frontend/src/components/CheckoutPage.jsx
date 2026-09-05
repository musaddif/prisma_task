import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ShoppingBag,
  Search,
  Lock,
  HelpCircle,
  Check,
  Sparkles,
} from "lucide-react";
import api from "../services/api";
import { product } from "../data";
import { usStates } from "../data/usStates";
import { stateZipPrefixes } from "../data/stateZipPrefixes";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const location = useLocation();

  const selectedProductId = location.state?.productId;
  const mainProduct = product.find(
    (item) => item.id === Number(selectedProductId)
  );

  const quantity = Math.max(
    1,
    Math.floor(Number(location.state?.quantity) || 1)
  );

  const PRODUCTS = mainProduct
    ? [{ ...mainProduct, quantity }]
    : [];

  const [sameBillingAddress, setSameBillingAddress] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("card");
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
    phoneNumber: "",

    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",

    billingCountry: "United States",
    billingAddress: "",
    billingApartment: "",
    billingCity: "",
    billingState: "",
    billingPostalCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

  const subtotal = mainProduct.price * quantity;
  const total = subtotal + shippingCost + protectionCost;

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "cardNumber") {
      const cleaned = value.replace(/\D/g, "").slice(0, 16);
      const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim();

      setFormData((prev) => ({
        ...prev,
        cardNumber: formatted,
      }));

      return;
    }

    if (name === "expiryDate") {
      const cleaned = value.replace(/\D/g, "").slice(0, 4);

      let formatted = cleaned;

      if (cleaned.length > 2) {
        formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
      }

      setFormData((prev) => ({
        ...prev,
        expiryDate: formatted,
      }));

      return;
    }

    if (name === "cvv") {
      const cleaned = value.replace(/\D/g, "").slice(0, 4);

      setFormData((prev) => ({
        ...prev,
        cvv: cleaned,
      }));

      return;
    }

    if (name === "phoneNumber") {
      const digits = value.replace(/\D/g, "").slice(0, 10);

      let formatted = "";

      if (digits.length > 0) {
        formatted = `(${digits.slice(0, 3)}`;
      }

      if (digits.length >= 3) {
        formatted += `) ${digits.slice(3, 6)}`;
      }

      if (digits.length >= 6) {
        formatted += `-${digits.slice(6, 10)}`;
      }

      setFormData((prev) => ({
        ...prev,
        phoneNumber: formatted,
      }));

      return;
    }

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

  const validateForm = () => {
    const {
      email,
      phoneNumber,
      cardNumber,
      expiryDate,
      cvv,
      cardName,
    } = formData;

    const required = [
      ["email", "Email is required."],
      ["firstName", "First name is required."],
      ["lastName", "Last name is required."],
      ["address", "Address is required."],
      ["city", "City is required."],
      ["state", "State is required."],
      ["postalCode", "ZIP code is required."],
      ["phoneNumber", "Phone is required."],
      ["cardNumber", "Card number is required."],
      ["expiryDate", "Expiration date is required."],
      ["cvv", "Security code is required."],
      ["cardName", "Name on card is required."],
    ];

    for (const [field, validationMessage] of required) {
      if (!formData[field]) {
        setError(validationMessage);
        return false;
      }
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError(
        "Email is not correct. Please enter a valid email address."
      );
      return false;
    }

    const phoneDigits = phoneNumber.replace(/\D/g, "");

    if (!/^\d{10}$/.test(phoneDigits)) {
      setError(
        "Phone number is not correct. Please enter a 10-digit number."
      );
      return false;
    }

    const cleanCardNumber = cardNumber.replace(/\s/g, "");

    if (!/^\d{16}$/.test(cleanCardNumber)) {
      setError(
        "Card number is not correct. Please enter a valid 16-digit card number."
      );
      return false;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      setError(
        "Expiration date is not correct. Please enter a valid expiry date (MM/YY)."
      );
      return false;
    }

    const [month, year] = expiryDate.split("/");

    const expiryMonth = parseInt(month, 10);
    const expiryYear = parseInt(year, 10);

    const currentDate = new Date();

    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (expiryMonth < 1 || expiryMonth > 12) {
      setError(
        "Expiration month is not correct. Please enter a valid month."
      );
      return false;
    }

    if (
      expiryYear < currentYear ||
      (expiryYear === currentYear &&
        expiryMonth < currentMonth)
    ) {
      setError("Card has expired.");
      return false;
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      setError(
        "Security code is not correct. Please enter a valid security code."
      );
      return false;
    }

    if (!cardName.trim()) {
      setError("Name on card is required.");
      return false;
    }

    const zipDigits = formData.postalCode.replace(/\D/g, "");

    if (zipDigits.length !== 5) {
      setError(
        "ZIP code is not correct. Please enter a valid 5-digit ZIP code."
      );
      return false;
    }

    const zipPrefix = parseInt(zipDigits.slice(0, 3), 10);
    const stateCode = formData.state;

    const validRanges = stateZipPrefixes[stateCode];

    const zipMatchesState = validRanges
      ? validRanges.some(
          ([min, max]) =>
            zipPrefix >= min && zipPrefix <= max
        )
      : false;

    const stateName =
      usStates.find((s) => s.code === stateCode)?.name ||
      stateCode;

    if (!zipMatchesState) {
      setError(
        `ZIP code does not match the selected state (${stateName}). Please enter a ZIP code for ${stateName}.`
      );

      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      /*
       * IMPORTANT:
       * The API endpoint and payload structure are intentionally
       * unchanged from your original implementation.
       */
      const payload = {
        delivery: {
          email: formData.email,
          country: formData.country,
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          apartment: formData.apartment || "",
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          phoneNumber: formData.phoneNumber,
        },

        payment: {
          method: "card",
          cardNumber: formData.cardNumber.replace(/\s/g, ""),
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
          cardName: formData.cardName,
        },

        billingAddress: {
          sameAsShipping: sameBillingAddress,
        },
      };

      const response = await api.post(
        "/checkout",
        payload
      );

      setMessage(
        response.data?.message ||
          "Order placed successfully!"
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
              ${total.toFixed(2)}
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
            onSubmit={handleSubmit}
            noValidate
          >
            {/* =================================================
                EXPRESS CHECKOUT
            ================================================== */}

            <section className="checkout-block express-block">
              <h3 className="section-title express-title">
                Express checkout
              </h3>
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
                disabled={loading}
                autoComplete="email"
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
                    disabled={loading}
                  >
                    <option value="United States">
                      United States
                    </option>
                  </select>

                  <span className="select-chevron">
                    ↓
                  </span>
                </div>
              </div>

              <div className="field-grid">
                <Field
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="given-name"
                />

                <Field
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="family-name"
                />
              </div>

              {/* <Field
                label="Company (optional)"
                optional
                name="company"
                value={formData.company}
                onChange={handleChange}
                disabled={loading}
                autoComplete="organization"
              /> */}

              <Field
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={loading}
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
                disabled={loading}
                autoComplete="address-line2"
              />

              <div className="field-grid delivery-city-grid">
                <Field
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="address-level2"
                />

                <div className="field">
                  <div className="select-container">
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      disabled={loading}
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

                    <span className="select-chevron">
                      ↓
                    </span>
                  </div>
                </div>

                <Field
                  label="ZIP code"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  disabled={loading}
                  inputMode="numeric"
                  autoComplete="postal-code"
                />
              </div>

              <Field
                label="Phone"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={loading}
                autoComplete="tel"
                required
                rightIcon={
                  <span className="question-icon">
                    <HelpCircle size={16} strokeWidth={1.8} />
                  </span>
                }
              />

              <Checkbox
                checked={textOffers}
                onChange={setTextOffers}
                disabled={loading}
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

              <div className="payment-card">

                {/* CREDIT CARD */}

                <button
                  type="button"
                  className={`payment-method-row ${
                    paymentMethod === "card"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setPaymentMethod("card")
                  }
                >
                  <span className="payment-method-left">
                    <span
                      className={`radio ${
                        paymentMethod === "card"
                          ? "checked"
                          : ""
                      }`}
                    />

                    <strong>Credit Card</strong>
                  </span>

                  <span className="card-brand-list">
                    <span className="brand visa">
                      VISA
                    </span>

                    <span className="brand mastercard">
                      <i />
                      <i />
                    </span>

                    <span className="brand amex">
                      AMEX
                    </span>

                    <span className="brand discover">
                      DISC
                      <span className="discover-swoop" />
                    </span>
                  </span>
                </button>

                {paymentMethod === "card" && (
                  <div className="card-fields">

                    <Field
                      label="Card Number"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      disabled={loading}
                      inputMode="numeric"
                      autoComplete="cc-number"
                      maxLength={19}
                      rightIcon={
                        <span className="lock-icon">
                          <Lock size={17} strokeWidth={1.8} />
                        </span>
                      }
                    />

                    <div className="field-grid">
                      <Field
                        label="Expiration date (MM / YY)"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        disabled={loading}
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        maxLength={5}
                      />

                      <Field
                        label="Security code"
                        name="cvv"
                        type="password"
                        value={formData.cvv}
                        onChange={handleChange}
                        disabled={loading}
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        maxLength={4}
                        rightIcon={
                          <span className="question-icon">
                            <HelpCircle size={16} strokeWidth={1.8} />
                          </span>
                        }
                      />
                    </div>

                    <Field
                      label="Name on card"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      disabled={loading}
                      autoComplete="cc-name"
                    />
                  </div>
                )}

                {/* PAYPAL */}

                {/* <button
                  type="button"
                  className={`payment-method-row paypal-row ${
                    paymentMethod === "paypal"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setPaymentMethod("paypal")
                  }
                >
                  <span className="payment-method-left">
                    <span
                      className={`radio ${
                        paymentMethod === "paypal"
                          ? "checked"
                          : ""
                      }`}
                    />

                    <strong className="paypal-wordmark">
                      PayPal
                    </strong>
                  </span>
                </button> */}

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
                      disabled={loading}
                    />

                    <span className="custom-check">
                      {sameBillingAddress
                        ? "✓"
                        : ""}
                    </span>

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
                            disabled={loading}
                          >
                            <option value="United States">
                              United States
                            </option>
                          </select>

                          <span className="select-chevron">
                            ↓
                          </span>
                        </div>
                      </div>

                      <Field
                        label="Address"
                        name="billingAddress"
                        value={
                          formData.billingAddress
                        }
                        onChange={handleChange}
                        disabled={loading}
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
                        disabled={loading}
                      />

                      <Field
                        label="City"
                        name="billingCity"
                        value={formData.billingCity}
                        onChange={handleChange}
                        disabled={loading}
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
                              disabled={loading}
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

                            <span className="select-chevron">
                              ↓
                            </span>
                          </div>
                        </div>

                        <Field
                          label="Postal Code"
                          name="billingPostalCode"
                          value={
                            formData.billingPostalCode
                          }
                          onChange={handleChange}
                          disabled={loading}
                          inputMode="numeric"
                          autoComplete="billing postal-code"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div
                  className="message error-message"
                  role="alert"
                >
                  {error}
                </div>
              )}

              {message && (
                <div
                  className="message success-message"
                  role="status"
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="pay-now-button"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : "Pay Now"}
              </button>

              <div className="checkout-footer-links">
                <a >Refund policy</a>
                <a >Shipping</a>
                <a >Privacy policy</a>
                <a >Terms of service</a>
                <a >
                  Cancellations
                </a>
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
        {products.map((product) => (
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
                {product.quantity || 1}
              </span>
            </div>

            <span className="summary-product-name">
              {product.name}
            </span>

            <div className="summary-product-price-wrap">
              <span className="summary-product-unit">
                {product.price === 0
                  ? "FREE"
                  : `$${product.price.toFixed(2)} × ${product.quantity || 1}`}
              </span>

              <strong className="summary-product-price">
                {product.price === 0
                  ? "FREE"
                  : `$${(product.price * (product.quantity || 1)).toFixed(2)}`}
              </strong>
            </div>
          </div>
        ))}
      </div>

      <div className="cost-summary">
        <div className="total-row">
          <span>Total</span>

          <strong>
            <small>USD</small>
            ${total.toFixed(2)}
          </strong>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;