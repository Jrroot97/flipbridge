"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseMoney } from "@/lib/format";
import {
  DEAL_STATUSES,
  FULFILLMENT_TYPES,
  type DealInput,
  type DealStatus,
} from "@/lib/types";

function readDealForm(formData: FormData): DealInput {
  const status = String(formData.get("status") ?? "RESEARCHING");
  const fulfillmentType = String(formData.get("fulfillmentType") ?? "FBA");

  return {
    status: (DEAL_STATUSES as readonly string[]).includes(status)
      ? (status as DealStatus)
      : "RESEARCHING",
    ebayUrl: String(formData.get("ebayUrl") ?? "").trim() || null,
    ebayTitle: String(formData.get("ebayTitle") ?? "").trim(),
    ebayCondition: String(formData.get("ebayCondition") ?? "Used - Good"),
    ebayPrice: parseMoney(formData.get("ebayPrice")),
    ebayShipping: parseMoney(formData.get("ebayShipping")),
    amazonAsin: String(formData.get("amazonAsin") ?? "").trim() || null,
    amazonTitle: String(formData.get("amazonTitle") ?? "").trim(),
    amazonPrice: parseMoney(formData.get("amazonPrice")),
    amazonCategory: String(formData.get("amazonCategory") ?? "Home & Kitchen"),
    fulfillmentType: (FULFILLMENT_TYPES as readonly string[]).includes(fulfillmentType)
      ? (fulfillmentType as DealInput["fulfillmentType"])
      : "FBA",
    referralFeePercent: parseMoney(formData.get("referralFeePercent")),
    fulfillmentFee: parseMoney(formData.get("fulfillmentFee")),
    prepCost: parseMoney(formData.get("prepCost")),
    otherCost: parseMoney(formData.get("otherCost")),
    notes: String(formData.get("notes") ?? "").trim() || null,
  };
}

function validateDeal(input: DealInput) {
  if (!input.ebayTitle) return "Add an eBay title so you can find this deal later.";
  if (!input.amazonTitle) return "Add the Amazon listing title or ASIN match.";
  return null;
}

export async function createDealAction(formData: FormData) {
  const user = await requireUser();
  const data = readDealForm(formData);
  const error = validateDeal(data);
  if (error) {
    throw new Error(error);
  }

  const deal = await prisma.deal.create({
    data: { ...data, userId: user.id },
  });

  revalidatePath("/dashboard");
  revalidatePath("/deals");
  redirect(`/deals/${deal.id}`);
}

export async function updateDealAction(dealId: string, formData: FormData) {
  const user = await requireUser();
  const data = readDealForm(formData);
  const error = validateDeal(data);
  if (error) {
    throw new Error(error);
  }

  await prisma.deal.update({
    where: { id: dealId, userId: user.id },
    data,
  });

  revalidatePath("/dashboard");
  revalidatePath("/deals");
  revalidatePath(`/deals/${dealId}`);
  redirect(`/deals/${dealId}`);
}

export async function updateDealStatusAction(dealId: string, status: DealStatus) {
  const user = await requireUser();
  if (!(DEAL_STATUSES as readonly string[]).includes(status)) return;

  await prisma.deal.update({
    where: { id: dealId, userId: user.id },
    data: { status },
  });

  revalidatePath("/dashboard");
  revalidatePath("/deals");
  revalidatePath(`/deals/${dealId}`);
}

export async function deleteDealAction(dealId: string) {
  const user = await requireUser();
  await prisma.deal.delete({
    where: { id: dealId, userId: user.id },
  });
  revalidatePath("/dashboard");
  revalidatePath("/deals");
  redirect("/deals");
}
