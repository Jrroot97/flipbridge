import { SettingsForm } from "@/components/settings-form";
import { getUserSettings, requireUser } from "@/lib/auth";

export default async function SettingsPage() {
  const user = await requireUser();
  const settings = await getUserSettings(user.id);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-heading text-3xl tracking-tight">Settings</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          These defaults seed every new calculator. Existing deals keep the fees you saved on
          them. Currency is USD for this MVP.
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
