import safepay from "../config/safepay.js";

export const createSafepayCustomer = async ({
  firstName,
  lastName,
  email,
  phoneNumber,
}) => {
  const response = await safepay.customers.object.create({
    first_name: firstName,
    last_name: lastName,
    email,
    phone_number: phoneNumber,
    country: "PK",
    is_guest: false,
  });

  const customerToken = response?.data?.token;
  if (!customerToken) {
    throw new Error("SafePay did not return a customer token");
  }

  return customerToken;
};

/**
 * STEP 1
 * Create an "instrument" tracker — this is a card-saving session, not a payment.
 * Call this first. Returns the tracker token you'll reuse in every later step.
 */
export const createInstrumentTracker = async ({ customerToken }) => {
  const response = await safepay.payments.session.setup({
    merchant_api_key: process.env.SAFEPAY_MERCHANT_API_KEY,
    user: customerToken,
    intent: "CYBERSOURCE",
    mode: "instrument",
    entry_mode: "raw",
    is_account_verification: true,
    currency: "PKR",
  });

  const trackerToken = response?.data?.tracker?.token;
  if (!trackerToken) {
    throw new Error("SafePay did not return a tracker token");
  }

  return trackerToken;
};

export const createWebAuthToken = async () => {
  const response = await safepay.client.passport.create();
  const webAuthToken = response?.data;

  if (typeof webAuthToken !== "string" || webAuthToken.length === 0) {
    throw new Error("SafePay did not return a web authentication token");
  }

  return webAuthToken;
};
