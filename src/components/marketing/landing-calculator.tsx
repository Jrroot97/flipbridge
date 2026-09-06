"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { formatPct, formatUsd } from "@/lib/format";
import { calculateProfit } from "@/lib/profit";
import { cn } from "@/lib/utils";

export function LandingCalculator() {
  const [ebayPrice, setEbayPrice] = useState("89");
  const [shipping, setShipping] = useState("14.50");
  const [amazonPrice, setAmazonPrice] = useState("189.99");
  const [referral, setReferral] = useState("15");
  const [fba, setFba] = useState("5.68");

  const profit = useMemo(
    () =>
      calculateProfit({
        ebayPrice: Number(ebayPrice) || 0,
        ebayShipping: Number(shipping) || 0,
        amazonPrice: Number(amazonPrice) || 0,
        referralFeePercent: Number(referral) || 0,
        fulfillmentFee: Number(fba) || 0,
        prepCost: 1,
        otherCost: 0,
      }),
    [ebayPrice, shipping, amazonPrice, referral, fba],
  );

  return (
    <div className="rounded-3xl border border-white/10 bg-[#10241f] p-5 text-white shadow-2xl sm:p-6">
      <p className="text-xs font-medium tracking-[0.16em] text-emerald-200/80 uppercase">
        Live spread check
      </p>
      <p className="mt-2 font-heading text-2xl">Would this Dyson still clear?</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <MiniField label="eBay buy" value={ebayPrice} onChange={setEbayPrice} />
        <MiniField label="Ship in" value={shipping} onChange={setShipping} />
        <MiniField label="Amazon sale" value={amazonPrice} onChange={setAmazonPrice} />
        <MiniField label="Referral %" value={referral} onChange={setReferral} />
      </div>
      <div className="mt-3">
        <MiniField label="FBA fee" value={fba} onChange={setFba} />
      </div>
      <div className="mt-5 rounded-2xl bg-white/5 px-4 py-4">
        <p className="text-xs text-emerald-100/70">Net after fees</p>
        <p
          className={cn(
            "font-heading text-4xl",
            profit.isProfitable ? "text-emerald-300" : "text-red-300",
          )}
        >
          {formatUsd(profit.netProfit)}
        </p>
        <p className="mt-1 text-sm text-emerald-100/70">
          {formatPct(profit.marginPercent)} margin · {formatPct(profit.roiPercent)} ROI
        </p>
      </div>
    </div>
  );
}

function MiniField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs text-emerald-100/70">{label}</span>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
      />
    </label>
  );
}
