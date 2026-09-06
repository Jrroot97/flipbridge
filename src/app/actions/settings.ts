"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseMoney } from "@/lib/format";
import { FULFILLMENT_TYPES, type FulfillmentType } from "@/lib/types";

export async function updateSettingsAction(formData: FormData) {
  const user = await requireUser();
  const fulfillmentPreference = String(formData.get("fulfillmentPreference") ?? "FBA");

  await prisma.settings.upsert({
    where: { userId: user.id },
    update: {
      fulfillmentPreference: (FULFILLMENT_TYPES as readonly string[]).includes(
        fulfillmentPreference,
      )
        ? (fulfillmentPreference as FulfillmentType)
        : "FBA",
      defaultReferralFee: parseMoney(formData.get("defaultReferralFee")),
      defaultFbaFee: parseMoney(formData.get("defaultFbaFee")),
      defaultFbmShipping: parseMoney(formData.get("defaultFbmShipping")),
      defaultPrepCost: parseMoney(formData.get("defaultPrepCost")),
      currency: "USD",
    },
    create: {
      userId: user.id,
      fulfillmentPreference: (FULFILLMENT_TYPES as readonly string[]).includes(
        fulfillmentPreference,
      )
        ? (fulfillmentPreference as FulfillmentType)
        : "FBA",
      defaultReferralFee: parseMoney(formData.get("defaultReferralFee")),
      defaultFbaFee: parseMoney(formData.get("defaultFbaFee")),
      defaultFbmShipping: parseMoney(formData.get("defaultFbmShipping")),
      defaultPrepCost: parseMoney(formData.get("defaultPrepCost")),
      currency: "USD",
    },
  });

  revalidatePath("/settings");
  revalidatePath("/deals/new");
}
