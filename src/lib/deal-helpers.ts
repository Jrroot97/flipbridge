import { calculateProfit } from "@/lib/profit";
import type { Deal } from "@prisma/client";

export function dealToProfitInput(deal: Deal) {
  return {
    ebayPrice: deal.ebayPrice,
    ebayShipping: deal.ebayShipping,
    amazonPrice: deal.amazonPrice,
    referralFeePercent: deal.referralFeePercent,
    fulfillmentFee: deal.fulfillmentFee,
    prepCost: deal.prepCost,
    otherCost: deal.otherCost,
  };
}

export function withProfit(deal: Deal) {
  return { ...deal, profit: calculateProfit(dealToProfitInput(deal)) };
}
