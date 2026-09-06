import Link from "next/link";
import { PipelineBoard } from "@/components/pipeline-board";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";

export default async function DealsPage() {
  const user = await requireUser();
  const deals = await prisma.deal.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-heading text-3xl tracking-tight">Pipeline</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Drag cards between stages or change status from the table. {deals.length} saved{" "}
            {deals.length === 1 ? "deal" : "deals"}.
          </p>
        </div>
        <Link href="/deals/new" className={cn(buttonVariants({ size: "lg" }), "h-10 px-4")}>
          New deal
        </Link>
      </div>
      {deals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
          <h2 className="font-heading text-2xl">No deals yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Save a calculator result to start the board. The demo account already has a full
            sample pipeline if you want to look around.
          </p>
          <Link href="/deals/new" className={cn(buttonVariants(), "mt-6 inline-flex")}>
            Build the first deal
          </Link>
        </div>
      ) : (
        <PipelineBoard deals={deals} />
      )}
    </div>
  );
}
