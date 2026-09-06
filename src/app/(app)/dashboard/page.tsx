import Link from "next/link";
import { QuickAdd } from "@/components/quick-add";
import { StatusBadge } from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { getUserSettings, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { withProfit } from "@/lib/deal-helpers";
import { formatPct, formatUsd } from "@/lib/format";
import { summarizeDeals } from "@/lib/profit";
import { DEAL_STATUS_LABELS, type DealStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await requireUser();
  const [deals, settings] = await Promise.all([
    prisma.deal.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    }),
    getUserSettings(user.id),
  ]);

  const scored = deals.map(withProfit);
  const summary = summarizeDeals(deals);
  const recent = scored.slice(0, 6);

  return (
    <div className="grid gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
            {settings.fulfillmentPreference} · {settings.currency}
          </p>
          <h1 className="font-heading mt-1 text-3xl tracking-tight">
            Good to see you, {user.name.split(" ")[0]}.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Open profit is what is still in the pipeline. Realized profit is Sold. Fees are
            estimates until SP-API is connected.
          </p>
        </div>
        <Link href="/deals/new" className={cn(buttonVariants({ size: "lg" }), "h-10 px-4")}>
          New deal
        </Link>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Open estimated profit" value={formatUsd(summary.openProfit)} />
        <Stat label="Realized (sold)" value={formatUsd(summary.realizedProfit)} />
        <Stat label="Average ROI" value={formatPct(summary.averageRoi)} />
        <Stat label="Active deals" value={String(summary.openDeals)} />
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="font-heading text-xl">Quick add from eBay</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Try a demo URL like https://www.ebay.com/itm/Dyson-V8-Animal-Cordless-Vacuum/126884210001
        </p>
        <div className="mt-4">
          <QuickAdd />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-xl">Recent deals</h2>
            <Link href="/deals" className="text-sm font-medium underline-offset-4 hover:underline">
              Open pipeline
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="mt-8 text-sm text-muted-foreground">
              No deals yet. Parse an eBay listing or enter one by hand.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {recent.map((deal) => (
                <li key={deal.id} className="flex items-start justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <Link href={`/deals/${deal.id}`} className="font-medium hover:underline">
                      {deal.ebayTitle}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">{deal.amazonTitle}</p>
                    <div className="mt-2">
                      <StatusBadge status={deal.status} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        "font-mono text-sm font-medium",
                        deal.profit.isProfitable ? "text-[var(--profit)]" : "text-[var(--loss)]",
                      )}
                    >
                      {formatUsd(deal.profit.netProfit)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatPct(deal.profit.roiPercent)} ROI
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-heading text-xl">Pipeline mix</h2>
          <ul className="mt-4 space-y-3">
            {(Object.keys(DEAL_STATUS_LABELS) as DealStatus[]).map((status) => {
              const count = deals.filter((deal) => deal.status === status).length;
              const width = deals.length === 0 ? 0 : Math.round((count / deals.length) * 100);
              return (
                <li key={status}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{DEAL_STATUS_LABELS[status]}</span>
                    <span className="font-mono text-muted-foreground">{count}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${width}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-heading mt-2 text-2xl tracking-tight">{value}</p>
    </div>
  );
}
