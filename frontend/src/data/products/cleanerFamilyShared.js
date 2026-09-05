/**
 * Shared below-the-fold content shape for Uproot cleaner-tool PDPs
 * (Lint Pro family: glove, glove+pro bundle, deepclean kits).
 * Consumed by LintProPdpSections when pdpLayout === "cleaner-tools" | "lint-pro".
 */

const F = "https://cdn.shopify.com/s/files/1/0551/2957/1484/files";

export const CLEANER_DESIGNED_TO_CLEAN = [
  { name: "Carpets", icon: `${F}/sol-carpet.png?v=1678178303` },
  { name: "Coats", icon: `${F}/sol-coat.png?v=1678178332` },
  { name: "Cars", icon: `${F}/sol-car.png?v=1678178356` },
  { name: "Furniture", icon: `${F}/sol-furniture.png?v=1678178387` },
  { name: "Bedding", icon: `${F}/sol-bedding.png?v=1678178415` },
  { name: "Clothes", icon: `${F}/sol-clothes.png?v=1678178479` },
  { name: "Pets", icon: `${F}/sol-pets.png?v=1678178501` },
  { name: "And much more!", icon: `${F}/sol-more.png?v=1678178524` },
];

export const CLEANER_COMPARE = {
  title: "Compare Cleaners",
  image: `${F}/compare-2_1.jpg?v=1678832188`,
  columns: [
    {
      name: "Mini™",
      subtitle: "Credit Card Sized",
      benefits: ["Tight Corners", "On the Go", "Clothes"],
      cta: "Explore Mini",
      current: false,
    },
    {
      name: "Pro™",
      subtitle: "Compact & Portable",
      benefits: ["Cars", "Carpets", "Around the House"],
      cta: "Explore Pro",
      current: false,
    },
    {
      name: "Max™",
      subtitle: "2X Wider than the Pro",
      benefits: ["Big Cars", "Stairs", "Around the House"],
      cta: "Explore Max",
      current: false,
    },
    {
      name: "Xtra™",
      subtitle: "Long & Adjustable Handle",
      benefits: ["Clean without bending", "Rugs & Carpets", "Stairs & More"],
      cta: "Explore Xtra",
      current: false,
    },
  ],
};

export const CLEANER_PRESS = [
  {
    name: "BuzzFeed",
    logo: `${F}/BuzzFeed_on_White.webp?v=1678117676`,
    quote:
      "I Thought My Carpets Were Clean Until I Bought This Pet Hair Remover...Now They *Actually* Are.",
  },
  {
    name: "Today",
    logo: `${F}/today.webp?v=1678117780`,
    quote: "It removes even the most embedded pet hair! WHAT!",
  },
  {
    name: "Nifty",
    logo: `${F}/nifty_2_5f90c536-b17f-4086-92ff-1e086e03bb27.png?v=1678117820`,
    quote:
      "The Uproot Clean carpet scraper helped me get rid of hair, crumbs, and dust without having to haul out the vacuum.",
  },
];

export const CLEANER_HOW_TO_ANGLES = {
  eyebrow: "Get Effective Results",
  title: "How to Use",
  description:
    "Advanced head design allows special edges to collect dust, lint, and pet hair in seconds.",
  demoImage: `${F}/Screen_Shot_2023-03-25_at_2.04.05_PM.png?v=1679767459`,
  angles: [
    {
      title: "90 Degree Angle",
      detail: "for fine-haired fabrics",
      image: `${F}/90deg.png?v=1678185926`,
    },
    {
      title: "45 Degree Angle",
      detail: "for medium-haired fabrics",
      image: `${F}/45deg.png?v=1678185926`,
    },
    {
      title: "10 Degree Angle",
      detail: "for tough-haired fabrics",
      image: `${F}/10deg.png?v=1678185926`,
    },
  ],
};

export const CLEANER_FAQS = [
  {
    question: "Is this product really as good as advertised?",
    answer:
      'Yes - it is! If it doesn\'t work as you expect, we will give you your money back. Guaranteed. Read this review from one of our customers: "I can honestly say that Uproot Cleaner Pro works better than any other product I\'ve used in my 50 years of being owned by animals."',
  },
  {
    question: "Does it work on deeply embedded pet hair?",
    answer:
      "Yes! It works extremely well for removing pet hair stuck on clothing / carpet / sofa / car seats :)",
  },
  {
    question: "Does it work on knitted clothing?",
    answer: "No, it does not work on knitted clothing.",
  },
  {
    question: "Does it work on human hair?",
    answer: "Yes - it works on both human and pet hair!",
  },
  {
    question: "How long does delivery take?",
    answer: "Delivery normally takes 3-5 business days.",
  },
  {
    question: "What is the money-back guarantee / refund policy?",
    answer:
      "You can return the product free of charge for any reason within the first 60 days of purchase.",
  },
];

/**
 * @param {{ cleaningTitle?: string, cleaningDescription?: string, video?: string, poster?: string, highlightCurrent?: string|null, includeHowTo?: boolean, includeCompare?: boolean, faqs?: any[] }} opts
 */
export function buildCleanerFamilySections(opts = {}) {
  const columns = CLEANER_COMPARE.columns.map((col) => ({
    ...col,
    current: opts.highlightCurrent ? col.name === opts.highlightCurrent : false,
    cta:
      opts.highlightCurrent && col.name === opts.highlightCurrent
        ? "This Product"
        : col.cta,
  }));

  return {
    designedToClean: CLEANER_DESIGNED_TO_CLEAN,
    cleaningSection: {
      subtitle: "Clean & Effective",
      title: opts.cleaningTitle || "Clean & Effective Results Guaranteed",
      description:
        opts.cleaningDescription ||
        "Meet the ultimate weapon in your battle against pet hair, leaving no strand unchallenged. This powerhouse effortlessly tackles stubborn fur, transforming your home into a pristine, hair-free oasis.",
      video:
        opts.video ||
        "https://d4yxl4pe8dqlj.cloudfront.net/d7043e03-86a2-4551-b3ad-06ded8d2b0a1/ea1fc69e-df1d-4319-a02c-6d2aece321b2/web.mp4",
      poster: opts.poster || `${F}/Screen_Shot_2023-03-25_at_2.02.05_PM.png?v=1679767341`,
      beforeImage: `${F}/before-img.jpg?v=1678093120`,
      afterImage: `${F}/after-img.jpg?v=1678093133`,
    },
    spotTheDifference: {
      eyebrow: "About the cleaner",
      title: "Spot the Difference",
      paragraphs: [
        "Not only is the Uproot Cleaner™ super easy to use but it's also designed to reach those tricky spots where pet hair loves to hide. Plus, it's gentle on your surfaces, so you won't have to worry about any damage while keeping your home fur-free. And the best part? It's a total time-saver, so you can spend more time cuddling with your pets and less time battling their hair!",
      ],
      afterImage: `${F}/after-img.jpg?v=1678093133`,
      beforeImage: `${F}/before-img.jpg?v=1678093120`,
    },
    howToUse: opts.includeHowTo === false ? null : CLEANER_HOW_TO_ANGLES,
    compareCleaners:
      opts.includeCompare === false
        ? null
        : { ...CLEANER_COMPARE, columns },
    pressMentions: CLEANER_PRESS,
    pressBanner: `${F}/press.webp?v=1678118462`,
    faqs: opts.faqs || CLEANER_FAQS,
    storySections: [],
    washerTypes: null,
    featureCards: null,
    comparisonTable: null,
  };
}
