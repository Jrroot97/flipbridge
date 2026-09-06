export const DEAL_STATUSES = [
  "RESEARCHING",
  "WATCHING",
  "BUYING",
  "LISTED",
  "SOLD",
] as const;

export type DealStatus = (typeof DEAL_STATUSES)[number];

export const DEAL_STATUS_LABELS: Record<DealStatus, string> = {
  RESEARCHING: "Researching",
  WATCHING: "Watching",
  BUYING: "Buying",
  LISTED: "Listed",
  SOLD: "Sold",
};

export const FULFILLMENT_TYPES = ["FBA", "FBM"] as const;
export type FulfillmentType = (typeof FULFILLMENT_TYPES)[number];

export const CONDITIONS = [
  "New",
  "Open box",
  "Refurbished",
  "Used - Like New",
  "Used - Very Good",
  "Used - Good",
  "Used - Acceptable",
] as const;

export type DealInput = {
  status: DealStatus;
  ebayUrl?: string | null;
  ebayTitle: string;
  ebayCondition: string;
  ebayPrice: number;
  ebayShipping: number;
  amazonAsin?: string | null;
  amazonTitle: string;
  amazonPrice: number;
  amazonCategory: string;
  fulfillmentType: FulfillmentType;
  referralFeePercent: number;
  fulfillmentFee: number;
  prepCost: number;
  otherCost: number;
  notes?: string | null;
};

export type SettingsInput = {
  fulfillmentPreference: FulfillmentType;
  defaultReferralFee: number;
  defaultFbaFee: number;
  defaultFbmShipping: number;
  defaultPrepCost: number;
  currency: string;
};
