export type ProfitInput = {
  ebayPrice: number;
  ebayShipping: number;
  amazonPrice: number;
  referralFeePercent: number;
  fulfillmentFee: number;
  prepCost: number;
  otherCost: number;
};

export type ProfitResult = {
  landedCost: number;
  referralFee: number;
  amazonFees: number;
  totalCost: number;
  netProfit: number;
  marginPercent: number;
  roiPercent: number;
  isProfitable: boolean;
};

function num(value: number) {
  return Number.isFinite(value) ? value : 0;
}

/**
 * Online-arbitrage P&L.
 * Landed cost = eBay item + inbound shipping + prep + other cash outlay.
 * Amazon referral + fulfillment come out of the sale, not the cash buy.
 * ROI is net profit / landed cost.
 */
export function calculateProfit(input: ProfitInput): ProfitResult {
  const ebayPrice = num(input.ebayPrice);
  const ebayShipping = num(input.ebayShipping);
  const amazonPrice = num(input.amazonPrice);
  const prepCost = num(input.prepCost);
  const otherCost = num(input.otherCost);
  const fulfillmentFee = num(input.fulfillmentFee);

  const landedCost = ebayPrice + ebayShipping + prepCost + otherCost;
  const referralFee = amazonPrice * (num(input.referralFeePercent) / 100);
  const amazonFees = referralFee + fulfillmentFee;
  const totalCost = landedCost + amazonFees;
  const netProfit = amazonPrice - totalCost;
  const marginPercent = amazonPrice === 0 ? 0 : (netProfit / amazonPrice) * 100;
  const roiPercent = landedCost === 0 ? 0 : (netProfit / landedCost) * 100;

  return {
    landedCost,
    referralFee,
    amazonFees,
    totalCost,
    netProfit,
    marginPercent,
    roiPercent,
    isProfitable: netProfit > 0.005,
  };
}

export function summarizeDeals(
  deals: Array<ProfitInput & { status: string }>,
) {
  const open = deals.filter((deal) => deal.status !== "SOLD");
  const sold = deals.filter((deal) => deal.status === "SOLD");

  const addProfit = (sum: number, deal: ProfitInput) =>
    sum + calculateProfit(deal).netProfit;

  return {
    totalDeals: deals.length,
    openDeals: open.length,
    soldDeals: sold.length,
    openProfit: open.reduce(addProfit, 0),
    realizedProfit: sold.reduce(addProfit, 0),
    pipelineProfit: deals.reduce(addProfit, 0),
    averageRoi:
      deals.length === 0
        ? 0
        : deals.reduce((sum, deal) => sum + calculateProfit(deal).roiPercent, 0) /
          deals.length,
    watchingCount: deals.filter((deal) => deal.status === "WATCHING").length,
    buyingCount: deals.filter((deal) => deal.status === "BUYING").length,
  };
}
