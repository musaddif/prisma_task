import dns from "node:dns";
import Safepay from "@sfpy/node-core";

dns.setDefaultResultOrder("ipv4first");

const safepay = Safepay(
  process.env.SAFE_PAY_SECRET_KEY,
  {
    authType: "secret",
    host: process.env.SAFEPAY_API_URL,
  }
);

export default safepay;