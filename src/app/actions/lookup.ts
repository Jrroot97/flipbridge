"use server";

import { getCategory } from "@/lib/categories";
import { lookupAmazon, parseEbayListing } from "@/lib/catalog";

export async function parseEbayAction(url: string) {
  // TODO: live eBay Browse API call goes here.
  const listing = parseEbayListing(url);
  const amazon = listing.suggestedAsin ? lookupAmazon(listing.suggestedAsin) : null;
  const category = amazon ? getCategory(amazon.category) : null;

  return {
    source: "mock" as const,
    ebay: listing,
    amazon,
    suggestedReferralFee: category?.referralFeePercent ?? null,
    suggestedFbaFee: category?.typicalFbaFee ?? null,
    message: listing.price
      ? "Filled from the demo catalog. Edit anything that looks off."
      : "No catalog match. Enter title and price manually — live eBay parsing is not wired yet.",
  };
}

export async function lookupAmazonAction(query: string) {
  // TODO: live SP-API / Keepa lookup goes here.
  const listing = lookupAmazon(query);
  const category = getCategory(listing.category);

  return {
    source: "mock" as const,
    amazon: listing,
    suggestedReferralFee: category.referralFeePercent,
    suggestedFbaFee: category.typicalFbaFee,
    message: listing.price
      ? "Matched a demo catalog ASIN. Replace this with SP-API + Keepa later."
      : "No catalog match. Enter Amazon title and price manually.",
  };
}
