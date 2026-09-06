import { DealForm } from "@/components/deal-form";
import { getUserSettings, requireUser } from "@/lib/auth";

export default async function NewDealPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string }>;
}) {
  const user = await requireUser();
  const settings = await getUserSettings(user.id);
  const params = await searchParams;

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-heading text-3xl tracking-tight">New deal</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Work the buy side, then the Amazon match. The P&L on the right is live. Nothing is
          saved until you add it to the pipeline.
        </p>
      </div>
      <DealForm mode="create" settings={settings} initialEbayUrl={params.url} />
    </div>
  );
}
