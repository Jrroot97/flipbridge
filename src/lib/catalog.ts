export type EbayListing = {
  itemId: string;
  title: string;
  condition: string;
  price: number;
  shipping: number;
  url: string;
  suggestedAsin?: string;
};

export type AmazonListing = {
  asin: string;
  title: string;
  price: number;
  category: string;
};

export const EBAY_CATALOG: EbayListing[] = [
  {
    itemId: "126884210001",
    title: "Dyson V8 Animal Cordless Vacuum — tested, works",
    condition: "Used - Very Good",
    price: 89,
    shipping: 14.5,
    url: "https://www.ebay.com/itm/Dyson-V8-Animal-Cordless-Vacuum/126884210001",
    suggestedAsin: "B0C3R9P8K2",
  },
  {
    itemId: "204991120118",
    title: "Instant Pot Duo 6-Quart 7-in-1 Pressure Cooker",
    condition: "Used - Like New",
    price: 45,
    shipping: 11.2,
    url: "https://www.ebay.com/itm/Instant-Pot-Duo-6-Quart/204991120118",
    suggestedAsin: "B00FLYWNYQ",
  },
  {
    itemId: "155773409220",
    title: "LEGO Star Wars 75313 AT-AT Sealed Box",
    condition: "New",
    price: 62,
    shipping: 9.85,
    url: "https://www.ebay.com/itm/LEGO-Star-Wars-75313-ATAT/155773409220",
    suggestedAsin: "B09J8BTR56",
  },
  {
    itemId: "334812009441",
    title: "Amazon Kindle Paperwhite 11th Gen 8GB",
    condition: "Used - Good",
    price: 70,
    shipping: 6.4,
    url: "https://www.ebay.com/itm/Kindle-Paperwhite-11th-Gen/334812009441",
    suggestedAsin: "B08KTZ8249",
  },
  {
    itemId: "266120883300",
    title: "YETI Rambler 30 oz Tumbler Stainless",
    condition: "New",
    price: 22,
    shipping: 7.15,
    url: "https://www.ebay.com/itm/YETI-Rambler-30oz-Tumbler/266120883300",
    suggestedAsin: "B07FM8K5N8",
  },
  {
    itemId: "145002118877",
    title: "Bose QuietComfort 45 Headphones Black",
    condition: "Used - Very Good",
    price: 110,
    shipping: 8.9,
    url: "https://www.ebay.com/itm/Bose-QuietComfort-45/145002118877",
    suggestedAsin: "B098FKXT8L",
  },
  {
    itemId: "176554339012",
    title: "KitchenAid Artisan 5-Qt Stand Mixer Empire Red",
    condition: "Used - Good",
    price: 180,
    shipping: 24.0,
    url: "https://www.ebay.com/itm/KitchenAid-Artisan-Mixer/176554339012",
    suggestedAsin: "B00005UP2P",
  },
  {
    itemId: "387221009554",
    title: "Lot of 10 Amazon Basics HDMI cables 6ft",
    condition: "New",
    price: 8,
    shipping: 4.25,
    url: "https://www.ebay.com/itm/Amazon-Basics-HDMI-cables/387221009554",
    suggestedAsin: "B014I8SSD0",
  },
];

export const AMAZON_CATALOG: AmazonListing[] = [
  {
    asin: "B0C3R9P8K2",
    title: "Dyson V8 Cordless Vacuum Cleaner",
    price: 189.99,
    category: "Home & Kitchen",
  },
  {
    asin: "B00FLYWNYQ",
    title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker, 6 Quart",
    price: 79.0,
    category: "Home & Kitchen",
  },
  {
    asin: "B09J8BTR56",
    title: "LEGO Star Wars AT-AT 75313 Building Toy",
    price: 99.99,
    category: "Toys & Games",
  },
  {
    asin: "B08KTZ8249",
    title: "Amazon Kindle Paperwhite (8 GB) — Now with a 6.8\" display",
    price: 139.99,
    category: "Electronics",
  },
  {
    asin: "B07FM8K5N8",
    title: "YETI Rambler 30 oz Tumbler with MagSlider Lid",
    price: 38.0,
    category: "Sports & Outdoors",
  },
  {
    asin: "B098FKXT8L",
    title: "Bose QuietComfort 45 Bluetooth Wireless Noise Cancelling Headphones",
    price: 179.0,
    category: "Electronics",
  },
  {
    asin: "B00005UP2P",
    title: "KitchenAid Artisan Series 5-Qt. Tilt-Head Stand Mixer",
    price: 329.99,
    category: "Home & Kitchen",
  },
  {
    asin: "B014I8SSD0",
    title: "Amazon Basics High-Speed HDMI Cable, 6 Feet",
    price: 11.99,
    category: "Electronics",
  },
];

