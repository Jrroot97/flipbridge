import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function QuickAdd() {
  return (
    <form action="/deals/new" method="get" className="flex flex-col gap-2 sm:flex-row">
      <Input
        name="url"
        placeholder="Paste an eBay URL to start a deal"
        className="sm:flex-1"
        defaultValue=""
      />
      <Button type="submit">Quick add</Button>
    </form>
  );
}
