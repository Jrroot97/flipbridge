import { formatPct, formatUsd } from "@/lib/format";
import { calculateProfit, type ProfitInput } from "@/lib/profit";
import { cn } from "@/lib/utils";

export function ProfitPanel({
  input,
  compact = false,
  className,
}: {
  input: ProfitInput;
  compact?: boolean;
  className?: string;
}) {
  const profit = calculateProfit(input);
  const tone = profit.isProfitable ? "profit" : "loss";

  return (
    <aside
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-sm",
        className,
      )}
    >
      <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
        Estimated P&L
      </p>
      <p
        className={cn(
          "font-heading mt-2 text-4xl tracking-tight",
          tone === "profit" ? "text-[var(--profit)]" : "text-[var(--loss)]",
        )}
      >
        {formatUsd(profit.netProfit)}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {profit.isProfitable ? "Net profit after marketplace fees" : "This flip loses money after fees"}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-3">
        <Stat label="Margin" value={formatPct(profit.marginPercent)} tone={tone} />
        <Stat label="ROI on cash" value={formatPct(profit.roiPercent)} tone={tone} />
      </dl>

      {!compact ? (
        <ol className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
          <Line label="Amazon sale" value={input.amazonPrice} />
          <Line label="eBay item" value={-input.ebayPrice} muted />
          <Line label="Inbound shipping" value={-input.ebayShipping} muted />
          <Line label="Referral fee" value={-profit.referralFee} muted />
          <Line label="Fulfillment" value={-input.fulfillmentFee} muted />
          <Line label="Prep" value={-input.prepCost} muted />
          <Line label="Other" value={-input.otherCost} muted />
          <Line label="Landed cost" value={profit.landedCost} emphasize />
        </ol>
      ) : null}
    </aside>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "profit" | "loss";
}) {
  return (
    <div className="rounded-xl bg-muted/70 px-3 py-2.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "font-mono text-base font-medium",
          tone === "profit" ? "text-[var(--profit)]" : "text-[var(--loss)]",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function Line({
  label,
  value,
  muted,
  emphasize,
}: {
  label: string;
  value: number;
  muted?: boolean;
  emphasize?: boolean;
}) {
  return (
    <li
      className={cn(
        "flex items-center justify-between gap-3",
        emphasize && "border-t border-dashed border-border pt-2 font-medium",
        muted && "text-muted-foreground",
      )}
    >
      <span>{label}</span>
      <span className="font-mono tabular-nums">{formatUsd(value)}</span>
    </li>
  );
}
