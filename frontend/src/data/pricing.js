/** Catalog-wide sale pricing: exact 10% off reference/original prices. */

export const CATALOG_DISCOUNT_RATE = 0.1;

const PRICE_KEYS = new Set([
  "price",
  "compareAtPrice",
  "originalPrice",
  "salePrice",
]);

const roundMoney = (value) => Math.round(Number(value) * 100) / 100;

/**
 * Keep the dollar whole-number; force cents to .99.
 * e.g. 15.8 → 15.99, 20.50 → 20.99, 35 → 35.99, 15.99 → 15.99
 */
export function toEnding99(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return amount;
  if (n === 0) return 0;
  if (n < 0) return roundMoney(n);
  return Math.floor(n) + 0.99;
}

/** Display helper — always shows a `.99` price. */
export function formatPrice(amount) {
  return `$${toEnding99(Number(amount) || 0).toFixed(2)}`;
}

/**
 * Apply an exact percentage discount, rounded to 2 decimal places.
 * e.g. $19.99 → $17.99, $79.96 → $71.96, $333 → $299.70
 */
export function discountMoney(amount, rate = CATALOG_DISCOUNT_RATE) {
  return roundMoney(Number(amount) * (1 - rate));
}

/** Recursively force every price-like field to end in .99. */
export function snapPricesDeep(value) {
  if (Array.isArray(value)) return value.map(snapPricesDeep);
  if (!value || typeof value !== "object") return value;

  const out = { ...value };
  for (const key of Object.keys(out)) {
    if (PRICE_KEYS.has(key) && typeof out[key] === "number") {
      out[key] = toEnding99(out[key]);
    } else if (out[key] && typeof out[key] === "object") {
      out[key] = snapPricesDeep(out[key]);
    }
  }
  return out;
}

/**
 * Reduce selling price by `rate`; keep the pre-discount price as compare-at /
 * original so the UI can show strike-through + savings. All money fields end in .99.
 */
export function applyCatalogDiscount(product, rate = CATALOG_DISCOUNT_RATE) {
  if (!product || typeof product !== "object") return product;

  const discountTier = (item) => {
    if (!item || typeof item.price !== "number") return item;

    const previousPrice = toEnding99(roundMoney(item.price));
    const salePrice = toEnding99(discountMoney(previousPrice, rate));

    return {
      ...item,
      price: salePrice,
      compareAtPrice: previousPrice,
      originalPrice: previousPrice,
      ...(typeof item.salePrice === "number" ? { salePrice } : {}),
    };
  };

  const discounted = discountTier({ ...product });

  if (Array.isArray(product.variants)) {
    discounted.variants = product.variants.map((variant) =>
      discountTier({ ...variant })
    );
  }

  return snapPricesDeep(discounted);
}
