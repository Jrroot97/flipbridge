import { Badge } from "@/components/ui/badge";
import { DEAL_STATUS_LABELS, type DealStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const TONES: Record<DealStatus, string> = {
  RESEARCHING: "bg-sky-100 text-sky-900",
  WATCHING: "bg-amber-100 text-amber-950",
  BUYING: "bg-indigo-100 text-indigo-950",
  LISTED: "bg-teal-100 text-teal-950",
  SOLD: "bg-emerald-100 text-emerald-950",
};

export function StatusBadge({ status }: { status: string }) {
  const key = (status in TONES ? status : "RESEARCHING") as DealStatus;
  return (
    <Badge variant="secondary" className={cn("border-0", TONES[key])}>
      {DEAL_STATUS_LABELS[key]}
    </Badge>
  );
}
