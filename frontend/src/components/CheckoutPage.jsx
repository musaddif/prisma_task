import { useState } from "react";
import axios from "axios";
import { usStates } from "../data/usStates";
import { stateZipPrefixes } from "../data/stateZipPrefixes";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const [sameBillingAddress, setSameBillingAddress] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [formData, setFormData] = useState({
    email: "",
    country: "United States",
    firstName: "",
    lastName: "",
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
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "cardNumber") {
      const cleaned = value.replace(/\D/g, "").slice(0, 16);
      const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim();
      setFormData((prev) => ({ ...prev, cardNumber: formatted }));
      return;
    }

    if (name === "expiryDate") {
      const cleaned = value.replace(/\D/g, "").slice(0, 4);
      let formatted = cleaned;
      if (cleaned.length > 2) {
        formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
      }
      setFormData((prev) => ({ ...prev, expiryDate: formatted }));
      return;
    }

    if (name === "cvv") {
      const cleaned = value.replace(/\D/g, "").slice(0, 4);
      setFormData((prev) => ({ ...prev, cvv: cleaned }));
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
      setFormData((prev) => ({ ...prev, phoneNumber: formatted }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
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

    for (const [field, message] of required) {
      if (!formData[field]) {
        setError(message);
        return false;
      }
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Email is not correct. Please enter a valid email address.");
      return false;
    }

    const phoneDigits = phoneNumber.replace(/\D/g, "");
    if (!/^\d{10}$/.test(phoneDigits)) {
      setError("Phone number is not correct. Please enter a 10-digit number.");
      return false;
    }

    const cleanCardNumber = cardNumber.replace(/\s/g, "");
    if (!/^\d{16}$/.test(cleanCardNumber)) {
      setError("Card number is not correct. Please enter a valid 16-digit card number.");
      return false;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      setError("Expiration date is not correct. Please enter a valid expiry date (MM/YY).");
      return false;
    }

    const [month, year] = expiryDate.split("/");
    const expiryMonth = parseInt(month, 10);
    const expiryYear = parseInt(year, 10);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (expiryMonth < 1 || expiryMonth > 12) {
      setError("Expiration month is not correct. Please enter a valid month.");
      return false;
    }

    if (
      expiryYear < currentYear ||
      (expiryYear === currentYear && expiryMonth < currentMonth)
    ) {
      setError("Card has expired.");
      return false;
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      setError("Security code is not correct. Please enter a valid security code.");
      return false;
    }

    if (!cardName.trim()) {
      setError("Name on card is required.");
      return false;
    }

    const zipDigits = formData.postalCode.replace(/\D/g, "");
    if (zipDigits.length !== 5) {
      setError("ZIP code is not correct. Please enter a valid 5-digit ZIP code.");
      return false;
    }

    const zipPrefix = parseInt(zipDigits.slice(0, 3), 10);
    const stateCode = formData.state;
    const validRanges = stateZipPrefixes[stateCode];
    const zipMatchesState = validRanges
      ? validRanges.some(
          ([min, max]) => zipPrefix >= min && zipPrefix <= max
        )
      : false;

    const stateName =
      usStates.find((s) => s.code === stateCode)?.name || stateCode;
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

      const response = await axios.post(
        "http://localhost:5000/api/checkout",
        payload
      );

      setMessage(response.data?.message || "Order placed successfully!");
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
    <div className="checkout-page">
      <div className="checkout-container">

        <section className="checkout-section">
          <h2>Contact</h2>

          <div className="input-wrapper">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <span className="help-icon">?</span>
          </div>
        </section>

        <section className="checkout-section delivery-section">
          <h2>Delivery Address</h2>

          <div className="input-wrapper country-wrapper">
            <label>Country/Region</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="United States">United States</option>
            </select>
            <span className="select-arrow">&#8964;</span>
          </div>

          <div className="two-columns">
            <div className="input-wrapper">
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            <div className="input-wrapper">
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="input-wrapper">
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="input-wrapper">
            <input
              type="text"
              name="apartment"
              placeholder="Apartment, suite, etc. (optional)"
              value={formData.apartment}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="two-columns">
            <div className="input-wrapper">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            <div className="input-wrapper">
              <div className="select-wrapper">
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={loading}
                  required
                >
                  <option value="" disabled>
                    State
                  </option>
                  {usStates.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <span className="select-arrow">&#8964;</span>
              </div>
            </div>
          </div>

          <div className="two-columns">
            <div className="input-wrapper">
              <input
                type="text"
                name="postalCode"
                placeholder="ZIP code"
                value={formData.postalCode}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            <div className="input-wrapper">
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={loading}
                required
              />
              <span className="help-icon">?</span>
            </div>
          </div>
        </section>

        <section className="checkout-section payment-section">
          <h2>Payment</h2>
          <p className="secure-text">All transactions are secure and encrypted.</p>

          <div className="payment-box">
            <div className="payment-methods">
              <div
                className={`payment-option ${
                  paymentMethod === "card" ? "selected" : ""
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                <div className="payment-title">
                  <span
                    className={`radio ${
                      paymentMethod === "card" ? "radio-selected" : ""
                    }`}
                  ></span>
                  <strong>Credit card</strong>
                </div>
                <div className="card-brands">
                  <span className="visa">VISA</span>
                  <span className="mastercard">
                    <span></span>
                    <span></span>
                  </span>
                  <span className="maestro">
                    <span></span>
                    <span></span>
                  </span>
                </div>
              </div>

              
            </div>

            {paymentMethod === "card" && (
              <div className="card-fields">
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card number"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    maxLength={19}
                    disabled={loading}
                    inputMode="numeric"
                    autoComplete="cc-number"
                    required
                  />
                  <span className="lock-icon">&#128274;</span>
                </div>

                <div className="two-columns">
                  <div className="input-wrapper">
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="Expiration date (MM / YY)"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      maxLength={5}
                      disabled={loading}
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      required
                    />
                  </div>
                  <div className="input-wrapper">
                    <input
                      type="password"
                      name="cvv"
                      placeholder="Security code"
                      value={formData.cvv}
                      onChange={handleChange}
                      maxLength={4}
                      disabled={loading}
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      required
                    />
                    <span className="help-icon">?</span>
                  </div>
                </div>

                <div className="input-wrapper">
                  <input
                    type="text"
                    name="cardName"
                    placeholder="Name on card"
                    value={formData.cardName}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="cc-name"
                    required
                  />
                </div>
              </div>
            )}
            <div
                className={`payment-option paypal-option ${
                  paymentMethod === "paypal" ? "selected" : ""
                }`}
                onClick={() => setPaymentMethod("paypal")}
              >
                <div className="payment-title">
                  <span
                    className={`radio ${
                      paymentMethod === "paypal" ? "radio-selected" : ""
                    }`}
                  ></span>
                  <span className="paypal-logo">PayPal</span>
                </div>
              </div>

            <label className="checkbox-row billing-row">
              <input
                type="checkbox"
                checked={sameBillingAddress}
                onChange={(e) =>
                  setSameBillingAddress(e.target.checked)
                }
                disabled={loading}
              />
              <span className="custom-checkbox">
                {sameBillingAddress ? "\u2713" : ""}
              </span>
              <span>Billing &amp; Shipping address are the same</span>
            </label>
          </div>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <button
            type="button"
            className="pay-button"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Processing..." : "Pay now"}
          </button>
        </section>
      </div>
    </div>
  );
};

export default CheckoutPage;
