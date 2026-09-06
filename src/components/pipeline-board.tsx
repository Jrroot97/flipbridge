"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { updateDealStatusAction } from "@/app/actions/deals";
import { StatusBadge } from "@/components/status-badge";
import { FieldSelect } from "@/components/field";
import { formatPct, formatUsd } from "@/lib/format";
import { calculateProfit } from "@/lib/profit";
import {
  DEAL_STATUSES,
  DEAL_STATUS_LABELS,
  type DealStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";

export type PipelineDeal = {
  id: string;
  status: string;
  ebayTitle: string;
  amazonTitle: string;
  amazonAsin: string | null;
  amazonPrice: number;
  ebayPrice: number;
  ebayShipping: number;
  referralFeePercent: number;
  fulfillmentFee: number;
  prepCost: number;
  otherCost: number;
  fulfillmentType: string;
};

export function PipelineBoard({ deals }: { deals: PipelineDeal[] }) {
  const [items, setItems] = useState(deals);
  const [dragging, setDragging] = useState<string | null>(null);
  const [view, setView] = useState<"board" | "table">("board");
  const [, startTransition] = useTransition();

  function moveDeal(id: string, status: DealStatus) {
    setItems((current) =>
      current.map((deal) => (deal.id === id ? { ...deal, status } : deal)),
    );
    startTransition(() => updateDealStatusAction(id, status));
  }

  return (
    <div>
      <div className="inline-flex rounded-lg bg-muted p-1">
        <button
          type="button"
          onClick={() => setView("board")}
          className={cn(
            "h-7 rounded-md px-3 text-sm font-medium",
            view === "board" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
          )}
        >
          Kanban
        </button>
        <button
          type="button"
          onClick={() => setView("table")}
          className={cn(
            "h-7 rounded-md px-3 text-sm font-medium",
            view === "table" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
          )}
        >
          Table
        </button>
      </div>
      {view === "board" ? (
      <div className="mt-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {DEAL_STATUSES.map((status) => {
            const column = items.filter((deal) => deal.status === status);
            return (
              <section
                key={status}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (dragging) moveDeal(dragging, status);
                  setDragging(null);
                }}
                className="min-h-56 rounded-2xl border border-border bg-muted/40 p-3"
              >
                <header className="mb-3 flex items-center justify-between gap-2 px-1">
                  <h2 className="text-sm font-medium">{DEAL_STATUS_LABELS[status]}</h2>
                  <span className="font-mono text-xs text-muted-foreground">{column.length}</span>
                </header>
                <div className="grid gap-2">
                  {column.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                      Drop a deal here
                    </p>
                  ) : (
                    column.map((deal) => (
                      <DealCard
                        key={deal.id}
                        deal={deal}
                        onDragStart={() => setDragging(deal.id)}
                        onStatus={moveDeal}
                      />
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
      ) : (
      <div className="mt-4">
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Deal</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Buy</th>
                <th className="px-4 py-3 font-medium">Sell</th>
                <th className="px-4 py-3 font-medium">Profit</th>
                <th className="px-4 py-3 font-medium">ROI</th>
              </tr>
            </thead>
            <tbody>
              {items.map((deal) => {
                const profit = calculateProfit(deal);
                return (
                  <tr key={deal.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <Link href={`/deals/${deal.id}`} className="font-medium hover:underline">
                        {deal.ebayTitle}
                      </Link>
                      <p className="text-xs text-muted-foreground">{deal.amazonTitle}</p>
                    </td>
                    <td className="px-4 py-3">
                      <FieldSelect
                        value={deal.status}
                        onChange={(event) => moveDeal(deal.id, event.target.value as DealStatus)}
                        className="w-36"
                      >
                        {DEAL_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {DEAL_STATUS_LABELS[status]}
                          </option>
                        ))}
                      </FieldSelect>
                    </td>
                    <td className="px-4 py-3 font-mono">{formatUsd(deal.ebayPrice)}</td>
                    <td className="px-4 py-3 font-mono">{formatUsd(deal.amazonPrice)}</td>
                    <td
                      className={cn(
                        "px-4 py-3 font-mono",
                        profit.isProfitable ? "text-[var(--profit)]" : "text-[var(--loss)]",
                      )}
                    >
                      {formatUsd(profit.netProfit)}
                    </td>
                    <td className="px-4 py-3 font-mono">{formatPct(profit.roiPercent)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
}

function DealCard({
  deal,
  onDragStart,
  onStatus,
}: {
  deal: PipelineDeal;
  onDragStart: () => void;
  onStatus: (id: string, status: DealStatus) => void;
}) {
  const profit = calculateProfit(deal);
  return (
    <article
      draggable
      onDragStart={onDragStart}
      className="rounded-xl border border-border bg-card p-3 shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <StatusBadge status={deal.status} />
        <span className="text-[11px] text-muted-foreground">{deal.fulfillmentType}</span>
      </div>
      <Link href={`/deals/${deal.id}`} className="mt-2 block text-sm font-medium leading-snug hover:underline">
        {deal.ebayTitle}
      </Link>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{deal.amazonTitle}</p>
      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <p
            className={cn(
              "font-mono text-sm font-medium",
              profit.isProfitable ? "text-[var(--profit)]" : "text-[var(--loss)]",
            )}
          >
            {formatUsd(profit.netProfit)}
          </p>
          <p className="text-[11px] text-muted-foreground">{formatPct(profit.roiPercent)} ROI</p>
        </div>
        <FieldSelect
          value={deal.status}
          onChange={(event) => onStatus(deal.id, event.target.value as DealStatus)}
          className="h-7 w-[7.5rem] text-xs"
          aria-label="Move deal"
        >
          {DEAL_STATUSES.map((status) => (
            <option key={status} value={status}>
              {DEAL_STATUS_LABELS[status]}
            </option>
          ))}
        </FieldSelect>
      </div>
    </article>
  );
}