const KEYWORD_ALIASES: Array<{ keywords: string[]; ebayItemId: string }> = [
  { keywords: ["dyson", "v8"], ebayItemId: "126884210001" },
  { keywords: ["instant", "pot"], ebayItemId: "204991120118" },
  { keywords: ["lego", "at-at", "atat"], ebayItemId: "155773409220" },
  { keywords: ["kindle", "paperwhite"], ebayItemId: "334812009441" },
  { keywords: ["yeti", "rambler"], ebayItemId: "266120883300" },
  { keywords: ["bose", "quietcomfort", "qc45"], ebayItemId: "145002118877" },
  { keywords: ["kitchenaid", "mixer"], ebayItemId: "176554339012" },
  { keywords: ["hdmi"], ebayItemId: "387221009554" },
];

export function extractEbayItemId(url: string) {
  const itemMatch = url.match(/\/itm\/(?:[^/?]*\/)?(\d{9,15})/i);
  if (itemMatch) return itemMatch[1];
  const queryMatch = url.match(/[?&]item=(\d{9,15})/i);
  return queryMatch?.[1] ?? null;
}

export function findEbayListing(query: string): EbayListing | null {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const itemId = extractEbayItemId(trimmed) ?? trimmed.replace(/\D/g, "");
  const byId = EBAY_CATALOG.find((listing) => listing.itemId === itemId);
  if (byId) return byId;

  const haystack = trimmed.toLowerCase();
  const alias = KEYWORD_ALIASES.find((entry) =>
    entry.keywords.every((keyword) => haystack.includes(keyword)),
  );
  if (alias) {
    return EBAY_CATALOG.find((listing) => listing.itemId === alias.ebayItemId) ?? null;
  }

  return null;
}

export function findAmazonListing(query: string): AmazonListing | null {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const asin = trimmed.toUpperCase();
  const byAsin = AMAZON_CATALOG.find((listing) => listing.asin === asin);
  if (byAsin) return byAsin;

  const haystack = trimmed.toLowerCase();
  return (
    AMAZON_CATALOG.find((listing) => {
      const words = listing.title.toLowerCase().split(/\s+/).slice(0, 3);
      return words.every((word) => haystack.includes(word.replace(/[^a-z0-9]/g, "")));
    }) ??
    AMAZON_CATALOG.find((listing) =>
      haystack.split(/\s+/).some((word) => listing.title.toLowerCase().includes(word) && word.length > 4),
    ) ??
    null
  );
}

function titleFromUrl(url: string) {
  const slug = url.match(/\/itm\/([^/?]+)/i)?.[1] ?? "";
  const cleaned = decodeURIComponent(slug)
    .replace(/[-_]+/g, " ")
    .replace(/\d{9,15}/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || "eBay listing (details not fetched)";
}

/**
 * Mock eBay parser.
 * TODO: plug in eBay Browse API (OAuth client credentials) to fetch live
 * title, item specifics, current price, and shipping for a listing URL.
 */
export function parseEbayListing(url: string): EbayListing {
  const known = findEbayListing(url);
  if (known) return known;

  const itemId = extractEbayItemId(url) ?? "unknown";
  return {
    itemId,
    title: titleFromUrl(url),
    condition: "Used - Good",
    price: 0,
    shipping: 0,
    url,
  };
}

/**
 * Mock Amazon catalog lookup.
 * TODO: plug in Amazon SP-API Catalog Items + Pricing, or Keepa for
 * Buy Box, fees, and 90-day average. Keep this function as the seam.
 */
export function lookupAmazon(query: string): AmazonListing {
  const known = findAmazonListing(query);
  if (known) return known;

  const looksLikeAsin = /^[A-Z0-9]{10}$/i.test(query.trim());
  return {
    asin: looksLikeAsin ? query.trim().toUpperCase() : "",
    title: looksLikeAsin ? `Amazon listing ${query.trim().toUpperCase()}` : query.trim(),
    price: 0,
    category: "Home & Kitchen",
  };
}
