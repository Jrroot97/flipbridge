export type CategoryFee = {
  name: string;
  referralFeePercent: number;
  typicalFbaFee: number;
};

/**
 * Approximate Amazon US referral fees for planning only.
 * TODO: replace with live SP-API fee estimates / category node lookup.
 */
export const AMAZON_CATEGORIES: CategoryFee[] = [
  { name: "Electronics", referralFeePercent: 8, typicalFbaFee: 5.42 },
  { name: "Computers", referralFeePercent: 8, typicalFbaFee: 5.15 },
  { name: "Camera & Photo", referralFeePercent: 8, typicalFbaFee: 4.75 },
  { name: "Cell Phones", referralFeePercent: 8, typicalFbaFee: 4.28 },
  { name: "Grocery", referralFeePercent: 8, typicalFbaFee: 4.12 },
  { name: "Health & Personal Care", referralFeePercent: 8, typicalFbaFee: 4.35 },
  { name: "Beauty", referralFeePercent: 8, typicalFbaFee: 4.18 },
  { name: "Baby", referralFeePercent: 8, typicalFbaFee: 4.55 },
  { name: "Home & Kitchen", referralFeePercent: 15, typicalFbaFee: 5.68 },
  { name: "Sports & Outdoors", referralFeePercent: 15, typicalFbaFee: 5.92 },
  { name: "Toys & Games", referralFeePercent: 15, typicalFbaFee: 4.96 },
  { name: "Tools & Home Improvement", referralFeePercent: 15, typicalFbaFee: 6.15 },
  { name: "Pet Supplies", referralFeePercent: 15, typicalFbaFee: 5.1 },
  { name: "Office Products", referralFeePercent: 15, typicalFbaFee: 4.45 },
  { name: "Automotive", referralFeePercent: 12, typicalFbaFee: 5.75 },
  { name: "Clothing & Accessories", referralFeePercent: 17, typicalFbaFee: 4.88 },
  { name: "Shoes", referralFeePercent: 15, typicalFbaFee: 5.22 },
  { name: "Books", referralFeePercent: 15, typicalFbaFee: 3.65 },
];

export const SIZE_TIERS = [
  { name: "Small standard", fbaFee: 3.22 },
  { name: "Large standard", fbaFee: 4.75 },
  { name: "Large standard (bulky)", fbaFee: 6.49 },
  { name: "Small oversize", fbaFee: 9.73 },
] as const;

export function getCategory(name: string) {
  return (
    AMAZON_CATEGORIES.find((category) => category.name === name) ??
    AMAZON_CATEGORIES.find((category) => category.name === "Home & Kitchen")!
  );
}
