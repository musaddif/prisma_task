/** Catalog-wide sale pricing: modest ~10% off (e.g. $19.99 → $17.99). */

export const CATALOG_DISCOUNT_RATE = 0.1;

const roundMoney = (value) => Math.round(Number(value) * 100) / 100;

/**
 * Prefer .99 endings when the previous price used .99,
 * while keeping the effective discount in a realistic ~8–12% band.
 */
export function discountMoney(amount, rate = CATALOG_DISCOUNT_RATE) {
  const previous = roundMoney(amount);
  const raw = previous * (1 - rate);
  const endsWith99 = Math.round((previous % 1) * 100) === 99;

  if (endsWith99) {
    const candidates = [
      roundMoney(Math.floor(raw) + 0.99),
      roundMoney(Math.floor(raw) - 0.01),
    ];

    for (const candidate of candidates) {
      const pctOff = 1 - candidate / previous;
      if (candidate < previous && pctOff >= 0.08 && pctOff <= 0.15) {
        return candidate;
      }
    }
  }

  return roundMoney(raw);
}

/**
 * Reduce selling price by `rate`, keep previous price as compare-at / original
 * so existing UI can show strike-through + savings.
 */
export function applyCatalogDiscount(product, rate = CATALOG_DISCOUNT_RATE) {
  if (!product || typeof product !== "object") return product;

  const discountTier = (item) => {
    if (!item || typeof item.price !== "number") return item;

    const previousPrice = roundMoney(item.price);
    const salePrice = discountMoney(previousPrice, rate);

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

  return discounted;
}
