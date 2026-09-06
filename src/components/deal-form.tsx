"use client";

import { useMemo, useState, useTransition } from "react";
import type { Deal, Settings } from "@prisma/client";
import { toast } from "sonner";
import { lookupAmazonAction, parseEbayAction } from "@/app/actions/lookup";
import { createDealAction, deleteDealAction, updateDealAction } from "@/app/actions/deals";
import { Field, FieldSelect } from "@/components/field";
import { ProfitPanel } from "@/components/profit-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AMAZON_CATEGORIES, SIZE_TIERS, getCategory } from "@/lib/categories";
import {
  CONDITIONS,
  DEAL_STATUSES,
  DEAL_STATUS_LABELS,
  type DealStatus,
  type FulfillmentType,
} from "@/lib/types";

type FormState = {
  status: DealStatus;
  ebayUrl: string;
  ebayTitle: string;
  ebayCondition: string;
  ebayPrice: string;
  ebayShipping: string;
  amazonAsin: string;
  amazonTitle: string;
  amazonPrice: string;
  amazonCategory: string;
  fulfillmentType: FulfillmentType;
  referralFeePercent: string;
  fulfillmentFee: string;
  prepCost: string;
  otherCost: string;
  notes: string;
  sizeTier: string;
};

function money(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function defaultsFromSettings(settings: Settings, ebayUrl = ""): FormState {
  const fulfillmentType = (settings.fulfillmentPreference === "FBM" ? "FBM" : "FBA") as FulfillmentType;
  return {
    status: "RESEARCHING",
    ebayUrl,
    ebayTitle: "",
    ebayCondition: "Used - Good",
    ebayPrice: "",
    ebayShipping: "",
    amazonAsin: "",
    amazonTitle: "",
    amazonPrice: "",
    amazonCategory: "Home & Kitchen",
    fulfillmentType,
    referralFeePercent: String(settings.defaultReferralFee),
    fulfillmentFee: String(
      fulfillmentType === "FBA" ? settings.defaultFbaFee : settings.defaultFbmShipping,
    ),
    prepCost: String(settings.defaultPrepCost),
    otherCost: "0",
    notes: "",
    sizeTier: "Large standard",
  };
}

function fromDeal(deal: Deal): FormState {
  return {
    status: deal.status as DealStatus,
    ebayUrl: deal.ebayUrl ?? "",
    ebayTitle: deal.ebayTitle,
    ebayCondition: deal.ebayCondition,
    ebayPrice: String(deal.ebayPrice),
    ebayShipping: String(deal.ebayShipping),
    amazonAsin: deal.amazonAsin ?? "",
    amazonTitle: deal.amazonTitle,
    amazonPrice: String(deal.amazonPrice),
    amazonCategory: deal.amazonCategory,
    fulfillmentType: deal.fulfillmentType as FulfillmentType,
    referralFeePercent: String(deal.referralFeePercent),
    fulfillmentFee: String(deal.fulfillmentFee),
    prepCost: String(deal.prepCost),
    otherCost: String(deal.otherCost),
    notes: deal.notes ?? "",
    sizeTier: "Large standard",
  };
}

export function DealForm({
  mode,
  settings,
  deal,
  initialEbayUrl,
}: {
  mode: "create" | "edit";
  settings: Settings;
  deal?: Deal;
  initialEbayUrl?: string;
}) {
  const [form, setForm] = useState<FormState>(
    deal ? fromDeal(deal) : defaultsFromSettings(settings, initialEbayUrl),
  );
  const [lookupNote, setLookupNote] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const profitInput = useMemo(
    () => ({
      ebayPrice: money(form.ebayPrice),
      ebayShipping: money(form.ebayShipping),
      amazonPrice: money(form.amazonPrice),
      referralFeePercent: money(form.referralFeePercent),
      fulfillmentFee: money(form.fulfillmentFee),
      prepCost: money(form.prepCost),
      otherCost: money(form.otherCost),
    }),
    [form],
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function applyCategory(name: string) {
    const category = getCategory(name);
    setForm((current) => ({
      ...current,
      amazonCategory: name,
      referralFeePercent: String(category.referralFeePercent),
      fulfillmentFee:
        current.fulfillmentType === "FBA"
          ? String(category.typicalFbaFee)
          : current.fulfillmentFee,
    }));
  }

  function applyFulfillment(next: FulfillmentType) {
    setForm((current) => ({
      ...current,
      fulfillmentType: next,
      fulfillmentFee:
        next === "FBA"
          ? String(getCategory(current.amazonCategory).typicalFbaFee)
          : String(settings.defaultFbmShipping),
    }));
  }

  function parseEbay() {
    const url = form.ebayUrl.trim();
    if (!url) {
      toast.error("Paste an eBay listing URL first.");
      return;
    }
    startTransition(async () => {
      const result = await parseEbayAction(url);
      setForm((current) => ({
        ...current,
        ebayTitle: result.ebay.title || current.ebayTitle,
        ebayCondition: result.ebay.condition,
        ebayPrice: result.ebay.price ? String(result.ebay.price) : current.ebayPrice,
        ebayShipping: result.ebay.shipping ? String(result.ebay.shipping) : current.ebayShipping,
        amazonAsin: result.amazon?.asin ?? current.amazonAsin,
        amazonTitle: result.amazon?.title ?? current.amazonTitle,
        amazonPrice: result.amazon?.price ? String(result.amazon.price) : current.amazonPrice,
        amazonCategory: result.amazon?.category ?? current.amazonCategory,
        referralFeePercent: result.suggestedReferralFee
          ? String(result.suggestedReferralFee)
          : current.referralFeePercent,
        fulfillmentFee:
          current.fulfillmentType === "FBA" && result.suggestedFbaFee
            ? String(result.suggestedFbaFee)
            : current.fulfillmentFee,
      }));
      setLookupNote(result.message);
      toast.success("Listing parsed");
    });
  }

  function lookupAmazon() {
    const query = form.amazonAsin || form.amazonTitle;
    if (!query.trim()) {
      toast.error("Enter an ASIN or Amazon title.");
      return;
    }
    startTransition(async () => {
      const result = await lookupAmazonAction(query);
      setForm((current) => ({
        ...current,
        amazonAsin: result.amazon.asin || current.amazonAsin,
        amazonTitle: result.amazon.title || current.amazonTitle,
        amazonPrice: result.amazon.price ? String(result.amazon.price) : current.amazonPrice,
        amazonCategory: result.amazon.category || current.amazonCategory,
        referralFeePercent: String(result.suggestedReferralFee),
        fulfillmentFee:
          current.fulfillmentType === "FBA"
            ? String(result.suggestedFbaFee)
            : current.fulfillmentFee,
      }));
      setLookupNote(result.message);
      toast.success("Amazon match updated");
    });
  }

  const action = mode === "create" ? createDealAction : updateDealAction.bind(null, deal!.id);

  return (
    <form action={action} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="grid gap-6">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-heading text-xl">eBay source</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Paste a listing or enter the buy-side numbers yourself.
              </p>
            </div>
            <FieldSelect
              name="status"
              value={form.status}
              onChange={(event) => update("status", event.target.value as DealStatus)}
              className="w-40"
            >
              {DEAL_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {DEAL_STATUS_LABELS[status]}
                </option>
              ))}
            </FieldSelect>
          </div>

          <div className="mt-5 grid gap-4">
            <Field label="eBay listing URL">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  name="ebayUrl"
                  value={form.ebayUrl}
                  onChange={(event) => update("ebayUrl", event.target.value)}
                  placeholder="https://www.ebay.com/itm/..."
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={parseEbay} disabled={pending}>
                  Parse listing
                </Button>
              </div>
            </Field>
            <Field label="Title">
              <Input
                name="ebayTitle"
                required
                value={form.ebayTitle}
                onChange={(event) => update("ebayTitle", event.target.value)}
                placeholder="What you would buy"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Condition">
                <FieldSelect
                  name="ebayCondition"
                  value={form.ebayCondition}
                  onChange={(event) => update("ebayCondition", event.target.value)}
                >
                  {CONDITIONS.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </FieldSelect>
              </Field>
              <Field label="eBay price">
                <Input
                  name="ebayPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.ebayPrice}
                  onChange={(event) => update("ebayPrice", event.target.value)}
                />
              </Field>
              <Field label="Shipping in">
                <Input
                  name="ebayShipping"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.ebayShipping}
                  onChange={(event) => update("ebayShipping", event.target.value)}
                />
              </Field>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-heading text-xl">Amazon match</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            ASIN lookup is mocked. Live SP-API and Keepa will plug into the same fields.
          </p>
          <div className="mt-5 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <Field label="ASIN">
                <Input
                  name="amazonAsin"
                  value={form.amazonAsin}
                  onChange={(event) => update("amazonAsin", event.target.value)}
                  placeholder="B08KTZ8249"
                />
              </Field>
              <Button type="button" variant="outline" onClick={lookupAmazon} disabled={pending}>
                Lookup ASIN
              </Button>
            </div>
            <Field label="Amazon title">
              <Input
                name="amazonTitle"
                required
                value={form.amazonTitle}
                onChange={(event) => update("amazonTitle", event.target.value)}
                placeholder="Buy Box / catalog title"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Amazon price">
                <Input
                  name="amazonPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.amazonPrice}
                  onChange={(event) => update("amazonPrice", event.target.value)}
                />
              </Field>
              <Field label="Category">
                <FieldSelect
                  name="amazonCategory"
                  value={form.amazonCategory}
                  onChange={(event) => applyCategory(event.target.value)}
                >
                  {AMAZON_CATEGORIES.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name} · {category.referralFeePercent}%
                    </option>
                  ))}
                </FieldSelect>
              </Field>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-heading text-xl">Fees & fulfillment</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Referral fees follow the category default. Override any number.
          </p>
          <div className="mt-5 grid gap-4">
            <div className="flex rounded-lg border border-border p-1">
              {(["FBA", "FBM"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => applyFulfillment(type)}
                  className={`h-8 flex-1 rounded-md text-sm font-medium transition-colors ${
                    form.fulfillmentType === type
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {type === "FBA" ? "Amazon FBA" : "Merchant FBM"}
                </button>
              ))}
            </div>
            <input type="hidden" name="fulfillmentType" value={form.fulfillmentType} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Referral fee %"
                hint="Category-aware default. Confirm against Seller Central."
              >
                <Input
                  name="referralFeePercent"
                  type="number"
                  step="0.1"
                  min="0"
                  value={form.referralFeePercent}
                  onChange={(event) => update("referralFeePercent", event.target.value)}
                />
              </Field>
              <Field
                label={form.fulfillmentType === "FBA" ? "FBA fulfillment fee" : "FBM outbound shipping"}
              >
                <Input
                  name="fulfillmentFee"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.fulfillmentFee}
                  onChange={(event) => update("fulfillmentFee", event.target.value)}
                />
              </Field>
              {form.fulfillmentType === "FBA" ? (
                <Field label="Size tier shortcut" hint="Applies a typical FBA fee for that tier.">
                  <FieldSelect
                    value={form.sizeTier}
                    onChange={(event) => {
                      const tier = SIZE_TIERS.find((item) => item.name === event.target.value);
                      update("sizeTier", event.target.value);
                      if (tier) update("fulfillmentFee", String(tier.fbaFee));
                    }}
                  >
                    {SIZE_TIERS.map((tier) => (
                      <option key={tier.name} value={tier.name}>
                        {tier.name} · ${tier.fbaFee.toFixed(2)}
                      </option>
                    ))}
                  </FieldSelect>
                </Field>
              ) : null}
              <Field label="Prep / polybag">
                <Input
                  name="prepCost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.prepCost}
                  onChange={(event) => update("prepCost", event.target.value)}
                />
              </Field>
              <Field label="Other costs">
                <Input
                  name="otherCost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.otherCost}
                  onChange={(event) => update("otherCost", event.target.value)}
                />
              </Field>
            </div>
            <Field label="Notes">
              <Textarea
                name="notes"
                value={form.notes}
                onChange={(event) => update("notes", event.target.value)}
                placeholder="Condition risks, gated brand, inbound plan..."
                className="min-h-24"
              />
            </Field>
          </div>
        </section>

        {lookupNote ? (
          <p className="rounded-xl border border-dashed border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
            {lookupNote}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Lookups are mocked for the MVP. Search the demo catalog with a Dyson, Instant Pot, or
            Kindle URL — or type those names into the ASIN field.
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="lg">
            {mode === "create" ? "Save to pipeline" : "Save changes"}
          </Button>
          {mode === "edit" && deal ? (
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (confirm("Delete this deal?")) {
                  startTransition(() => deleteDealAction(deal.id));
                }
              }}
            >
              Delete
            </Button>
          ) : null}
        </div>
      </div>

      <div className="xl:sticky xl:top-6 xl:self-start">
        <ProfitPanel input={profitInput} />
      </div>
    </form>
  );
}
