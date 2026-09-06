import { notFound } from "next/navigation";
import { DealForm } from "@/components/deal-form";
import { getUserSettings, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const [deal, settings] = await Promise.all([
    prisma.deal.findFirst({ where: { id, userId: user.id } }),
    getUserSettings(user.id),
  ]);

  if (!deal) notFound();

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
          Saved deal
        </p>
        <h1 className="font-heading mt-1 text-3xl tracking-tight">{deal.ebayTitle}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{deal.amazonTitle}</p>
      </div>
      <DealForm mode="edit" settings={settings} deal={deal} />
    </div>
  );
}
