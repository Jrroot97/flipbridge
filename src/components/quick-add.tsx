"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function QuickAdd() {
  const router = useRouter();
  const [url, setUrl] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const next = url.trim()
      ? `/deals/new?url=${encodeURIComponent(url.trim())}`
      : "/deals/new";
    router.push(next);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
      <Input
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="Paste an eBay URL to start a deal"
        className="sm:flex-1"
      />
      <Button type="submit">Quick add</Button>
    </form>
  );
}
