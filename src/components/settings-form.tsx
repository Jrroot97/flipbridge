"use client";

import { useTransition } from "react";
import type { Settings } from "@prisma/client";
import { toast } from "sonner";
import { updateSettingsAction } from "@/app/actions/settings";
import { Field, FieldSelect } from "@/components/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SettingsForm({ settings }: { settings: Settings }) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await updateSettingsAction(formData);
          toast.success("Defaults saved");
        });
      }}
      className="grid max-w-xl gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <Field
        label="Default fulfillment"
        hint="Applied when you open a new deal. You can still switch FBA/FBM per listing."
      >
        <FieldSelect name="fulfillmentPreference" defaultValue={settings.fulfillmentPreference}>
          <option value="FBA">Amazon FBA</option>
          <option value="FBM">Merchant fulfilled (FBM)</option>
        </FieldSelect>
      </Field>
      <Field label="Fallback referral fee %" hint="Used when a category is not chosen yet.">
        <Input
          name="defaultReferralFee"
          type="number"
          step="0.1"
          min="0"
          defaultValue={settings.defaultReferralFee}
        />
      </Field>
      <Field label="Default FBA fulfillment fee">
        <Input
          name="defaultFbaFee"
          type="number"
          step="0.01"
          min="0"
          defaultValue={settings.defaultFbaFee}
        />
      </Field>
      <Field label="Default FBM outbound shipping">
        <Input
          name="defaultFbmShipping"
          type="number"
          step="0.01"
          min="0"
          defaultValue={settings.defaultFbmShipping}
        />
      </Field>
      <Field label="Default prep / polybag">
        <Input
          name="defaultPrepCost"
          type="number"
          step="0.01"
          min="0"
          defaultValue={settings.defaultPrepCost}
        />
      </Field>
      <Field label="Currency" hint="USD only in v1. Multi-currency is a later pass.">
        <Input name="currency" value="USD" readOnly />
      </Field>
      <Button type="submit" disabled={pending} size="lg">
        {pending ? "Saving…" : "Save defaults"}
      </Button>
    </form>
  );
}
